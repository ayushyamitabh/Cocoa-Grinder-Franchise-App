import React, {Component} from 'react';
import {Alert,
        Animated,
        Dimensions,
        Image,
        Picker,
        ScrollView,
        StyleSheet,
        StatusBar,
        Text,
        TextInput,
        View } from 'react-native';
import {StackNavigator} from 'react-navigation';
import {Button, 
        BottomNavigation,
        Card, 
        Divider,
        COLOR, 
        ListItem,
        ThemeProvider, 
        Toolbar
        } from 'react-native-material-ui';
import * as firebase from 'firebase';

const uiTheme = {
    palette: {
        primaryColor: COLOR.blue400,
    },
    toolbar: {
        container: {
            height: 50,
        },
    },
};

class ShopHome extends Component {
    static navigationOptions = {
        tabBarLabel: 'Shop',
        header: null
    };
    constructor (props) {
        super(props);
        this.state = {
            types: []
        }
    }
    componentWillMount () {
        firebase.database().ref('Inventory').once('value', (snap)=>{
            var hold = [];
            Object.keys(snap.val()).map((key, index)=>{
                hold.push(key);
            })
            this.setState({
                types: hold
            })
        });
    }
    render() {
        return (
            <ThemeProvider uiTheme={uiTheme}> 
                    <ScrollView contentContainerStyle={{display:'flex',paddingTop:25,paddingBottom:25, alignItems:'center'}} >
                        {
                            this.state.types.map((data,index)=>{
                                return(
                                    <Card 
                                        style={{
                                            container: {
                                                width: Dimensions.get('window').width/100 * 80
                                            }
                                        }}
                                        key={`type${index}`}
                                        onPress={()=>{
                                            this.props.navigation.navigate('Items', {type: data});
                                        }}
                                    >
                                        <Text
                                            style={{
                                                textAlign:'center',
                                                fontSize:18,
                                                paddingTop:10,
                                                paddingBottom:10
                                            }}
                                        >
                                            {
                                                data === 'SaucesDressings'?
                                                'Sauces & Dressings' :
                                                data === 'VeggiesFruits'?
                                                'Veggies & Fruits' :
                                                data === 'SyrupsSugars'?
                                                'Syrups & Sugars':
                                                data
                                            }
                                        </Text>
                                    </Card>
                                );
                            })
                        }
                    </ScrollView>
            </ThemeProvider>
        );
    }
}

class TypeItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            notify: false,
            notifyMsg: ''
        };
    }
    componentWillMount(){
        var itemType = this.props.navigation.state.params.type;        
        firebase.database().ref(`Inventory/${itemType}`).once('value', (snap)=>{
            this.setState({
                items: snap.val()
            })
        })
    }
    addToCart (item, type, quantity) {
        if (!quantity) quantity = 1;
        firebase.database().ref(`Users/${firebase.auth().currentUser.uid}/cart`).once('value', (cartSnap)=>{
            if (cartSnap.val()) {
                var cart = cartSnap.val();
                if (cart.hasOwnProperty(item.toString())){ // if cart exists and some quantity of item exists
                    var newQuantity = parseInt(cart[item][type]) + parseInt(quantity);
                    cart[item][type] = newQuantity;
                } else { // if cart exists but this item isn't in the cart yet
                    cart[item] = {
                        [type] : quantity
                    };
                    if (type === 'case') {
                        cart[item].singles = 0;
                    } else {
                        cart[item].case = 0;
                    }
                }
                firebase.database().ref(`Users/${firebase.auth().currentUser.uid}/cart`).set(cart).then(()=>{
                    this.setState({
                        notify:true,
                        notifyMsg: `Added ${quantity} x ${type} of ${item} to your cart.`
                    })
                    setTimeout(()=>{this.setState({notify:false,notifyMsg:''})}, 3000);
                }).catch((error)=>{
                    // something went wrong
                });
            } else { // if cart doesn't exist
                var cart = {
                    [item] : {
                        [type] : quantity
                    }
                };
                if (type === 'case') {
                    cart[item].singles = 0;
                } else {
                    cart[item].case = 0;
                }
                firebase.database().ref(`Users/${firebase.auth().currentUser.uid}/cart`).set(cart).then(()=>{
                    this.setState({
                        notify:true,
                        notifyMsg: `Added ${quantity} x ${type} of ${item} to your cart.`
                    })
                    setTimeout(()=>{this.setState({notify:false,notifyMsg:''})}, 3000);
                }).catch((error)=>{
                    // something went wrong
                });
            }
        })
    }
    render () {
        var itemType = this.props.navigation.state.params.type;
        return (
            <ThemeProvider uiTheme={uiTheme}>
                <View
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    {
                        this.state.notify ? 
                        <View 
                            style={{
                                backgroundColor:COLOR.blue400, 
                                width:Dimensions.get('window').width,
                                paddingTop: 5,
                                paddingBottom: 5
                            }}
                        >
                            <Text 
                                style={{
                                    color:COLOR.white, 
                                    textAlign:'center'
                                }}
                            >
                                {this.state.notifyMsg}
                            </Text>
                        </View> :
                        null
                    }
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 20,
                            marginBottom: 10,
                            marginTop: 10
                        }}
                    >
                        {
                            itemType === 'SaucesDressings'?
                            'Sauces & Dressings' :
                            itemType === 'VeggiesFruits'?
                            'Veggies & Fruits' :
                            itemType === 'SyrupsSugars'?
                            'Syrups & Sugars':
                            itemType
                        }
                    </Text>
                    <Button 
                        style={{
                            container: {
                                width: Dimensions.get('window').width/100 * 75,
                                marginBottom: 5
                            }
                        }}
                        accent
                        raised
                        text='Back To Store'
                        onPress={()=>{this.props.navigation.goBack()}}
                    />
                    <ScrollView
                        style={{
                            width: Dimensions.get('window').width
                        }}
                        contentContainerStyle={{
                            paddingLeft: 5,
                            paddingRight: 5,
                            paddingBottom: 40,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        {
                            this.state.items.map((data, index)=>{
                                return (
                                    <Card key={`item${index}`} style={{container:{padding:10,width:Dimensions.get('window').width/100 * 75,display:'flex',justifyContent:'center',alignItems:'center', flexDirection:'column'}}}>
                                        <Text style={{textAlign:'center',fontSize:18}}>{data}</Text>
                                        <TextInput style={{textAlign:'center',width:Dimensions.get('window').width/100 * 50}} keyboardType='numeric' ref={`quantity${index}`} placeholder='1' />
                                        <View style={{display:'flex',flexDirection:'row'}}>
                                            <Button primary text={'+ Single(s)'} style={{container:{flex:1}}} onPress={()=>{this.addToCart(data,'singles',this.refs[`quantity${index}`]._lastNativeText)}}/>
                                            <Button accent text={'+ Case(s)'} style={{container:{flex:1}}} onPress={()=>{this.addToCart(data,'case',this.refs[`quantity${index}`]._lastNativeText)}}/>
                                        </View>
                                    </Card>
                                );
                            })
                        }
                    </ScrollView>
                </View>
            </ThemeProvider>
        );
    }
}

export default Shop = StackNavigator({
    ShopHome: { screen: ShopHome, navigationOptions:({navigation})=>({title:'Shop',header:null})  },
    Items: { screen: TypeItems, navigationOptions:({navigation})=>({title:'Shop',header:null})  }
},{
    index: 0,
    initialRouteName: 'ShopHome',
    navigationOptions: {
        gesturesEnabled: false
    }
});