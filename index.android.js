import React, {Component} from 'react';
import {AppRegistry, View} from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';

class FranchiseeApp extends Component {
  static navigationOptions = {
    title: 'Cocoa Grinder Franchisee',
  };
  render () {
    return (
      <View>
        <Text>Hello, Navigation!</Text>;
      </View>
    );
  }
}

const SimpleApp = StackNavigator({
  Home: { screen: FranchiseeApp },
});

AppRegistry.registerComponent('SimpleApp', () => FranchiseeApp);