package org.chums.checkin.printProviders;

import android.content.Context;
import android.graphics.Bitmap;
import android.net.Uri;
import android.provider.MediaStore;
import android.util.Log;

import org.chums.checkin.PrintHandHelper;
import org.chums.checkin.PrinterHelper;

import java.io.File;
import java.util.ArrayList;
import java.util.List;


import com.brother.ptouch.sdk.NetPrinter;
import com.brother.ptouch.sdk.Printer;
import com.brother.sdk.lmprinter.PrintError;
import com.brother.sdk.lmprinter.PrinterModel;
import com.brother.sdk.lmprinter.setting.QLPrintSettings;

import com.brother.sdk.lmprinter.Channel;
import com.brother.sdk.lmprinter.OpenChannelError;
import com.brother.sdk.lmprinter.PrinterDriver;
import com.brother.sdk.lmprinter.PrinterDriverGenerateResult;
import com.brother.sdk.lmprinter.PrinterDriverGenerator;

public class BrotherProvider implements PrintProviderInterface {
    static Context context = null;
    public static boolean readyToPrint=false;

    private void setStatus(String status)
    {
        PrinterHelper.updateStatus(status);
    }

    public void checkInit(Context c) {
        context = c;
    }

    public void init()
    {
    }

    public void configure()
    {

    }

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

    }




    void printImage() {
        Channel channel = Channel.newWifiChannel("192.168.1.53");

        PrinterDriverGenerateResult result = PrinterDriverGenerator.openChannel(channel);
        if (result.getError().getCode() != OpenChannelError.ErrorCode.NoError) {
            Log.e("", "Error - Open Channel: " + result.getError().getCode());
            return;
        }

        File dir = context.getExternalFilesDir(null); // getExternalFilesDir(null);
        File file = new File(dir, "tv" + ".png");

        PrinterDriver printerDriver = result.getDriver();
        QLPrintSettings printSettings = new QLPrintSettings(PrinterModel.QL_1110NWB);

        printSettings.setLabelSize(QLPrintSettings.LabelSize.DieCutW29H90);
        printSettings.setAutoCut(true);
        printSettings.setWorkPath(dir.toString());

        PrintError printError = printerDriver.printImage(file.toString(), printSettings);

        if (printError.getCode() != PrintError.ErrorCode.NoError) {
            Log.d("", "Error - Print Image: " + printError.getCode());
        }
        else {
            Log.d("", "Success - Print Image");
        }

        printerDriver.closeChannel();
    }





}