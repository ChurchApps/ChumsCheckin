import { Dimensions, PixelRatio } from "react-native";

export class DimensionHelper {
  private static screenWidth = Dimensions.get('window').width;
  private static screenHeight = Dimensions.get('window').height;

  static wp(widthPercent: any) {
    const elemWidth = typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);
    return PixelRatio.roundToNearestPixel(this.screenWidth * elemWidth / 100);
  };

  static hp(heightPercent: any) {
    const elemHeight = typeof heightPercent === "number" ? heightPercent : parseFloat(heightPercent);
    return PixelRatio.roundToNearestPixel(this.screenHeight * elemHeight / 100);
  };

  static listenOrientationChange(that:any, callback:() => void) {
    Dimensions.addEventListener('change', newDimensions => {
      this.screenWidth = newDimensions.window.width;
      this.screenHeight = newDimensions.window.height;
      callback();
    });
  };

  static removeOrientationListener() {
    // Note: Dimensions.removeEventListener was deprecated
    // This is kept for compatibility but doesn't actually do anything
  };
}