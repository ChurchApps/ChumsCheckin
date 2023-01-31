import * as React from "react";
import { View, StyleSheet, Button } from "react-native";

export function ErrorFallback(props: any) {
  return (
    <View style={[styles.container]}>
      <View>

        <Button title="try Again" onPress={props.resetErrorBoundary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "center",
    alignContent: "center",
    paddingHorizontal: 12,
  },
});