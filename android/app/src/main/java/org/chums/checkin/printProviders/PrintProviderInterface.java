package org.chums.checkin.printProviders;

import android.content.Context;
import android.graphics.Bitmap;

import java.util.List;

public interface PrintProviderInterface {
    public void checkInit(Context c);
    public void init();
    public void configure();
    public void printBitmaps(List<Bitmap> bmps);
    public String[] scan();
}
