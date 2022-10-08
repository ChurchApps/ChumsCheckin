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
import com.brother.sdk.lmprinter.setting.PrintImageSettings;
import com.brother.sdk.lmprinter.setting.QLPrintSettings;

import com.brother.sdk.lmprinter.Channel;
import com.brother.sdk.lmprinter.OpenChannelError;
import com.brother.sdk.lmprinter.PrinterDriver;
import com.brother.sdk.lmprinter.PrinterDriverGenerateResult;
import com.brother.sdk.lmprinter.PrinterDriverGenerator;


public class BrotherProvider implements PrintProviderInterface {
    static Context context = null;
    public static boolean readyToPrint=false;
    private static String printerIP = "";
    private static String model = "QL-1110NWB";

    public String[] scan() {
        //return new String[]{"192.168.1.2", "192.168.1.3"};

        List<String> result = new ArrayList<>();
        Printer printers = new Printer();
        String[] models = new String[]{"QL-1100", "QL-1110NWB", "QL-580N", "QL-710W", "QL-720NW", "QL-800", "QL-810W", "QL-820NWB", "QL-1115NWB"};
        NetPrinter[] printerList = printers.getNetPrinters(models);

        for (NetPrinter printer: printerList) {
            result.add(printer.modelName + "~" + printer.ipAddress);
        }
        return result.toArray(new String[0]);
    }

    public void checkInit(Context c, String ip, String model) {
        printerIP = ip;
        context = c;
        if (!printerIP.equals("")) PrinterHelper.updateStatus(printerIP);
        else PrinterHelper.updateStatus("No Printer");
    }


    public void configure()
    {

    }

    private QLPrintSettings getPrinterSettings() {
        QLPrintSettings printSettings = new QLPrintSettings(PrinterModel.QL_1110NWB);
        switch (model)
        {
            case "Brother QL-1100": printSettings = new QLPrintSettings(PrinterModel.QL_1100); break;
            case "Brother QL-580N": printSettings = new QLPrintSettings(PrinterModel.QL_580N); break;
            case "Brother QL-710W": printSettings = new QLPrintSettings(PrinterModel.QL_710W); break;
            case "Brother QL-720NW": printSettings = new QLPrintSettings(PrinterModel.QL_720NW); break;
            case "Brother QL-800": printSettings = new QLPrintSettings(PrinterModel.QL_800); break;
            case "Brother QL-810W": printSettings = new QLPrintSettings(PrinterModel.QL_810W); break;
            case "Brother QL-820NWB": printSettings = new QLPrintSettings(PrinterModel.QL_820NWB); break;
            case "Brother QL-1115NWB": printSettings = new QLPrintSettings(PrinterModel.QL_1115NWB); break;
        }

        return printSettings;
    }

    public void printBitmaps(List<Bitmap> bmps)
    {
        Channel channel = Channel.newWifiChannel(printerIP);

        PrinterDriverGenerateResult result = PrinterDriverGenerator.openChannel(channel);
        if (result.getError().getCode() != OpenChannelError.ErrorCode.NoError) {
            Log.e("", "Error - Open Channel: " + result.getError().getCode());
            return;
        }

        File dir = context.getExternalFilesDir(null);

        PrinterDriver printerDriver = result.getDriver();
        QLPrintSettings printSettings = getPrinterSettings();
//        QLPrintSettings printSettings = new QLPrintSettings(PrinterModel.QL_1110NWB);

        printSettings.setPrintOrientation(PrintImageSettings.Orientation.Landscape);
        printSettings.setLabelSize(QLPrintSettings.LabelSize.DieCutW29H90);
        printSettings.setAutoCut(true);
        printSettings.setWorkPath(dir.toString());

        for (Bitmap bmp: bmps) {
            PrintError printError =  printerDriver.printImage(bmp, printSettings);

            if (printError.getCode() != PrintError.ErrorCode.NoError) {
                Log.d("", "Error - Print Image: " + printError.getCode());
            }
            else {
                Log.d("", "Success - Print Image");
            }
        }


        printerDriver.closeChannel();


    }


}
