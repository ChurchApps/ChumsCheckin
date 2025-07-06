// import React from "react";
// import { View, Text, ScrollView } from "react-native";
// import Ripple from "react-native-material-ripple";
// import { RouteProp } from "@react-navigation/native";
// import { ScreenList } from "./ScreenList";
// import { screenNavigationProps, CachedData, Styles, StyleConstants } from "../src/helpers";
// import {  VisitInterface ,AppCenterHelper} from "@churchapps/mobilehelper";
// import Header from "./components/Header";
// import MemberList from "./components/MemberList";
// import { useRouter, useLocalSearchParams } from "expo-router";


// // type ProfileScreenRouteProp = RouteProp<ScreenList, "Household">;
// // interface Props { navigation: screenNavigationProps; route: ProfileScreenRouteProp; }

//  const Household = () => {

//   const router = useRouter();
//   const params = useLocalSearchParams(); //  Retrieve route parameters

//   const [pendingVisits, setPendingVisits] = React.useState<VisitInterface[]>([]);

//   React.useEffect(() => {
//     // AppCenterHelper.trackEvent("Household screen");
//     setPendingVisits([...CachedData.pendingVisits]);
//   }, []);

//   // const init = () => {
//   //   AppCenterHelper.trackEvent("Household screen");
//   //   props.navigation.addListener("focus", () => {
//   //     setPendingVisits([...CachedData.pendingVisits]);
//   //   });
//   // };

//   // const checkin = () => { props.navigation.navigate("CheckinComplete"); };
//   // const addGuest = () => { props.navigation.navigate("AddGuest"); };

//   const checkin = () => {
//     router.push({ pathname: "/checkinComplete", params: { householdId: params.householdId } }); //   Pass params
//   };

//   const addGuest = () => {
//     router.push({ pathname: "/addGuest", params: { householdId: params.householdId } }); //   Pass params
//   };

//   // React.useEffect(init, []); // eslint-disable-line react-hooks/exhaustive-deps

//   return (
//     <View style={{ flex: 1 }}>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         <View style={Styles.fullWidthContainer}>
//           <Header />
//           <MemberList pendingVisits={pendingVisits} />
//           <View style={[Styles.blockButtons, {marginTop:20}]}>
//             <Ripple style={[Styles.blockButton, {backgroundColor: StyleConstants.greenColor}]} onPress={addGuest}><Text style={Styles.blockButtonText}>Add a Guest</Text></Ripple>
//           </View>

//         </View>
//       </ScrollView>
//       <View style={[Styles.blockButtons]}>
//         <Ripple style={[Styles.blockButton]} onPress={checkin}><Text style={Styles.blockButtonText}>CHECKIN</Text></Ripple>
//       </View>
//     </View>
//   );
// };


// export default Household


import React, { useCallback } from "react";
import { View, Text, ScrollView } from "react-native";
import Ripple from "react-native-material-ripple";
import Header from "./components/Header";
import MemberList from "./components/MemberList";
import { CachedData, Styles, StyleConstants } from "../src/helpers";
import { FirebaseHelper, VisitInterface } from "@churchapps/mobilehelper";
import { router, useFocusEffect } from "expo-router";

const Household = () => {
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
          <Header />
          <MemberList pendingVisits={pendingVisits} />
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
