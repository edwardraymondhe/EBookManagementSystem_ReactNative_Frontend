import React, {useState} from 'react';
import {View, Text, StyleSheet, Dimensions, TextInput, ImageBackground} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Button, Input} from 'react-native-elements';
import { Navigation } from "react-native-navigation";
import roots from '../routes/routes';

const Panel = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginFeedBack, setLoginFeedBack] = useState(null);
    const [fetchUser, setFetchUser] = useState(null);
    const [mode, setMode] = useState('login');

    const submitLogin = () => {
        let logParam = new FormData();
        logParam.append("username", username);
        logParam.append("password", password);

        fetch('http://192.168.175.1:8080/auth/login', {
            method: 'POST',
            body: logParam,
        }).then((response) => response.json())
            .then((json) => {
                setLoginFeedBack(json);
                if(json !== -1 && json !== -2) {

                    alert('Welcome to Literature-World, ' + username);

                    /* SAVING */
                    let getParam = new FormData();
                    getParam.append("userId", json);
                    AsyncStorage.setItem('@UserId', JSON.stringify(json));


                    // Save login status
                    AsyncStorage.setItem('@Login', JSON.stringify('True'));

                    // Save current User Info
                    fetch('http://192.168.175.1:8080/user/getUser', {
                        method: 'POST',
                        body: getParam
                    }).then(response => response.json())
                        .then((json) => {
                            AsyncStorage.setItem('@User', JSON.stringify(json));
                    });
                    Navigation.setRoot(roots.mainRoot);


                    /* END SAVING */

                }else{
                    alert("I'm sorry, you're not authorized to be here.");
                    AsyncStorage.removeItem('@Login');
                }
            });
    };

    const submitRegister = () => {
        fetch(`http://192.168.175.1:8080/auth/register?username=${username}&password=${password}`, {
            method: 'GET',
        }).then(response => response.json())
            .then((json) => {
                if(json.status === 500)
                {
                    alert("User exists.");
                }else{
                    AsyncStorage.setItem('@Login', "True");
                    AsyncStorage.setItem('@User', JSON.stringify(json));
                    AsyncStorage.setItem('@UserId', JSON.stringify(json.userId));
                    alert('Welcome to Literature-World, ' + username);
                    Navigation.setRoot(roots.mainRoot);
                }
            });

    };

    if(mode === 'login') {
        return (
            <ImageBackground style={styles.bg} source={require('../assets/img/main_background_dark.jpg')}>
                <View style={styles.root}>
                    <Text style={styles.intro}># Login for Literature World #</Text>
                    <TextInput
                        style={styles.info}
                        placeholder={"What's the reader's name?"}
                        onChangeText={text => setUsername(text)}
                        value={username}
                    />
                    <TextInput
                        style={styles.info}
                        placeholder={"What's the reader's password?"}
                        onChangeText={text => setPassword(text)}
                        value={password}
                        secureTextEntry={true}
                    />
                    <Button
                        type="outline"
                        title="Login"
                        buttonStyle={styles.button}
                        titleStyle={styles.buttonTitle}
                        onPress={submitLogin}
                    />
                    <Text
                        style={styles.switch}
                        onPress={() => setMode('register')}>
                        Come and join our common interest.
                    </Text>
                </View>
            </ImageBackground>
        );
    }else{
        return(
            <ImageBackground style={styles.bg} source={require('../assets/img/main_background_dark.jpg')}>
                <View style={styles.root}>
                    <Text style={styles.intro}># Register for Literature World #</Text>
                    <TextInput
                        style={styles.info}
                        placeholder={"What's the reader's name?"}
                        onChangeText={text => setUsername(text)}
                        value={username}
                    />
                    <TextInput
                        style={styles.info}
                        placeholder={"What's the reader's password?"}
                        onChangeText={text => setPassword(text)}
                        value={password}
                        secureTextEntry={true}
                    />
                    <Button
                        type="outline"
                        title="Register"
                        buttonStyle={styles.button}
                        titleStyle={styles.buttonTitle}
                        onPress={submitRegister}
                    />
                    <Text
                        style={styles.switch}
                        onPress={() => setMode('login')}>
                        Already got an account?
                    </Text>
                </View>
            </ImageBackground>
        )
    }
};

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    bg:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    root: {
        height: windowHeight / 1.8,
        width: windowWidth * 0.95,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'whitesmoke',
        borderWidth: 0.5,
        borderColor: '#282C34',
        borderRadius: 8,
        marginBottom: windowHeight / 6,
    },
    intro: {
        flex: 1,
        fontSize: 21,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: "Montserrat-LightItalic"
    },
    info: {
        textDecorationColor: '#282C34',
        fontSize: 15,
        textAlign: 'center',
        width: windowWidth * 0.7,
        borderBottomWidth: 1,
        borderColor: 'rgba(40, 44, 52, 0.5)',
        fontFamily: "Montserrat-Regular",
        textAlignVertical: 'bottom'
    },
    button: {
        marginTop: 40,
        width: 140,
        borderColor: '#282C34',
        borderWidth: 1,
    },
    buttonTitle: {
        color: '#282C34',
        fontSize: 15,
        fontFamily: "Montserrat-Regular",
    },
    switch: {
        marginTop: 20,
        marginBottom: 50,
        fontFamily: "Montserrat-Italic",
    }
});

export default Panel;
