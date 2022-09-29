import React from 'react'
import { View, Image, StatusBar, Text, NativeModules, NativeEventEmitter, Platform, Dimensions } from 'react-native'
import Ripple from 'react-native-material-ripple';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { CachedData, screenNavigationProps, Styles } from '../../helpers'

interface Props {
  navigation: screenNavigationProps,
  logo?: any
}

export const Header = (props: Props) => {
  const [status, setStatus] = React.useState("");
  const [landscap, setLandscap] = React.useState(false);

  var eventEmitter: NativeEventEmitter;

  const handleClick = () => {
    props.navigation.navigate("Printers");
    //NativeModules.PrinterHelper.configure(); 
  }
  const receiveNativeStatus = (receivedStatus: string) => { setStatus(receivedStatus); }

  const init = () => {
    console.log(Platform.OS)
    if (Platform.OS === 'android') {


      NativeModules.PrinterHelper.bind(receiveNativeStatus);
      eventEmitter = new NativeEventEmitter(NativeModules.PrinterHelper);
      eventEmitter.addListener('StatusUpdated', (event: any) => {
        console.log("PRINTER STATUS: ");
        console.log(event.status);
        if (event.status.indexOf("ready") > -1) CachedData.printerReady = true;
        setStatus(event.status);
      });
    }
  }

  React.useEffect(init, []);

  const isLandscape = () => {
    const dim = Dimensions.get('screen');
    return dim.width >= dim.height;
  };

  React.useEffect(() => {
    Dimensions.addEventListener('change', () => {
      isLandscape() ? setLandscap(true) : setLandscap(false);
    })
  }, []);

  React.useEffect(() => {
    Dimensions.addEventListener('change', () => {
      isLandscape() ? setLandscap(true) : setLandscap(false);
    })
  }, [landscap])

  return (
    <View style={[Styles.headerLogoView, landscap && { maxHeight: props.logo ? '30%' : widthPercentageToDP('50%') }]}>
      <StatusBar backgroundColor="#08A1CD"></StatusBar>
      <Ripple style={Styles.printerStatus} onPress={() => { handleClick() }} >
        <Text style={{ backgroundColor: "#09A1CD", color: "#FFF" }} >{status} - Configure Printer</Text>
      </Ripple>
      <Image source={require('../../images/logo1.png')} style={[Styles.headerLogoIcon, landscap && { maxHeight: '40%', top: '10%' }]} />
    </View>
  )
}
