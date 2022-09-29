import React from 'react'
import { View, Text, ScrollView, NativeModules, FlatList, PixelRatio, Dimensions } from 'react-native'
import Ripple from 'react-native-material-ripple';
import { RouteProp } from '@react-navigation/native';
import { ScreenList } from './ScreenList'
import { Header } from './components'
import { screenNavigationProps, Styles } from "../helpers"
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CodePush from 'react-native-code-push';

type ProfileScreenRouteProp = RouteProp<ScreenList, 'Household'>;
interface Props { navigation: screenNavigationProps; route: ProfileScreenRouteProp; }

export const Printers = (props: Props) => {
  const [printers, setPrinters] = React.useState<string[]>([]);
  const [dimension, setDimension] = React.useState(Dimensions.get('window'));

  const init = async () => {
    NativeModules.PrinterHelper.scan().then((data: string) => {
      const items = data.split(",");
      setPrinters(items);
    });
    return null;

  }

  const selectNone = () => {
    //props.navigation.navigate("CheckinComplete"); 
  }
  React.useEffect(() => { init() }, []);

  const wd = (number: string) => {
    let givenWidth = typeof number === "number" ? number : parseFloat(number);
    return PixelRatio.roundToNearestPixel((dimension.width * givenWidth) / 100);
  };

  const handlePrinterClick = (printer: string) => {

    CodePush.restartApp();

  }

  const getPrinterRow = (data: any) => {
    const printer: string = data.item;
    return (
      <View>
        <Ripple style={[Styles.flatlistMainView, { width: wd('90%'), padding: wd("3%") }]} onPress={() => { handlePrinterClick(printer) }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }} >
            <Text style={[Styles.personName, { alignSelf: 'flex-start' }]} numberOfLines={1}>{printer}</Text>
          </View>
        </Ripple>
      </View>
    )
  }


  return (
    <View style={{ flex: 1 }}>


      <Header navigation={props.navigation} />
      <Text style={{ ...Styles.H1, marginLeft: wp('5%') }}>Select a printer:</Text>
      <View style={Styles.fullWidthContainer}>
        <FlatList data={printers} renderItem={getPrinterRow} keyExtractor={(printer: string) => printer} />
      </View>

      <View style={[Styles.blockButtons]}>
        <Ripple style={[Styles.blockButton]} onPress={selectNone}><Text style={Styles.blockButtonText}>No Printer</Text></Ripple>
      </View>
    </View>
  )
}