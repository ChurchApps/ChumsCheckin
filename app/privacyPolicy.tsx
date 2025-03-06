import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import WebView from 'react-native-webview'
import { FirebaseHelper } from '@churchapps/mobilehelper';

const PrivacyPolicy = () => {
  FirebaseHelper.addOpenScreenEvent("Privacy");
  return (
    <View style={{ flex: 1 }}>
      <WebView source={{ uri: 'https://churchapps.org/privacy' }} style={{ flex: 1 }} />
    </View>
  )
}

export default PrivacyPolicy