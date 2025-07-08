import React from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { TextInput, View, Text, Image, FlatList, ActivityIndicator, Keyboard, SafeAreaView, ScrollView, Dimensions, PixelRatio } from "react-native";
import Ripple from "react-native-material-ripple";
import { RouteProp } from "@react-navigation/native";
import { ScreenList } from "../src/screenList";
import { EnvironmentHelper, screenNavigationProps, CachedData, Styles, StyleConstants } from "../src/helpers";
import { ApiHelper, AppCenterHelper, ArrayHelper, DimensionHelper, FirebaseHelper, PersonInterface, Utils } from "../src/helpers";
import Header from "../src/components/Header";
import Subheader from "../src/components/Subheader";
import { router } from "expo-router";

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
      });
    }
  };

  const getRow = (data: any) => {
    const person: PersonInterface = data.item;
    return (
      <Ripple style={[lookupStyles.personCard, { width: wd("90%") }]} onPress={() => { selectPerson(person); }}>
        <Image 
          source={{ uri: EnvironmentHelper.ContentRoot + person.photo }} 
          style={lookupStyles.personPhoto} 
        />
        <View style={lookupStyles.personInfo}>
          <Text style={lookupStyles.personName}>{person.name.display}</Text>
        </View>
        <View style={lookupStyles.arrowContainer}>
          <Text style={lookupStyles.arrow}>›</Text>
        </View>
      </Ripple>
    );
  };

  const getResults = () => {
    if (!hasSearched) { 
      return (
        <View style={lookupStyles.emptyState}>
          <Text style={lookupStyles.emptyStateIcon}>🔍</Text>
          <Text style={lookupStyles.emptyStateTitle}>Ready to Search</Text>
          <Text style={lookupStyles.emptyStateSubtitle}>Enter a phone number to find people</Text>
        </View>
      );
    }
    else if (isLoading) { 
      return (
        <View style={lookupStyles.loadingContainer}>
          <ActivityIndicator size="large" color={StyleConstants.baseColor} animating={isLoading} />
          <Text style={lookupStyles.loadingText}>Searching...</Text>
        </View>
      );
    }
    else { 
      if (people.length === 0) {
        return (
          <View style={lookupStyles.noResultsState}>
            <Text style={lookupStyles.noResultsIcon}>😔</Text>
            <Text style={lookupStyles.noResultsTitle}>No Matches Found</Text>
            <Text style={lookupStyles.noResultsSubtitle}>Try searching with a different phone number</Text>
          </View>
        );
      }
      return (
        <View style={lookupStyles.resultsContainer}>
          <FlatList 
            data={people} 
            renderItem={getRow} 
            keyExtractor={(item: PersonInterface) => item.id?.toString() || "0"}
            contentContainerStyle={lookupStyles.resultsList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      );
    }
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
    <View style={lookupStyles.container}>
      <Header
        navigation={props.navigation}
        prominentLogo={true}
      />

      {/* Search Section */}
      <Subheader
        icon="🔍"
        title="Search by Phone Number"
        subtitle="Enter last four digits of mobile number"
      />

      {/* Main Content */}
      <View style={lookupStyles.mainContent}>
        {/* Search Input */}
        <View style={lookupStyles.searchSection}>
          <View style={[lookupStyles.searchView, { width: wd("90%") }]}>
            <TextInput 
              placeholder="Enter last four digits of mobile number" 
              onChangeText={(value) => { setPhone(value); }} 
              keyboardType="numeric" 
              style={lookupStyles.searchTextInput} 
              placeholderTextColor={StyleConstants.lightGray}
            />
            <Ripple style={lookupStyles.searchButton} onPress={handleSearch}>
              <Text style={lookupStyles.searchButtonText}>Search</Text>
            </Ripple>
          </View>
        </View>

        {/* Results Section */}
        <View style={lookupStyles.resultsSection}>
          {getResults()}
        </View>
      </View>
    </View>
  );
};

