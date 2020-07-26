import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList, ImageBackground, Dimensions, TouchableOpacity} from 'react-native';
import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import CartItem from '../components/cartItem';
import { Navigation } from "react-native-navigation";

export default class Cart extends Component {
    constructor(props) {
        super(props);
        this.state={
            emptyList: true,
            selectedItems: [],
            cartItems:[],
            totPrice:0,
            sent:false,
            refresh:false,
            reEnter: false,
            isLoading:true
        }
    }

    componentDidMount() {
        this.navigationEventListener = Navigation.events().bindComponent(this);
        this.reFetch();
    }

    componentWillUnmount() {
        // Unregistering listeners bound to components isn't mandatory since RNN handles the unregistration for you
        if (this.navigationEventListener) {
            this.navigationEventListener.remove();
        }
    }

    componentDidAppear(){
        AsyncStorage.getItem('@Cart', (err, res) => {
            console.log(res);
            this.setState({cartItems: []});
            this.setState({cartItems: JSON.parse(res)});
            this.setState({selectedItems: []});
            this.setState({totPrice: 0});
            this.setState({reEnter: !this.state.reEnter});
        });
    }

    reCalc = (calcType) => {
        let _this = this;
        if (calcType === 1) {
            this.setState({refresh:true});
            setTimeout(() => {
                this.setState({refresh:false});
            }, 1000);
            AsyncStorage.getItem('@Cart', (err, res) => {
                this.setState({cartItems: JSON.parse(res)});
            });
        }

        let cartTmp;
        AsyncStorage.getItem('@Cart', (err, res) => {
            cartTmp = JSON.parse(res);
            let itemsTmp = _this.state.selectedItems;
            _this.setState({totPrice: 0});
            for(let i in itemsTmp)
            {
                fetch(`http://192.168.175.1:8080/book/getBook?bookId=${itemsTmp[i]}`,{
                    method: 'GET',
                })
                .then(response =>  response.json()).then((json) => {
                        for(let j in cartTmp) {
                            if (cartTmp[j].bookId === itemsTmp[i]) {
                                _this.setState({totTmp: _this.state.totPrice += json.price * cartTmp[j].quantity});
                                break;
                            }
                        }
                    }
                );
            }
        });

    };

    reFetch = () => {
        let _this = this;
        AsyncStorage.getItem('@UserId', (err, res) => {
            let userId = res;
            fetch(`http://192.168.175.1:8080/cart/getCart?userId=${userId}`, {
                method: 'GET',
            }).then(response => response.json())
                .then((json) => {
                    AsyncStorage.setItem('@Cart', JSON.stringify(json));
                    _this.setState({cartItems:json});
                    _this.setState({isLoading:false});
                    _this.setState({totPrice:0});
                    _this.reCalc(1);
                });
        });
    };

    selectItem = (item) => {
        let tmp = this.state.selectedItems;
        let has = tmp.indexOf(item);
        if (has >= 0) {
            tmp.splice(has, 1);
            this.setState({selectedItems: tmp});
        } else {
            tmp.push(item);
            this.setState({selectedItems: tmp});
        }
        this.setState({totPrice: 0});
        let tempTot = 0;
        let cart = this.state.cartItems;
        console.log(cart);
        for (let i in tmp) {
            fetch(`http://192.168.175.1:8080/book/getBook?bookId=${tmp[i]}`, {
                method: 'GET'
            }).then(response => response.json()).then(json => {
                for(let j in cart) {
                    if(cart[j].bookId === tmp[i]) {
                        tempTot = tempTot + json.price * cart[j].quantity;
                        this.setState({totPrice: tempTot});
                        break;
                    }
                }
            });
        }
    };

    checkout = () =>{
        let _this = this;
        console.log("In checkout");
        console.log(_this.state.selectedItems.length);
        console.log(_this.state.selectedItems);
        if(_this.state.selectedItems.length <= 0) {
            alert("You brought an empty bucket with you...?");
            return;
        }

        _this.setState({sent:true});

        AsyncStorage.getItem('@UserId', (err, res)=>{
            console.log(res);
            console.log(typeof res);
            console.log(typeof((parseInt(res))));
            let postData = new FormData();
            let userId = parseInt(res);
            postData.append('userId', parseInt(res));
            console.log(JSON.stringify(_this.state.selectedItems));
            postData.append('checkedItems', JSON.stringify(_this.state.selectedItems));
            console.log(postData);

            fetch('http://192.168.175.1:8080/purchase/updatePurchaseItems', {
                method: 'POST',
                body: postData,
            }).then((response) => response.json())
                .then((json) => {
                    setTimeout(()=> {
                        AsyncStorage.setItem('@Order', JSON.stringify(json));
                        alert("Congrats, you've just ordered what you might like.");
                        this.setState({sent:false});
                        this.reFetch();
                    },2000);
                });
        });
    };

    render = () => {
        if(!this.state.isLoading && this.state.cartItems.length > 0) {
            return(
                <ImageBackground style={styles.bg} source={require('../assets/img/main_background_dark.jpg')}>
                    <View style={styles.cart_wrapper}>
                        <FlatList extraData={this.state.reEnter}
                                  data={this.state.cartItems.slice()}
                                  keyExtractor={(item, index) => item.bookId}
                                  renderItem={({ item }) => (
                                      <View style={styles.cartItem_wrapper}>
                                          <CartItem reCalc={this.reCalc} selectItem={this.selectItem} cartInfo={item}/>
                                      </View>
                                  )}/>
                        <View style={styles.option}>
                            <Text style={styles.text}>TotalPrice: ${this.state.totPrice}</Text>
                            <Button containerStyle={styles.optionButtonCot} titleStyle={styles.optionTitle} title="CHECKOUT" onPress={this.checkout}/>
                        </View>
                    </View>
                </ImageBackground>
            )
        }else{
            return(
                <ImageBackground style={styles.bg} source={require('../assets/img/main_background_dark.jpg')}>
                    <View style={styles.cart_wrapper}>
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
    checkBox:{
        width: 20,
        color: 'black'
    },
    cart_wrapper:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(252,252,252,0.2)',
        width: windowWidth,
    },
    cartItem_wrapper:{
        display: 'flex',
        flexDirection: 'row'
    },
    message:{
        color: 'rgba(252,252,252,1)',
        fontFamily: 'Montserrat-Regular'
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
        width: windowWidth / 2,
    },
    text:{
        fontSize: 15,
        textAlign: 'center',
        alignSelf: 'center',
        fontFamily: "Montserrat-Medium",
        width: windowWidth / 2,
    }
});
