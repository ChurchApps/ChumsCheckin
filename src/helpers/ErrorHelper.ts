import { DeviceEventEmitter } from "react-native";
import { setJSExceptionHandler, setNativeExceptionHandler } from "react-native-exception-handler";
import { AppCenterHelper } from "@churchapps/mobilehelper";

export class ErrorHelper {

  static logEvent(eventType: string, source: string, message: string) {
    AppCenterHelper.trackEvent(eventType, { source, message });
  }

  static logError(source: string, message: string) {
    AppCenterHelper.trackEvent("Error", { source, message });
  }

  static onJavaError(event: any) {
    ErrorHelper.logError(event.source, event.message);
  }

  static onJavaEvent(event: any) {
    ErrorHelper.logEvent(event.eventType, event.source, event.message);
  }

  static init() {
    ErrorHelper.initJava();
    ErrorHelper.initUnhandled();
  }

  static initJava() {
    DeviceEventEmitter.addListener("onError", ErrorHelper.onJavaError);
    DeviceEventEmitter.addListener("onEvent", ErrorHelper.onJavaEvent);
  }

  static initUnhandled() {
    setJSExceptionHandler((error, isFatal) => {
      ErrorHelper.logError("Unhandled Javascript", error.toString());
    });

    setNativeExceptionHandler((exceptionString: string) => {
      ErrorHelper.logError("Unhandled Native", exceptionString);
    }, false, true);

  }


}