// Professional tablet-optimized styles matching ChumsApp
const lookupStyles = {
  container: {
    flex: 1,
    backgroundColor: StyleConstants.ghostWhite
  },

  // Main Content
  mainContent: {
    flex: 1,
    paddingHorizontal: DimensionHelper.wp("5%")
  },

  // Search Section
  searchSection: {
    marginBottom: DimensionHelper.wp("5%")
  },

  searchView: {
    backgroundColor: StyleConstants.whiteColor,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: DimensionHelper.wp("4%"),
    paddingVertical: DimensionHelper.wp("2%"),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    shadowColor: StyleConstants.baseColor,
    alignSelf: "center",
    marginVertical: DimensionHelper.wp("3%")
  },

  searchTextInput: {
    flex: 1,
    fontSize: DimensionHelper.wp("4%"),
    fontFamily: StyleConstants.RobotoRegular,
    color: StyleConstants.darkColor,
    paddingVertical: DimensionHelper.wp("2%"),
    paddingHorizontal: DimensionHelper.wp("2%")
  },

  searchButton: {
    backgroundColor: StyleConstants.baseColor,
    paddingHorizontal: DimensionHelper.wp("6%"),
    paddingVertical: DimensionHelper.wp("3%"),
    borderRadius: 8,
    marginLeft: DimensionHelper.wp("3%")
  },

  searchButtonText: {
    color: StyleConstants.whiteColor,
    fontSize: DimensionHelper.wp("3.8%"),
    fontFamily: StyleConstants.RobotoMedium,
    fontWeight: "600"
  },

  // Results Section
  resultsSection: {
    flex: 1
  },

  resultsContainer: {
    flex: 1
  },

  resultsList: {
    paddingBottom: DimensionHelper.wp("5%")
  },

  // Person Cards (Professional Material Design)
  personCard: {
    backgroundColor: StyleConstants.whiteColor,
    borderRadius: 12,
    marginVertical: DimensionHelper.wp("1.5%"),
    padding: DimensionHelper.wp("4%"),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    shadowColor: StyleConstants.baseColor,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    minHeight: DimensionHelper.wp("18%")
  },

  personPhoto: {
    width: DimensionHelper.wp("12%"),
    height: DimensionHelper.wp("12%"),
    borderRadius: DimensionHelper.wp("6%"),
    marginRight: DimensionHelper.wp("4%")
  },

  personInfo: {
    flex: 1,
    justifyContent: "center"
  },

  personName: {
    fontSize: DimensionHelper.wp("4.5%"),
    fontFamily: StyleConstants.RobotoMedium,
    color: StyleConstants.darkColor,
    lineHeight: DimensionHelper.wp("5.5%")
  },

  arrowContainer: {
    marginLeft: DimensionHelper.wp("3%"),
    justifyContent: "center",
    alignItems: "center"
  },

  arrow: {
    fontSize: DimensionHelper.wp("6%"),
    color: StyleConstants.baseColor,
    opacity: 0.7
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: DimensionHelper.wp("20%")
  },

  loadingText: {
    fontSize: DimensionHelper.wp("4%"),
    fontFamily: StyleConstants.RobotoRegular,
    color: StyleConstants.baseColor,
    marginTop: DimensionHelper.wp("4%"),
    textAlign: "center"
  },

  // Empty States
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: DimensionHelper.wp("20%")
  },

  emptyStateIcon: {
    fontSize: DimensionHelper.wp("16%"),
    marginBottom: DimensionHelper.wp("4%")
  },

  emptyStateTitle: {
    fontSize: DimensionHelper.wp("5%"),
    fontFamily: StyleConstants.RobotoMedium,
    color: StyleConstants.darkColor,
    marginBottom: DimensionHelper.wp("2%"),
    textAlign: "center"
  },

  emptyStateSubtitle: {
    fontSize: DimensionHelper.wp("3.8%"),
    fontFamily: StyleConstants.RobotoRegular,
    color: StyleConstants.lightGray,
    textAlign: "center",
    lineHeight: DimensionHelper.wp("5%")
  },

  // No Results State
  noResultsState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: DimensionHelper.wp("15%")
  },

  noResultsIcon: {
    fontSize: DimensionHelper.wp("16%"),
    marginBottom: DimensionHelper.wp("4%")
  },

  noResultsTitle: {
    fontSize: DimensionHelper.wp("5%"),
    fontFamily: StyleConstants.RobotoMedium,
    color: StyleConstants.darkColor,
    marginBottom: DimensionHelper.wp("2%"),
    textAlign: "center"
  },

  noResultsSubtitle: {
    fontSize: DimensionHelper.wp("3.8%"),
    fontFamily: StyleConstants.RobotoRegular,
    color: StyleConstants.lightGray,
    textAlign: "center",
    lineHeight: DimensionHelper.wp("5%"),
    paddingHorizontal: DimensionHelper.wp("10%")
  }
};

export default Lookup