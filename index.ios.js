import React, { Component } from 'react';
import { Dimensions, Animated, Alert, AppRegistry, View, Text,Image, TextInput, Navigator, NativeModules } from 'react-native';
import { COLOR, ThemeProvider, Button, Toolbar } from 'react-native-material-ui';
import Login from './components/login.js';
import Signup from './components/signup.js';
import User from './components/user.js';
import * as firebase from 'firebase';

var config = {
  apiKey: "AIzaSyCS6-iikOnF-t6vLskVRbLGJaowIKWSAF8",
  authDomain: "cocoagrinder-af99e.firebaseapp.com",
  databaseURL: "https://cocoagrinder-af99e.firebaseio.com",
  projectId: "cocoagrinder-af99e",
  storageBucket: "cocoagrinder-af99e.appspot.com",
  messagingSenderId: "642782349955"
};
firebase.initializeApp(config);

console.ignoredYellowBox = ['Setting a timer'];

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

export default class FranchiseeApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      trying: true,
      tryingMsg: 'Checking if you\'re signed in ...',
      user: ''
    };
    this.login = this.login.bind(this);
    this.changeScreen = this.changeScreen.bind(this);
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user)=>{
      if (user) {
        console.log('User logged in.');
        this.setState({
          loggedIn: true,
          trying: false,
          tryingMsg: ''
        })
        if (user.displayName) {
          this.setState({
            user: user.displayName
          })
        }
      } else {
        console.log('User logged out.');
        this.setState({
          loggedIn: false,
          user: '',
          trying: false,
          tryingMsg: ''
        })
      }
    })
  }
  changeScreen (t) {
    this.setState ({
      loggedIn : t
    })
  }
  login(e,p) {
    this.setState({trying:true, tryingMsg: 'Signing you in...'})
    firebase.auth().signInWithEmailAndPassword(e,p).catch((error)=>{
      Alert.alert('Login Error',error.message,[
        {text:'Retry', onPress: ()=>{}}
      ],{cancelable:true});
      this.setState({trying:false, tryingMsg: ''})
    })
  }
  logout() {
    firebase.auth().signOut();
  }
  signup(data) {
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
  render() {
    return (
      <ThemeProvider uiTheme={uiTheme}>
        <View>
          {
            this.state.loggedIn === true ? <Toolbar leftElement={<Image style={{width:30,height:30}} source={require('./assets/res/cgnycBlack.png')}/>} centerElement="COCOA GRINDER" style={{container:{backgroundColor:COLOR.white},titleText:{color:COLOR.black},leftElementContainer:{marginLeft:10}}}/> : null
          }
          {
            this.state.trying === true ? <Text style={{textAlign:'center',backgroundColor:COLOR.red700,color:COLOR.white,paddingTop:10,paddingBottom:10}}>{this.state.tryingMsg}</Text> : null
          }
          {
            this.state.loggedIn === false ? <Login login={this.login} loggedIn={this.state.loggedIn} logout={this.logout} changeScreen={this.changeScreen} trying={this.state.trying}/> :
            this.state.loggedIn === 'signup' ? <Signup changeScreen={this.changeScreen} signup={this.signup}/> :
            this.state.loggedIn === true ? <User logout={this.logout}/> :
            null
          } 
          
        </View>
      </ThemeProvider>
    );
  }
}

AppRegistry.registerComponent('FranchiseeApp', () => FranchiseeApp);