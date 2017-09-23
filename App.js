import React, {Component} from 'react';
import {View, 
        AppRegistry, 
        Image, 
        Dimensions} from 'react-native';
import {StackNavigator} from 'react-navigation';
import {Button, COLOR, ThemeProvider} from 'react-native-material-ui';
import Login from './Login';
import Signup from './Signup';
import User from './User';
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

class Home extends Component {
  constructor (props) {
    super(props);
    this.state = {
      msg: 'Loading...'
    }
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user)=> {
      if (user) {
        this.setState({
          msg: 'Go To Your Portal'
        })
        this.props.navigation.navigate('User');
      } else {
        this.setState({
          msg: 'Go To Sign In / Sign Up'
        })
        this.props.navigation.navigate('Login');
      }
    })
  }
  static navigationOptions = {
    title: 'Cocoa Grinder Franchise'
  };
  render () {
    return (
      <ThemeProvider uiTheme={uiTheme}>
        <View 
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            paddingTop: Dimensions.get('window').height/100 * 20
          }}
        >
          <Image
              style={{
                width: Dimensions.get('window').width/100 * 80,
                height: Dimensions.get('window').width/100 * 80
              }}
              source={require('./assets/res/cgnycBlack.png')}
          />
          <Button 
              text={this.state.msg}
              primary
              raised
              onPress={()=>{
                if (firebase.auth().currentUser) {
                  this.props.navigation.navigate('User');
                } else {
                  this.props.navigation.navigate('Login');
                }                
              }}
          />
        </View>
      </ThemeProvider>
    );
  }
};

export default SimpleApp = StackNavigator({
  Home: { screen: Home },
  Login: { screen: Login },
  Signup: { screen: Signup },
  User: { screen: User }
},{
  index: 0,
  initialRouteName: 'Home',
  headerMode: 'none',
  navigationOptions: {
    gesturesEnabled: false
  }
});

AppRegistry.registerComponent('FranchiseeApp', () => SimpleApp);