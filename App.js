import React from 'react';
import {AppRegistry} from 'react-native';
import {StackNavigator} from 'react-navigation';
import Login from './Login';

export default SimpleApp = StackNavigator({
  Home: { screen: Login },
});

// if you are using create-react-native-app you don't need this line
AppRegistry.registerComponent('FranchiseeApp', () => SimpleApp);