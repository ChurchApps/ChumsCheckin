import React from 'react'
import { View, Text, TextInput, ActivityIndicator, } from 'react-native'
import { Container, Content } from 'native-base'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CommonActions } from '@react-navigation/native';
import Ripple from 'react-native-material-ripple';
import { Header } from './components'
import { ApiHelper, Utilities, screenNavigationProps, Styles, LoginResponseInterface, StyleConstants } from "../helpers";
import Icon from 'react-native-vector-icons/Fontisto';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

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
                    const churches = data.churches?.filter(church => church.apis && church.apis?.length > 0)
                    AsyncStorage.multiSet([['@Login', 'true'], ['@Email', email], ['@Password', password], ["@UserChurches", JSON.stringify(churches)]]);
                    setEmail("");
                    setPassword("");
                    props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'SelectChurch' }] }));
                }
            });
        }
    }

    return (
        <Container style={{ backgroundColor: StyleConstants.ghostWhite }}>
            <Header />
            <Content contentContainerStyle={Styles.mainContainer} >
                <Text style={{...Styles.H1, marginTop: wp('6%')}}>Welcome.  Please Log in.</Text>
                <View style={Styles.textInputView}>
                    <Icon name={'email'} color={StyleConstants.baseColor} style={Styles.inputIcon} size={wp('4.5%')} />
                    <TextInput placeholder={'Email'} placeholderTextColor={'lightgray'} style={Styles.textInputStyle} autoCompleteType="email" keyboardType='email-address' autoCapitalize="none" value={email} onChangeText={(value) => setEmail(value)}  />
                </View>
                <View style={Styles.textInputView}>
                    <Icon name={'key'} color={StyleConstants.baseColor} style={Styles.inputIcon} size={wp('4.5%')} />
                    <TextInput placeholder={'Password'} placeholderTextColor={'lightgray'} style={Styles.textInputStyle} secureTextEntry={true} autoCapitalize="none" autoCorrect={false} keyboardType='default' value={password} onChangeText={(value) => { setPassword(value) }} />
                </View>
                <Ripple style={Styles.bigButton} onPress={login}>
                    <ActivityIndicator size="small" color="#FFFFFF" animating={isLoading} style={{ display: (isLoading) ? "flex" : "none" }} />
                    <Text style={[Styles.bigButtonText, { display: (isLoading) ? "none" : "flex" }]} >LOGIN</Text>
                </Ripple>
            </Content>
        </Container>
    )
}