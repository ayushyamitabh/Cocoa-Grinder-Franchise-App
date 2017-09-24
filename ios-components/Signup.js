import React, {Component} from 'react';
import { Alert,
    Animated,
    Dimensions,
    Image,
    Picker,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
  } from 'react-native';
import { Button, 
        Card, 
        COLOR, 
        Divider,
        Drawer, 
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

console.ignoredYellowBox = ['Setting a timer'];

export default class Signup extends Component {
    constructor (props) {
        super (props);
        this.state = {
            address: '',
            altcontact: '',
            altphone: '',
            billingcontact: '',
            billingemail: '',
            billingphone: '',
            bname: '',
            btype: 'btype',
            city: '',
            confirmemail: '',
            confirmpassword: '',
            contact: '',
            date: new Date(),
            deladdress: '',
            delcity: '',
            delcontact: '',
            deldetails: '',
            delphone: '',
            delstate: '',
            deltime: '',
            delzip: '',
            email: '',
            itin: '',
            loginemail: '',
            loginpassword: '',
            lphone: '',
            orders: [],
            phone: '',
            state: '',
            tax: '', 
            tname: '',
            username: '',
            welcomed: false,
            zip: '',
            taxClassification: 'taxClassification',

            trying: false,
            tryingMsg: ''
        };
        this.processData = this.processData.bind(this);
    }
    static navigationOptions = {
        title: 'Sign Up'
    };
    signup (data) {
        this.setState({
            trying: true,
            tryingMsg: 'Signing you up... this may take a moment.'
        })
        firebase.auth().createUserWithEmailAndPassword(data.loginemail, data.loginpassword).then((user)=>{
            firebase.database().ref(`Users/${user.uid}`).set(data).then(()=>{
                user.updateProfile({
                    displayName: data.username
                }).then(()=>{
                    // success updating profile
                    this.setState({
                        trying: false,
                        tryingMsg: ''
                    })
                },(error)=>{
                    // error updating profile
                })
            },(error)=>{
            // error saving to database
            })
        },(error)=>{
            Alert.alert('Signup Error',error.message,[
            {text:'Retry', onPress: ()=>{this.signup(data)}},
            {text:'Ok', onPress:null}
            ],{cancelable:true});
        })
    }
    processData () {
        var pData = this.state;
        delete pData.trying;
        delete pData.tryingMsg;
        if (pData.loginemail !== pData.confirmemail) {
            Alert.alert('Information Mismatch','Your e-mails in Login Information don\'t match.',[{text:'Ok',onPress:null}],{cancelable:false});
            return false;
        }
        if (pData.loginpassword !== pData.confirmpassword) {
            Alert.alert('Information Mismatch','Your passwords in Login Information don\'t match.',[{text:'Ok',onPress:null}],{cancelable:false});
            return false;
        }
        if (pData.taxClassification === 'taxClassification') {
            Alert.alert('Missing Information','You forgot to select your tax classification type',[{text:'Ok',onPress:null}],{cancelable:false});
            return false;
        } else if (pData.taxClassification === 'tax' && pData.tax === '') {
            Alert.alert('Missing Information','You forgot to enter your Tax ID',[{text:'Ok',onPress:null}],{cancelable:false});            
            return false;            
        } else if (pData.taxClassification === 'itin' && pData.itin === '') {
            Alert.alert('Missing Information','You forgot to enter your ITIN ID',[{text:'Ok',onPress:null}],{cancelable:false});     
            return false;                   
        }
        if (pData.btype === 'btype') {
            Alert.alert('Missing Information','You forgot to select your business type',[{text:'Ok',onPress:null}],{cancelable:false});   
            return false;             
        }
        for (var key in pData) {
            if (pData[key] === '') {
                if (key === 'tax' || key === 'itin') {
                    //been handled
                } else {
                    Alert.alert('Missing Information',`Oops... looks like you forgot something.\n| txtID : ${key} |`,[{text:'Ok',onPress:null}],{cancelable:false});
                    return false;
                }
            }
        }
        if (pData.taxClassification === 'tax') {
            delete pData['itin'];
        } else if (pData.taxClassification === 'itin') {
            delete pData['tax'];
        }
        delete pData['taxClassification'];
        this.signup(pData);
    }
    render () {
        return (
            <ThemeProvider uiTheme={uiTheme}>
                <View>
                    {
                        this.state.trying ? 
                        <Text
                            style ={{
                                textAlign: 'center',
                                paddingTop: 10,
                                paddingBottom: 10,
                                color: COLOR.black
                            }}
                        >
                            {this.state.tryingMsg}
                        </Text>:
                        null
                    }
                    <ScrollView contentContainerStyle={styles.signupView}>
                        <Text style={{marginTop:10,marginBottom:10}} >Already have an account? Go to Login.</Text>
                        <Button 
                            accent 
                            raised
                            text={"Back to login" }
                            style={{
                                container:{
                                width:Dimensions.get('window').width/100 * 85
                                }
                            }}
                            onPress={()=>{this.props.navigation.navigate('Login')}}
                        />
                        <Text style={{marginTop:10,marginBottom:10}}>Fill out all the fields below to signup.</Text>                
                        <Card style={{container:{padding:15}}}>
                            <Text style={styles.sectionTitle}>LOGIN INFORMATION</Text>
                            <Divider />
                            <TextInput onSubmitEditing={()=>{this.refs.loginemail.focus()}} 
                                ref='username'
                                blurOnSubmit={false}
                                returnKeyType='next'
                                onChangeText={(t)=>{this.setState({username:t})}}
                                placeholder="Full Name / Username"
                                style={styles.input}
                            />
                            <TextInput onSubmitEditing={()=>{this.refs.confirmemail.focus()}} 
                                keyboardType="email-address"
                                ref='loginemail'
                                blurOnSubmit={false}
                                returnKeyType='next'
                                onChangeText={(t)=>{this.setState({loginemail:t})}}                    
                                placeholder="Login Email"
                                style={styles.input}
                            />
                            <TextInput onSubmitEditing={()=>{this.refs.loginpassword.focus()}}
                                keyboardType="email-address"
                                ref='confirmemail'
                                blurOnSubmit={false}
                                returnKeyType='next'
                                onChangeText={(t)=>{this.setState({confirmemail:t})}}
                                placeholder="Confirm Email"
                                style={styles.input}
                            />
                            <TextInput onSubmitEditing={()=>{this.refs.confirmpassword.focus()}} 
                                secureTextEntry={true}
                                ref='loginpassword'
                                blurOnSubmit={false}
                                returnKeyType='next'
                                onChangeText={(t)=>{this.setState({loginpassword:t})}}
                                placeholder="Login Password"
                                style={styles.input}
                            />
                            <TextInput onSubmitEditing={()=>{this.refs.bname.focus()}} 
                                secureTextEntry={true}
                                ref='confirmpassword'
                                blurOnSubmit={false}
                                returnKeyType='next'
                                onChangeText={(t)=>{this.setState({confirmpassword:t})}}
                                placeholder="Confirm Password"
                                style={styles.input}
                            />
                        </Card>
                        <Card style={{container:{padding:15}}}>
                            <Text style={styles.sectionTitle}>PERSONAL / BUSINESS INFORMATION</Text>
                            <Divider />
                            <TextInput onSubmitEditing={()=>{this.refs.tname.focus()}} 
                                ref='bname'
                                blurOnSubmit={false}
                                returnKeyType='next'
                                onChangeText={(t)=>{this.setState({bname:t})}}
                                placeholder="Legal Business Name"
                                style={styles.input}
                            />
                            <TextInput onSubmitEditing={()=>{this.refs.address.focus()}} 
                                ref='tname'
                                blurOnSubmit={false}
                                returnKeyType='next'
                                onChangeText={(t)=>{this.setState({tname:t})}}
                                placeholder="Business Trade Name"
                                style={styles.input}
                            />
                            <TextInput onSubmitEditing={()=>{this.refs.city.focus()}} 
                                ref='address'
                                blurOnSubmit={false}
                                returnKeyType='next'
                                onChangeText={(t)=>{this.setState({address:t})}}
                                placeholder="Address"
                                style={styles.input}
                            />
                            <TextInput onSubmitEditing={()=>{this.refs.state.focus()}} 
                                ref='city'
                                blurOnSubmit={false}
                                returnKeyType='next'
                                onChangeText={(t)=>{this.setState({city:t})}}
                                placeholder="City"
                                style={styles.input}
                            />
                            <TextInput onSubmitEditing={()=>{this.refs.zip.focus()}} 
                                ref='state'
                                blurOnSubmit={false}
                                returnKeyType='next'
                                onChangeText={(t)=>{this.setState({state:t})}}
                                placeholder="State"
                                style={styles.input}
                            />
                            <TextInput onSubmitEditing={()=>{this.refs.lphone.focus()}} 
                                keyboardType="numeric"
                                ref='zip'
                                blurOnSubmit={false}
                                returnKeyType='next'
                                onChangeText={(t)=>{this.setState({zip:t})}}
                                placeholder="Zip"
                                style={styles.input}
                            />
                            <TextInput onSubmitEditing={()=>{this.refs.contact.focus()}} 
                                keyboardType="phone-pad"
                                ref='lphone'
                                blurOnSubmit={false}
                                returnKeyType='next'
                                onChangeText={(t)=>{this.setState({lphone:t})}}
                                placeholder="Location Phone"
                                style={styles.input}
                            />
                            <TextInput onSubmitEditing={()=>{this.refs.phone.focus()}} 
                                ref='contact'
                                blurOnSubmit={false}
                                returnKeyType='next'
                                onChangeText={(t)=>{this.setState({contact:t})}}
                                placeholder="Primary Contact"
                                style={styles.input}
                            />
                            <TextInput onSubmitEditing={()=>{this.refs.altcontact.focus()}} 
                                keyboardType="phone-pad"
                                ref='phone'
                                blurOnSubmit={false}
                                returnKeyType='next'
                                onChangeText={(t)=>{this.setState({phone:t})}}
                                placeholder="Primary Phone"
                                style={styles.input}
                            />
                            <TextInput onSubmitEditing={()=>{this.refs.altphone.focus()}} 
                                ref='altcontact'
                                blurOnSubmit={false}
                                returnKeyType='next'
                                onChangeText={(t)=>{this.setState({altcontact:t})}}
                                placeholder="Alternate Contact"
                                style={styles.input}
                            />
                            <TextInput onSubmitEditing={()=>{this.refs.email.focus()}} 
                                keyboardType="phone-pad"
                                ref='altphone'
                                blurOnSubmit={false}
                                returnKeyType='next'
                                onChangeText={(t)=>{this.setState({altphone:t})}}
                                placeholder="Alternate Phone"
                                style={styles.input}
                            />
                            <TextInput onSubmitEditing={()=>{this.refs.billingcontact.focus()}} 
                                keyboardType="email-address"
                                ref='email'
                                blurOnSubmit={false}
                                returnKeyType='next'
                                onChangeText={(t)=>{this.setState({email:t})}}
                                placeholder="E-Mail"
                                style={styles.input}
                            />
                        </Card>
                        <Card style={{container:{padding:15}}}>
                            <Text style={styles.sectionTitle}>BILLING INFORMATION</Text>
                            <Divider />
                            <TextInput onSubmitEditing={()=>{this.refs.billingphone.focus()}} 
                                ref='billingcontact'
                                blurOnSubmit={false}
                                returnKeyType='next'
                                onChangeText={(t)=>{this.setState({billingcontact:t})}}
                                placeholder="Billing Contact"
                                style={styles.input}
                            />
                            <TextInput onSubmitEditing={()=>{this.refs.billingemail.focus()}} 
                                keyboardType="phone-pad"
                                ref='billingphone'
                                blurOnSubmit={false}
                                returnKeyType='next'
                                onChangeText={(t)=>{this.setState({billingphone:t})}}
                                placeholder="Billing Phone"
                                style={styles.input}
                            />
                            <TextInput
                                ref='billingemail'
                                keyboardType="email-address"
                                blurOnSubmit={true}
                                returnKeyType='next'
                                onChangeText={(t)=>{this.setState({billingemail:t})}}
                                placeholder="Billing E-Mail"
                                style={styles.input}
                            />
                            <Picker
                                ref='taxClassification'
                                selectedValue={this.state.taxClassification}
                                onValueChange={(value, index)=>{
                                        this.setState({
                                            taxClassification: value
                                        });
                                    }}
                            >
                                    <Picker.Item value='taxClassification' label='Tax Classification' />
                                    <Picker.Item value='tax' label='Tax ID Number' />
                                    <Picker.Item value='itin' label='ITIN ID Number' />                            
                            </Picker>
                            <TextInput
                                ref='taxitin'
                                blurOnSubmit={true}
                                returnKeyType='next'
                                onChangeText={(t)=>{
                                        if (this.state.taxClassification === 'tax'){
                                            this.setState({tax:t})
                                        } else if (this.state.taxClassification === 'itin') {
                                            this.setState({itin:t})
                                        }
                                    }}
                                placeholder={this.state.taxClassification === 'taxClassification'? 'Choose your tax classification first' : this.state.taxClassification === 'tax' ? 'Tax ID' : 'ITIN ID'}
                                style={styles.input}
                            />
                            <Picker
                                ref='btype'
                                selectedValue={this.state.btype}
                                onValueChange={(value, index)=>{
                                    this.setState({
                                        btype: value
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
                            <TextInput onSubmitEditing={()=>{this.refs.deladdress.focus()}}
                                ref='delcontact'
                                blurOnSubmit={false}
                                returnKeyType='next'
                                onChangeText={(t)=>{this.setState({delcontact:t})}}
                                placeholder="Delivery Contact"
                                style={styles.input}
                            />
                            <TextInput onSubmitEditing={()=>{this.refs.delcity.focus()}}
                                ref='deladdress'
                                blurOnSubmit={false}
                                returnKeyType='next'
                                onChangeText={(t)=>{this.setState({deladdress:t})}}
                                placeholder="Delivery Address"
                                style={styles.input}
                            />
                            <TextInput onSubmitEditing={()=>{this.refs.delstate.focus()}}
                                ref='delcity'
                                blurOnSubmit={false}
                                returnKeyType='next'
                                onChangeText={(t)=>{this.setState({delcity:t})}}
                                placeholder="City"
                                style={styles.input}
                            />
                            <TextInput onSubmitEditing={()=>{this.refs.delzip.focus()}}
                                ref='delstate'
                                blurOnSubmit={false}
                                returnKeyType='next'
                                onChangeText={(t)=>{this.setState({delstate:t})}}
                                placeholder="State"
                                style={styles.input}
                            />
                            <TextInput onSubmitEditing={()=>{this.refs.delphone.focus()}}
                                ref='delzip'
                                blurOnSubmit={false}
                                returnKeyType='next'
                                onChangeText={(t)=>{this.setState({delzip:t})}}
                                placeholder="Zip Code"
                                style={styles.input}
                            />
                            <TextInput onSubmitEditing={()=>{this.refs.deltime.focus()}}
                                keyboardType="phone-pad"
                                ref='delphone'
                                blurOnSubmit={false}
                                returnKeyType='next'
                                onChangeText={(t)=>{this.setState({delphone:t})}}
                                placeholder="Delivery Phone"
                                style={styles.input}
                            />
                            <TextInput onSubmitEditing={()=>{this.refs.deldetails.focus()}}
                                ref='deltime'
                                blurOnSubmit={false}
                                returnKeyType='next'
                                onChangeText={(t)=>{this.setState({deltime:t})}}
                                placeholder="Receiving Hours"
                                style={styles.input}
                            />
                            <TextInput
                                ref='deldetails'
                                blurOnSubmit={false}
                                multiline={true}
                                numberOfLines={3}
                                onChangeText={(t)=>{this.setState({deldetails:t})}}
                                placeholder="Details or Special Instructions"
                                style={styles.input}
                            />
                        </Card>
                        <Button 
                            raised
                            primary
                            text={'Sign Up'}
                            style={{
                                container:{
                                    width:Dimensions.get('window').width/100 * 85,
                                    marginBottom: 30
                                }
                            }}
                            onPress={this.processData}
                        />
                    </ScrollView>
                </View>
            </ThemeProvider>
        );
    }
}

const styles = StyleSheet.create({
    signupView :{
      width: Dimensions.get('window').width,
      display: 'flex',
      flexDirection:'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 10,
      paddingBottom: 20
    },
    sectionTitle: {
        textAlign: 'center',
        paddingBottom: 10,
        fontSize: 14
    },
    input: {
        width: Dimensions.get('window').width/100 * 85 - 30
    }
});