import { View } from "react-native";
import React from "react";
import WebView from "react-native-webview";
import { FirebaseHelper } from "../src/helpers";

const PrivacyPolicy = () => {
  FirebaseHelper.addOpenScreenEvent("Privacy");
  return (
    <View style={{ flex: 1 }}>
      <WebView source={{ uri: "https://churchapps.org/privacy" }} style={{ flex: 1 }} />
    </View>
  );
};

export default PrivacyPolicy;
