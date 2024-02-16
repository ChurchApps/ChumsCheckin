import React from "react";
import { View, Text } from "react-native";
import Ripple from "react-native-material-ripple";
import { CachedData,  screenNavigationProps, VisitHelper, VisitSessionHelper, Styles, StyleConstants } from "../../helpers";
import Icon from "react-native-vector-icons/FontAwesome";
import { PersonInterface, VisitInterface, ServiceTimeInterface, VisitSessionInterface, GroupInterface, ArrayHelper, DimensionHelper } from "@churchapps/mobilehelper";

interface Props { person: PersonInterface, selectedMemberId: string, navigation: screenNavigationProps, pendingVisits: VisitInterface[] }

export const MemberServiceTimes = (props: Props) => {

  const handleServiceTimeClick = (serviceTime: ServiceTimeInterface, person: PersonInterface) => { props.navigation.navigate("SelectGroup", { personId: person.id || "", serviceTime: serviceTime }); };

  const getExpandedRow = (serviceTime: ServiceTimeInterface, visitSessions: VisitSessionInterface[]) => {
    const stSessions = VisitSessionHelper.getByServiceTimeId(visitSessions, serviceTime.id || "");
    let buttonStyle = { backgroundColor: (stSessions.length > 0) ? StyleConstants.greenColor : StyleConstants.blueColor };
    let selectedGroupName = "NONE";
    if (stSessions.length > 0) {
      const groupId = stSessions[0].session?.groupId || "";
      const group: GroupInterface = ArrayHelper.getOne(serviceTime.groups || [], "id", groupId);
      selectedGroupName = group?.name || "Error";
    }
    return (<View key={serviceTime.id} style={Styles.expandedRow}>
      <View style={Styles.serviceTimeView}>
        <Icon name={"clock-o"} style={Styles.timeIcon} size={DimensionHelper.wp("5%")} />
        <Text style={Styles.serviceTimeText}>{serviceTime.name}</Text>
      </View>
      <Ripple style={[Styles.serviceTimeButton, buttonStyle]} onPress={() => { handleServiceTimeClick(serviceTime, props.person); }}>
        <Text style={Styles.serviceTimeButtonText}>{selectedGroupName}</Text>
      </Ripple>
    </View>);
  };

  const result: any[] = [];
  if (props.selectedMemberId === props.person.id) {
    const visit = VisitHelper.getByPersonId(props.pendingVisits, props.person.id || "");
    const visitSessions = visit?.visitSessions || [];
    CachedData.serviceTimes.forEach(st => { result.push(getExpandedRow(st, visitSessions)); });
  }
  return <View>{result}</View>;
};
