import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { CheckinComplete } from './src/screens/CheckinComplete'
import { Splash, Lookup, Services, Login, Household, SelectGroup, AddGuest, ScreenList, SelectChurch } from './src/screens'
import { EnvironmentHelper } from './src/helpers'
import { Printers } from './src/screens/Printers'

EnvironmentHelper.init();
const stack = createStackNavigator<ScreenList>();
const createNavigation = () => {
  return (
    <NavigationContainer>
      <stack.Navigator screenOptions={{ headerShown: false, animationEnabled: false }} >
        <stack.Screen name='Splash' component={Splash} />
        <stack.Screen name='Login' component={Login} />
        <stack.Screen name='Services' component={Services} />
        <stack.Screen name='Lookup' component={Lookup} />
        <stack.Screen name='Household' component={Household} />
        <stack.Screen name='AddGuest' component={AddGuest} />
        <stack.Screen name='CheckinComplete' component={CheckinComplete} />
        <stack.Screen name='SelectGroup' component={SelectGroup} />
        <stack.Screen name="SelectChurch" component={SelectChurch} />
        <stack.Screen name="Printers" component={Printers} />
      </stack.Navigator>
    </NavigationContainer>
  )
}
export default createNavigation