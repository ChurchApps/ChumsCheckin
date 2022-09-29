package org.chums.checkin;

import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.net.Uri;
import android.provider.MediaStore;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.chums.checkin.printProviders.BrotherProvider;
import org.chums.checkin.printProviders.PrintHandProvider;
import org.chums.checkin.printProviders.PrintProviderInterface;

import java.util.ArrayList;
import java.util.List;
import com.facebook.react.bridge.Promise;

public class PrinterHelper extends  ReactContextBaseJavaModule  {
    public static String Status = "Pending init";
    static Runnable statusChangeRunnable;
    public static boolean readyToPrint=false;
    static ReactContext reactContext = null;
    //static PrintProviderInterface printProvider = new PrintHandProvider();
    static PrintProviderInterface printProvider = new BrotherProvider();
    static Context context = null;

    public PrinterHelper(ReactContext _reactContext) {
        reactContext = _reactContext;
    }

    @ReactMethod
    public void getStatus(Callback cb)
    {
        cb.invoke(PrinterHelper.Status);
    }

    private void sendStatusUpdate() {
        WritableMap params = Arguments.createMap();
        params.putString("status", PrinterHelper.Status);
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("StatusUpdated", params);
    }

    @ReactMethod
    public void scan(final Promise promise) {
        promise.resolve(String.join(",", printProvider.scan()));
    }

/*
    @ReactMethod
    public String[] scan()
    {
        return printProvider.scan();
    }
  */

    @ReactMethod
    public void init()
    {
        printProvider.init();
    }

    public static void updateStatus(String status)
    {
        Status = status;
        if (statusChangeRunnable!=null){
            try {
                statusChangeRunnable.run();
            } catch (Exception e) {}
        }
    }

    @ReactMethod
    public void bind(Callback statusChangeCallback)
    {
        // Runnable runnable
        Activity activity = reactContext.getCurrentActivity();
        context = (activity==null) ? reactContext : activity;

        statusChangeRunnable = new Runnable() { @Override public void run() {  sendStatusUpdate();  } };
        getStatus(statusChangeCallback);

        printProvider.checkInit(context);
    }

    @ReactMethod
    public void printUris(String uriList) //comma separated
    {
        String[] uris = uriList.split(",");
        List<Bitmap> bmps = new ArrayList<>();
        for (String uriString : uris)
        {
            Uri uri = Uri.parse(uriString);
            try {
                Bitmap  mBitmap = MediaStore.Images.Media.getBitmap(context.getContentResolver(), uri);
                bmps.add(mBitmap);
            } catch (Exception ex)
            {  int a=0; }
        }
        if (bmps.size()>0) printProvider.printBitmaps(bmps);
    }

    @ReactMethod
    public void configure()
    {
        printProvider.configure();
    }

    @Override
    public String getName() {
        return "PrinterHelper";
    }
}
