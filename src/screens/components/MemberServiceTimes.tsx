import React from 'react'
import { View, Text } from 'react-native'
import Ripple from 'react-native-material-ripple';
import { CachedData, PersonInterface, screenNavigationProps, ServiceTimeInterface, VisitHelper, VisitSessionHelper, VisitSessionInterface, VisitInterface, Styles, StyleConstants, Utilities, GroupInterface } from "../../helpers";
import Icon from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp} from 'react-native-responsive-screen';

interface Props { person: PersonInterface, selectedMemberId: string, navigation: screenNavigationProps, pendingVisits: VisitInterface[] }

export const MemberServiceTimes = (props: Props) => {

    const handleServiceTimeClick = (serviceTime: ServiceTimeInterface, person: PersonInterface) => { props.navigation.navigate("SelectGroup", { personId: person.id || "", serviceTime: serviceTime }); }

    const getExpandedRow = (serviceTime: ServiceTimeInterface, visitSessions: VisitSessionInterface[]) => {
        const stSessions = VisitSessionHelper.getByServiceTimeId(visitSessions, serviceTime.id || "");
        var buttonStyle = { backgroundColor: (stSessions.length > 0) ? StyleConstants.greenColor : StyleConstants.blueColor };
        var selectedGroupName = "NONE";
        if (stSessions.length > 0) {
            const groupId = stSessions[0].session?.groupId || "";
            const group: GroupInterface = Utilities.getById(serviceTime.groups || [], groupId);
            selectedGroupName = group?.name || "Error";
        }
        return (<View key={serviceTime.id} style={Styles.expandedRow}>
            <View style={Styles.serviceTimeView}>
                <Icon name={'clock-o'} style={Styles.timeIcon} size={wp('5%')} />
                <Text style={Styles.serviceTimeText}>{serviceTime.name}</Text>
            </View>
            <Ripple style={[Styles.serviceTimeButton, buttonStyle]} onPress={() => { handleServiceTimeClick(serviceTime, props.person) }} >
                <Text style={Styles.serviceTimeButtonText}>{selectedGroupName}</Text>
            </Ripple>
        </View>);
    }

    const result: any[] = [];
    if (props.selectedMemberId === props.person.id) {
        const visit = VisitHelper.getByPersonId(props.pendingVisits, props.person.id || "");
        const visitSessions = visit?.visitSessions || [];
        CachedData.serviceTimes.forEach(st => { result.push(getExpandedRow(st, visitSessions)) });
    }
    return <View>{result}</View>;
}