import React from "react";
import { View, Text } from "react-native";
import { Container } from "native-base";
import { Header } from "./components";
import { screenNavigationProps, CachedData, ApiHelper, LabelHelper, Styles, StyleConstants, Utilities } from "../helpers";
import { CommonActions } from "@react-navigation/native";
import { ArrayHelper } from "../helpers/ArrayHelper";
import Icon from "react-native-vector-icons/FontAwesome";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { PrintUI } from "./components/PrintUI";

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
      Utilities.trackEvent("Checkin Complete");
      props.navigation.navigate("CheckinComplete");
    });
  };


  const getLabelView = () => {
    if (htmlLabels?.length > 0) {return (<PrintUI htmlLabels={htmlLabels} onPrintComplete={startOver} />);}
    else {return <></>;}
  };

  React.useEffect(loadData, []);

  return (
    <Container style={{ backgroundColor: StyleConstants.ghostWhite }}>
      <Header navigation={props.navigation} />
      <View style={[Styles.mainContainer, { justifyContent: "center" }]}>
        <Icon name={"check-circle"} style={{ fontSize: wp("20%"), color: StyleConstants.greenColor, alignSelf: "center" }} size={wp("20%")} />
        <Text style={[Styles.H1, { alignSelf: "center" }]}>Checkin Complete.</Text>
        {getLabelView()}
      </View>
    </Container>
  );

};
