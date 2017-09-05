import React, {Component} from 'react';
import { Alert,
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
import { Button, 
        BottomNavigation,
        Card, 
        Divider,
        COLOR, 
        ListItem,
        ThemeProvider, 
        Toolbar
        } from 'react-native-material-ui';
import * as firebase from 'firebase';

export default class User extends Component {
    constructor (props) {
        super(props);
        this.state = {
            data: {},
            inventory: {},
            cart: {},
            changed: false,
            emailChanged: false,
            passwordChanged: false,
            loading: true,
            active: 'shop',
            notify:false,
            notifyMsg: ''
        };
        this.saveChanges = this.saveChanges.bind(this);
        this.placeOrder = this.placeOrder.bind(this);
    }
    componentDidMount () {
        var uid = firebase.auth().currentUser.uid;
        firebase.database().ref(`Users/${uid}`).on('value', (snap)=>{
            if (snap.val()) {
                var userData = snap.val();
                this.setState({
                    data: userData
                });
            } else {
                Alert.alert('Data Fetch Error', 
                'We were unable to fetch your data. Please check your internet connection or try logging out and logging back in.', 
                [{text:'Logout',onPress:()=>{this.props.logout}},{text:'Ok',onPress: ()=>{}}],
                {cancelable:false});
                this.setState({loading:false})
            }
        });
        firebase.database().ref('Inventory').once('value', (snap)=>{
            this.setState({
                inventory: snap.val(),
                loading: false
            });
        });
        firebase.database().ref(`Users/${uid}/cart`).on('value', (snap)=>{
            if (snap.val()) {
                this.setState({
                    cart: snap.val()
                })
            }
        })
    }
    saveChanges () {
        firebase.database().ref(`Users/${firebase.auth().currentUser.uid}`).set(this.state.data).then(()=>{
            Alert.alert('Save Success', 'Successfully updated your data.',[{text:'Ok', onPress: null}],{cancelable:false});
            this.setState({
                changed: false
            })
            if (this.state.passwordChanged === true) {
                firebase.auth().currentUser.updatePassword(this.state.data.loginpassword).then(()=>{
                    this.setState({passwordChanged:false})
                }).catch((error)=>{
                    Alert.alert('Update Password', 'There was an error trying to update your password.',[{text:'Ok', onPress: null}],{cancelable:false});
                });
            }
            if (this.state.emailChanged === true) {
                firebase.auth().currentUser.updateEmail(this.state.data.loginemail).then(()=>{
                    this.setState({emailChanged:false})
                }).catch((error)=>{
                    Alert.alert('Update E-Mail', 'There was an error trying to update your email.',[{text:'Ok', onPress: null}],{cancelable:false});
                });
            }
        }).catch((error)=>{
            Alert.alert('Save Error', `We couldn't save your data. Error message: ${error.message}`,[{text:'Ok', onPress: null}],{cancelable:false});
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
    placeOrder () {
        var orderData = {
            cart: this.state.cart,
            user: firebase.auth().currentUser.uid,
            confirmed: false
        };
        firebase.database().ref(`Orders/nextNumber`).once('value', (numSnap)=>{
            var nextNumber = numSnap.val();
            nextNumber = parseInt(nextNumber);
            var updatedNumber = nextNumber + 1;
            firebase.database().ref('Orders/nextNumber').set(updatedNumber);
            firebase.database().ref(`Orders/${nextNumber}`).set(orderData);
            firebase.database().ref(`Users/${firebase.auth().currentUser.uid}/orders`).once('value', (snap)=>{
                if (snap.val()) {
                    var newOrders = snap.val();
                    newOrders.push(nextNumber);
                    firebase.database().ref(`Users/${firebase.auth().currentUser.uid}/orders`).set(newOrders);
                } else {
                    firebase.database().ref(`Users/${firebase.auth().currentUser.uid}/orders`).set([nextNumber]);                    
                }
            });
            firebase.database().ref(`Users/${firebase.auth().currentUser.uid}/cart`).set({});
        })
    }
    render() {
        return(
            <View style={{display:'flex',flexDirection:'column',height:Dimensions.get('window').height - 75,justifyContent:'flex-end'}}>
                {
                    this.state.loading === true ? <Text style={{textAlign:'center',backgroundColor:COLOR.red700,color:COLOR.white,paddingTop:10,paddingBottom:10}}>{'Loading...please wait'}</Text> : null
                }
                {
                    this.state.notify === true ? <Text style={{textAlign:'center',backgroundColor:COLOR.blue200,color:COLOR.white,paddingTop:10,paddingBottom:10}}>{this.state.notifyMsg}</Text> : null                    
                }
                {
                    !this.state.loading && this.state.active === 'account' ?
                    <ScrollView contentContainerStyle={{display: 'flex', alignItems:'center',backgroundColor:COLOR.grey300,paddingTop:25,paddingBottom:25}}>
                        <Button raised accent onPress={this.props.logout} text={'LOGOUT'} style={{container:{width:Dimensions.get('window').width/100 * 85,marginBottom:10}}}/>
                        <Button raised primary onPress={this.saveChanges} text={'SAVE CHANGES'} style={{container:{width:Dimensions.get('window').width/100 * 85,marginBottom:10}}} disabled={!this.state.changed}/>                        
                        <Card style={{container:{padding:15}}}>
                            <Text style={styles.sectionTitle}>LOGIN INFORMATION</Text>
                            <Divider />
                            <TextInput  
                                ref='username'
                                blurOnSubmit={true}                                 
                                onChangeText={(t)=>{var dat = this.state.data; dat.username = t; this.setState({data:dat,changed:true})}}
                                value={this.state.data.username}
                                placeholder="Full Name / Username"
                                style={styles.input}
                            />
                            <TextInput  
                                keyboardType="email-address"
                                ref='loginemail'
                                blurOnSubmit={true}                                 
                                onChangeText={(t)=>{var dat = this.state.data; dat.loginemail = t; dat.confirmemail = t; this.setState({data:dat,changed:true,emailChanged:true})}}
                                value={this.state.data.loginemail}                
                                placeholder="Login Email"
                                style={styles.input}
                            />
                            <TextInput
                                ref='loginpassword'
                                blurOnSubmit={true}                                 
                                onChangeText={(t)=>{var dat = this.state.data; dat.loginpassword = t; dat.confirmpassword = t; this.setState({data:dat,changed:true,passwordChanged:true})}}
                                value={this.state.data.loginpassword}
                                placeholder="Login Password"
                                style={styles.input}
                            />
                        </Card>
                        <Card style={{container:{padding:15}}}>
                            <Text style={styles.sectionTitle}>PERSONAL / BUSINESS INFORMATION</Text>
                            <Divider />
                            <TextInput  
                                ref='bname'
                                blurOnSubmit={true}                                 
                                onChangeText={(t)=>{var dat = this.state.data; dat.bname = t; this.setState({data:dat,changed:true})}}
                                value={this.state.data.bname}
                                placeholder="Legal Business Name"
                                style={styles.input}
                            />
                            <TextInput  
                                ref='tname'
                                blurOnSubmit={true}                                 
                                onChangeText={(t)=>{var dat = this.state.data; dat.tname = t; this.setState({data:dat,changed:true})}}
                                value={this.state.data.tname}
                                placeholder="Business Trade Name"
                                style={styles.input}
                            />
                            <TextInput  
                                ref='address'
                                blurOnSubmit={true}                                 
                                onChangeText={(t)=>{var dat = this.state.data; dat.address = t; this.setState({data:dat,changed:true})}}
                                value={this.state.data.address}
                                placeholder="Address"
                                style={styles.input}
                            />
                            <TextInput  
                                ref='city'
                                blurOnSubmit={true}                                 
                                onChangeText={(t)=>{var dat = this.state.data; dat.city = t; this.setState({data:dat,changed:true})}}
                                value={this.state.data.city}
                                placeholder="City"
                                style={styles.input}
                            />
                            <TextInput  
                                ref='state'
                                blurOnSubmit={true}                                 
                                onChangeText={(t)=>{var dat = this.state.data; dat.state = t; this.setState({data:dat,changed:true})}}
                                value={this.state.data.state}
                                placeholder="State"
                                style={styles.input}
                            />
                            <TextInput  
                                keyboardType="numeric"
                                ref='zip'
                                blurOnSubmit={true}                                 
                                onChangeText={(t)=>{var dat = this.state.data; dat.zip = t; this.setState({data:dat,changed:true})}}
                                value={this.state.data.zip}
                                placeholder="Zip"
                                style={styles.input}
                            />
                            <TextInput  
                                keyboardType="phone-pad"
                                ref='lphone'
                                blurOnSubmit={true}                                 
                                onChangeText={(t)=>{var dat = this.state.data; dat.lphone = t; this.setState({data:dat,changed:true})}}
                                value={this.state.data.lphone}
                                placeholder="Location Phone"
                                style={styles.input}
                            />
                            <TextInput  
                                ref='contact'
                                blurOnSubmit={true}                                 
                                onChangeText={(t)=>{var dat = this.state.data; dat.contact = t; this.setState({data:dat,changed:true})}}
                                value={this.state.data.contact}
                                placeholder="Primary Contact"
                                style={styles.input}
                            />
                            <TextInput  
                                keyboardType="phone-pad"
                                ref='phone'
                                blurOnSubmit={true}                                 
                                onChangeText={(t)=>{var dat = this.state.data; dat.phone = t; this.setState({data:dat,changed:true})}}
                                value={this.state.data.phone}
                                placeholder="Primary Phone"
                                style={styles.input}
                            />
                            <TextInput  
                                ref='altcontact'
                                blurOnSubmit={true}
                                 
                                onChangeText={(t)=>{var dat = this.state.data; dat.altcontact = t; this.setState({data:dat,changed:true})}}
                                value={this.state.data.altcontact}
                                placeholder="Alternate Contact"
                                style={styles.input}
                            />
                            <TextInput  
                                keyboardType="phone-pad"
                                ref='altphone'
                                blurOnSubmit={true}                                 
                                onChangeText={(t)=>{var dat = this.state.data; dat.altphone = t; this.setState({data:dat,changed:true})}}
                                value={this.state.data.altphone}
                                placeholder="Alternate Phone"
                                style={styles.input}
                            />
                            <TextInput  
                                keyboardType="email-address"
                                ref='email'
                                blurOnSubmit={true}                                 
                                onChangeText={(t)=>{var dat = this.state.data; dat.email = t; this.setState({data:dat,changed:true})}}
                                value={this.state.data.email}
                                placeholder="E-Mail"
                                style={styles.input}
                            />
                        </Card>
                        <Card style={{container:{padding:15}}}>
                            <Text style={styles.sectionTitle}>BILLING INFORMATION</Text>
                            <Divider />
                            <TextInput  
                                ref='billingcontact'
                                blurOnSubmit={true}                                 
                                onChangeText={(t)=>{var dat = this.state.data; dat.billingcontact = t; this.setState({data:dat,changed:true})}}
                                value={this.state.data.billingcontact}
                                placeholder="Billing Contact"
                                style={styles.input}
                            />
                            <TextInput  
                                keyboardType="phone-pad"
                                ref='billingphone'
                                blurOnSubmit={true}                                 
                                onChangeText={(t)=>{var dat = this.state.data; dat.billingphone = t; this.setState({data:dat,changed:true})}}
                                value={this.state.data.billingphone}
                                placeholder="Billing Phone"
                                style={styles.input}
                            />
                            <TextInput
                                ref='billingemail'
                                keyboardType="email-address"
                                blurOnSubmit={true}                                
                                onChangeText={(t)=>{var dat = this.state.data; dat.billingemail = t; this.setState({data:dat,changed:true})}}
                                value={this.state.data.billingemail}
                                placeholder="Billing E-Mail"
                                style={styles.input}
                            />
                            <TextInput
                                ref='taxitin'
                                blurOnSubmit={true}                                 
                                editable={false}
                                value={this.state.data.tax ? `TAX ID: ${this.state.data.tax}` : `ITIN ID: ${this.state.data.itin}`}
                                style={styles.input}
                            />
                            <Picker
                                ref='btype'
                                selectedValue={this.state.data.btype}
                                onValueChange={(value, index)=>{
                                    var dat = this.state.data;
                                    dat.btype = value;
                                    this.setState({
                                        data:dat
                                    });
                                }}
                            >
                                <Picker.Item value='btype' label='Business Type' />
                                <Picker.Item value='Restaurant' label='Restaurant' />
                                <Picker.Item value='Cafe' label='Cafe' />
                                <Picker.Item value='Bakery' label='Bakery' />
                                <Picker.Item value='University' label='University' />
                                <Picker.Item value='School' label='School' />
                                <Picker.Item value='Retail' label='Retail' />
                                <Picker.Item value='Manufacturer' label='Manufacturer' />
                                <Picker.Item value='Distributor' label='Distributor' />
                                <Picker.Item value='Corporate' label='Corporate' />
                                <Picker.Item value='Caterer' label='Caterer' />
                                <Picker.Item value='Non-Profit' label='Non-Profit' />                        
                            </Picker>
                        </Card>
                        <Card style={{container:{padding:15}}}>
                            <Text style={styles.sectionTitle}>DELIVERY INFORMATION</Text>
                            <Divider />
                            <TextInput 
                                ref='delcontact'
                                blurOnSubmit={true}                                 
                                onChangeText={(t)=>{var dat = this.state.data; dat.delcontact = t; this.setState({data:dat,changed:true})}}
                                value={this.state.data.delcontact}
                                placeholder="Delivery Contact"
                                style={styles.input}
                            />
                            <TextInput 
                                ref='deladdress'
                                blurOnSubmit={true}                                 
                                onChangeText={(t)=>{var dat = this.state.data; dat.deladdress = t; this.setState({data:dat,changed:true})}}
                                value={this.state.data.deladdress}
                                placeholder="Delivery Address"
                                style={styles.input}
                            />
                            <TextInput 
                                ref='delcity'
                                blurOnSubmit={true}                                 
                                onChangeText={(t)=>{var dat = this.state.data; dat.delcity = t; this.setState({data:dat,changed:true})}}
                                value={this.state.data.delcity}
                                placeholder="City"
                                style={styles.input}
                            />
                            <TextInput 
                                ref='delstate'
                                blurOnSubmit={true}
                                onChangeText={(t)=>{var dat = this.state.data; dat.delstate = t; this.setState({data:dat,changed:true})}}
                                value={this.state.data.delstate}
                                placeholder="State"
                                style={styles.input}
                            />
                            <TextInput 
                                ref='delzip'
                                blurOnSubmit={true}
                                keyboardType='numeric'                                 
                                onChangeText={(t)=>{var dat = this.state.data; dat.delzip = t; this.setState({data:dat,changed:true})}}
                                value={this.state.data.delzip}
                                placeholder="Zip Code"
                                style={styles.input}
                            />
                            <TextInput 
                                keyboardType="phone-pad"
                                ref='delphone'
                                blurOnSubmit={true}                                 
                                onChangeText={(t)=>{var dat = this.state.data; dat.delphone = t; this.setState({data:dat,changed:true})}}
                                value={this.state.data.delphone}
                                placeholder="Delivery Phone"
                                style={styles.input}
                            />
                            <TextInput 
                                ref='deltime'
                                blurOnSubmit={true}                                 
                                onChangeText={(t)=>{var dat = this.state.data; dat.deltime = t; this.setState({data:dat,changed:true})}}
                                value={this.state.data.deltime}
                                placeholder="Receiving Hours"
                                style={styles.input}
                            />
                            <TextInput
                                ref='deldetails'
                                blurOnSubmit={true}
                                multiline={true}
                                numberOfLines={3}
                                onChangeText={(t)=>{var dat = this.state.data; dat.deldetails = t; this.setState({data:dat,changed:true})}}
                                value={this.state.data.deldetails}
                                placeholder="Details or Special Instructions"
                                style={styles.input}
                            />
                        </Card>
                    </ScrollView> :
                    !this.state.loading && this.state.active === 'shop' ?
                    <ScrollView contentContainerStyle={{alignItems:'center',paddingTop:10,paddingBottom:10,backgroundColor:COLOR.grey300}}>
                        {   
                            this.state.showTypes === true ? 
                            <View>
                                {
                                    this.state.inventory[this.state.showKey].map((data,index)=>{
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
                            </View>:
                            Object.keys(this.state.inventory).map((key, index) => {
                                return (
                                    <View key={`type${index}`} style={{width:Dimensions.get('window').width/100 * 85}}>
                                        <ListItem 
                                            divider 
                                            centerElement={
                                                key === 'SaucesDressings' ? 'Sauces & Dressings' : 
                                                key === 'SyrupsSugars' ? 'Syrups & Sugars' :
                                                key === 'VeggiesFruits' ? 'Veggies & Fruits' :
                                                key
                                            } 
                                            onPress={()=>{this.setState({showTypes:true,showKey:key})}} 
                                            style={this.state[key] === true ? {container:{backgroundColor:COLOR.lightBlue300}}:{}}/>
                                    </View>
                                );
                            })
                        }
                    </ScrollView> :
                    !this.state.loading && this.state.active === 'cart' ?
                    <ScrollView contentContainerStyle={{ display: 'flex', alignItems:'center', paddingTop:25, paddingBottom:25}}>
                        <Button 
                            disabled={Object.keys(this.state.cart).length > 0 ? false : true}
                            accent
                            primary
                            text={'EMPTY CART'} 
                            style={{
                                container:{
                                    width: Dimensions.get('window').width/100 * 75
                                }
                            }}
                            onPress={()=>{
                                firebase.database().ref(`Users/${firebase.auth().currentUser.uid}/cart`).set({}).then(()=>{
                                    this.setState({
                                        notify:true,
                                        notifyMsg:'Emptied your cart.',
                                        cart: {}
                                    })
                                    setTimeout(()=>{this.setState({notify:false,notifyMsg:''})}, 3000);
                                })
                            }} 
                        />
                        <Button 
                            disabled={Object.keys(this.state.cart).length > 0 ? false : true}
                            raised
                            primary
                            text={'PLACE ORDER'} 
                            style={{
                                container:{
                                    width: Dimensions.get('window').width/100 * 75
                                }
                            }}
                            onPress={this.placeOrder}
                        />
                       {
                            Object.keys(this.state.cart).map((key, index)=>{
                                return (
                                    <Card key={`item${index}`} style={{container:{padding:10,width:Dimensions.get('window').width/100 * 75,display:'flex',justifyContent:'center',alignItems:'center', flexDirection:'column'}}}>
                                        <Text style={{textAlign:'center',fontSize:18}}>{key}</Text>
                                        <View style={{display:'flex', flexDirection: 'row', justifyContent: 'center', alignContent: 'center'}}>
                                            <TextInput style={{textAlign:'center',marginLeft:5, marginRight:5, flex: 1}} value={this.state.cart[key].singles.toString()} editable={false}/>
                                            <TextInput style={{textAlign:'center',marginLeft:5, marginRight:5, flex: 1}} value={this.state.cart[key].case.toString()} editable={false}/>                                            
                                        </View>
                                        <View style={{display:'flex', flexDirection: 'row', justifyContent: 'center', alignContent: 'center'}}>
                                            <Text style={{textAlign:'center',marginLeft:5, marginRight:5, flex: 1}}>Single(s)</Text>
                                            <Text style={{textAlign:'center',marginLeft:5, marginRight:5, flex: 1}}>Case(s)</Text>
                                        </View>
                                    </Card>
                                );
                            })
                       }
                    </ScrollView>:
                    null                 
                }
                {
                    this.state.showTypes === true && this.state.active === 'shop' ? 
                    <Button text='Back' accent raised onPress={()=>{this.setState({showTypes:false,showKey:''})}}/> :null
                }
                <BottomNavigation active={this.state.active}>
                    <BottomNavigation.Action 
                        key='account'
                        icon='people'
                        onPress={()=>{this.setState({active:'account'})}}
                        label='Account'
                    />
                    <BottomNavigation.Action 
                        key='shop'
                        icon='shop'
                        onPress={()=>{this.setState({active:'shop'})}}
                        label='Shop'
                    />
                    <BottomNavigation.Action
                        key='cart'
                        icon='shopping-cart'
                        onPress={()=>{this.setState({active:'cart'})}}
                        label='Cart'
                    />
                </BottomNavigation>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    sectionTitle: {
        textAlign: 'center',
        paddingBottom: 10,
        fontSize: 14
    },
    input: {
        width: Dimensions.get('window').width/100 * 85 - 30
    }
});