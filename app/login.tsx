import React, { useState } from "react";
import { View, Text, TextInput, ActivityIndicator, PixelRatio, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Utilities, screenNavigationProps, Styles, StyleConstants, DimensionHelper, Utils } from "../src/helpers";
import { ApiHelper, FirebaseHelper, LoginResponseInterface } from "@churchapps/mobilehelper";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ripple from "react-native-material-ripple";
import Header from "./components/Header";
import { router } from "expo-router";

interface Props { navigation: screenNavigationProps }

function Login(props: Props) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [dimension, setDimension] = useState(Dimensions.get("window"));

  const login = () => {

    console.log("logni")

    if (email === "") { Utils.snackBar("Please enter your email address"); }
    else if (!Utilities.validateEmail(email)) { Utils.snackBar("Please enter valid email"); }
    else if (password === "") { Utils.snackBar("Please enter your password"); }
    else {
      // router.replace("SelectChurch")
      console.log("event")
      // AppCenterHelper.trackEvent("Login attempt", { email: email });
      setIsLoading(true);
      ApiHelper.postAnonymous("/users/login", { email: email, password: password }, "MembershipApi").then((data: LoginResponseInterface) => {
        setIsLoading(false);
        if (data.errors?.length > 0) { Utils.snackBar(data.errors[0]); }
        else {
          const churches = data.userChurches?.filter(userChurch => userChurch.apis && userChurch.apis?.length > 0);
          AsyncStorage.multiSet([["@Login", "true"], ["@Email", email], ["@Password", password], ["@UserChurches", JSON.stringify(churches)]]);
          setEmail("");
          setPassword("");
          // AppCenterHelper.trackEvent("Login success", { email: email });
          router.replace("/selectChurch")
          // props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "SelectChurch" }] }));
        }
      }).catch((error) => {
        setIsLoading(false);
        Utils.snackBar("Login failed.");
      });
    }
  };

  React.useEffect(() => {
    FirebaseHelper.addOpenScreenEvent("Login");
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
      <Header navigation={props.navigation} logo={true} />
      <View style={Styles.mainContainer}>
        <Text style={{ ...Styles.H1, marginTop: DimensionHelper.wp("6%") }}>Welcome.  Please Log in.</Text>
        <View style={[Styles.textInputView, { width: wd("90%") }]}>
          <Fontisto name={"email"} color={StyleConstants.baseColor} style={Styles.inputIcon} size={DimensionHelper.wp("4.5%")} />
          <TextInput placeholder={"Email"} placeholderTextColor={"lightgray"} style={[Styles.textInputStyle, { width: wd("80%") }]} autoComplete="email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={(value) => setEmail(value)} />
        </View>
        <View style={[Styles.textInputView, { width: wd("90%") }]}>
          <Fontisto name={"key"} color={StyleConstants.baseColor} style={Styles.inputIcon} size={DimensionHelper.wp("4.5%")} />
          <TextInput placeholder={"Password"} placeholderTextColor={"lightgray"} style={[Styles.textInputStyle, { width: wd("80%") }]} secureTextEntry={true} autoCapitalize="none" autoCorrect={false} keyboardType="default" value={password} onChangeText={(value) => { setPassword(value); }} />
        </View>

        <View style={Styles.privacyPolicyView}>
          <Text style={{ ...Styles.H2, width: wd("90%") }}>By clicking on Login, I confirm that I have read the <Text style={{ color: StyleConstants.baseColor }} onPress={() => {
            // props.navigation.navigate("PrivacyPolicy")
            router.navigate("/privacyPolicy")
          }}    >privacy policy.</Text>
          </Text>
        </View>


        <Ripple style={[Styles.bigButton, { marginTop: DimensionHelper.wp("6%"), width: wd("90%") }]} onPress={login}>
          <ActivityIndicator size="small" color="#FFFFFF" animating={isLoading} style={{ display: (isLoading) ? "flex" : "none" }} />
          <Text style={[Styles.bigButtonText, { display: (isLoading) ? "none" : "flex" }]}>LOGIN</Text>
        </Ripple>
      </View>
    </View>
  );
};
export default Login
