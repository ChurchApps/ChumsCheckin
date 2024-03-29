import React from "react";
import { TextInput, View, Text, ScrollView } from "react-native";
import Ripple from "react-native-material-ripple";
import { Header } from "./components";
import { screenNavigationProps, CachedData, Styles, StyleConstants } from "../helpers";
import { ApiHelper, AppCenterHelper, PersonInterface, Utils } from "@churchapps/mobilehelper";

interface Props { navigation: screenNavigationProps }

export const AddGuest = (props: Props) => {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");

  const addGuest = () => {
    if (firstName === "") {Utils.snackBar("Please enter first name");}
    else if (lastName === "") {Utils.snackBar("Please enter last name");}
    else {getOrCreatePerson(firstName, lastName).then(person => {
      AppCenterHelper.trackEvent("Add Guest", { name: firstName + " " + lastName });
      CachedData.householdMembers.push(person);
      props.navigation.navigate("Household");
    });}
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
      person.id = data[0].id;
    }
    return person;
  };

  const searchForGuest = async (fullName: string) => {
    AppCenterHelper.trackEvent("Search for Guest", { name: fullName });
    let result: PersonInterface | null = null;
    const url = "/people/search?term=" + escape(fullName);
    let people: PersonInterface[] = await ApiHelper.get(url, "MembershipApi");
    people.forEach(p => { if (p.membershipStatus !== "Member") {result = p;} });
    return (result === undefined) ? null : result;
  };

  const cancelGuest = () => { props.navigation.goBack(); };

  return (
    <View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header navigation={props.navigation} />
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
