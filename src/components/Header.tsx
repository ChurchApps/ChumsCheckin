import React from "react";
import { View, Image, StatusBar, Text, NativeModules, NativeEventEmitter, Platform, Dimensions } from "react-native";
import Ripple from "react-native-material-ripple";
import { CachedData, screenNavigationProps, Styles, StyleConstants, DimensionHelper } from "../helpers";
import { routeToScreen } from "expo-router/build/useScreens";
import { router } from "expo-router";


interface Props {
  navigation: screenNavigationProps,
  logo?: boolean,
  prominentLogo?: boolean,
  title?: string,
  subtitle?: string
}


const Header = (props: Props) => {
  const [status, setStatus] = React.useState("");
  const [landscape, setLandscape] = React.useState(false);

  let eventEmitter: NativeEventEmitter;

  const handleClick = () => {
    router.navigate('/printers')
    // props.navigation?.navigate("/printers");
  };
  
  const receiveNativeStatus = (receivedStatus: string) => { setStatus(receivedStatus); };

  const init = () => {
    console.log(Platform.OS);
    if (Platform.OS === "android" && NativeModules.PrinterHelper) {
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
    else { return require("../images/logo1.png"); }
  };

  if (props.prominentLogo) {
    return (
      <View style={{ backgroundColor: StyleConstants.ghostWhite }}>
        <StatusBar backgroundColor={StyleConstants.baseColor} />
        
        {/* Compact Printer Status Bar */}
        <Ripple style={Styles.printerStatus} onPress={() => { handleClick(); }}>
          <Text style={{ backgroundColor: StyleConstants.baseColor, color: "#FFF" }}>{getVersion()} - {status}</Text>
        </Ripple>

        {/* Professional Header Section with Prominent Logo */}
        <View style={headerStyles.headerSection}>
          {/* Prominent Church Logo in White Box */}
          <View style={headerStyles.logoContainer}>
            <Image source={getLogoUrl()} style={headerStyles.prominentLogo} />
          </View>
          
          {/* Header Text Below Logo */}
          <View style={headerStyles.headerTextContainer}>
            <View style={headerStyles.titleRow}>
              <View style={headerStyles.titleIconContainer}>
                <Text style={headerStyles.titleIcon}>🏛️</Text>
              </View>
              <View style={headerStyles.titleTextContainer}>
                <Text style={headerStyles.headerTitle}>{props.title || "Select a Service"}</Text>
                <Text style={headerStyles.headerSubtitle}>{props.subtitle || "Choose which service you'd like to check in for"}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[
      props.logo !== false ? Styles.headerLogoView : { backgroundColor: "transparent" }, 
      landscape && { maxHeight: props.logo ? "30%" : DimensionHelper.wp("50%") }
    ]}>
      <StatusBar backgroundColor={StyleConstants.baseColor} />
      <Ripple style={Styles.printerStatus} onPress={() => { handleClick(); }}>
        <Text style={{ backgroundColor: StyleConstants.baseColor, color: "#FFF" }}>{getVersion()} - {status}</Text>
      </Ripple>
      {props.logo !== false && (
        <Image source={getLogoUrl()} style={[Styles.headerLogoIcon, landscape && { maxHeight: "40%", top: "10%" }]} />
      )}
    </View>
  );
};

// Professional tablet-optimized styles for prominent logo mode
const headerStyles = {
  // Header Section (Blue background with prominent logo)
  headerSection: {
    backgroundColor: StyleConstants.baseColor, // Dark blue #1565C0
    paddingHorizontal: DimensionHelper.wp("5%"),
    paddingTop: DimensionHelper.wp("6%"),
    paddingBottom: DimensionHelper.wp("5%"),
    borderBottomLeftRadius: DimensionHelper.wp("8%"),
    borderBottomRightRadius: DimensionHelper.wp("8%"),
    marginBottom: DimensionHelper.wp("2%"),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    shadowColor: StyleConstants.baseColor,
    alignItems: "center"
  },
  
  // Prominent White Box for Logo within Blue Header
  logoContainer: {
    backgroundColor: StyleConstants.whiteColor,
    borderRadius: 12,
    width: DimensionHelper.wp("70%"), // 70% of blue box width
    height: DimensionHelper.wp("16%"),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: DimensionHelper.wp("4%"),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4
  },
  
  prominentLogo: {
    width: DimensionHelper.wp("65%"), // Slightly smaller than container for padding
    height: DimensionHelper.wp("14%"),
    resizeMode: "contain"
  },
  
  headerTextContainer: {
    width: "100%"
  },
  
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%"
  },
  
  titleIconContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    width: DimensionHelper.wp("10%"),
    height: DimensionHelper.wp("10%"),
    justifyContent: "center",
    alignItems: "center",
    marginRight: DimensionHelper.wp("3%")
  },
  
  titleIcon: {
    fontSize: DimensionHelper.wp("5%")
  },
  
  titleTextContainer: {
    flex: 1
  },
  
  headerTitle: {
    fontSize: DimensionHelper.wp("5.5%"),
    fontFamily: StyleConstants.RobotoMedium,
    fontWeight: "600",
    color: StyleConstants.whiteColor,
    marginBottom: DimensionHelper.wp("1%"),
    textAlign: "left"
  },
  
  headerSubtitle: {
    fontSize: DimensionHelper.wp("3.8%"),
    fontFamily: StyleConstants.RobotoRegular,
    color: "rgba(255,255,255,0.9)",
    textAlign: "left"
  }
};

export default Header