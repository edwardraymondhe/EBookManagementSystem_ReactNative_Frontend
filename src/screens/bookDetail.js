import {View, StyleSheet, ActivityIndicator, FlatList, ImageBackground} from 'react-native';
import { Image, Button, Text } from 'react-native-elements';
import React, {Component} from 'react';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';


export default class BookDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookInfo: [],
            bookColl: '',
            bookIntro: '',
        }
    }

    componentDidMount() {
        fetch(`http://192.168.175.1:8080/book/getBook?bookId=${this.props.bookId}`, {
            method: 'GET',
        }).then(response => response.json())
            .then((json) => {
                this.setState({bookInfo: json});
                this.setState({bookCover: json.bookColl.bookCover});
                this.setState({bookIntro: json.bookColl.bookIntro});
                console.log(json);
            });
    }

    render() {
        return (
            <ImageBackground style={styles.bg} source={require('../assets/img/main_background_dark.jpg')}>
                <View style={styles.book_wrapper}>
                    <Image
                        source={{uri: this.state.bookCover}}
                        style={styles.cover}
                        PlaceholderContent={<ActivityIndicator/>}
                    />
                    <View>
                        <Text h3 style={styles.info}>{this.state.bookInfo.name}</Text>
                        <Text h4 style={styles.info}>{this.state.bookInfo.author}</Text>
                        <Text style={styles.intro}>{this.state.bookIntro}</Text>
                    </View>
                    <View style={styles.option}>
                        {this.state.bookInfo.stock > 0 ? (
                            <Button containerStyle={styles.optionButtonCot} titleStyle={styles.optionTitle} title="BUY NOW"/>
                        ) : (
                            <Button containerStyle={styles.optionButtonCot} titleStyle={styles.optionTitle} title="BUY NOW"/>
                        )}
                        {this.state.bookInfo.stock > 0 ? (
                            <Button containerStyle={styles.optionButtonCot} titleStyle={styles.optionTitle} onPress={() => {this.inc()}} title="ADD TO CART"/>
                        ) : (
                            <Button containerStyle={styles.optionButtonCot} titleStyle={styles.optionTitle} title="NOT IN STOCK"/>
                        )}
                    </View>
                </View>
            </ImageBackground>
        )
    }

    inc(){
        console.log("Entered inc");
        let cart;
        let flag;
        let userId;
        AsyncStorage.getItem('@Cart', (err, res) => {
            cart = JSON.parse(res);
            for(let i in cart)
            {
                if(cart[i].bookId === this.state.bookInfo.bookId) {
                    console.log("cart");
                    console.log(cart[i].quantity);
                    console.log("stock");
                    console.log(this.state.bookInfo.stock);
                    if (cart[i].quantity === this.state.bookInfo.stock) {
                        alert("We currently don't have that much in stock.");
                        flag = true;
                    }
                }
            }
            if(!flag) {
                AsyncStorage.getItem('@UserId', (err, res) => {
                    userId = JSON.parse(res);
                    fetch(`http://192.168.175.1:8080/cart/updateCart?userId=${userId}&bookId=${this.state.bookInfo.bookId}&quantity=-1`, {
                        method: 'GET',
                    }).then(response => response.json())
                        .then((json) => {
                            AsyncStorage.removeItem('@Cart');
                            AsyncStorage.setItem('@Cart', JSON.stringify(json));
                            AsyncStorage.getItem('@Cart', (err, res) => {console.log(res)});
                        });
                });
            }
        });

    }
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    bg:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    book_wrapper:{
        flex: 1,
        width: windowWidth
    },
    cover:{
        width: windowWidth,
        height: windowWidth,
    },
    info:{
        marginLeft: 10,
        marginTop: 5,
        fontFamily: "Montserrat-Bold",
        color: 'rgba(252,252,252, 0.9)'
    },
    intro:{
        fontSize: 15,
        marginLeft: 10,
        marginTop: 5,
        color: 'rgba(252,252,252, 0.9)'
    },
    option:{
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        width: windowWidth,
        alignSelf: 'center',
        backgroundColor: '#2289dc',
    },
    optionButtonCot:{
        width: windowWidth/2,
    },
    optionTitle:{
        fontFamily: "Montserrat-Bold"
    }
});
