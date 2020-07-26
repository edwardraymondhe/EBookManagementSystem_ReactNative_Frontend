import React, {useState, Component} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, FlatList, ImageBackground, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import OrderItem from '../components/orderItem';
import {Navigation} from 'react-native-navigation';

export default class Order extends Component{
    _extraUniqueKey(item ,index){ return "index"+index+item; }
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            orderItems:[]
        }
    }

    componentDidMount(){
        this.navigationEventListener = Navigation.events().bindComponent(this);
        var userId;
        AsyncStorage.getItem('@UserId', (err, res) => {

            userId = res;
            fetch(`http://192.168.175.1:8080/purchase/getPurchase?userId=${userId}`, {
                method: 'GET',
            }).then(response => response.json())
                .then((json) => {
                    // console.log('Here....' + JSON.stringify(json));
                    AsyncStorage.setItem('@Order', JSON.stringify(json));
                    this.setState({orderItems: json});
                    this.setState({isLoading: false});
                    // alert('order!' + this.state.orderItems);
                });
        });

    }

    componentWillUnmount() {
        // Unregistering listeners bound to components isn't mandatory since RNN handles the unregistration for you
        if (this.navigationEventListener) {
            this.navigationEventListener.remove();
        }
    }

    componentDidAppear(){
        console.log("Enters didDisappear");
        AsyncStorage.getItem('@Order', (err, res) => {
            this.setState({orderItems: JSON.parse(res)});
        });
    }

    render(){
        if(!this.state.isLoading) {
            return(
                <ImageBackground style={styles.bg} source={require('../assets/img/main_background_dark.jpg')}>
                    <View style={styles.order_wrapper}>
                        <FlatList data={this.state.orderItems}
                                  keyExtractor={this._extraUniqueKey}
                                  renderItem={({ item }) => (
                                      <OrderItem orderInfo={item}/>
                                  )}/>
                    </View>
                </ImageBackground>
            )
        }else{
            return(
                <ImageBackground style={styles.bg} source={require('../assets/img/main_background_dark.jpg')}>
                    <View style={styles.order_wrapper}>
                        <Text style={styles.message}>Currently nothing inside.</Text>
                    </View>
                </ImageBackground>
            )
        }
    }
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    bg:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    order_wrapper:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(252,252,252,0.2)',
        width: windowWidth,
    },
    message:{
        color: 'rgba(252,252,252,1)',
        fontFamily: 'Montserrat-Regular'
    }
});
