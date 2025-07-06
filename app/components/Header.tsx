import React from "react";
import { View, Image, StatusBar, Text, NativeModules, NativeEventEmitter, Platform, Dimensions } from "react-native";
import Ripple from "react-native-material-ripple";
import { CachedData, screenNavigationProps, Styles, DimensionHelper } from "../../src/helpers";
import { router } from "expo-router";


interface Props {
  navigation: screenNavigationProps,
  logo?: boolean
}


const Header = (props: Props) => {
  const [status, setStatus] = React.useState("");
  const [landscape, setLandscape] = React.useState(false);

  let eventEmitter: NativeEventEmitter;

  const handleClick = () => {
    router.navigate("/printers")
    // props.navigation?.navigate("/printers");
  };

  const receiveNativeStatus = (receivedStatus: string) => { setStatus(receivedStatus); };

  const init = () => {
    console.log(Platform.OS);
    if (Platform.OS === "android") {
      console.log("print", CachedData.printer);
      console.log(receiveNativeStatus);

      NativeModules.PrinterHelper.bind(receiveNativeStatus);
      NativeModules.PrinterHelper.checkInit(CachedData.printer?.ipAddress || "", CachedData.printer?.model || "");
      eventEmitter = new NativeEventEmitter(NativeModules.PrinterHelper);  //eslint-disable-line react-hooks/exhaustive-deps
      eventEmitter.addListener("StatusUpdated", (event: any) => {
        if (event.status.indexOf("ready") > -1) { CachedData.printer.ipAddress = "ready"; }
        setStatus(event.status);
      });
    }
  };

  const getVersion = () => {
    let pkg = require("../../package.json");
    return "v" + pkg.version;
  };

  React.useEffect(init, []);

  const isLandscape = () => {
    const dim = Dimensions.get("screen");
    return dim.width >= dim.height;
  };

  React.useEffect(() => {
    Dimensions.addEventListener("change", () => {
      isLandscape() ? setLandscape(true) : setLandscape(false);
    });
  }, []);

  React.useEffect(() => {
    Dimensions.addEventListener("change", () => {
      isLandscape() ? setLandscape(true) : setLandscape(false);
    });
  }, [landscape]);

  const getLogoUrl = () => {
    if (CachedData.churchAppearance?.logoLight) {
      return { uri: CachedData.churchAppearance?.logoLight };
    }
    else { return require("../../src/images/logo1.png"); }
  };

  return (
    <View style={[Styles.headerLogoView, landscape && { maxHeight: props.logo ? "30%" : DimensionHelper.wp("50%") }]}>
      <StatusBar backgroundColor="#08A1CD" />
      <Ripple style={Styles.printerStatus} onPress={() => { handleClick(); }}>
        <Text style={{ backgroundColor: "#09A1CD", color: "#FFF" }}>{getVersion()} - {status}</Text>
      </Ripple>
      <Image source={getLogoUrl()} style={[Styles.headerLogoIcon, landscape && { maxHeight: "40%", top: "10%" }]} />
    </View>
  );
};
export default Header
