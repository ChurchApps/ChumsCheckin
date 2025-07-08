import React from "react";
import { View, Text } from "react-native";
import { screenNavigationProps, CachedData, LabelHelper, Styles, StyleConstants } from "../src/helpers";
import { FontAwesome } from "@expo/vector-icons";
import { ApiHelper, AppCenterHelper, ArrayHelper, DimensionHelper, FirebaseHelper } from "../src/helpers";
import PrintUI from "../src/components/PrintUI";
import Header from "../src/components/Header";
import Subheader from "../src/components/Subheader";
import { router } from "expo-router";

interface Props { navigation: screenNavigationProps; }

const CheckinComplete = (props: Props) => {
  const [htmlLabels, setHtmlLabels] = React.useState<string[]>([]);

  const loadData = () => {
    FirebaseHelper.addOpenScreenEvent("CheckinCompleteScreen");
    const promises: Promise<any>[] = [];
    promises.push(checkin());
    if (CachedData.printer?.ipAddress) { print(); }
    //print();

    Promise.all(promises).then(() => {
      if (!CachedData.printer?.ipAddress) { startOver(); }
    });
  };

  const startOver = () => {
    CachedData.existingVisits = [];
    CachedData.pendingVisits = [];
    setHtmlLabels([]);
    redirectToLookup();
  };

  const redirectToLookup = () => {
    timeout(3000).then(() => {
      router.replace('/lookup')
    });
  };

  const print = async () => LabelHelper.getAllLabels().then(async (labels) => {
    setHtmlLabels(labels);
    if (labels.length === 0) { startOver(); }
  });

  const timeout = (ms: number) => new Promise(resolve => setTimeout(() => { resolve(null); }, ms));

  const checkin = async () => {
    const peopleIds: number[] = ArrayHelper.getUniqueValues(CachedData.householdMembers, "id");
    const url = "/visits/checkin?serviceId=" + CachedData.serviceId + "&peopleIds=" + escape(peopleIds.join(","));
    return ApiHelper.post(url, CachedData.pendingVisits, "AttendanceApi").then(data => {
      console.log("Checkin Complete")
      //console.log(data)
      // AppCenterHelper.trackEvent("Checkin Complete");
      //router.navigate('/checkinComplete')
      // props.navigation.navigate("CheckinComplete");
    });
  };


  const getLabelView = () => {
    if (htmlLabels?.length > 0) { return (<PrintUI htmlLabels={htmlLabels} onPrintComplete={startOver} />); }
    else { return <></>; }
  };

  React.useEffect(loadData, []);  //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View style={checkinCompleteStyles.container}>
      <Header
        navigation={props.navigation}
        prominentLogo={true}
      />

      {/* Check-in Complete Section */}
      <Subheader
        icon="✅"
        title="Check-in Complete"
        subtitle="Your family has been successfully checked in"
      />

      {/* Main Content */}
      <View style={checkinCompleteStyles.mainContent}>
        <View style={checkinCompleteStyles.successCard}>
          <View style={checkinCompleteStyles.successIconContainer}>
            <FontAwesome
              name="check-circle"
              style={checkinCompleteStyles.successIcon}
              size={DimensionHelper.wp("15%")}
            />
          </View>
          <Text style={checkinCompleteStyles.successTitle}>Welcome!</Text>
          <Text style={checkinCompleteStyles.successMessage}>
            Your family has been checked in successfully.
            {CachedData.printer?.ipAddress ? " Your labels are being printed now." : ""}
          </Text>
        </View>

        {getLabelView()}
      </View>
    </View>
  );

};

// Professional tablet-optimized styles matching ChumsApp design patterns
const checkinCompleteStyles = {
  container: {
    flex: 1,
    backgroundColor: StyleConstants.ghostWhite
  },

  // Main Content
  mainContent: {
    flex: 1,
    paddingHorizontal: DimensionHelper.wp("5%"),
    paddingTop: DimensionHelper.wp("5%"),
    justifyContent: "center",
    alignItems: "center"
  },

  // Success Card (Professional Material Design)
  successCard: {
    backgroundColor: StyleConstants.whiteColor,
    borderRadius: 16,
    padding: DimensionHelper.wp("8%"),
    marginBottom: DimensionHelper.wp("5%"),
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    shadowColor: StyleConstants.baseColor,
    alignItems: "center",
    minWidth: DimensionHelper.wp("80%"),
    maxWidth: DimensionHelper.wp("90%")
  },

  successIconContainer: {
    backgroundColor: StyleConstants.greenColor + "20",
    borderRadius: DimensionHelper.wp("8%"),
    width: DimensionHelper.wp("20%"),
    height: DimensionHelper.wp("20%"),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: DimensionHelper.wp("5%")
  },

  successIcon: {
    color: StyleConstants.greenColor
  },

  successTitle: {
    fontSize: DimensionHelper.wp("6%"),
    fontFamily: StyleConstants.RobotoMedium,
    fontWeight: "600",
    color: StyleConstants.darkColor,
    marginBottom: DimensionHelper.wp("3%"),
    textAlign: "center"
  },

  successMessage: {
    fontSize: DimensionHelper.wp("4.2%"),
    fontFamily: StyleConstants.RobotoRegular,
    color: StyleConstants.darkColor,
    textAlign: "center",
    lineHeight: DimensionHelper.wp("5.5%"),
    opacity: 0.8,
    paddingHorizontal: DimensionHelper.wp("2%")
  }
};

export default CheckinComplete