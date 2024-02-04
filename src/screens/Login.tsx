import React, { useState } from "react";
import { View, Text, TextInput, ActivityIndicator, ScrollView, PixelRatio, Dimensions, SafeAreaView, } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import Ripple from "react-native-material-ripple";
import { Header } from "./components";
import { Utilities, screenNavigationProps, Styles, LoginResponseInterface, StyleConstants } from "../helpers";
import Icon from "react-native-vector-icons/Fontisto";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ApiHelper } from "@churchapps/mobilehelper";

interface Props { navigation: screenNavigationProps }

export const Login = (props: Props) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [dimension, setDimension] = useState(Dimensions.get("window"));

  const login = () => {
    if (email === "") {Utilities.snackBar("Please enter your email address");}
    else if (!Utilities.validateEmail(email)) {Utilities.snackBar("Please enter valid email");}
    else if (password === "") {Utilities.snackBar("Please enter your password");}
    else {
      Utilities.trackEvent("Login attempt", { email: email });
      setIsLoading(true);
      ApiHelper.postAnonymous("/users/login", { email: email, password: password }, "MembershipApi").then((data: LoginResponseInterface) => {
        setIsLoading(false);
        if (data.errors?.length > 0) {Utilities.snackBar(data.errors[0]);}
        else {
          const churches = data.userChurches?.filter(userChurch => userChurch.apis && userChurch.apis?.length > 0);
          AsyncStorage.multiSet([["@Login", "true"], ["@Email", email], ["@Password", password], ["@UserChurches", JSON.stringify(churches)]]);
          setEmail("");
          setPassword("");
          Utilities.trackEvent("Login success", { email: email });
          props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "SelectChurch" }] }));
        }
      });
    }
  };

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

  return (
    <View style={{ flex: 1, backgroundColor: StyleConstants.ghostWhite }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView style={{ flex: 1 }}>
          <Header navigation={props.navigation} logo={true} />
          <View style={Styles.mainContainer}>
            <Text style={{ ...Styles.H1, marginTop: wp("6%") }}>Welcome.  Please Log in.</Text>
            <View style={[Styles.textInputView, { width: wd("90%") }]}>
              <Icon name={"email"} color={StyleConstants.baseColor} style={Styles.inputIcon} size={wp("4.5%")} />
              <TextInput placeholder={"Email"} placeholderTextColor={"lightgray"} style={[Styles.textInputStyle, { width: wd("80%") }]} autoComplete="email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={(value) => setEmail(value)} />
            </View>
            <View style={[Styles.textInputView, { width: wd("90%") }]}>
              <Icon name={"key"} color={StyleConstants.baseColor} style={Styles.inputIcon} size={wp("4.5%")} />
              <TextInput placeholder={"Password"} placeholderTextColor={"lightgray"} style={[Styles.textInputStyle, { width: wd("80%") }]} secureTextEntry={true} autoCapitalize="none" autoCorrect={false} keyboardType="default" value={password} onChangeText={(value) => { setPassword(value); }} />
            </View>
            <Ripple style={[Styles.bigButton, { marginTop: wp("6%"), width: wd("90%") }]} onPress={login}>
              <ActivityIndicator size="small" color="#FFFFFF" animating={isLoading} style={{ display: (isLoading) ? "flex" : "none" }} />
              <Text style={[Styles.bigButtonText, { display: (isLoading) ? "none" : "flex" }]}>LOGIN</Text>
            </Ripple>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};
