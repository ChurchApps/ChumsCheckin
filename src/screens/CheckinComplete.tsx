import React from 'react'
import { View, Text, NativeModules } from 'react-native'
import { Container } from 'native-base'
import { WebView } from "react-native-webview"
import { Header } from './components'
import ViewShot, { captureRef } from "react-native-view-shot";
import { screenNavigationProps, CachedData, ApiHelper, LabelHelper, Styles, StyleConstants, Utilities } from "../helpers"
import { CommonActions } from '@react-navigation/native';
import { ArrayHelper } from '../helpers/ArrayHelper'
import Icon from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

interface Props { navigation: screenNavigationProps; }

export const CheckinComplete = (props: Props) => {
  const shotRef = React.useRef(null);
  const [html, setHtml] = React.useState("");
  const [showPrint, setShowPrint] = React.useState(false);


  const loadData = () => {
    const promises: Promise<any>[] = [];
    promises.push(checkin());
    if (CachedData.printer?.ip) promises.push(print());

    Promise.all(promises).then(() => {
      CachedData.existingVisits = [];
      CachedData.pendingVisits = [];
      redirectToLookup();
    });
  }

  const redirectToLookup = () => {
    timeout(500).then(() => {
      const action = CommonActions.reset({ index: 0, routes: [{ name: 'Lookup' }] });
      props.navigation.dispatch(action);
    });
  }

  const print = async () => {
    return LabelHelper.getAllLabels().then(async (htmlLabels) => {
      if (htmlLabels.length > 0) await printBitmaps(htmlLabels);
    });
  }

  const printBitmaps = async (htmlLabels: string[]) => {
    Utilities.trackEvent("Print");
    setShowPrint(true);
    for (let i = 0; i < htmlLabels.length; i++) {
      const html = htmlLabels[i];
      await printBitmap(html)
    }
  }

  const printBitmap = async (html: string) => {
    setHtml(html);
    await timeout(1000);
    const result = await captureRef(shotRef, { format: "jpg", quality: 1 });
    NativeModules.PrinterHelper.printUris(result);
  }

  const timeout = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  const checkin = async () => {
    const peopleIds: number[] = ArrayHelper.getUniqueValues(CachedData.householdMembers, "id");
    const url = '/visits/checkin?serviceId=' + CachedData.serviceId + '&peopleIds=' + escape(peopleIds.join(","));
    return ApiHelper.post(url, CachedData.pendingVisits, "AttendanceApi").then(data => {
      Utilities.trackEvent("Checkin Complete");
      props.navigation.navigate("CheckinComplete")
    });
  }

  const getLabelView = () => {
    if (showPrint) {
      return (
        <>
          <Text style={Styles.H1}>Printing</Text>
          <View style={{ flex: 1, }}>
            <ViewShot ref={shotRef} style={Styles.viewShot} >
              <WebView source={{ html: html }} style={Styles.webView} />
            </ViewShot>
          </View>
        </>
      );
    } else return <></>;
  }

  React.useEffect(loadData, []);

  return (
    <Container style={{ backgroundColor: StyleConstants.ghostWhite }}>
      <Header navigation={props.navigation} />
      <View style={[Styles.mainContainer, { justifyContent: 'center' }]}>
        <Icon name={'check-circle'} style={{ fontSize: wp('20%'), color: StyleConstants.greenColor, alignSelf: 'center' }} size={wp('20%')} />
        <Text style={[Styles.H1, { alignSelf: 'center' }]}>Checkin Complete.</Text>
        {getLabelView()}
      </View>
    </Container>
  )

}