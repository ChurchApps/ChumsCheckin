import React, { useEffect } from "react";
import { Image, TouchableOpacity, View, Text } from "react-native";
import { router } from "expo-router";

export default function Splash() {
  console.log('Splash component called')

  useEffect(() => {
    // Redirect to login after 2 seconds for testing
    const timer = setTimeout(() => {
      console.log('Redirecting to login...');
      router.replace('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <TouchableOpacity onPress={() => {
        console.log("Manual navigation to login");
        router.replace('/login');
      }}>
        <Text style={{ fontSize: 24, color: '#000', marginBottom: 20 }}>Chums Checkin</Text>
        <Text style={{ fontSize: 16, color: '#666' }}>Loading...</Text>
      </TouchableOpacity>
    </View>
  );
}