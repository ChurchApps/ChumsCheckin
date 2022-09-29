package org.chums.checkin.printProviders;

import android.content.Context;

public interface PrintProviderInterface {
    public void checkInit(Context c);
    public void init();
    public void configure();
    public void printUris(String uriList);
}
