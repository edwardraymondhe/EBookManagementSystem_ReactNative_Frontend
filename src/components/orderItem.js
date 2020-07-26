import React, {Component} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';

export default class OrderItem extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    };

    render() {
        return (
            <View style={styles.orderItem_wrapper}>
                <Text style={styles.info}>OrderNo.{this.props.orderInfo.purchaseId}</Text>
                <Text style={styles.info}>TotalPrice:  ${this.props.orderInfo.totalPrice}</Text>
            </View>
        )
    }
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    orderItem_wrapper:{
        width: windowWidth - 20,
        height: 85,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(252,252,252,0.9)',
        borderRadius: 10,
        marginTop: 15,
    },
    info:{
        width: windowWidth/2,
        paddingLeft: 40,
        fontSize: 15,
        fontFamily: 'Montserrat-Regular'
    }
});
