import React from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { TextInput, View, Text, Image, FlatList, ActivityIndicator, Keyboard, SafeAreaView, ScrollView, Dimensions, PixelRatio } from "react-native";
import Ripple from "react-native-material-ripple";
import { RouteProp } from "@react-navigation/native";
import { ScreenList } from "./screenList";
import { EnvironmentHelper, screenNavigationProps, CachedData, Styles, StyleConstants } from "../src/helpers";
import { ApiHelper, AppCenterHelper, ArrayHelper, DimensionHelper, FirebaseHelper, PersonInterface, Utils } from "@churchapps/mobilehelper";
import Header from "./components/Header";
import { router } from "expo-router";
// import { Header } from "./components";

type ProfileScreenRouteProp = RouteProp<ScreenList, "Lookup">;
interface Props { navigation: screenNavigationProps; route: ProfileScreenRouteProp; }



const Lookup = (props: Props) => {
  // const Lookup = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [hasSearched, setHasSearched] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [people, setPeople] = React.useState([]);
  const [phone, setPhone] = React.useState("");
  const [dimension, setDimension] = React.useState(Dimensions.get("window"));

  const loadHouseholdMembers = async () => {
    CachedData.householdMembers = await ApiHelper.get("/people/household/" + CachedData.householdId, "MembershipApi");
    loadExistingVisits();
  };

  const loadExistingVisits = async () => {
    CachedData.existingVisits = [];
    const peopleIds: number[] = ArrayHelper.getUniqueValues(CachedData.householdMembers, "id");
    const url = "/visits/checkin?serviceId=" + CachedData.serviceId + "&peopleIds=" + escape(peopleIds.join(",")) + "&include=visitSessions";
    CachedData.existingVisits = await ApiHelper.get(url, "AttendanceApi");
    CachedData.pendingVisits = [...CachedData.existingVisits];
    setIsLoading(false);
    // props.navigation.navigate("Household");
    router.navigate("/household");
  };

  const selectPerson = (person: PersonInterface) => {
    setIsLoading(true);
    CachedData.householdId = person.householdId || "";
    loadHouseholdMembers();
  };

  const handleSearch = () => {
    const nonNumericPattern = /[^\d]/;
    if (nonNumericPattern.test(phone)) {
      Utils.snackBar("Please enter valid numbers.");
      return;
    }

    const cleanedPhone = phone.replace(/\D/g, '');
    if (phone === "") { Utils.snackBar("Please enter phone number or last four digits"); }
    else {
      Keyboard.dismiss();
      setHasSearched(true);
      setIsLoading(true);
      // AppCenterHelper.trackEvent("Search");

      if (cleanedPhone.length < 4) {
        Utils.snackBar("Please enter at least four digits.");
        setIsLoading(false);
        return;
      }

      const searchQuery = cleanedPhone.length > 4 ? cleanedPhone : cleanedPhone.slice(-4);
      // console.log("searchQuery ", searchQuery)
      ApiHelper.get("/people/search/phone?number=" + searchQuery, "MembershipApi").then(data => {
        setIsLoading(false);
        setPeople(data);
        if (data.length === 0) { Utils.snackBar("No matches found"); }
      });
    }
  };

  const getRow = (data: any) => {
    const person: PersonInterface = data.item;
    return (
      <Ripple style={[Styles.flatlistMainView, { width: wd("90%") }]} onPress={() => { selectPerson(person); }}>
        <Image source={{ uri: EnvironmentHelper.ContentRoot + person.photo }} style={Styles.personPhoto} />
        <Text style={Styles.personName}>{person.name.display}</Text>
      </Ripple>
    );
  };

  const getResults = () => {
    if (!hasSearched) { return null; }
    else if (isLoading) { return (<ActivityIndicator size="large" color={StyleConstants.baseColor1} animating={isLoading} style={{ marginTop: "25%" }} />); }
    else { return (<FlatList data={people} renderItem={getRow} keyExtractor={(item: PersonInterface) => item.id?.toString() || "0"} />); }
  };

  React.useEffect(() => {
    FirebaseHelper.addOpenScreenEvent("Lookup");
    Dimensions.addEventListener("change", () => {
      const dim = Dimensions.get("screen");
      setDimension(dim);
    });
  }, []);

  const wd = (number: string) => {
    let givenWidth = typeof number === "number" ? number : parseFloat(number);
    return PixelRatio.roundToNearestPixel((dimension.width * givenWidth) / 100);
  };

  return (
    <View style={{ backgroundColor: StyleConstants.ghostWhite }}>
      <Header navigation={props.navigation} />
      <Text style={{ ...Styles.H1, marginLeft: DimensionHelper.wp("5%") }}>Search by phone number:</Text>
      <View style={[Styles.searchView, { width: wd("90%") }]}>
        <TextInput placeholder="Enter last four digits of mobile number" onChangeText={(value) => { setPhone(value); }} keyboardType="numeric" style={Styles.searchTextInput} />
        <Ripple style={Styles.searchButton} onPress={handleSearch}>
          <Text style={[Styles.searchButtonText]}>Search</Text>
        </Ripple>
      </View>
      {getResults()}
    </View>
  );
};
export default Lookup