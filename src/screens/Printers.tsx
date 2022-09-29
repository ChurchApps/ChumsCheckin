import React from 'react'
import { View, Text, ScrollView, NativeModules, FlatList, PixelRatio, Dimensions } from 'react-native'
import Ripple from 'react-native-material-ripple';
import { RouteProp } from '@react-navigation/native';
import { ScreenList } from './ScreenList'
import { Header } from './components'
import { screenNavigationProps, Styles, Utilities } from "../helpers"
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

type ProfileScreenRouteProp = RouteProp<ScreenList, 'Household'>;
interface Props { navigation: screenNavigationProps; route: ProfileScreenRouteProp; }

export const Printers = (props: Props) => {
  const [printers, setPrinters] = React.useState<string[]>([]);
  const [dimension, setDimension] = React.useState(Dimensions.get('window'));

  const init = () => {
    Utilities.trackEvent("Household screen");
    console.log("FETCH PRINTERS");
    NativeModules.PrinterHelper.scan().then((data: string) => {
      const items = data.split(",");
      console.log("Callback");
      console.log(items);
      setPrinters(items);
    });

  }

  const selectNone = () => {
    //props.navigation.navigate("CheckinComplete"); 
  }
  React.useEffect(init, []);

  const wd = (number: string) => {
    let givenWidth = typeof number === "number" ? number : parseFloat(number);
    return PixelRatio.roundToNearestPixel((dimension.width * givenWidth) / 100);
  };

  const handlePrinterClick = (printer: string) => {

  }

  const getPrinterRow = (data: any) => {
    const printer: string = data.item;
    return (
      <View>
        <Ripple style={[Styles.flatlistMainView, { width: wd('90%') }]} onPress={() => { handlePrinterClick(printer) }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }} >
            <Text style={[Styles.personName, { alignSelf: 'flex-start' }]} numberOfLines={1}>{printer}</Text>
          </View>
        </Ripple>
      </View>
    )
  }


  return (
    <View style={{ flex: 1 }}>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Header navigation={props.navigation} />
        <Text style={{ ...Styles.H1, marginLeft: wp('5%') }}>Search by phone number:</Text>
        <View style={Styles.fullWidthContainer}>

          <FlatList data={printers} renderItem={getPrinterRow} keyExtractor={(printer: string) => printer} />
        </View>
      </ScrollView>
      <View style={[Styles.blockButtons]}>
        <Ripple style={[Styles.blockButton]} onPress={selectNone}><Text style={Styles.blockButtonText}>No Printer</Text></Ripple>
      </View>
    </View>
  )
}