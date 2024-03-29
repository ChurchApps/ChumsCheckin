import React from "react";
import { View, Text, ScrollView } from "react-native";
import Ripple from "react-native-material-ripple";
import { RouteProp } from "@react-navigation/native";
import { ScreenList } from "./ScreenList";
import { Header, MemberList } from "./components";
import { screenNavigationProps, CachedData, Styles, Utilities, StyleConstants } from "../helpers";
import { AppCenterHelper, VisitInterface } from "@churchapps/mobilehelper";

type ProfileScreenRouteProp = RouteProp<ScreenList, "Household">;
interface Props { navigation: screenNavigationProps; route: ProfileScreenRouteProp; }

export const Household = (props: Props) => {
  const [pendingVisits, setPendingVisits] = React.useState<VisitInterface[]>([]);
  const init = () => {
    AppCenterHelper.trackEvent("Household screen");
    props.navigation.addListener("focus", () => {
      setPendingVisits([...CachedData.pendingVisits]);
    });
  };
  const checkin = () => { props.navigation.navigate("CheckinComplete"); };
  const addGuest = () => { props.navigation.navigate("AddGuest"); };


  React.useEffect(init, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={Styles.fullWidthContainer}>
          <Header navigation={props.navigation} />
          <MemberList navigation={props.navigation} pendingVisits={pendingVisits} />
          <View style={[Styles.blockButtons, {marginTop:20}]}>
            <Ripple style={[Styles.blockButton, {backgroundColor: StyleConstants.greenColor}]} onPress={addGuest}><Text style={Styles.blockButtonText}>Add a Guest</Text></Ripple>
          </View>

        </View>
      </ScrollView>
      <View style={[Styles.blockButtons]}>
        <Ripple style={[Styles.blockButton]} onPress={checkin}><Text style={Styles.blockButtonText}>CHECKIN</Text></Ripple>
      </View>
    </View>
  );
};
