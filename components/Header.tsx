import React from "react";
import { View, Image, StatusBar, Text, NativeModules, NativeEventEmitter, Platform, Dimensions, TouchableOpacity } from "react-native";
import { CachedData, screenNavigationProps, Styles, StyleConstants, DimensionHelper } from "../../src/helpers";
import { router } from "expo-router";

interface Props {
  navigation?: screenNavigationProps;
  logo?: boolean;
  title?: string;
  subtitle?: string;
  showPrinterStatus?: boolean;
  children?: React.ReactNode;
}


const Header = (props: Props) => {
  const [status, setStatus] = React.useState("");
  const [landscape, setLandscape] = React.useState(false);

  let eventEmitter: NativeEventEmitter;

  const handlePrinterClick = () => {
    router.navigate("/printers");
  };

  const receiveNativeStatus = (receivedStatus: string) => {
    setStatus(receivedStatus);
  };

  const init = () => {
    if (Platform.OS === "android" && props.showPrinterStatus) {
      NativeModules.PrinterHelper.bind(receiveNativeStatus);
      NativeModules.PrinterHelper.checkInit(CachedData.printer?.ipAddress || "", CachedData.printer?.model || "");
      eventEmitter = new NativeEventEmitter(NativeModules.PrinterHelper);
      eventEmitter.addListener("StatusUpdated", (event: any) => {
        if (event.status.indexOf("ready") > -1) {
          CachedData.printer.ipAddress = "ready";
        }
        setStatus(event.status);
      });
    }
  };

  const getVersion = () => {
    const pkg = require("../../package.json");
    return "v" + pkg.version;
  };

  React.useEffect(init, [props.showPrinterStatus]);

  const isLandscape = () => {
    const dim = Dimensions.get("screen");
    return dim.width >= dim.height;
  };

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener("change", () => {
      setLandscape(isLandscape());
    });
    setLandscape(isLandscape());

    return () => subscription?.remove();
  }, []);

  const getLogoUrl = () => {
    if (CachedData.churchAppearance?.logoLight) {
      return { uri: CachedData.churchAppearance?.logoLight };
    }
    return require("../../src/images/logo1.png");
  };

  // If this is a page header with title
  if (props.title) {
    return (
      <View>
        <StatusBar backgroundColor={StyleConstants.headerColor} barStyle="light-content" />

        {/* Printer Status Bar */}
        {props.showPrinterStatus && (
          <TouchableOpacity style={Styles.printerStatus} onPress={handlePrinterClick}>
            <Text style={{
              color: StyleConstants.whiteText,
              fontSize: StyleConstants.captionSize,
              fontWeight: StyleConstants.fontMedium
            }}>
              {getVersion()} - {status || "Ready"}
            </Text>
          </TouchableOpacity>
        )}

        {/* Page Header */}
        <View style={Styles.pageHeader}>
          <View style={{
            flexDirection: landscape ? "row" : "column",
            alignItems: landscape ? "center" : "flex-start",
            justifyContent: "space-between",
            gap: landscape ? 20 : 12,
          }}>
            {/* Title Section */}
            <View style={{ flex: 1 }}>
              <Text style={[Styles.H1, {
                color: StyleConstants.headerText,
                marginVertical: 0,
                marginBottom: 4,
              }]}>
                {props.title}
              </Text>
              {props.subtitle && (
                <Text style={[Styles.body1, {
                  color: "rgba(255,255,255,0.9)",
                  marginVertical: 0,
                }]}>
                  {props.subtitle}
                </Text>
              )}
            </View>

            {/* Action Buttons */}
            {props.children && (
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                flexWrap: landscape ? "nowrap" : "wrap",
              }}>
                {props.children}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }

  // Logo header (original behavior)
  return (
    <View style={[
      Styles.headerLogoView,
      landscape && {
        maxHeight: props.logo ? "30%" : Math.min(200, DimensionHelper.wp("40%"))
      }
    ]}>
      <StatusBar backgroundColor={StyleConstants.headerColor} barStyle="light-content" />

      {props.showPrinterStatus && (
        <TouchableOpacity style={Styles.printerStatus} onPress={handlePrinterClick}>
          <Text style={{
            color: StyleConstants.whiteText,
            fontSize: StyleConstants.captionSize,
            fontWeight: StyleConstants.fontMedium
          }}>
            {getVersion()} - {status || "Ready"}
          </Text>
        </TouchableOpacity>
      )}

      <Image
        source={getLogoUrl()}
        style={[
          Styles.headerLogoIcon,
          landscape && {
            maxHeight: "60%",
            marginTop: 10,
          }
        ]}
      />
    </View>
  );
};
export default Header
