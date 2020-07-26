import React, {useState, Component} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, FlatList, ImageBackground, Dimensions} from 'react-native';
import Book from '../components/book';
import AsyncStorage from '@react-native-community/async-storage';
import {Navigation} from 'react-native-navigation';

export default class BookList extends Component{
    _extraUniqueKey(item ,index){ return "index"+index+item; }
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            bookInfos:[]
        }
    }

    componentDidMount(){
        fetch('http://192.168.175.1:8080/book/getBooks', {
            method: 'GET',
        }).then((response) => response.json())
            .then((json) => {
            // console.log('Fetching...');
            console.log(json);
            this.setState({bookInfos: json});
            this.setState({isLoading: false});
            console.log(this.state.isLoading);
        });
    }

    render(){
        if(!this.state.isLoading) {
            return(
                <ImageBackground style={styles.bg} source={require('../assets/img/main_background_dark.jpg')}>
                    <View style={styles.bookList_wrapper}>
                        <FlatList data={this.state.bookInfos}
                                  keyExtractor={this._extraUniqueKey}
                                  numColumns={2}
                                  renderItem={({ item }) => (
                                <Book style={styles.book} bookInfo={item}/>
                        )}/>
                    </View>
                </ImageBackground>
            )
        }else{
            return(
                <ImageBackground style={styles.bg} source={require('../assets/img/main_background_dark.jpg')}>
                    <View style={styles.bookList_wrapper}>
                        <Text>Currently nothing inside.</Text>
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
    bookList_wrapper:{
        flex: 1,
        width: windowWidth,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(252,252,252,0.4)',
        paddingTop: 8.5
    },
    book:{
        borderRadius: 100/10,
    }
});

