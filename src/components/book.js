import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions} from 'react-native';
import { Image } from 'react-native-elements';
import { Navigation } from "react-native-navigation";

const Book = (item) => {
    return (
        <TouchableOpacity activeOpacity={0.5} onPress={() =>Navigation.push('BookList_Tab', {
            component: {
                name: 'BookDetail',
                passProps: {
                    bookId: item.bookInfo.bookId,
                },
                options: {
                    topBar: {
                        title: {
                            text: 'Book Detail',
                            fontFamily: "Montserrat-Medium"
                        },
                    },
                    bottomTabs: {
                        visible: false
                    },
                }
            }
        })}
        >
            <View
                style={styles.book_wrapper}
            >
                <Image
                    source={{ uri: item.bookInfo.bookColl.bookCover }}
                    style={styles.cover}
                    containerStyle={{borderTopRightRadius: 10, borderTopLeftRadius:10}}
                    PlaceholderContent={<ActivityIndicator />}
                />
                <Text style={styles.name}>{item.bookInfo.name}</Text>
                <Text style={styles.price}>${item.bookInfo.price}</Text>
            </View>
        </TouchableOpacity>
    )
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    book_wrapper:{
        width: windowWidth / 2 - 20,
        height: windowWidth / 1.6,
        margin: 6.5,
        borderRadius: 100/10,
        backgroundColor: '#FCFCFC'
    },
    name:{
        marginLeft: 10,
        fontFamily: "Montserrat-Medium"
    },
    price:{
        marginLeft: 10,
        fontFamily: "Montserrat-SemiBold",
        color: 'orange'
    },
    cover:{
        width: 200,
        height: 200,
        marginBottom: 3
    }

});

export default Book;
