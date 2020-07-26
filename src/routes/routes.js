import {Navigation} from 'react-native-navigation';
import PanelScreen from '../screens/panel';
import BookListScreen from '../screens/bookList';
import BookDetailScreen from '../screens/bookDetail';
import CartScreen from '../screens/cart';
import OrderScreen from '../screens/order';
import ProfileScreen from '../screens/profile';

Navigation.registerComponent('Panel', () => PanelScreen);
Navigation.registerComponent('BookList', () => BookListScreen);
Navigation.registerComponent('BookDetail', () => BookDetailScreen);
Navigation.registerComponent('Cart', () => CartScreen);
Navigation.registerComponent('Order', () => OrderScreen);
Navigation.registerComponent('Profile', () => ProfileScreen);


const roots = {

    loginRoot : {
            root: {
                component: {
                    name: 'Panel'
                }
            }
        },

    mainRoot : {
        root: {
            bottomTabs: {
                id: 'MainStack',
                    children: [
                    {
                        stack: {
                            id: 'BookList_Tab',
                            children: [
                                {
                                    component: {
                                        id: 'BookList',
                                        name: 'BookList'
                                    }
                                }
                            ],
                            options: {
                                bottomTab: {
                                    icon: require('../assets/img/home.png'),
                                    iconColor: '#C4C1C0',
                                },
                                topBar: {
                                    title: {
                                        text: 'EBook Home',
                                        fontFamily: "Montserrat-Medium"
                                    },
                                }
                            }
                        }
                    },
                    {
                        stack: {
                            id: 'Cart_Tab',
                            children: [
                                {
                                    component: {
                                        id: 'Cart',
                                        name: 'Cart'
                                    }
                                }
                            ],
                            options: {
                                bottomTab: {
                                    icon: require('../assets/img/cart.png'),
                                    iconColor: '#C4C1C0',
                                },
                                topBar: {
                                    title: {
                                        text: 'Your Cart',
                                        fontFamily: "Montserrat-Medium"
                                    }
                                }
                            }
                        }
                    },
                    {
                        stack: {
                            id: 'Order_Tab',
                            children: [
                                {
                                    component: {
                                        id: 'Order',
                                        name: 'Order'
                                    }
                                }
                            ],
                            options: {
                                bottomTab: {
                                    icon: require('../assets/img/order.png'),
                                    iconColor: '#C4C1C0',
                                },
                                topBar: {
                                    title: {
                                        text: 'Your Order',
                                        fontFamily: "Montserrat-Medium"
                                    }
                                },
                            }
                        }
                    },
                    {
                        stack: {
                            id: 'Profile_Tab',
                            children: [
                                {
                                    component: {
                                        id: 'Profile',
                                        name: 'Profile'
                                    }
                                }
                            ],
                            options: {
                                bottomTab: {
                                    icon: require('../assets/img/profile.png'),
                                    iconColor: '#C4C1C0',
                                },
                                topBar: {
                                    title: {
                                        text: 'Your Profile',
                                        fontFamily: "Montserrat-Medium"
                                    }
                                }
                            }
                        }
                    }
                ],
            }
        }
    }
};

export default roots;
