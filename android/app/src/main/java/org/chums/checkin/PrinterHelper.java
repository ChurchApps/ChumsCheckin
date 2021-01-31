package org.chums.checkin;

import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.net.Uri;
import android.provider.MediaStore;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.ArrayList;
import java.util.List;

public class PrinterHelper extends  ReactContextBaseJavaModule  {
    public static String Status = "Pending init";
    static PrintHandHelper phh;
    static Context context = null;
    static Runnable statusChangeRunnable;
    public static boolean readyToPrint=false;
    static ReactContext reactContext = null;

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
    public void init()
    {
        System.out.println("Print Method call");
        Runnable r = new Runnable() { @Override public void run() {

            if (phh.Status=="Initialized") setStatus("Initialized");
            else if (phh.Status == "PrintHand not installed.") setStatus("PrintHand required to enable printing.  You may still checkin.");
            else if (phh.Status == "Printer not configured.") setStatus(phh.Status);
            else if (phh.Status.contains("Printer ready")) {
                setStatus(phh.Status);
                readyToPrint=true;
            }
            checkPrinterStatus();
        } };
        phh = new PrintHandHelper(r);
    }

    public void setStatus(String status)
    {
        Status = status;
        if (statusChangeRunnable!=null){
            try {
                statusChangeRunnable.run();
            } catch (Exception e) {}
        }
        //fire and event
        checkPrinterStatus();
    }

    @ReactMethod
    public void bind(Callback statusChangeCallback)
    {
        // Runnable runnable
        Activity activity = reactContext.getCurrentActivity();
        context = (activity==null) ? reactContext : activity;
        if (phh==null) init();

        statusChangeRunnable = new Runnable() { @Override public void run() {  sendStatusUpdate();  } };
        getStatus(statusChangeCallback);
        checkPrinterStatus();
    }

    @ReactMethod
    public void printUris(String uriList) //comma separated
    {
        String[] uris = uriList.split(",");
        List<Bitmap> bmps = new ArrayList<Bitmap>();
        for (String uriString : uris)
        {
            Uri uri = Uri.parse(uriString);
            try {
                Bitmap  mBitmap = MediaStore.Images.Media.getBitmap(context.getContentResolver(), uri);
                bmps.add(mBitmap);
            } catch (Exception ex)
            {  int a=0; }
        }
        phh.print(bmps, context);
    }

    public void checkPrinterStatus()
    {
        if (Status=="Pending init") { setStatus("Initializing print service."); phh.initSdk(context); }
        else if (phh.Status == "PrintHand not installed.") setStatus("PrintHand required to enable printing.  You may still checkin.");
        else if (Status=="Initialized") { attachToPrinter(); }
    }

    private void attachToPrinter()
    {
        setStatus("Detecting printer.");
        phh.attach(context);
    }

    @ReactMethod
    public void configure()
    {
        try {
            phh.configurePrinter();
        } catch (Exception ex) {
            setStatus("Please install PrintHand application.");
        }
    }


    @Override
    public String getName() {
        return "PrinterHelper";
    }
}
