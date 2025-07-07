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
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Header from "./components/Header";
import MemberList from "./components/MemberList";
import { CachedData, StyleConstants } from "../src/helpers";
import { FirebaseHelper, VisitInterface } from "@churchapps/mobilehelper";
import { router, useFocusEffect } from "expo-router";

const Household = () => {
  const [pendingVisits, setPendingVisits] = React.useState<VisitInterface[]>([]);
  const [dimensions, setDimensions] = React.useState(Dimensions.get("window"));

  const householdName = "Household"; // Will be enhanced with actual household name later
  const memberCount = CachedData.householdMembers?.length || 0;

  useFocusEffect(
    useCallback(() => {
      setPendingVisits([...CachedData.pendingVisits]);
    }, [])
  );

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  React.useEffect(() => {
    FirebaseHelper.addOpenScreenEvent("Household");
  }, []);

  const checkin = () => {
    router.navigate("/checkinComplete");
  };

  const addGuest = () => {
    router.navigate("/addGuest");
  };

  const headerButtons = (
    <>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={addGuest}
      >
        <FontAwesome name="user-plus" size={16} color={StyleConstants.whiteText} />
        <Text style={styles.headerButtonText}>Add Guest</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={householdName}
        subtitle={`${memberCount} member${memberCount !== 1 ? "s" : ""}`}
        showPrinterStatus={true}
      >
        {headerButtons}
      </Header>

      <View style={styles.content}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <MemberList pendingVisits={pendingVisits} />
        </ScrollView>

        {/* Fixed bottom check-in button */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.checkinButton}
            onPress={checkin}
          >
            <FontAwesome name="check" size={20} color={StyleConstants.whiteText} />
            <Text style={styles.checkinButtonText}>CHECK IN</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: StyleConstants.backgroundColor,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for fixed bottom button
  },
  headerButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: StyleConstants.buttonRadius,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  headerButtonText: {
    color: StyleConstants.whiteText,
    fontSize: StyleConstants.body2Size,
    fontWeight: StyleConstants.fontMedium,
    marginLeft: 8,
  },
  bottomBar: {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: StyleConstants.cardBackground,
    paddingHorizontal: 20,
    paddingVertical: 16,
    ...StyleConstants.shadow,
  },
  checkinButton: {
    backgroundColor: StyleConstants.primaryBlue,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingVertical: 16,
    borderRadius: StyleConstants.buttonRadius,
    ...StyleConstants.lightShadow,
  },
  checkinButtonText: {
    color: StyleConstants.whiteText,
    fontSize: StyleConstants.h4Size,
    fontWeight: StyleConstants.fontSemiBold,
    marginLeft: 12,
    textAlign: "center" as const,
  },
};


export default Household
