import React from "react";
import { View, Text } from "react-native";
import { Header } from "./components";
import { screenNavigationProps, CachedData, LabelHelper, Styles, StyleConstants } from "../helpers";
import { CommonActions } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { PrintUI } from "./components/PrintUI";
import { ApiHelper, AppCenterHelper, ArrayHelper, DimensionHelper } from "@churchapps/mobilehelper";

interface Props { navigation: screenNavigationProps; }

export const CheckinComplete = (props: Props) => {
  const [htmlLabels, setHtmlLabels] = React.useState<string[]>([]);

  const loadData = () => {
    const promises: Promise<any>[] = [];
    promises.push(checkin());
    if (CachedData.printer?.ipAddress) {print();}
    //print();

    Promise.all(promises).then(() => {
      if (!CachedData.printer?.ipAddress) {startOver();}
    });
  };

  const startOver = () => {
    CachedData.existingVisits = [];
    CachedData.pendingVisits = [];
    setHtmlLabels([]);
    redirectToLookup();
  };

  const redirectToLookup = () => {
    timeout(500).then(() => {
      const action = CommonActions.reset({ index: 0, routes: [{ name: "Lookup" }] });
      props.navigation.dispatch(action);
    });
  };

  const print = async () => LabelHelper.getAllLabels().then(async (labels) => {
    setHtmlLabels(labels);
    if (labels.length === 0) {startOver();}
  });

  const timeout = (ms: number) => new Promise(resolve => setTimeout(() => { resolve(null); }, ms));

  const checkin = async () => {
    const peopleIds: number[] = ArrayHelper.getUniqueValues(CachedData.householdMembers, "id");
    const url = "/visits/checkin?serviceId=" + CachedData.serviceId + "&peopleIds=" + escape(peopleIds.join(","));
    return ApiHelper.post(url, CachedData.pendingVisits, "AttendanceApi").then(data => {
      AppCenterHelper.trackEvent("Checkin Complete");
      props.navigation.navigate("CheckinComplete");
    });
  };


  const getLabelView = () => {
    if (htmlLabels?.length > 0) {return (<PrintUI htmlLabels={htmlLabels} onPrintComplete={startOver} />);}
    else {return <></>;}
  };

  React.useEffect(loadData, []);  //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View style={{ backgroundColor: StyleConstants.ghostWhite }}>
      <Header navigation={props.navigation} />
      <View style={[Styles.mainContainer, { justifyContent: "center" }]}>
        <Icon name={"check-circle"} style={{ fontSize: DimensionHelper.wp("20%"), color: StyleConstants.greenColor, alignSelf: "center" }} size={DimensionHelper.wp("20%")} />
        <Text style={[Styles.H1, { alignSelf: "center" }]}>Checkin Complete.</Text>
        {getLabelView()}
      </View>
    </View>
  );

};
