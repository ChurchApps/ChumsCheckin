package org.chums.checkin.printProviders;

import android.content.Context;
import android.graphics.Bitmap;
import android.net.Uri;
import android.provider.MediaStore;

import org.chums.checkin.PrintHandHelper;
import org.chums.checkin.PrinterHelper;

import java.util.ArrayList;
import java.util.List;

public class PrintHandProvider {
    public static String Status = "Pending init";
    static PrintHandHelper phh;
    static Context context = null;
    public static boolean readyToPrint=false;

    private static void setStatus(String status)
    {
        PrinterHelper.updateStatus(status);
        checkPrinterStatus();
    }

    public static void checkInit(Context c) {
        context = c;
        if (phh==null) init();
        checkPrinterStatus();
    }

    public static void init()
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

    public static void configure()
    {
        try {
            phh.configurePrinter();
        } catch (Exception ex) {
            setStatus("Please install PrintHand application.");
        }
    }

    public static void printUris(String uriList) //comma separated
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

    private static void checkPrinterStatus()
    {
        if (Status=="Pending init") { setStatus("Initializing print service."); phh.initSdk(context); }
        else if (phh.Status == "PrintHand not installed.") setStatus("PrintHand required to enable printing.  You may still checkin.");
        else if (Status=="Initialized") { attachToPrinter(); }
    }

    private static void attachToPrinter()
    {
        setStatus("Detecting printer.");
        phh.attach(context);
    }
}
