import { DimensionHelper } from "./DimensionHelper";
import { StyleSheet, Dimensions } from "react-native";

export class StyleConstants {
  static deviceWidth = Dimensions.get("window").width;
  static deviceHeight = Dimensions.get("window").height;

  // Typography scales optimized for tablets
  static h1Size = Math.min(34, StyleConstants.deviceWidth * 0.055);
  static h2Size = Math.min(30, StyleConstants.deviceWidth * 0.05);
  static h3Size = Math.min(26, StyleConstants.deviceWidth * 0.045);
  static h4Size = Math.min(22, StyleConstants.deviceWidth * 0.04);
  static bodySize = Math.min(18, StyleConstants.deviceWidth * 0.035);
  static body2Size = Math.min(16, StyleConstants.deviceWidth * 0.032);
  static captionSize = Math.min(14, StyleConstants.deviceWidth * 0.028);
  static smallSize = Math.min(12, StyleConstants.deviceWidth * 0.025);

  // Legacy font sizes for backward compatibility
  static fontSize = StyleConstants.bodySize;
  static fontSize1 = StyleConstants.h4Size;
  static fontSize2 = StyleConstants.h3Size;
  static smallFont = StyleConstants.body2Size;
  static smallerFont = StyleConstants.captionSize;

  // ChumsApp Color System
  static primaryBlue = "#1565C0";
  static primaryBlueL1 = "#3578CC";
  static primaryBlueL2 = "#568BDA";
  static primaryBlueL3 = "#77A0E5";
  static primaryBlueL4 = "#99B5F0";
  static primaryBlueL5 = "#BBCBF8";
  static primaryBlueL6 = "#DDE1FC";
  static primaryBlueL7 = "#F0F4FF";
  static primaryBlueD1 = "#1358AD";
  static primaryBlueD2 = "#114A99";

  // Header color
  static headerColor = StyleConstants.primaryBlueL2;

  // Status colors
  static successColor = "#77cc00";
  static warningColor = "#ffc107";
  static errorColor = "#cc0011";
  static infoColor = "#03a9f4";

  // Background colors
  static backgroundColor = "#F6F6F8";
  static cardBackground = "#FFFFFF";
  static headerBackground = StyleConstants.headerColor;

  // Text colors
  static primaryText = "#333333";
  static secondaryText = "#666666";
  static lightText = "#999999";
  static whiteText = "#FFFFFF";
  static headerText = "#FFFFFF";

  // Legacy colors for backward compatibility
  static baseColor = StyleConstants.primaryBlue;
  static baseColor1 = StyleConstants.primaryBlueD1;
  static blueColor = StyleConstants.primaryBlue;
  static darkColor = StyleConstants.primaryText;
  static blackColor = "#000000";
  static grayColor = StyleConstants.secondaryText;
  static lightGrayColor = "#cccccc";
  static whiteColor = "#ffffff";
  static yellowColor = "#FEAA24";
  static greenColor = StyleConstants.successColor;
  static redColor = StyleConstants.errorColor;
  static cyanColor = "#1C9BA0";
  static darkPink = "#FF69B4";
  static ghostWhite = StyleConstants.backgroundColor;

  // Font weights
  static fontLight = "300" as const;
  static fontRegular = "400" as const;
  static fontMedium = "500" as const;
  static fontSemiBold = "600" as const;
  static fontBold = "700" as const;

  // Legacy font families for React Native compatibility
  static RobotoBold = "Roboto-Bold";
  static RobotoBlack = "Roboto-Black";
  static RobotoItalic = "Roboto-Italic";
  static RobotoLight = "Roboto-Light";
  static RobotoMedium = "Roboto-Medium";
  static RobotoRegular = "Roboto-Regular";
  static RobotoThin = "Roboto-Thin";

  // Shadow styles
  static shadow = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  };

  static lightShadow = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  };

  static strongShadow = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  };

  // Border radius
  static borderRadius = 8;
  static cardRadius = 12;
  static buttonRadius = 6;
}

