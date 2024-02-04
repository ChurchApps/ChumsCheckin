import * as React from "react";
import { Text, SafeAreaView, FlatList, ActivityIndicator, Dimensions, PixelRatio, ScrollView } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Container } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ripple from "react-native-material-ripple";
import { CommonActions } from "@react-navigation/native";
import { StyleConstants, Styles, CachedData, screenNavigationProps, Utilities } from "../helpers";
import { Header } from "./components";
import { ApiHelper, LoginUserChurchInterface } from "@churchapps/mobilehelper";

interface Props {
  navigation: screenNavigationProps
}

export function SelectChurch({ navigation }: Props) {
  const [userChurches, setUserChurches] = React.useState<LoginUserChurchInterface[]>([]);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [dimension, setDimension] = React.useState(Dimensions.get("window"));

  React.useEffect(() => {
    setLoading(true);
    Utilities.trackEvent("Select Church Screen");
    (async () => {
      const userChurch = await AsyncStorage.getItem("@UserChurches");
      setUserChurches(JSON.parse(userChurch || ""));
      setLoading(false);
    })();
  }, []);

  React.useEffect(() => {
    Dimensions.addEventListener("change", () => {
      const dim = Dimensions.get("screen");
      setDimension(dim);
    });
  }, []);

  const wd = (number: string) => {
    let givenWidth = typeof number === "number" ? number : parseFloat(number);
    return PixelRatio.roundToNearestPixel((dimension.width * givenWidth) / 100);
  };


  const select = async (userChurch: LoginUserChurchInterface) => {
    CachedData.userChurch = userChurch;
    userChurch.apis?.forEach(api => ApiHelper.setPermissions(api.keyName || "", api.jwt, api.permissions));
    await AsyncStorage.setItem("@SelectedChurchId", userChurch.church?.id?.toString() || "");
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "Services" }] }));
  };

  const getRow = (userChurch: LoginUserChurchInterface) => (
    <Ripple style={[Styles.bigLinkButton, { width: wd("90%") }]} onPress={() => select(userChurch)}>
      <Text style={Styles.bigLinkButtonText}>{userChurch.church.name}</Text>
    </Ripple>
  );

  console.log(JSON.stringify(userChurches));

  const churchList = isLoading
    ? (
      <ActivityIndicator
        size="large"
        color={StyleConstants.baseColor1}
        animating={isLoading}
        style={{ marginTop: "25%" }}
      />
    )
    : (
      <FlatList
        data={userChurches}
        renderItem={({ item }) => getRow(item)}
        keyExtractor={(item: any) => item.church.id.toString()}
      />
    );

  return (
    <Container style={{ backgroundColor: StyleConstants.ghostWhite }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header navigation={navigation} />
        <SafeAreaView style={Styles.fullWidthContainer}>
          <Text style={{ ...Styles.H1, marginLeft: wp("5%") }}>
            Select a Church:
          </Text>
          {churchList}
        </SafeAreaView>
      </ScrollView>
    </Container>
  );
}
