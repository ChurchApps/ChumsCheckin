import React from "react";
import { TextInput, View, Text, ScrollView } from "react-native";
import Ripple from "react-native-material-ripple";
import { screenNavigationProps, CachedData, Styles, StyleConstants } from "../src/helpers";
import { ApiHelper , AppCenterHelper, FirebaseHelper, PersonInterface, Utils } from "@churchapps/mobilehelper";
import Header from "./components/Header";
import { router } from "expo-router";
import { useRouter ,useLocalSearchParams} from "expo-router";


interface Props { navigation: screenNavigationProps }

const AddGuest = (props: Props) => {
  const router = useRouter();
  const params = useLocalSearchParams(); // ✅ Retrieve route parameters

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");

  const addGuest = () => {
    if (firstName === "") {Utils.snackBar("Please enter first name");}
    else if (lastName === "") {Utils.snackBar("Please enter last name");}
    else {getOrCreatePerson(firstName, lastName).then(person => {
      // console.log(person)
      // AppCenterHelper.trackEvent("Add Guest", { name: firstName + " " + lastName });
      CachedData.householdMembers.push(person);
      // props.navigation.navigate("Household");
      router.push("/household"); 
      // router.push({ pathname: "/household", params: { householdId: params.householdId || CachedData.householdId } });     
    });}
    // router.push({ pathname: "/household", params: { householdId: params.householdId || CachedData.householdId } });
  };

  const getOrCreatePerson = async (firstname: string, lastname: string) => {
    const fullName = firstname + " " + lastname;
    let person: PersonInterface | null = await searchForGuest(fullName);
    if (person === null) {
      person = {
        householdId: CachedData.householdId,
        name: { display: fullName, first: firstName, last: lastName },
        contactInfo: {}
      };
      const data = await ApiHelper.post("/people", [person], "MembershipApi");
      console.log("data", data)
      person.id = data[0].id;
    }
    console.log("zzz", person)
    return person;
  };

  const searchForGuest = async (fullName: string) => {
    // AppCenterHelper.trackEvent("Search for Guest", { name: fullName });
    let result: PersonInterface | null = null;
    console.log("sssss", fullName)
    const url = "/people/search?term=" + escape(fullName);
    console.log("ss", url)
    let people: PersonInterface[] = await ApiHelper.get(url, "MembershipApi");
    console.log("urllll", people)
    people.forEach(p => { if (p.membershipStatus !== "Member") {result = p;} });
    console.log("reuslt", result)
    return (result === undefined) ? null : result;
  };

  // const cancelGuest = () => { props.navigation.goBack(); };

  const cancelGuest = () => {
    router.back(); // Replaced props.navigation.goBack()
  };

  return (
    <View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header router={router} />
        <View style={Styles.mainContainer}>
          <Text style={Styles.label}>First Name</Text>
          <TextInput placeholder="First" onChangeText={(value) => { setFirstName(value); }} style={[Styles.textInput]} />
          <Text style={Styles.label}>Last Name</Text>
          <TextInput placeholder="Last" onChangeText={(value) => { setLastName(value); }} style={[Styles.textInput, { marginBottom: 10 }]} />
        </View>
      </ScrollView>
      <View style={Styles.blockButtons}>
        <Ripple style={[Styles.blockButton, { backgroundColor: StyleConstants.yellowColor }]} onPress={cancelGuest}><Text style={Styles.blockButtonText}>CANCEL</Text></Ripple>
        <Ripple style={[Styles.blockButton, { backgroundColor: StyleConstants.greenColor }]} onPress={addGuest}><Text style={Styles.blockButtonText}>ADD</Text></Ripple>
      </View>
    </View>
  );
};

export default AddGuest