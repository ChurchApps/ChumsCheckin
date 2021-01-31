import React from 'react'
import { View, Text } from 'react-native'
import Ripple from 'react-native-material-ripple';
import { CachedData, PersonInterface, screenNavigationProps, ServiceTimeInterface, VisitHelper, VisitSessionHelper, VisitSessionInterface, VisitInterface, Styles, StyleConstants, Utilities, GroupInterface } from "../../helpers";

interface Props { person: PersonInterface, selectedMemberId: number, navigation: screenNavigationProps, pendingVisits: VisitInterface[] }

export const MemberServiceTimes = (props: Props) => {

    const handleServiceTimeClick = (serviceTime: ServiceTimeInterface, person: PersonInterface) => { props.navigation.navigate("SelectGroup", { personId: person.id || 0, serviceTime: serviceTime }); }

    const getExpandedRow = (serviceTime: ServiceTimeInterface, visitSessions: VisitSessionInterface[]) => {
        const stSessions = VisitSessionHelper.getByServiceTimeId(visitSessions, serviceTime.id || 0);
        var buttonStyle = { backgroundColor: (stSessions.length > 0) ? StyleConstants.greenColor : StyleConstants.blueColor };
        var selectedGroupName = "NONE";
        if (stSessions.length > 0) {
            const groupId = stSessions[0].session?.groupId || 0;
            const group: GroupInterface = Utilities.getById(serviceTime.groups || [], groupId);
            selectedGroupName = group?.name || "Error";
        }
        return (<View key={serviceTime.id} style={Styles.expandedRow}>
            <Text style={Styles.serviceTimeText}>{serviceTime.name}</Text>
            <Ripple style={[Styles.serviceTimeButton, buttonStyle]} onPress={() => { handleServiceTimeClick(serviceTime, props.person) }} >
                <Text style={Styles.serviceTimeButtonText}>{selectedGroupName}</Text>
            </Ripple>
        </View>);
    }

    const result: any[] = [];
    if (props.selectedMemberId === props.person.id) {
        const visit = VisitHelper.getByPersonId(props.pendingVisits, props.person.id || 0);
        const visitSessions = visit?.visitSessions || [];
        CachedData.serviceTimes.forEach(st => { result.push(getExpandedRow(st, visitSessions)) });
    }
    return <View>{result}</View>;
}