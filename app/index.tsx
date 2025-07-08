import React, { useEffect } from "react";
import { Image, View, Text, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EnvironmentHelper, ApiHelper, LoginResponseInterface, CachedData, DimensionHelper, StyleConstants } from "../src/helpers";

export default function Splash() {
  console.log("Splash component called");
  const [statusMessage, setStatusMessage] = React.useState("Initializing...");

  useEffect(() => {
    // Initialize API configuration
    EnvironmentHelper.init();

    checkStoredCredentials();
  }, []);

  const checkStoredCredentials = async () => {
    try {
      // Check if user has stored credentials
      const [email, password, selectedChurchId, churchAppearance] = await AsyncStorage.multiGet(["@Email", "@Password", "@SelectedChurchId", "@ChurchAppearance"]);

      if (email[1] && password[1]) {
        setStatusMessage("Logging in...");

        // Attempt auto-login with stored credentials
        const loginData: LoginResponseInterface = await ApiHelper.postAnonymous(
          "/users/login",
          { email: email[1], password: password[1] },
          "MembershipApi"
        );

        if (loginData.errors?.length > 0) {
          // Login failed, go to login screen
          router.replace("/login");
        } else {
          // Login successful, update stored churches
          const churches = loginData.userChurches?.filter(userChurch =>
            userChurch.apis && userChurch.apis?.length > 0);
          await AsyncStorage.setItem("@UserChurches", JSON.stringify(churches));

          // Check if there's a previously selected church
          if (selectedChurchId[1] && churches) {
            const previousChurch = churches.find(uc =>
              uc.church?.id?.toString() === selectedChurchId[1]);

            if (previousChurch) {
              // Restore previous church selection
              setStatusMessage("Loading church data...");
              CachedData.userChurch = previousChurch;
              previousChurch.apis?.forEach(api =>
                ApiHelper.setPermissions(api.keyName || "", api.jwt, api.permissions));

              // Restore church appearance if available
              if (churchAppearance[1]) {
                try {
                  CachedData.churchAppearance = JSON.parse(churchAppearance[1]);
                } catch (_e) {
                  // Fetch fresh appearance data if parsing fails
                  CachedData.churchAppearance = await ApiHelper.getAnonymous(
                    "/settings/public/" + previousChurch.church.id,
                    "MembershipApi"
                  );
                  await AsyncStorage.setItem("@ChurchAppearance", JSON.stringify(CachedData.churchAppearance));
                }
              } else {
                // Fetch appearance data
                CachedData.churchAppearance = await ApiHelper.getAnonymous(
                  "/settings/public/" + previousChurch.church.id,
                  "MembershipApi"
                );
                await AsyncStorage.setItem("@ChurchAppearance", JSON.stringify(CachedData.churchAppearance));
              }

              // Go directly to services screen
              router.replace("/services");
              return;
            }
          }

          // No previous church selection, go to church selection
          router.replace("/selectChurch");
        }
      } else {
        // No stored credentials, go to login
        setTimeout(() => {
          router.replace("/login");
        }, 1500);
      }
    } catch (error) {
      console.error("Auto-login error:", error);
      // On any error, go to login screen
      setTimeout(() => {
        router.replace("/login");
      }, 1500);
    }
  };

  return (
    <View style={splashStyles.container}>
      <Image
        source={require("../src/images/logo1.png")}
        style={splashStyles.logo}
      />
      <Text style={splashStyles.title}>CHUMS Check-in</Text>
      <View style={splashStyles.loadingContainer}>
        <ActivityIndicator size="large" color={StyleConstants.baseColor} />
        <Text style={splashStyles.statusText}>{statusMessage}</Text>
      </View>
    </View>
  );
}

const splashStyles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: StyleConstants.whiteColor
  },
  logo: {
    width: DimensionHelper.wp("35%"),
    height: DimensionHelper.wp("35%"),
    resizeMode: "contain",
    marginBottom: DimensionHelper.wp("4%")
  },
  title: {
    fontSize: DimensionHelper.wp("6%"),
    fontFamily: StyleConstants.RobotoMedium,
    color: StyleConstants.darkColor,
    marginBottom: DimensionHelper.wp("8%")
  },
  loadingContainer: {
    alignItems: "center"
  },
  statusText: {
    fontSize: DimensionHelper.wp("3.5%"),
    fontFamily: StyleConstants.RobotoRegular,
    color: StyleConstants.grayColor,
    marginTop: DimensionHelper.wp("3%")
  }
};

