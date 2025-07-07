import { Dimensions } from "react-native";

export class StyleConstants {
  static deviceWidth = Dimensions.get("window").width;
  static deviceHeight = Dimensions.get("window").height;

  static fontSize = StyleConstants.deviceWidth * 4 / 100;
  static fontSize1 = StyleConstants.deviceWidth * 4.5 / 100;
  static fontSize2 = StyleConstants.deviceWidth * 5 / 100;
  static smallFont = StyleConstants.deviceWidth * 3.6 / 100;
  static smallerFont = StyleConstants.deviceWidth * 3.0 / 100;

  //Colors
  static baseColor = "#24B8FE";
  static baseColor1 = "#08A1CD";
  static blueColor = "#2196F3";
  static darkColor = "#3c3c3c";
  static blackColor = "black";
  static whiteColor = "white";
  static grayColor = "gray";
  static lightGrayColor = "#f5f5f5";
  static redColor = "#FF0000";
  static greenColor = "#4CAF50";
  static orangeColor = "#FF9800";
  static yellowColor = "#FFEB3B";
  static ghostWhite = "#F8F8FF";
  static transparent = "rgba(0,0,0,0)";
  
  // Font families
  static RobotoRegular = "Roboto";
}