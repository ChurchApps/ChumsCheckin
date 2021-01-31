import React from 'react'
import { View, Text, FlatList, Image } from 'react-native'
import { Icon } from 'native-base'
import Ripple from 'react-native-material-ripple';
import { CachedData, EnvironmentHelper, PersonInterface, screenNavigationProps, ServiceTimeInterface, Utilities, VisitHelper, VisitInterface, Styles, StyleConstants, GroupInterface, VisitSessionInterface } from "../../helpers";
import { MemberServiceTimes } from './MemberServiceTimes';
import { ArrayHelper } from '../../helpers/ArrayHelper';

interface Props { navigation: screenNavigationProps, pendingVisits: VisitInterface[] }

export const MemberList = (props: Props) => {
    const [selectedMemberId, setSelectedMemberId] = React.useState(0);
    const handleMemberClick = (id: number) => { setSelectedMemberId((selectedMemberId === id) ? 0 : id); }

    const getCondensedGroupList = (person: PersonInterface) => {
        if (selectedMemberId == person.id) return null;
        else {
            const visit = VisitHelper.getByPersonId(props.pendingVisits, person.id || 0);
            if (visit?.visitSessions?.length === 0) return (null);
            else {
                const groups: JSX.Element[] = [];
                visit?.visitSessions?.forEach((vs: VisitSessionInterface) => {
                    const st: ServiceTimeInterface | null = Utilities.getById(CachedData.serviceTimes, vs.session?.serviceTimeId || 0);
                    const group: GroupInterface = Utilities.getById(st?.groups || [], vs.session?.groupId || 0);
                    //const group: GroupInterface = ArrayHelper.getOne()
                    var name = group.name || "none";
                    if (st != null) name = (st.name || "") + " - " + name;
                    if (groups.length > 0) groups.push(<Text key={vs.id?.toString() + "comma"} style={{ color: StyleConstants.grayColor }}>, </Text>);
                    groups.push(<Text key={vs.id?.toString()} style={{ color: StyleConstants.greenColor }}>{name}</Text>);
                });
                return (<View style={{ flexDirection: "row" }} >{groups}</View>);
            }
        }
    }

    const getMemberRow = (data: any) => {
        const person: PersonInterface = data.item;
        return (
            <View>
                <Ripple style={Styles.flatlistMainView} onPress={() => { handleMemberClick(person.id || 0) }}  >
                    <Icon name={(selectedMemberId === person.id) ? 'up' : 'down'} type="AntDesign" style={Styles.flatlistDropIcon} />
                    <Image source={{ uri: EnvironmentHelper.ImageBaseUrl + person.photo }} style={Styles.personPhoto} resizeMode="contain" />
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: '5%' }} >
                        <Text style={[Styles.personName, { alignSelf: 'center' }]}>{person.name.display}</Text>
                        {getCondensedGroupList(person)}
                    </View>
                </Ripple>
                <MemberServiceTimes person={person} navigation={props.navigation} selectedMemberId={selectedMemberId} key={person.id?.toString()} pendingVisits={props.pendingVisits} />
            </View>
        )
    }

    return (<FlatList data={CachedData.householdMembers} renderItem={getMemberRow} keyExtractor={(item: PersonInterface) => item.id?.toString() || "0"} />)
}