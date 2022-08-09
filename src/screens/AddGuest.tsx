import React from 'react'
import { TextInput, View, Text, ScrollView } from 'react-native'
import { Container, Content } from 'native-base'
import Ripple from 'react-native-material-ripple';
import { Header } from './components'
import { ApiHelper, Utilities, screenNavigationProps, CachedData, Styles, StyleConstants, PersonInterface } from "../helpers";

interface Props { navigation: screenNavigationProps }

export const AddGuest = (props: Props) => {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");

  const addGuest = () => {
    if (firstName === '') Utilities.snackBar("Please enter first name")
    else if (lastName === '') Utilities.snackBar("Please enter last name")
    else getOrCreatePerson(firstName, lastName).then(person => {
      Utilities.trackEvent("Add Guest", { name: firstName + " " + lastName });
      CachedData.householdMembers.push(person);
      props.navigation.navigate("Household");
    });
  }

  const getOrCreatePerson = async (firstName: string, lastName: string) => {
    const fullName = firstName + " " + lastName;
    var person: PersonInterface | null = await searchForGuest(fullName);
    if (person === null) {
      person = {
        householdId: CachedData.householdId,
        name: { display: fullName, first: firstName, last: lastName }
      };
      const data = await ApiHelper.post("/people", [person], "MembershipApi");
      person.id = data[0].id;
    }
    return person;
  }

  const searchForGuest = async (fullName: string) => {
    Utilities.trackEvent("Search for Guest", { name: fullName });
    var result: PersonInterface | null = null;
    const url = "/people/search?term=" + escape(fullName);
    var people: PersonInterface[] = await ApiHelper.get(url, "MembershipApi");;
    people.forEach(p => { if (p.membershipStatus !== "Member") result = p; });
    return (result === undefined) ? null : result;
  }

  const cancelGuest = () => { props.navigation.goBack() }

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header />
        <View style={Styles.mainContainer}>
          <Text style={Styles.label}>First Name</Text>
          <TextInput placeholder="First" onChangeText={(value) => { setFirstName(value) }} style={[Styles.textInput]} />
          <Text style={Styles.label}>Last Name</Text>
          <TextInput placeholder="Last" onChangeText={(value) => { setLastName(value) }} style={[Styles.textInput,{marginBottom:10}]} />
        </View>
      </ScrollView>
      <View style={Styles.blockButtons}>
        <Ripple style={[Styles.blockButton, { backgroundColor: StyleConstants.yellowColor }]} onPress={cancelGuest} ><Text style={Styles.blockButtonText}>CANCEL</Text></Ripple>
        <Ripple style={[Styles.blockButton, { backgroundColor: StyleConstants.greenColor }]} onPress={addGuest} ><Text style={Styles.blockButtonText}>ADD</Text></Ripple>
      </View>
    </Container>
  )
}