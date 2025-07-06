import React from "react";
import { View, Text, FlatList, Image, Dimensions, PixelRatio } from "react-native";
// import Icon from "react-native-vector-icons/FontAwesome";
import { FontAwesome } from "@expo/vector-icons";
import Ripple from "react-native-material-ripple";
import { CachedData, EnvironmentHelper, screenNavigationProps, VisitHelper, Styles } from "../../src/helpers";
// import { MemberServiceTimes } from "./MemberServiceTimes";
import MemberServiceTimes from "./MemberServiceTimes";
import { VisitInterface, PersonInterface, VisitSessionInterface, ServiceTimeInterface, GroupInterface, ArrayHelper, DimensionHelper } from "@churchapps/mobilehelper";

interface Props { navigation: screenNavigationProps, pendingVisits: VisitInterface[] }

const MemberList = (props: Props) => {
  const [selectedMemberId, setSelectedMemberId] = React.useState("");
  const [dimension, setDimension] = React.useState(Dimensions.get("window"));

  const handleMemberClick = (id: string) => { setSelectedMemberId((selectedMemberId === id) ? "" : id); };

  const getCondensedGroupList = (person: PersonInterface) => {
    if (selectedMemberId === person.id) {return null;}
    else {
      const visit = VisitHelper.getByPersonId(props.pendingVisits, person.id || "");
      if (visit?.visitSessions?.length === 0) {return (null);}
      else {
        const groups: JSX.Element[] = [];
        visit?.visitSessions?.forEach((vs: VisitSessionInterface, index) => {
          const st: ServiceTimeInterface | null = ArrayHelper.getOne(CachedData.serviceTimes, "id", vs.session?.serviceTimeId || "");
          const group: GroupInterface = ArrayHelper.getOne(st?.groups || [], "id", vs.session?.groupId || "");
          let name = group.name || "none";
          if (st != null) {name = (st.name || "") + " - " + name;}
          // if (groups.length > 0) groups.push(<Text key={vs.id?.toString() + "comma"} style={{ color: StyleConstants.grayColor }}>, </Text>);
          groups.push(<View key={index}>
            <Text style={Styles.groupName} numberOfLines={1}>{name}</Text>
          </View>);
        });
        return (<View>{groups}</View>);
      }
    }
  };


  console.log("testssst",CachedData.householdMembers)

  React.useEffect(() => {
    Dimensions.addEventListener("change", () => {
      const dim = Dimensions.get("screen");
      setDimension(dim);
    });
  }, []);

  const wd = (number: string) => {
    let givenWidth = typeof number === "number" ? number : parseFloat(number);
    return PixelRatio.roundToNearestPixel((dimension.width * givenWidth) / 100);
  };

  const getMemberRow = (data: any) => {
    const person: PersonInterface = data.item;
    return (
      <View>
        <Ripple style={[Styles.flatlistMainView,{width:wd("90%")}]} onPress={() => { handleMemberClick(person.id || ""); }}>
          <FontAwesome name={(selectedMemberId === person.id) ? "angle-down" : "angle-right"} style={Styles.flatlistDropIcon} size={DimensionHelper.wp("6%")} />
          <Image source={{ uri: EnvironmentHelper.ContentRoot + person.photo }} style={Styles.personPhoto} />
          <View style={{ justifyContent: "center", alignItems: "center"}}>
            <Text style={[Styles.personName, { alignSelf: "flex-start" }]} numberOfLines={1}>{person.name.display}</Text>
            {getCondensedGroupList(person)}
          </View>
        </Ripple>
        <MemberServiceTimes person={person} navigation={props.navigation} selectedMemberId={selectedMemberId} key={person.id?.toString()} pendingVisits={props.pendingVisits} />
      </View>
    );
  };

  return (<FlatList data={CachedData.householdMembers} renderItem={getMemberRow} keyExtractor={(item: PersonInterface) => item.id?.toString() || "0"} />);
};
export default MemberList
