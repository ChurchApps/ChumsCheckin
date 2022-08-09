import React from 'react'
import { TextInput, View, Text, Image, FlatList, ActivityIndicator, Keyboard, SafeAreaView, ScrollView, Dimensions, PixelRatio } from 'react-native'
import { Container } from 'native-base'
import Ripple from 'react-native-material-ripple'
import { RouteProp } from '@react-navigation/native';
import { ScreenList } from './ScreenList';
import { Header } from './components'
import { EnvironmentHelper, ApiHelper, Utilities, screenNavigationProps, PersonInterface, CachedData, Styles, StyleConstants } from "../helpers";
import { ArrayHelper } from '../helpers/ArrayHelper';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

type ProfileScreenRouteProp = RouteProp<ScreenList, 'Lookup'>;
interface Props { navigation: screenNavigationProps; route: ProfileScreenRouteProp; }

export const Lookup = (props: Props) => {
  const [hasSearched, setHasSearched] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [people, setPeople] = React.useState([]);
  const [phone, setPhone] = React.useState(""); 
  const [dimension, setDimension] = React.useState(Dimensions.get('window'));

  const loadHouseholdMembers = async () => {
    console.log('/people/household/' + CachedData.householdId);
    CachedData.householdMembers = await ApiHelper.get('/people/household/' + CachedData.householdId, "MembershipApi");
    loadExistingVisits();
  }

  const loadExistingVisits = async () => {
    CachedData.existingVisits = []
    const peopleIds: number[] = ArrayHelper.getUniqueValues(CachedData.householdMembers, "id");
    const url = '/visits/checkin?serviceId=' + CachedData.serviceId + '&peopleIds=' + escape(peopleIds.join(",")) + '&include=visitSessions';
    CachedData.existingVisits = await ApiHelper.get(url, "AttendanceApi");
    CachedData.pendingVisits = [...CachedData.existingVisits];
    setIsLoading(false);
    props.navigation.navigate("Household")
  }

  const selectPerson = (person: PersonInterface) => {
    setIsLoading(true);
    CachedData.householdId = person.householdId || "";
    loadHouseholdMembers();
  }

  const handleSearch = () => {
    if (phone === '') Utilities.snackBar("Please enter phone number")
    else {
      Keyboard.dismiss();
      setHasSearched(true);
      setIsLoading(true);
      Utilities.trackEvent("Search");
      ApiHelper.get('/people/search/phone?number=' + phone, "MembershipApi").then(data => {
        setIsLoading(false);
        setPeople(data);
        if (data.length == 0) Utilities.snackBar("No matches found");
      });
    }
  }

  const getRow = (data: any) => {
    const person: PersonInterface = data.item;
    return (
      <Ripple style={[Styles.flatlistMainView,{width:wd('90%')}]} onPress={() => { selectPerson(person) }} >
        <Image source={{ uri: EnvironmentHelper.ContentRoot + person.photo }} style={Styles.personPhoto} />
        <Text style={Styles.personName}>{person.name.display}</Text>
      </Ripple>
    )
  }

  const getResults = () => {
    if (!hasSearched) return null;
    else if (isLoading) return (<ActivityIndicator size="large" color={StyleConstants.baseColor1} animating={isLoading} style={{ marginTop: '25%' }} />)
    else return (<FlatList data={people} renderItem={getRow} keyExtractor={(item: PersonInterface) => item.id?.toString() || "0"} />);
  }

  React.useEffect(() => {
    Dimensions.addEventListener('change', () => {
      const dim = Dimensions.get('screen')
      setDimension(dim);
    })
  }, []);

  const wd = (number: string) => {
    let givenWidth = typeof number === "number" ? number : parseFloat(number);
    return PixelRatio.roundToNearestPixel((dimension.width * givenWidth) / 100);
  };

  return (
    <Container style={{ backgroundColor: StyleConstants.ghostWhite }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header />
        <SafeAreaView style={Styles.fullWidthContainer}>
          <Text style={{ ...Styles.H1, marginLeft: wp('5%') }}>Search by phone number:</Text>
          <View style={[Styles.searchView,{width:wd('90%')}]} >
            <TextInput placeholder='Enter mobile no' onChangeText={(value) => { setPhone(value) }} keyboardType="numeric" style={Styles.searchTextInput} />
            <Ripple style={Styles.searchButton} onPress={handleSearch} >
              <Text style={[Styles.searchButtonText]}>Search</Text>
            </Ripple>
          </View>
          {getResults()}
        </SafeAreaView>
      </ScrollView>
    </Container>
  )
}