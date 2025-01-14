import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { CheckinComplete } from "./src/screens/CheckinComplete";
import { Splash, Lookup, Services, Login, Household, SelectGroup, AddGuest, ScreenList, SelectChurch } from "./src/screens";
import { EnvironmentHelper } from "./src/helpers";
import { Printers } from "./src/screens/Printers";
import CodePush from "react-native-code-push";
import { ErrorHelper } from "@churchapps/mobilehelper";
import PrivacyPolicy from "./src/screens/PrivacyPolicy";

const CODE_PUSH_OPTIONS = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START
};

EnvironmentHelper.init();
const stack = createStackNavigator<ScreenList>();
const App = () => {

  useEffect(() => {
    CodePush.sync({ installMode: CodePush.InstallMode.IMMEDIATE }, syncWithCodePush);
    ErrorHelper.init();
  }, []);

  const syncWithCodePush = (status: CodePush.SyncStatus) => {
    switch (status) {
      case CodePush.SyncStatus.AWAITING_USER_ACTION: console.log("AWAITING_USER_ACTION"); break;
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE: console.log("CHECKING_FOR_UPDATE"); break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE: console.log("DOWNLOADING_PACKAGE"); break;
      case CodePush.SyncStatus.INSTALLING_UPDATE: console.log("INSTALLING_UPDATE"); break;
      case CodePush.SyncStatus.SYNC_IN_PROGRESS: console.log("SYNC_IN_PROGRESS"); break;
      case CodePush.SyncStatus.UNKNOWN_ERROR: console.log("UNKNOWN_ERROR"); break;
      case CodePush.SyncStatus.UPDATE_IGNORED: console.log("UPDATE_IGNORED"); break;
      case CodePush.SyncStatus.UPDATE_INSTALLED: console.log("UPDATE_INSTALLED"); break;
      case CodePush.SyncStatus.UP_TO_DATE: console.log("UP_TO_DATE"); break;
    }
    console.log("Codepush sync status", status);
  };

  return (

    <NavigationContainer>
      <stack.Navigator screenOptions={{ headerShown: false, animationEnabled: false }}>
        <stack.Screen name="Splash" component={Splash} />
        <stack.Screen name="Login" component={Login} />
        <stack.Screen name="Services" component={Services} />
        <stack.Screen name="Lookup" component={Lookup} />
        <stack.Screen name="Household" component={Household} />
        <stack.Screen name="AddGuest" component={AddGuest} />
        <stack.Screen name="CheckinComplete" component={CheckinComplete} />
        <stack.Screen name="SelectGroup" component={SelectGroup} />
        <stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{headerShown: true, headerTitle:"Privacy Policy"}} />
        <stack.Screen name="SelectChurch" component={SelectChurch} />
        <stack.Screen name="Printers" component={Printers} />
      </stack.Navigator>
    </NavigationContainer>

  );
};

export default CodePush(CODE_PUSH_OPTIONS)(App);
//export default createNavigation
//export default App;
