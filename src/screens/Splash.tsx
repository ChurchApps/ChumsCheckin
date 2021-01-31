import React from 'react'
import { Image, View } from 'react-native'
import { Container } from 'native-base'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CommonActions } from '@react-navigation/native';
import { screenNavigationProps, ApiHelper, Styles, LoginResponseInterface, CachedData, SwitchAppRequestInterface } from "../helpers";


type Props = { navigation: screenNavigationProps; };

export const Splash = (props: Props) => {

    const loadData = () => { setTimeout(access, 1000); }

    const access = async () => {
        await AsyncStorage.multiGet(['@Login', '@Email', '@Password']).then(response => {
            const login = response[0][1] === "true";
            if (login) {
                const email = response[1][1];
                const password = response[2][1];
                attemptLogin(email || "", password || "");
            } else redirectToLogin();
        });
    }

    const redirectToLogin = () => { props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "Login" }] })); }
    const redirectToServices = () => { props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "Services" }] })); }

    const attemptLogin = (email: string, password: string) => {
        ApiHelper.postAnonymous("/users/login", { email: email, password: password }, "AccessApi").then((data: LoginResponseInterface) => {
            if (data.errors?.length > 0) redirectToLogin();
            else {
                CachedData.church = data.churches[0];
                data.churches[0].apis?.forEach(api => { ApiHelper.setPermissions(api.keyName || "", api.jwt, api.permissions); });
                AsyncStorage.multiSet([['@Login', 'true'], ['@Email', email], ['@Password', password]]);
                redirectToServices();
            }
        });
    }

    React.useEffect(loadData, []);

    return (
        <Container>
            <View style={Styles.splashMaincontainer}>
                <Image source={require('../images/logo1.png')} style={Styles.headerImage} resizeMode="contain" />
            </View>
        </Container>
    )

}