import React from 'react'
import { View, Text, TextInput, ActivityIndicator, } from 'react-native'
import { Container, Content } from 'native-base'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CommonActions } from '@react-navigation/native';
import Ripple from 'react-native-material-ripple';
import { Header } from './components'
import { ApiHelper, Utilities, screenNavigationProps, Styles, CachedData, LoginResponseInterface } from "../helpers";


interface Props { navigation: screenNavigationProps }

export const Login = (props: Props) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const login = () => {
        if (email === '') Utilities.snackBar("Please enter your email address");
        else if (!Utilities.validateEmail(email)) Utilities.snackBar("Please enter valid email");
        else if (password === '') Utilities.snackBar("Please enter your password");
        else {
            setIsLoading(true);
            ApiHelper.postAnonymous("/users/login", { email: email, password: password }, "AccessApi").then((data: LoginResponseInterface) => {
                setIsLoading(false);
                if (data.errors?.length > 0) Utilities.snackBar(data.errors[0])
                else {
                    CachedData.church = data.churches[0];
                    data.churches[0].apis?.forEach(api => { ApiHelper.setPermissions(api.keyName || "", api.jwt, api.permissions); });
                    AsyncStorage.multiSet([['@Login', 'true'], ['@Email', email], ['@Password', password]]);
                    setEmail("");
                    setPassword("");
                    props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Services' }] }));
                }
            });
        }
    }

    return (
        <Container>
            <Header />
            <Content contentContainerStyle={Styles.mainContainer} >
                <Text style={Styles.H1}>Welcome.  Please Log in.</Text>
                <TextInput placeholder="Email" value={email} style={Styles.textInput} autoCompleteType="email" keyboardType="email-address" onChangeText={(value) => setEmail(value)} />
                <View style={{ marginTop: "5%" }}>
                    <TextInput placeholder="Password" value={password} secureTextEntry={true} autoCompleteType="password" style={Styles.textInput} onChangeText={(value) => { setPassword(value) }} />
                </View>

                <Ripple style={Styles.bigButton} onPress={login}>
                    <ActivityIndicator size="small" color="#FFFFFF" animating={isLoading} style={{ display: (isLoading) ? "flex" : "none" }} />
                    <Text style={[Styles.bigButtonText, { display: (isLoading) ? "none" : "flex" }]} >LOGIN</Text>
                </Ripple>
            </Content>
        </Container>
    )
}