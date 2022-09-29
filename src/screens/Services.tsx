import React from 'react'
import { Text, FlatList, ActivityIndicator, SafeAreaView, Dimensions, PixelRatio, ScrollView } from 'react-native'
import { Container } from 'native-base'
import Ripple from 'react-native-material-ripple'
import { Header } from './components'
import { ApiHelper, screenNavigationProps, CachedData, Styles, StyleConstants, GroupInterface, GroupServiceTimeInterface, Utilities } from '../helpers'
import { ArrayHelper } from '../helpers/ArrayHelper'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface Props { navigation: screenNavigationProps }

export const Services = (props: Props) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [services, setServices] = React.useState([]);
  const [dimension, setDimension] = React.useState(Dimensions.get('window'));

  const loadData = () => {
    setIsLoading(true);
    Utilities.trackEvent("Services Screen");
    ApiHelper.get("/services", "AttendanceApi").then(data => {
      setServices(data); setIsLoading(false);
    });
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
      <Ripple style={[Styles.bigLinkButton, { width: wd('90%') }]} onPress={() => { selectService(item.id) }}>
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
    <Container style={{ backgroundColor: StyleConstants.ghostWhite }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header navigation={props.navigation} />
        <SafeAreaView style={Styles.fullWidthContainer} >
          <Text style={{ ...Styles.H1, marginLeft: wp('5%') }}>Select a service:</Text>
          {getResults()}
        </SafeAreaView>
      </ScrollView>
    </Container>
  )
}
