import React, {Component} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Image, Button, CheckBox} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class CartItem extends Component{
    constructor(props) {
        super(props);
        this.state={
            bookId:0,
            quantity:0,
            name:'',
            price:0,
            author:'',
            language:'',
            userId:0,
            cover:'',
            selected: false,
            stock: 0,
        }
    }

    componentDidMount(){
        console.log("cartItem did mount");
        this.setState({bookId: this.props.cartInfo.bookId});
        this.setState({quantity:this.props.cartInfo.quantity});
        AsyncStorage.getItem('@UserId', (err, res)=>{
            this.setState({userId:res});

            fetch(`http://192.168.175.1:8080/book/getBook?bookId=${this.props.cartInfo.bookId}`,{
                method: 'GET'
            }).then(response => response.json())
                .then((json) => {
                    this.setState({stock:json.stock, name:json.name, author:json.author, price:json.price, language:json.language, cover:json.bookColl.bookCover});
                    console.log(this.state.cover);
                });
        });
    }


    inc(){
        if(this.state.quantity < this.state.stock) {
            let quantity = this.state.quantity + 1;
            this.setState({quantity: quantity});
            this.watchQuantity(quantity);
        }else
        {
            alert("We currently don't have that much in stock.");
        }

    }

    dec(){
        let quantity = this.state.quantity - 1;
        this.setState({quantity: quantity});
        this.watchQuantity(quantity);
    }

    selectItem(){
        this.setState({selected: !this.state.selected});
        this.props.selectItem(this.state.bookId);
    }

    watchQuantity(quantity){
        fetch(`http://192.168.175.1:8080/cart/updateCart?userId=${this.state.userId}&bookId=${this.state.bookId}&quantity=${quantity}`, {
            method: 'GET',
        }).then(response => response.json())
            .then((json) => {
                // console.log('Here....' + JSON.stringify(json));
                AsyncStorage.setItem('@Cart', JSON.stringify(json));
                if(this.state.quantity !== 0)
                    this.props.reCalc(0);
                else
                    this.props.reCalc(1);
            });
    }

    render(){
        let cartItem_wrapper = {
                width: windowWidth - 50,
                height: 170,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: this.state.selected? 'rgba(252,252,252,0.9)' : 'rgba(252,252,252,0.4)',
                borderRadius: 10,
                marginTop: 15,
            };
        return(
            <View style={cartItem_wrapper}>
                <View style={styles.info}>
                    <TouchableOpacity
                        activeOpacity={0.5} onPress={() => {this.selectItem()}}>
                    <Image
                        source={{ uri: this.state.cover }}
                        style={styles.cover}
                        PlaceholderContent={<ActivityIndicator />}
                    />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.text}>{this.state.name}</Text>
                        <Text style={styles.text}>{this.state.language}/{this.state.author}</Text>
                    </View>

                </View>
                <View style={styles.control}>
                    <Button icon={<Icon name="plus" size={12} color="#282C34"/>}
                            type="outline"
                            onPress={()=>{this.inc()}} buttonStyle={styles.button} titleStyle={styles.buttonTitle}/>
                    <Text style={styles.quantity}>{this.state.quantity}</Text>
                    <Button icon={<Icon name="minus" size={12} color="#282C34"/>}
                            type="outline"
                            onPress={()=>{this.dec()}} buttonStyle={styles.button} titleStyle={styles.buttonTitle}/>
                </View>
            </View>
        )
    }
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    info:{
        flex: 2,
        marginLeft: 20,
    },
    text:{
        fontFamily: 'Montserrat-Regular'
    },
    cover:{
        width: 'auto',
        height: 100
    },
    control:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantity:{
        width: 20,
        margin: 10,
        textAlign: 'center'
    },
    button:{
        width: 25,
        height: 25,
        borderRadius: 30,
        borderColor: '#282C34'
    },
    buttonTitle:{
        textAlignVertical: 'center',
        textAlign: 'center'
    }
});

