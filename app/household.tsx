
import React, { useCallback } from "react";
import { View, Text, ScrollView } from "react-native";
import Ripple from "react-native-material-ripple";
import { RouteProp } from "@react-navigation/native";

// import { Header, MemberList } from "./components";
import Header from "../src/components/Header";
import MemberList from "../src/components/MemberList";
import { screenNavigationProps, CachedData, Styles, Utilities, StyleConstants } from "../src/helpers";
import { AppCenterHelper, FirebaseHelper, VisitInterface } from "../src/helpers";
import { router, useFocusEffect } from "expo-router";
import { ScreenList } from "../src/screenList";

type ProfileScreenRouteProp = RouteProp<ScreenList, "Household">;
interface Props { navigation: screenNavigationProps; }

const Household = (props: Props) => {
  const [pendingVisits, setPendingVisits] = React.useState<VisitInterface[]>([]);
  // const init = () => {
  //   // AppCenterHelper.trackEvent("Household screen");
  //   props.navigation.addListener("focus", () => {
  //     setPendingVisits([...CachedData.pendingVisits]);
  //   });
  // };

  useFocusEffect(
    useCallback(() => {
      setPendingVisits([...CachedData.pendingVisits]);
    }, [])
  );
  const checkin = () => { router.navigate("/checkinComplete"); };
  const addGuest = () => { router.navigate("/addGuest"); };


  // console.log(props.navigation)

  React.useEffect(() => { FirebaseHelper.addOpenScreenEvent("Household"); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={Styles.fullWidthContainer}>
          <Header navigation={props.navigation} />
          <MemberList navigation={props.navigation} pendingVisits={pendingVisits} />
          <View style={[Styles.blockButtons, { marginTop: 20 }]}>
            <Ripple style={[Styles.blockButton, { backgroundColor: StyleConstants.greenColor }]} onPress={addGuest}><Text style={Styles.blockButtonText}>Add a Guest</Text></Ripple>
          </View>

        </View>
      </ScrollView>
      <View style={[Styles.blockButtons]}>
        <Ripple style={[Styles.blockButton]} onPress={checkin}><Text style={Styles.blockButtonText}>CHECKIN</Text></Ripple>
      </View>
    </View>
  );
};


export default Household