import React from "react";
import { Image, View } from "react-native";
import { Container } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import { screenNavigationProps, ApiHelper, Styles, LoginResponseInterface, CachedData, Utilities } from "../helpers";
import { PushNotificationHelper } from "@churchapps/mobilehelper";

type Props = { navigation: screenNavigationProps; };

export const Splash = (props: Props) => {

  const loadData = () => {
    Utilities.trackEvent("Splash Screen");
    PushNotificationHelper.registerUserDevice("ChumsCheckin");
    setTimeout(access, 1000);
  };

  const access = async () => {
    await AsyncStorage.multiGet(["@Login", "@Email", "@Password", "@SelectedChurchId", "@Printer"]).then(response => {

      const printerJSON = response[4][1];
      console.log("********", "PRINTER JSON IS: ", printerJSON);
      if (printerJSON) {CachedData.printer = JSON.parse(printerJSON);}

      const login = response[0][1] === "true";
      if (login) {
        const email = response[1][1];
        const password = response[2][1];
        const selectedChurchId = response[3][1];

        attemptLogin(email || "", password || "", selectedChurchId || "");
      } else {redirectToLogin();}
    });
  };

  const redirectToLogin = () => { props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "Login" }] })); };

  const attemptLogin = (email: string, password: string, churchId: string) => {
    ApiHelper.postAnonymous("/users/login", { email: email, password: password }, "MembershipApi").then((data: LoginResponseInterface) => {
      if (data.errors?.length > 0) {redirectToLogin();}
      else {
        AsyncStorage.multiSet([["@Login", "true"], ["@Email", email], ["@Password", password]]);
        if (churchId) {
          const userChurch = data.userChurches.filter(userchurch => userchurch.church.id === churchId)[0];
          CachedData.userChurch = userChurch;
          userChurch.apis?.forEach(api => { ApiHelper.setPermissions(api.keyName || "", api.jwt, api.permissions); });
          props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "Services" }] }));
          return;
        }
        props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "SelectChurch" }] }));
      }
    });
  };

  React.useEffect(loadData, []);  //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container>
      <View style={Styles.splashMaincontainer}>
        <Image source={require("../images/logo1.png")} style={Styles.headerImage} resizeMode="contain" />
      </View>
    </Container>
  );

};
