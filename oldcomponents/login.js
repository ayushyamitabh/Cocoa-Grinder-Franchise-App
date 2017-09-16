import React, {Component} from 'react';
import { Alert,
         Animated,
         Dimensions,
         Image,
         ScrollView,
         StyleSheet,
         Text,
         TextInput,
         View
       } from 'react-native';
import { Button, 
        Card, 
        COLOR, 
        ThemeProvider, 
        Toolbar
        } from 'react-native-material-ui';
import Signup from './signup.js';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sent: false,
            lemail: '',
            lpassword: ''
        };
        this.prepareLogin = this.prepareLogin.bind(this);
    }
    prepareLogin() {
        this.props.login(this.state.lemail,this.state.lpassword);
        this.setState({
            sent: true
        })
    }
    shouldComponentUpdate(nextProps) {
        if (nextProps.loggedIn === true && this.state.sent === true) {
            this.setState({
                sent: false
            })
        }
        if (nextProps != this.props){
            return true;
        }
        return false;
    }
    render () {
        return (
            <View>
                <ScrollView style={styles.homeContent} contentContainerStyle={styles.homeContentContainer}>
                <Image 
                    style={styles.loginLogo}
                    source={require('../assets/res/cgnycBlack.png')}
                />
                <Text style={styles.loginTitle}> 
                    COCOA GRINDER FRANCHISEE
                </Text>
                <Card style={{container:{display:'flex',flexDirection:'column',alignItems:'center',padding:15}}}>
                    <TextInput 
                        style={styles.loginEmail} 
                        placeholder="E-Mail" 
                        keyboardType="email-address"
                        returnKeyType="next"
                        underlineColorAndroid={COLOR.blue400}
                        onChangeText={(t)=>{this.setState({lemail:t})}}
                        onSubmitEditing={()=>{this.refs.lpassword.focus()}}
                        editable={!this.props.trying}
                    />
                    <TextInput 
                        ref="lpassword"
                        style={styles.loginPassword} 
                        placeholder="Password" 
                        secureTextEntry={true}
                        returnKeyType="done"
                        underlineColorAndroid={COLOR.blue400}   
                        onChangeText={(t)=>{this.setState({lpassword:t})}}
                        onSubmitEditing={this.prepareLogin}        
                        editable={!this.props.trying}
                    />
                    <Button
                        display={this.props.trying}
                        primary 
                        text={"LOGIN" }
                        style={{
                            container:{
                            width:Dimensions.get('window').width/100 * 65
                            }
                        }}
                        onPress={this.prepareLogin}
                    />
                </Card>
                <Button
                    display={this.props.trying}                
                    primary 
                    raised 
                    onPress={()=>{this.props.changeScreen('signup')}}
                    text="SIGN UP" 
                    style={{
                        container:{
                            width:Dimensions.get('window').width/100* 72.5
                        }
                    }}
                />
            </ScrollView>
            </View>
        );
        
    }
}

const styles = StyleSheet.create({
    homeContentContainer:{
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height - 50,
      display: 'flex',
      flexDirection:'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    loginLogo: {
      width: Dimensions.get('window').width/100 * 62.5,
      height: Dimensions.get('window').width/100 * 62.5
    },
    loginTitle: {
      fontSize: 21,
      color: COLOR.grey800
    },
    loginEmail :{
      width: Dimensions.get('window').width/100 * 65
    },
    loginPassword: {
      width: Dimensions.get('window').width/100 * 65
    }
  });