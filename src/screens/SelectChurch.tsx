import * as React from 'react';
import { Text, SafeAreaView, FlatList, ActivityIndicator, Dimensions, PixelRatio, ScrollView } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Container } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ripple from 'react-native-material-ripple';
import { CommonActions } from "@react-navigation/native"
import { ChurchInterface, StyleConstants, Styles, CachedData, ApiHelper, screenNavigationProps, Utilities, } from '../helpers';
import { Header } from './components';

interface Props {
  navigation: screenNavigationProps
}

export function SelectChurch({ navigation }: Props) {
  const [churches, setChurches] = React.useState<ChurchInterface[]>([]);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [dimension, setDimension] = React.useState(Dimensions.get('window'));

  React.useEffect(() => {
    setLoading(true);
    Utilities.trackEvent("Select Church Screen");
    (async () => {
      const churches = await AsyncStorage.getItem('@UserChurches');
      setChurches(JSON.parse(churches || ''));
      setLoading(false);
    })();
  }, []);

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


  const select = async (church: ChurchInterface) => {
    CachedData.church = church
    church.apis?.forEach(api => ApiHelper.setPermissions(api.keyName || "", api.jwt, api.permissions))
    await AsyncStorage.setItem("@SelectedChurchId", church.id?.toString() || "")
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "Services" }] }));
  }

  const getRow = (church: ChurchInterface) => {
    return (
      <Ripple style={[Styles.bigLinkButton, { width: wd('90%') }]} onPress={() => select(church)}>
        <Text style={Styles.bigLinkButtonText}>{church.name}</Text>
      </Ripple>
    );
  };

  const churchList = isLoading ? (
    <ActivityIndicator
      size="large"
      color={StyleConstants.baseColor1}
      animating={isLoading}
      style={{ marginTop: '25%' }}
    />
  ) : (
    <FlatList
      data={churches}
      renderItem={({ item }) => getRow(item)}
      keyExtractor={(item: any) => item.id.toString()}
    />
  );

  return (
    <Container style={{ backgroundColor: StyleConstants.ghostWhite }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header navigation={navigation} />
        <SafeAreaView style={Styles.fullWidthContainer}>
          <Text style={{ ...Styles.H1, marginLeft: wp('5%') }}>
            Select a Church:
          </Text>
          {churchList}
        </SafeAreaView>
      </ScrollView>
    </Container>
  );
}
