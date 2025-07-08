import React from "react";
import { TextInput, View, Text, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import Ripple from "react-native-material-ripple";
import { screenNavigationProps, CachedData, Styles, StyleConstants, DimensionHelper } from "../src/helpers";
import { ApiHelper, AppCenterHelper, FirebaseHelper, PersonInterface, Utils } from "../src/helpers";
import Header from "../src/components/Header";
import Subheader from "../src/components/Subheader";
import { FontAwesome } from "@expo/vector-icons";
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
    <KeyboardAvoidingView 
      style={addGuestStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Header
        navigation={props.navigation}
        prominentLogo={true}
      />

      {/* Add Guest Section */}
      <Subheader
        icon="👤"
        title="Add Guest"
        subtitle="Enter guest information to add them to your household"
      />

      {/* Main Content */}
      <ScrollView 
        style={addGuestStyles.scrollView}
        contentContainerStyle={addGuestStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={addGuestStyles.formCard}>
          <View style={addGuestStyles.inputGroup}>
            <View style={addGuestStyles.labelContainer}>
              <FontAwesome 
                name="user" 
                size={DimensionHelper.wp("4%")} 
                color={StyleConstants.baseColor}
                style={addGuestStyles.labelIcon}
              />
              <Text style={addGuestStyles.label}>First Name</Text>
            </View>
            <TextInput 
              placeholder="Enter first name" 
              onChangeText={(value) => { setFirstName(value); }} 
              style={addGuestStyles.textInput}
              placeholderTextColor={StyleConstants.darkColor + "50"}
            />
          </View>

          <View style={addGuestStyles.inputGroup}>
            <View style={addGuestStyles.labelContainer}>
              <FontAwesome 
                name="user" 
                size={DimensionHelper.wp("4%")} 
                color={StyleConstants.baseColor}
                style={addGuestStyles.labelIcon}
              />
              <Text style={addGuestStyles.label}>Last Name</Text>
            </View>
            <TextInput 
              placeholder="Enter last name" 
              onChangeText={(value) => { setLastName(value); }} 
              style={addGuestStyles.textInput}
              placeholderTextColor={StyleConstants.darkColor + "50"}
            />
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={addGuestStyles.buttonContainer}>
        <Ripple 
          style={[addGuestStyles.actionButton, addGuestStyles.cancelButton]} 
          onPress={cancelGuest}
        >
          <FontAwesome 
            name="times" 
            size={DimensionHelper.wp("4%")} 
            color={StyleConstants.baseColor}
            style={addGuestStyles.buttonIcon}
          />
          <Text style={addGuestStyles.cancelButtonText}>Cancel</Text>
        </Ripple>
        <Ripple 
          style={[addGuestStyles.actionButton, addGuestStyles.addButton]} 
          onPress={addGuest}
        >
          <FontAwesome 
            name="plus" 
            size={DimensionHelper.wp("4%")} 
            color={StyleConstants.whiteColor}
            style={addGuestStyles.buttonIcon}
          />
          <Text style={addGuestStyles.addButtonText}>Add Guest</Text>
        </Ripple>
      </View>
    </KeyboardAvoidingView>
  );
};

// Professional tablet-optimized styles matching ChumsApp design patterns
const addGuestStyles = {
  container: {
    flex: 1,
    backgroundColor: StyleConstants.ghostWhite
  },

  scrollView: {
    flex: 1
  },

  scrollContent: {
    paddingHorizontal: DimensionHelper.wp("5%"),
    paddingTop: DimensionHelper.wp("3%"),
    paddingBottom: DimensionHelper.wp("10%")
  },

  // Form Card (Professional Material Design)
  formCard: {
    backgroundColor: StyleConstants.whiteColor,
    borderRadius: 12,
    padding: DimensionHelper.wp("5%"),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    shadowColor: StyleConstants.baseColor,
    maxWidth: DimensionHelper.wp("90%"),
    alignSelf: "center",
    width: "100%"
  },

  // Input Groups
  inputGroup: {
    marginBottom: DimensionHelper.wp("5%")
  },

  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: DimensionHelper.wp("2%")
  },

  labelIcon: {
    marginRight: DimensionHelper.wp("2%")
  },

  label: {
    fontSize: DimensionHelper.wp("4%"),
    fontFamily: StyleConstants.RobotoMedium,
    fontWeight: "600",
    color: StyleConstants.darkColor
  },

  textInput: {
    backgroundColor: StyleConstants.ghostWhite,
    borderRadius: 8,
    paddingHorizontal: DimensionHelper.wp("4%"),
    paddingVertical: DimensionHelper.wp("3.5%"),
    fontSize: DimensionHelper.wp("4.2%"),
    fontFamily: StyleConstants.RobotoRegular,
    color: StyleConstants.darkColor,
    borderWidth: 1,
    borderColor: StyleConstants.baseColor + "20"
  },

  // Action Buttons
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: DimensionHelper.wp("5%"),
    paddingVertical: DimensionHelper.wp("3%"),
    backgroundColor: StyleConstants.whiteColor,
    borderTopWidth: 1,
    borderTopColor: StyleConstants.baseColor + "20",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3
  },

  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: DimensionHelper.wp("3.5%"),
    borderRadius: 8,
    marginHorizontal: DimensionHelper.wp("1.5%")
  },

  cancelButton: {
    backgroundColor: StyleConstants.whiteColor,
    borderWidth: 2,
    borderColor: StyleConstants.baseColor
  },

  addButton: {
    backgroundColor: StyleConstants.baseColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },

  buttonIcon: {
    marginRight: DimensionHelper.wp("2%")
  },

  cancelButtonText: {
    fontSize: DimensionHelper.wp("4.2%"),
    fontFamily: StyleConstants.RobotoMedium,
    fontWeight: "600",
    color: StyleConstants.baseColor
  },

  addButtonText: {
    fontSize: DimensionHelper.wp("4.2%"),
    fontFamily: StyleConstants.RobotoMedium,
    fontWeight: "600",
    color: StyleConstants.whiteColor
  }
};

export default AddGuest