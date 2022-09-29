package org.chums.checkin;

import android.app.Activity;
import android.content.Context;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.chums.checkin.printProviders.PrintHandProvider;
import org.chums.checkin.printProviders.PrintProviderInterface;

public class PrinterHelper extends  ReactContextBaseJavaModule  {
    public static String Status = "Pending init";
    static Runnable statusChangeRunnable;
    public static boolean readyToPrint=false;
    static ReactContext reactContext = null;
    static PrintProviderInterface printProvider = new PrintHandProvider();

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
        Context context = (activity==null) ? reactContext : activity;

        statusChangeRunnable = new Runnable() { @Override public void run() {  sendStatusUpdate();  } };
        getStatus(statusChangeCallback);

        printProvider.checkInit(context);
    }

    @ReactMethod
    public void printUris(String uriList) //comma separated
    {
        printProvider.printUris(uriList);
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
