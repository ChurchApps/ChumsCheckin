package org.chums.checkin;

import com.facebook.react.ReactActivity;

import com.microsoft.codepush.react.CodePush;

public class MainActivity extends ReactActivity {
  private ReactRootView mReactRootView;
  private ReactInstanceManager mReactInstanceManager;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
      mReactInstanceManager = ReactInstanceManager.builder()
        .addPackage(new CodePush("DY_Lkr9-GZDz8flf8fS3yd6Udp-t-6qyopnEs", getApplicationContext(), BuildConfig.DEBUG))
        .setJSBundleFile(CodePush.getJSBundleFile())
        .build();
      mReactRootView.startReactApplication(mReactInstanceManager, "MyReactNativeApp", null);
      setContentView(mReactRootView);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Chums";
  }
}
