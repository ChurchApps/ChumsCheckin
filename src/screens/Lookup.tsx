import React from 'react'
import { TextInput, View, Text, Image, FlatList, ActivityIndicator, Keyboard } from 'react-native'
import { Container } from 'native-base'
import Ripple from 'react-native-material-ripple'
import { RouteProp } from '@react-navigation/native';
import { ScreenList } from './ScreenList';
import { Header } from './components'
import { EnvironmentHelper, ApiHelper, Utilities, screenNavigationProps, PersonInterface, CachedData, Styles, StyleConstants } from "../helpers";
import { ArrayHelper } from '../helpers/ArrayHelper';

type ProfileScreenRouteProp = RouteProp<ScreenList, 'Lookup'>;
interface Props { navigation: screenNavigationProps; route: ProfileScreenRouteProp; }

export const Lookup = (props: Props) => {
    const [hasSearched, setHasSearched] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [people, setPeople] = React.useState([]);
    const [phone, setPhone] = React.useState("");

    const loadHouseholdMembers = async () => {
        console.log('/people/household/' + CachedData.householdId);
        CachedData.householdMembers = await ApiHelper.get('/people/household/' + CachedData.householdId, "MembershipApi");
        loadExistingVisits();
    }

    const loadExistingVisits = async () => {
        try {
            CachedData.existingVisits = []
            const peopleIds: number[] = ArrayHelper.getUniqueValues(CachedData.householdMembers, "id");
            const url = '/visits/checkin?serviceId=' + CachedData.serviceId + '&peopleIds=' + escape(peopleIds.join(",")) + '&include=visitSessions';
            CachedData.existingVisits = await ApiHelper.get(url, "AttendanceApi");
        } catch {
            console.log("***ERROR LOADING EXISTING");
        }
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
            <Ripple style={Styles.flatlistMainView} onPress={() => { selectPerson(person) }} >
                <Image source={{ uri: EnvironmentHelper.ImageBaseUrl + person.photo }} style={Styles.personPhoto} resizeMode="contain" />
                <Text style={[Styles.personName, { marginLeft: '7%' }]}>{person.name.display}</Text>
            </Ripple>
        )
    }

    const getResults = () => {
        if (!hasSearched) return null;
        else if (isLoading) return (<ActivityIndicator size="large" color={StyleConstants.baseColor1} animating={isLoading} style={{ marginTop: '25%' }} />)
        else return (<FlatList data={people} renderItem={getRow} keyExtractor={(item: PersonInterface) => item.id?.toString() || "0"} />);
    }

    return (
        <Container>
            <Header />
            <View style={Styles.mainContainer}>
                <Text style={Styles.H1}>Search by phone number:</Text>
                <View style={Styles.searchView} >
                    <TextInput placeholder='Enter mobile no' onChangeText={(value) => { setPhone(value) }} keyboardType="numeric" style={Styles.searchTextInput} />
                    <Ripple style={Styles.searchButton} onPress={handleSearch} >
                        <Text style={Styles.searchButtonText}>Search</Text>
                    </Ripple>
                </View>
                {getResults()}
            </View>
        </Container>
    )
}