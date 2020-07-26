/**
 * @format
 */

import React from 'react';
import { Navigation } from "react-native-navigation";
import roots from './src/routes/routes';
import { StyleSheet } from'react-native';
import AsyncStorage from '@react-native-community/async-storage';

console.ignoredYellowBox = ['Warning: BackAndroid is deprecated. Please use BackHandler instead.','source.uri should not be an empty string','Invalid props.style key'];
console.disableYellowBox = true;

Navigation.events().registerAppLaunchedListener(async () => {
    Navigation.setRoot(isLoggedIn()? roots.mainRoot : roots.loginRoot);
});

function isLoggedIn() {
    AsyncStorage.getItem('@Login',(err, res)=>{
        return res != null;
    });
}

const styles = StyleSheet.create({
});
