import React from 'react'
import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import { Container } from 'native-base'
import Ripple from 'react-native-material-ripple'
import { Header } from './components'
import { ApiHelper, screenNavigationProps, CachedData, Styles, StyleConstants, GroupInterface, GroupServiceTimeInterface } from '../helpers'
import { ArrayHelper } from '../helpers/ArrayHelper'

interface Props { navigation: screenNavigationProps }

export const Services = (props: Props) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [services, setServices] = React.useState([]);

    const loadData = () => {
        setIsLoading(true);
        ApiHelper.get("/services", "AttendanceApi").then(data => {
            setServices(data); setIsLoading(false);
        });
    }

    const selectService = (serviceId: string) => {
        setIsLoading(true);

        const promises: Promise<any>[] = [
            ApiHelper.get("/servicetimes?serviceId=" + serviceId, "AttendanceApi").then(times => { CachedData.serviceId = serviceId; CachedData.serviceTimes = times; }),
            ApiHelper.get("/groupservicetimes", "AttendanceApi").then(groupServiceTimes => { CachedData.groupServiceTimes = groupServiceTimes }),
            ApiHelper.get("/groups", "MembershipApi").then(groups => { CachedData.groups = groups })
        ];

        Promise.all(promises).then(() => {
            //for simplicity, iterate the group service times and add groups to the services.
            CachedData.serviceTimes.forEach(st => {
                st.groups = [];
                ArrayHelper.getAll(CachedData.groupServiceTimes, "serviceTimeId", st.id).forEach((gst: GroupServiceTimeInterface) => {
                    const g: GroupInterface = ArrayHelper.getOne(CachedData.groups, "id", gst.groupId);
                    st.groups?.push(g);
                })
            });
            console.log(JSON.stringify(CachedData.serviceTimes));

            setIsLoading(false);
            props.navigation.navigate("Lookup");
        });

    }

    const getRow = (data: any) => {
        const item = data.item;
        return (
            <Ripple style={Styles.bigLinkButton} onPress={() => { selectService(item.id) }}>
                <Text style={Styles.bigLinkButtonText}>{item.campus.name} - {item.name}</Text>
            </Ripple>
        );
    }

    const getResults = () => {
        if (isLoading) return (<ActivityIndicator size="large" color={StyleConstants.baseColor1} animating={isLoading} style={{ marginTop: '25%' }} />)
        else return (<FlatList data={services} renderItem={getRow} keyExtractor={(item: any) => item.id.toString()} />);
    }

    React.useEffect(loadData, []);

    return (
        <Container>
            <Header />
            <View style={Styles.mainContainer} >
                <Text style={Styles.H1}>Select a service:</Text>
                {getResults()}
            </View>
        </Container>
    )
}