export const Styles = StyleSheet.create({
  // Global styles with tablet optimization
  mainContainer: {
    paddingHorizontal: "5%",
    backgroundColor: StyleConstants.backgroundColor,
    flex: 1,
    minHeight: "100%",
  },
  fullWidthContainer: {
    backgroundColor: StyleConstants.backgroundColor,
    flex: 1,
    minHeight: "100%",
  },

  // Typography styles
  H1: {
    fontSize: StyleConstants.h1Size,
    alignSelf: "flex-start",
    marginVertical: 16,
    fontWeight: StyleConstants.fontSemiBold,
    color: StyleConstants.primaryText,
  },
  H2: {
    fontSize: StyleConstants.h2Size,
    alignSelf: "flex-start",
    marginVertical: 12,
    fontWeight: StyleConstants.fontMedium,
    color: StyleConstants.primaryText,
  },
  H3: {
    fontSize: StyleConstants.h3Size,
    alignSelf: "flex-start",
    marginVertical: 10,
    fontWeight: StyleConstants.fontMedium,
    color: StyleConstants.primaryText,
  },
  H4: {
    fontSize: StyleConstants.h4Size,
    alignSelf: "flex-start",
    marginVertical: 8,
    fontWeight: StyleConstants.fontMedium,
    color: StyleConstants.primaryBlue,
  },
  body1: {
    fontSize: StyleConstants.bodySize,
    fontWeight: StyleConstants.fontRegular,
    color: StyleConstants.primaryText,
    lineHeight: StyleConstants.bodySize * 1.4,
  },
  body2: {
    fontSize: StyleConstants.body2Size,
    fontWeight: StyleConstants.fontRegular,
    color: StyleConstants.secondaryText,
    lineHeight: StyleConstants.body2Size * 1.4,
  },
  caption: {
    fontSize: StyleConstants.captionSize,
    fontWeight: StyleConstants.fontRegular,
    color: StyleConstants.lightText,
    lineHeight: StyleConstants.captionSize * 1.3,
  },

  // Header styles
  pageHeader: {
    backgroundColor: StyleConstants.headerBackground,
    paddingVertical: 24,
    paddingHorizontal: 20,
    ...StyleConstants.lightShadow,
  },
  headerImageView: {
    height: StyleConstants.deviceHeight * 0.24,
    width: "100%",
    backgroundColor: StyleConstants.cardBackground,
    borderBottomLeftRadius: StyleConstants.cardRadius,
    borderBottomRightRadius: StyleConstants.cardRadius,
    ...StyleConstants.shadow,
  },
  headerImage: {
    maxWidth: StyleConstants.deviceWidth * 0.7,
    height: StyleConstants.deviceHeight * 0.2,
    alignSelf: "center",
    resizeMode: "contain",
  },
  printerStatus: {
    backgroundColor: StyleConstants.infoColor,
    height: 30,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },

  // Content styles
  content: {
    backgroundColor: StyleConstants.backgroundColor,
    paddingBottom: 20,
    flex: 1,
  },
  label: {
    fontSize: StyleConstants.bodySize,
    alignSelf: "flex-start",
    marginVertical: 12,
    fontWeight: StyleConstants.fontMedium,
    color: StyleConstants.primaryText,
  },
  // Input styles
  textInput: {
    backgroundColor: StyleConstants.cardBackground,
    paddingHorizontal: 16,
    fontSize: StyleConstants.bodySize,
    borderRadius: StyleConstants.borderRadius,
    borderWidth: 1,
    borderColor: StyleConstants.lightGrayColor,
    minHeight: 48,
  },
  textInputView: {
    height: Math.max(48, parseFloat(DimensionHelper.wp("12%").toString())),
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
    marginHorizontal: 20,
    backgroundColor: StyleConstants.cardBackground,
    borderRadius: StyleConstants.borderRadius,
    ...StyleConstants.lightShadow,
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: StyleConstants.lightGrayColor,
  },
  textInputStyle: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: StyleConstants.bodySize,
    color: StyleConstants.primaryText,
    minHeight: 44,
  },
  flatlistDropIcon: {
    fontSize: 24,
    color: StyleConstants.secondaryText,
    marginLeft: 12,
  },
  inputIcon: {
    width: 20,
    height: 20,
    margin: 12,
    tintColor: StyleConstants.secondaryText,
  },
  privacyIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: StyleConstants.primaryBlue,
  },
  privacyPolicyView: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },

  // Button styles
  button: {
    backgroundColor: StyleConstants.primaryBlue,
    marginVertical: 16,
    height: 48,
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: StyleConstants.buttonRadius,
    alignItems: "center",
    ...StyleConstants.lightShadow,
  },
  buttonText: {
    color: StyleConstants.whiteText,
    fontSize: StyleConstants.bodySize,
    fontWeight: StyleConstants.fontMedium,
  },
  primaryButton: {
    backgroundColor: StyleConstants.primaryBlue,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: StyleConstants.buttonRadius,
    alignItems: "center",
    justifyContent: "center",
    ...StyleConstants.lightShadow,
  },
  primaryButtonText: {
    color: StyleConstants.whiteText,
    fontSize: StyleConstants.bodySize,
    fontWeight: StyleConstants.fontMedium,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: StyleConstants.buttonRadius,
    borderWidth: 2,
    borderColor: StyleConstants.primaryBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: StyleConstants.primaryBlue,
    fontSize: StyleConstants.bodySize,
    fontWeight: StyleConstants.fontMedium,
  },
  bigButton: {
    height: Math.max(56, parseFloat(DimensionHelper.wp("14%").toString())),
    borderRadius: StyleConstants.buttonRadius,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: StyleConstants.primaryBlue,
    marginTop: 20,
    paddingHorizontal: 32,
    ...StyleConstants.shadow,
  },
  bigButtonText: {
    color: StyleConstants.whiteText,
    fontSize: StyleConstants.h4Size,
    fontWeight: StyleConstants.fontMedium,
  },
  bigLinkButton: {
    width: "90%",
    minHeight: Math.max(64, parseFloat(DimensionHelper.wp("16%").toString())),
    justifyContent: "center",
    backgroundColor: StyleConstants.cardBackground,
    alignSelf: "center",
    alignItems: "center",
    marginVertical: 8,
    borderRadius: StyleConstants.cardRadius,
    ...StyleConstants.shadow,
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  bigLinkButtonText: {
    fontSize: StyleConstants.h4Size,
    fontWeight: StyleConstants.fontMedium,
    color: StyleConstants.primaryBlue,
  },
  blockButtons: {
    height: Math.max(52, StyleConstants.deviceWidth * 0.12),
    width: "100%",
    flexDirection: "row",
  },
  blockButton: {
    backgroundColor: StyleConstants.primaryBlueD1,
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
  },
  blockButtonText: {
    color: StyleConstants.whiteText,
    fontSize: StyleConstants.bodySize,
    fontWeight: StyleConstants.fontMedium,
    textAlign: "center",
  },


  // Splash screen
  splashMaincontainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: StyleConstants.backgroundColor,
    paddingTop: "45%",
  },

  // Card styles
  card: {
    backgroundColor: StyleConstants.cardBackground,
    borderRadius: StyleConstants.cardRadius,
    ...StyleConstants.shadow,
    marginVertical: 8,
    overflow: "hidden",
  },
  cardHeader: {
    backgroundColor: StyleConstants.primaryBlueL6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: StyleConstants.lightGrayColor,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: StyleConstants.h4Size,
    fontWeight: StyleConstants.fontMedium,
    color: StyleConstants.primaryBlue,
    marginBottom: 4,
  },

  // Search and lookup styles
  searchView: {
    width: "90%",
    minHeight: Math.max(56, parseFloat(DimensionHelper.wp("14%").toString())),
    alignSelf: "center",
    flexDirection: "row",
    marginVertical: 12,
    ...StyleConstants.shadow,
  },
  searchTextInput: {
    backgroundColor: StyleConstants.cardBackground,
    flex: 1,
    paddingHorizontal: 16,
    fontSize: StyleConstants.bodySize,
    borderTopLeftRadius: StyleConstants.borderRadius,
    borderBottomLeftRadius: StyleConstants.borderRadius,
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: StyleConstants.lightGrayColor,
    minHeight: 56,
  },
  searchButton: {
    backgroundColor: StyleConstants.primaryBlue,
    minWidth: 80,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    borderTopRightRadius: StyleConstants.borderRadius,
    borderBottomRightRadius: StyleConstants.borderRadius,
  },
  searchButtonText: {
    color: StyleConstants.whiteText,
    fontSize: StyleConstants.bodySize,
    fontWeight: StyleConstants.fontMedium,
  },
  flatlistMainView: {
    width: "90%",
    backgroundColor: StyleConstants.cardBackground,
    alignSelf: "center",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: 6,
    borderRadius: StyleConstants.borderRadius,
    ...StyleConstants.lightShadow,
    flexDirection: "row",
    minHeight: Math.max(80, parseFloat(DimensionHelper.wp("20%").toString())),
    paddingVertical: 12,
  },
  personPhoto: {
    width: Math.max(64, parseFloat(DimensionHelper.wp("16%").toString())),
    height: Math.max(64, parseFloat(DimensionHelper.wp("16%").toString())),
    marginHorizontal: 12,
    borderRadius: StyleConstants.borderRadius,
  },
  personName: {
    flex: 1,
    color: StyleConstants.primaryBlue,
    fontSize: StyleConstants.h4Size,
    fontWeight: StyleConstants.fontMedium,
    marginRight: 12,
  },

  // Household and service time styles
  serviceTimeButton: {
    minWidth: "50%",
    height: Math.max(56, parseFloat(DimensionHelper.wp("14%").toString())),
    marginHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: StyleConstants.buttonRadius,
    ...StyleConstants.lightShadow,
  },
  serviceTimeButtonText: {
    color: StyleConstants.whiteText,
    fontSize: StyleConstants.bodySize,
    fontWeight: StyleConstants.fontMedium,
    textAlign: "center",
  },
  serviceTimeText: {
    fontSize: StyleConstants.body2Size,
    color: StyleConstants.primaryBlue,
    fontWeight: StyleConstants.fontMedium,
  },
  expandedRow: {
    width: "90%",
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: StyleConstants.lightGrayColor,
    paddingHorizontal: 16,
  },
  serviceTimeView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  timeIcon: {
    fontSize: 20,
    color: StyleConstants.primaryBlue,
    marginHorizontal: 4,
  },
  groupName: {
    flex: 1,
    textAlign: "left",
    fontSize: StyleConstants.body2Size,
    color: StyleConstants.successColor,
    marginVertical: 4,
    fontWeight: StyleConstants.fontMedium,
  },

  // Check-in complete and print styles
  viewShot: {
    width: StyleConstants.deviceWidth * 0.9,
    height: (StyleConstants.deviceWidth * 0.9) / 3.5 * 1.1,
    alignSelf: "center",
  },
  webView: {
    width: StyleConstants.deviceWidth * 0.9,
    height: (StyleConstants.deviceWidth * 0.9) / 3.5 * 1.1,
    alignSelf: "center",
  },
  printImage: {
    width: StyleConstants.deviceWidth * 0.9,
    height: (StyleConstants.deviceWidth * 0.9) / 3.5 * 1.1,
    alignSelf: "center",
  },
  backIcon: {
    marginVertical: 16,
    marginLeft: 12,
    color: StyleConstants.primaryBlue,
  },
  modelView: {
    flex: 1,
    backgroundColor: StyleConstants.backgroundColor,
  },

  // Logo and branding styles
  headerLogoView: {
    borderBottomLeftRadius: StyleConstants.cardRadius,
    borderBottomRightRadius: StyleConstants.cardRadius,
    marginBottom: 16,
    backgroundColor: StyleConstants.cardBackground,
    ...StyleConstants.shadow,
  },
  headerLogoIcon: {
    width: "100%",
    height: Math.max(120, DimensionHelper.hp(16)),
    marginBottom: 12,
    marginTop: 20,
    resizeMode: "contain",
    alignSelf: "center",
  },

  // Status chip styles
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  statusChipActive: {
    backgroundColor: "#e8f5e9",
  },
  statusChipActiveText: {
    color: "#2e7d32",
    fontSize: StyleConstants.captionSize,
    fontWeight: StyleConstants.fontMedium,
  },
  statusChipPending: {
    backgroundColor: "#fff3e0",
  },
  statusChipPendingText: {
    color: "#f57c00",
    fontSize: StyleConstants.captionSize,
    fontWeight: StyleConstants.fontMedium,
  },
  statusChipDefault: {
    backgroundColor: StyleConstants.primaryBlueL6,
  },
  statusChipDefaultText: {
    color: StyleConstants.primaryBlue,
    fontSize: StyleConstants.captionSize,
    fontWeight: StyleConstants.fontMedium,
  },
});
