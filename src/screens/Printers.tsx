import React from "react";
import { View, Text, NativeModules, FlatList, PixelRatio, Dimensions, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ripple from "react-native-material-ripple";
import { RouteProp } from "@react-navigation/native";
import { ScreenList } from "./ScreenList";
import { Header } from "./components";
import { AvailablePrinter, CachedData, screenNavigationProps, Styles } from "../helpers";
import CodePush from "react-native-code-push";
import { PrintUI } from "./components/PrintUI";
import { DimensionHelper } from "@churchapps/mobilehelper";

type ProfileScreenRouteProp = RouteProp<ScreenList, "Household">;
interface Props { navigation: screenNavigationProps; route: ProfileScreenRouteProp; }

export const Printers = (props: Props) => {
  const [printers, setPrinters] = React.useState<AvailablePrinter[]>([{ model: "No Printer", ipAddress: "No Printer" }]);
  const [selectedPrinter, setSelectedPrinter] = React.useState<AvailablePrinter>({ model: "No Printer", ipAddress: "No Printer" });
  const [dimension, setDimension] = React.useState(Dimensions.get("window"));
  const [htmlLabels, setHtmlLabels] = React.useState<string[]>([]);

  const init = async () => {
    NativeModules.PrinterHelper.scan().then((data: string) => {
      const items = data.split(",");
      let result: AvailablePrinter[] = [];
      items.forEach(item => {
        if (item.length > 0) {
          const splitItem = item.split("~");
          result.push({ ipAddress: splitItem[1], model: splitItem[0] });
        }
      });
      result.push({ model: "No Printer", ipAddress: "No Printer" });
      setPrinters(result);
    });
    return null;

  };

  const saveSelectedPrinter = async () => {
    let printer = selectedPrinter;
    if (printer.model === "No Printer") {printer = { model: "none", ipAddress: "" };}

    CachedData.printer = printer;
    await AsyncStorage.setItem("@Printer", JSON.stringify(CachedData.printer));
    console.log(JSON.stringify(CachedData.printer));

    //NativeModules.PrinterHelper.bind(receiveNativeStatus);
    NativeModules.PrinterHelper.checkInit(CachedData.printer?.ipAddress || "", CachedData.printer?.model || "");

  };

  React.useEffect(() => { init(); }, []);

  const wd = (number: string) => {
    let givenWidth = typeof number === "number" ? number : parseFloat(number);
    return PixelRatio.roundToNearestPixel((dimension.width * givenWidth) / 100);
  };

  const getPrinterRow = (data: any) => {
    const printer: AvailablePrinter = data.item;
    const style = (printer.ipAddress === selectedPrinter.ipAddress) ? { backgroundColor: "#DDFFDD" } : {};
    return (
      <View>
        <Ripple style={[Styles.flatlistMainView, { width: wd("90%"), padding: wd("3%") }, style]} onPress={() => { setSelectedPrinter(printer); }}>
          <View style={[{ justifyContent: "center", alignItems: "center" }]}>
            <Text style={[Styles.personName, { alignSelf: "flex-start" }]} numberOfLines={1}>{printer.ipAddress}</Text>
            <Text style={[Styles.groupName, { alignSelf: "flex-start" }]} numberOfLines={1}>{printer.model}</Text>
          </View>
        </Ripple>
      </View>
    );
  };

  const testPrint = () => {
    if (selectedPrinter.model === "No Printer") {Alert.alert("No printer selected");}
    else {
      saveSelectedPrinter();
      setHtmlLabels(["<b>Hello World</b>"]);
    }
  };

  const getLabelView = () => {
    if (htmlLabels?.length > 0) {return (<PrintUI htmlLabels={htmlLabels} onPrintComplete={() => { setHtmlLabels([]); }} />);}
    else {return <View style={[Styles.blockButtons]}>
      <Ripple style={[Styles.blockButton, { backgroundColor: "#FFFFFF" }]} onPress={testPrint}><Text style={[Styles.blockButtonText, { color: "#08A1CD" }]}>Test Print</Text></Ripple>
    </View>;}
  };

  return (
    <View style={{ flex: 1 }}>
      <Header navigation={props.navigation} />
      <Text style={{ ...Styles.H1, marginLeft: DimensionHelper.wp("5%") }}>Select a printer:</Text>
      <View style={Styles.fullWidthContainer}>
        <FlatList data={printers as any[]} renderItem={getPrinterRow} keyExtractor={(printer: string) => printer} />
      </View>
      {getLabelView()}

      <View style={[Styles.blockButtons]}>
        <Ripple style={[Styles.blockButton]} onPress={() => { saveSelectedPrinter(); CodePush.restartApp(); }}><Text style={Styles.blockButtonText}>Done</Text></Ripple>
      </View>
    </View>
  );
};
