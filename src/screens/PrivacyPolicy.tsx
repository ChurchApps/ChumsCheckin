import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import WebView from 'react-native-webview'

const PrivacyPolicy = () => {
  return (
    <View style={{flex:1}}>
      <WebView source={{ uri: 'https://churchapps.org/privacy' }} style={{ flex: 1 }}/>
    </View>
  )
}

export default PrivacyPolicy