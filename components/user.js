import React, {Component} from 'react';
import { Alert,
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
        ThemeProvider, 
        Toolbar
        } from 'react-native-material-ui';
export default class User extends Component {
    constructor (props) {
        super(props);
        this.state = {
            active: 'account'
        };
    }
    render() {
        return(
            <View style={{display:'flex',flexDirection:'column',height:Dimensions.get('window').height - 75,justifyContent:'flex-end'}}>
                {
                    this.state.active === 'account' ?
                    <ScrollView contentContainerStyle={{display: 'flex', alignItems:'center',backgroundColor:COLOR.grey300,paddingTop:25,paddingBottom:25}}>
                        <Button raised accent onPress={this.props.logout} text={'LOGOUT'} style={{container:{width:Dimensions.get('window').width/100 * 85,marginBottom:10}}}/>
                        <Button raised primary onPress={this.props.logout} text={'SAVE CHANGES'} style={{container:{width:Dimensions.get('window').width/100 * 85,marginBottom:10}}}/>                        
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
                    </ScrollView> :
                    this.state.active === 'shop' ?
                    <ScrollView contentContainerStyle={{flex: 1, display: 'flex', alignItems:'center'}}>
                        <Button raised accent onPress={this.props.logout} text={'SHOP'} style={{container:{width:Dimensions.get('window').width/100 * 75}}}/>
                    </ScrollView> :
                    <ScrollView contentContainerStyle={{flex: 1, display: 'flex', alignItems:'center'}}>
                        <Button raised accent onPress={this.props.logout} text={'CART'} style={{container:{width:Dimensions.get('window').width/100 * 75}}}/>
                    </ScrollView>                    
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