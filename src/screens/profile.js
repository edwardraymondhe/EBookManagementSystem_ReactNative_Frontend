import {View, StyleSheet, ActivityIndicator, ImageBackground} from 'react-native';
import { Image, Button, Text } from 'react-native-elements';
import React, {Component} from 'react';
import { Dimensions } from 'react-native';
import { Navigation } from "react-native-navigation";
import roots from '../routes/routes';
import AsyncStorage from '@react-native-community/async-storage';

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            nickName: null,
            tel: null,
            email: null,
            userIcon: null,
            userIntro: null
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('@User', (err, res)=>{
            let user = JSON.parse(res);
            this.setState({name: user.name, nickName:user.nickName, tel:user.tel, email:user.email});
            if(user.userColl !== null) {
                 this.setState({userIcon: user.userColl.userIcon, userIntro: user.userColl.userIntro});
            }
        });
    }

    logout(){
        AsyncStorage.removeItem('@User');
        AsyncStorage.removeItem('@UserId');
        AsyncStorage.removeItem('@Login');
        Navigation.setRoot(roots.loginRoot);
    };

    render() {
        return (
            <ImageBackground style={styles.bg} source={require('../assets/img/main_background_dark.jpg')}>
                <View style={styles.profile_wrapper}>
                    <Image
                        source={{uri: this.state.userIcon}}
                        style={styles.cover}
                        containerStyle={styles.coverContainer}
                        PlaceholderContent={<ActivityIndicator/>}
                    />
                    <View style={styles.infoContainer}>
                        <Text h3 style={styles.info}>{this.state.name}</Text>
                        <Text h4 style={styles.info}>{this.state.nickName}</Text>
                        <Text style={styles.info}>{this.state.tel}</Text>
                        <Text style={styles.info}>{this.state.email}</Text>
                        <Text style={styles.info}>{this.state.userIntro}</Text>
                    </View>
                </View>
                <View style={styles.option}>
                    <Button containerStyle={styles.optionButtonCot} titleStyle={styles.optionTitle} title="EDIT"/>
                    <Button containerStyle={styles.optionButtonCot} titleStyle={styles.optionTitle} title="LOGOUT" onPress={this.logout}/>
                </View>
            </ImageBackground>
        )
    }
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    bg:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    profile_wrapper:{
        flex: 1,
        backgroundColor: 'rgba(252,252,252,0.9)',
        width: windowWidth * 0.8,
        height: windowHeight / 1.8,
        borderWidth: 0.5,
        borderRadius: 10,
        marginBottom: windowHeight / 6,
        marginTop: 15,
    },
    cover:{
        width: windowWidth,
        height: windowWidth * 0.4,
    },
    coverContainer:{
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5
    },
    infoContainer:{
        marginLeft: 10,
        marginTop: 10,
    },
    info:{
        marginLeft: 10,
        marginTop: 10,
        fontFamily: 'Montserrat-Regular',
    },
    option:{
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        width: windowWidth,
        alignSelf: 'center',
        backgroundColor: '#2289dc'
    },
    optionButtonCot:{
        width: windowWidth/2,
    },
    optionTitle:{
        fontFamily: "Montserrat-Bold"
    }
});
