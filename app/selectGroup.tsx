import React from "react";
import { View, Text, FlatList } from "react-native";
import Ripple from "react-native-material-ripple";
import { RouteProp } from "@react-navigation/native";
import { ScreenList } from "../src/screenList";
import Header from "../src/components/Header";
import { screenNavigationProps, VisitHelper, VisitSessionHelper, CachedData, Styles, StyleConstants, Utilities } from "../src/helpers";
import { FontAwesome } from "@expo/vector-icons";
import { AppCenterHelper, DimensionHelper, FirebaseHelper, GroupInterface } from "../src/helpers";
import { useRouter, useLocalSearchParams } from "expo-router";


// type ProfileScreenRouteProp = RouteProp<ScreenList, "SelectGroup">;
// interface Props { navigation: screenNavigationProps; route: ProfileScreenRouteProp; }
interface GroupCategoryInterface { key: number, name: string, items: GroupInterface[] }

const SelectGroup = (props: any) => {


  const router = useRouter();
  const { personId, serviceTime } = useLocalSearchParams();
  let serviceTimes = JSON.parse(serviceTime)

  const [selectedCategory, setSelectedCategory] = React.useState(-1);
  const [groupTree, setGroupTree] = React.useState<GroupCategoryInterface[]>([]);

  const buildTree = () => {
    FirebaseHelper.addOpenScreenEvent("Select Group");
    let category = "";
    let gt: GroupCategoryInterface[] = [];



    const sortedGroups = [...(serviceTimes?.groups || [])].sort((a, b) => ((a.categoryName || "") > (b.categoryName || "")) ? 1 : -1);
    console.log("Sorted Groups", sortedGroups);




    sortedGroups?.forEach(g => {
      if (g.categoryName !== category) { gt.push({ key: gt.length, name: g.categoryName || "", items: [] }); }
      gt[gt.length - 1].items.push(g);
      category = g.categoryName || "";
    });

    console.log("Group Tree", gt);
    setGroupTree(gt);
  };

  const handleCategoryClick = (value: number) => { setSelectedCategory((selectedCategory === value) ? -1 : value); };
  const handleNone = () => { selectGroup("", "NONE"); };

  // const selectGroup = (id: string, name: string) => {
  //   // AppCenterHelper.trackEvent("Select Group", name);
  //   const personId = props.route.params.personId;
  //   let visit = VisitHelper.getByPersonId(CachedData.pendingVisits, personId);
  //   if (visit === null) {
  //     visit = { personId: personId, serviceId: CachedData.serviceId, visitSessions: [] };
  //     CachedData.pendingVisits.push(visit);
  //   }
  //   const vs = visit?.visitSessions || [];
  //   const serviceTimeId = props.route.params.serviceTime.id || "";
  //   VisitSessionHelper.setValue(vs, serviceTimeId, id, name);
  //   // props.navigation.goBack();
  //   router.back();  
  // };

  const selectGroup = (id: string, name: string) => {

    let visit = VisitHelper.getByPersonId(CachedData.pendingVisits, personId);

    if (!visit) {
      visit = { personId, serviceId: CachedData.serviceId, visitSessions: [] };
      CachedData.pendingVisits.push(visit);
    }

    const vs = visit?.visitSessions || [];
    const serviceTimeId = serviceTimes.id || ""; // ✅ Use serviceTimeId from params
    VisitSessionHelper.setValue(vs, serviceTimeId, id, name);

    router.back();
  };

  const getRow = (data: any) => {
    console.log("GET ROW", data);
    const item: GroupCategoryInterface = data.item;
    return (
      <View>
        <Ripple style={Styles.flatlistMainView} onPress={() => { handleCategoryClick(item.key); }}>
          <FontAwesome name={(selectedCategory === item.key) ? "angle-down" : "angle-right"} style={Styles.flatlistDropIcon} size={DimensionHelper.wp("6%")} />
          <Text style={[Styles.bigLinkButtonText, { margin: DimensionHelper.wp("3%") }]}>{item.name}</Text>
        </Ripple>
        {getExpanded(selectedCategory, item)}
      </View>
    );
  };

  const getExpanded = (selectedcategory: number, category: GroupCategoryInterface) => {
    if (selectedcategory !== category.key) { return null; }
    else {
      const result: JSX.Element[] = [];
      category.items.forEach(g => {
        result.push(<Ripple key={g.id?.toString()} style={[Styles.expandedRow, { justifyContent: "flex-start", width: DimensionHelper.wp("80%") }]} onPress={() => selectGroup(g.id || "", g.name || "")}>
          <Text style={[Styles.bigLinkButtonText, { marginLeft: "5%", fontFamily: StyleConstants.RobotoRegular, marginVertical: DimensionHelper.wp("1%") }]}>{g.name}</Text>
        </Ripple>);
      });
      return result;
    }
  };

  React.useEffect(buildTree, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View>
      <Header navigation={props.navigation} />
      <FlatList data={groupTree} renderItem={getRow} keyExtractor={(item: GroupCategoryInterface) => item.name} />
      <View style={Styles.fullWidthContainer}>

        <View style={Styles.blockButtons}>
          <Ripple style={[Styles.blockButton, { backgroundColor: StyleConstants.redColor }]} onPress={handleNone}>
            <Text style={Styles.blockButtonText}>NONE</Text>
          </Ripple>
        </View>
      </View>
    </View>
  );

};
export default SelectGroup