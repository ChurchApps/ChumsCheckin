import React from 'react'
import { View, Text, FlatList, Image } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import Ripple from 'react-native-material-ripple';
import { CachedData, EnvironmentHelper, PersonInterface, screenNavigationProps, ServiceTimeInterface, Utilities, VisitHelper, VisitInterface, Styles, GroupInterface, VisitSessionInterface } from "../../helpers";
import { MemberServiceTimes } from './MemberServiceTimes';
import { widthPercentageToDP as wp} from 'react-native-responsive-screen';

interface Props { navigation: screenNavigationProps, pendingVisits: VisitInterface[] }

export const MemberList = (props: Props) => {
    const [selectedMemberId, setSelectedMemberId] = React.useState("");
    const handleMemberClick = (id: string) => { setSelectedMemberId((selectedMemberId === id) ? "" : id); }

    const getCondensedGroupList = (person: PersonInterface) => {
        if (selectedMemberId == person.id) return null;
        else {
            const visit = VisitHelper.getByPersonId(props.pendingVisits, person.id || "");
            if (visit?.visitSessions?.length === 0) return (null);
            else {
                const groups: JSX.Element[] = [];
                visit?.visitSessions?.forEach((vs: VisitSessionInterface, index) => {
                    const st: ServiceTimeInterface | null = Utilities.getById(CachedData.serviceTimes, vs.session?.serviceTimeId || "");
                    const group: GroupInterface = Utilities.getById(st?.groups || [], vs.session?.groupId || "");
                    //const group: GroupInterface = ArrayHelper.getOne()
                    var name = group.name || "none";
                    if (st != null) name = (st.name || "") + " - " + name;
                    // if (groups.length > 0) groups.push(<Text key={vs.id?.toString() + "comma"} style={{ color: StyleConstants.grayColor }}>, </Text>);
                    groups.push(<View key={index}>
                        <Text style={Styles.groupName} numberOfLines={1}>{name}</Text>
                    </View>)
                });
                return (<View>{groups}</View>);
            }
        }
    }

    const getMemberRow = (data: any) => {
        const person: PersonInterface = data.item;
        return (
            <View>
                <Ripple style={Styles.flatlistMainView} onPress={() => { handleMemberClick(person.id || "") }}  >
                    <Icon name={(selectedMemberId === person.id) ? 'angle-down' : 'angle-right'} style={Styles.flatlistDropIcon} size={wp('6%')} />
                    <Image source={{ uri: EnvironmentHelper.ContentRoot + person.photo }} style={Styles.personPhoto} />
                    <View style={{ justifyContent: 'center', alignItems: 'center'}} >
                        <Text style={[Styles.personName, { alignSelf: 'flex-start' }]} numberOfLines={1}>{person.name.display}</Text>
                        {getCondensedGroupList(person)}
                    </View>
                </Ripple>
                <MemberServiceTimes person={person} navigation={props.navigation} selectedMemberId={selectedMemberId} key={person.id?.toString()} pendingVisits={props.pendingVisits} />
            </View>
        )
    }

    return (<FlatList data={CachedData.householdMembers} renderItem={getMemberRow} keyExtractor={(item: PersonInterface) => item.id?.toString() || "0"} />)
}