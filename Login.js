import React from 'react';
import {
  AppRegistry,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  ScrollView
} from 'react-native';
import { Button, ThemeProvider} from 'react-navigation';  

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
          paddingTop: 15
        },
        heading: {
          fontSize: 24,
          // color: '#176BEF'
        },
        logo: {
          width: Dimensions.get('window').width/100 * 62.5,
          height: Dimensions.get('window').width/100 * 62.5
        },
        input:{ 
            width: Dimensions.get('window').width/100 * 70
        },
        signin: {
            width: Dimensions.get('window').width/100 * 70            
        }
      })
    }
    static navigationOptions = {
      title: 'Cocoa Grinder Franchisee',
    };
    render() {
      return (
          <ThemeProvider>
            <ScrollView style={this.styles.view} contentContainerStyle={this.styles.container}>
                <Image 
                    style={this.styles.logo}
                    source={require('./assets/res/cgnycBlack.png')}
                />
                <Text style={this.styles.heading}> 
                    COCOA GRINDER FRANCHISEE
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
                />     
            </ScrollView>
        </ThemeProvider>
      );
    }
  }