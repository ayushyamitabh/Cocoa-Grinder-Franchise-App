import React from 'react';
import {Alert,
        AppRegistry,
        Dimensions,
        Image,
        StyleSheet,
        Text,
        TextInput,
        ScrollView,
        View
        } from 'react-native';
import {Button, 
        COLOR, 
        Divider,
        ThemeProvider} from 'react-native-material-ui';
import * as firebase from 'firebase';
import {NavigationActions} from 'react-navigation';

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

export default class Login extends React.Component {
    constructor (props) {
      super (props);
      this.state = {
          email: '',
          password: ''
      }
      this.styles = StyleSheet.create({
        container: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: Dimensions.get('window').height/100 * 10
        },
        heading: {
          fontSize: 24,
          // color: '#176BEF'
        },
        headerLogo: {
          width: Dimensions.get('window').width/100 * 10
        },
        logo: {
          width: Dimensions.get('window').width/100 * 62.5,
          height: Dimensions.get('window').width/100 * 62.5
        },
        input: {
            width: Dimensions.get('window').width/100 * 85 - 30,
            fontSize: 14,
            paddingTop: 4,
            paddingBottom: 4,
            paddingLeft: 6,
            borderWidth: 1,
            borderColor: COLOR.grey500,
            marginTop: 4,
            borderRadius: 8
        },
        signin: {
            width: Dimensions.get('window').width/100 * 70            
        }
      })
    }
    static navigationOptions = {
      title: 'Sign In',
      headerLeft: null
    };
    static paths = null;
    render() {
      return (
        <ThemeProvider uiTheme={uiTheme}>
          <ScrollView style={this.styles.view} contentContainerStyle={this.styles.container}>
            <Image 
                style={this.styles.logo}
                source={require('../assets/res/cgnycBlack.png')}
            />
            <Text style={this.styles.heading}> 
                COCOA GRINDER FAMILY
            </Text>
            <TextInput 
                style={this.styles.input}
                placeholder="E-Mail" 
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={()=>{this.refs.lpassword.focus()}}
                value={this.state.email} 
                onChangeText={(value)=>{this.setState({email:value})}}
            />
            <TextInput
                ref='lpassword'
                style={this.styles.input}          
                placeholder="Password" 
                secureTextEntry={true}
                value={this.state.password} 
                onChangeText={(value)=>{this.setState({password:value})}}
                editable={this.state.email === '' ? false: true}
                onSubmitEditing={()=>{
                    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch((error)=>{
                        Alert.alert('Login Error',error.message,[{text:'Retry', onPress: ()=>{}}],{cancelable:true});
                    });
                }}
            />
            <Button         
                primary 
                raised 
                disabled = {this.state.email.length < 7 || this.state.password.length < 6 ? true: false}
                text="SIGN IN" 
                style={{
                    container:{
                        width:Dimensions.get('window').width/100* 69,
                        marginTop: 8
                    }
                }}
                onPress={()=>{
                    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch((error)=>{
                        Alert.alert('Login Error',error.message,[{text:'Retry', onPress: ()=>{}}],{cancelable:true});
                    });
                }}
            />
            <Divider style={{container:{paddingTop:2,paddingBottom:2}}} />
            <Button         
                accent 
                raised 
                text="SIGN UP" 
                style={{
                    container:{
                        width:Dimensions.get('window').width/100* 69
                    }
                }}
                onPress={()=>{
                    this.props.navigation.navigate('Signup');
                }}
            />
          </ScrollView>
        </ThemeProvider>
      );
    }
  }