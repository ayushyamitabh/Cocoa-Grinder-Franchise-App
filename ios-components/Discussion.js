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
import {StackNavigator, 
        TabNavigator} from 'react-navigation';
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

class DiscussionHome extends Component {
    static navigationOptions = {
        title: 'Discussion',
        tabBarLabel:'Chat'
    }
    constructor (props) {
        super(props);
        this.state = {
            posts: []
        };
    }
    componentWillMount() {
        firebase.database().ref('Discussion').on('value', (snap)=>{
            this.setState({
                posts: snap.val()
            })
        })
    }
    render() {
        return (
            <ThemeProvider uiTheme={uiTheme}>
                <ScrollView contentContainerStyle={{paddingTop: 10}}>
                    <Card 
                        style={{
                            container: {
                                padding: 10,
                                backgroundColor: COLOR.blue300
                            }
                        }}
                        onPress={()=>{this.props.navigation.navigate('Create')}}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                color: COLOR.white
                            }}
                        >
                            NEW POST
                        </Text>
                        <Divider />
                        <Text
                            style={{
                                fontSize: 12,
                                color: COLOR.white
                            }}
                        >
                            Publish a new post to our forums
                        </Text>
                    </Card>
                    {
                        this.state.posts.map((data,index)=>{
                            return (
                                <Card 
                                    key={`post${index}`}
                                    style={{
                                        container: {
                                            padding: 10
                                        }
                                    }}
                                    onPress={()=>{
                                        this.props.navigation.navigate('Post', {index: index})
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            color: COLOR.black
                                        }}
                                    >
                                        {data.Title}
                                    </Text>
                                    <Text>By: {data.By}</Text>
                                </Card>
                            );
                        })
                    }
                </ScrollView>
            </ThemeProvider>
        );
    }
}

class PostItem extends Component {
    static navigationOptions = {
        title: 'Post',
        tabBarLabel: 'Chat'
    };
    constructor(props) {
        super(props);
        this.state = {
            data: {
                comments: []
            },
            newMsg: ''
        }
        this.postComment = this.postComment.bind(this);
    }
    componentWillMount () {
        var ind = this.props.navigation.state.params.index;
        firebase.database().ref(`Discussion/${ind}`).on('value', (snap)=>{
            this.setState({
                data: snap.val()
            })
        })
    }
    postComment () {
        var newComments = [];
        if (this.state.data.comments) {
            newComments = this.state.data.comments;
            newComments.push({
                Comment: this.state.newMsg,
                By: firebase.auth().currentUser.displayName,
                ByUID: firebase.auth().currentUser.uid
            })
        } else {
            newComments.push({
                Comment: this.state.newMsg,
                By: firebase.auth().currentUser.displayName,
                ByUID: firebase.auth().currentUser.uid
            })
        }
        var ind = this.props.navigation.state.params.index;
        firebase.database().ref(`Discussion/${ind}/comments`).set(newComments).then(()=>{
            this.setState({
                newMsg: ''
            })
        })
    }
    render() {
        return (
            <ThemeProvider uiTheme={uiTheme}>
                <ScrollView
                    contentContainerStyle={{
                        display:'flex',
                        paddingBottom: 10,
                        height: Dimensions.get('window').height/100 * 80
                    }}
                >
                    <Card
                        style={{
                            container: {
                                padding: 10
                            }
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                color: COLOR.black
                            }}
                        >
                            {this.state.data.Title}
                        </Text>
                        <Text>By: {this.state.data.By}</Text>
                        <Divider style={{
                            container: {
                                marginTop: 5,
                                marginBottom: 5
                            }
                        }} 
                        />
                        <Text>{this.state.data.Message}</Text>
                    </Card>
                    <Text
                        style={{
                            marginLeft: 10,
                            fontSize: 14,
                            marginBottom: 5,
                            marginTop: 5
                        }}
                    >
                        Comments
                    </Text>
                    <ScrollView
                        style={{
                            flex: 1
                        }}
                        contentContainerStyle={{
                            justifyContent:'center',
                            alignItems:'center'
                        }}
                    >
                        <Card
                            style={{
                                container: {
                                    padding: 15,
                                    width: Dimensions.get('window').width/100 * 95
                                }
                            }}
                        >
                            <TextInput 
                                maxLength={400}
                                multiline
                                numberOfLines={3}
                                autoCapitalize='sentences'
                                keyboardType='default'
                                value={this.state.newMsg}
                                placeholder='Add a comment...'
                                onChangeText={(text)=>{this.setState({newMsg:text})}}
                            />
                            <Text
                                style={{
                                    textAlign:'right'
                                }}
                            >
                                Characters: {this.state.newMsg.length}/400
                            </Text>
                            <Button 
                                disabled={this.state.newMsg.length === 0 ? true : false}
                                style={{
                                    container: {
                                        marginTop: 8
                                    }
                                }}
                                primary
                                raised
                                text='Post Comment'
                                onPress={this.postComment}
                            />
                        </Card>
                        {
                            this.state.data.comments ?
                            this.state.data.comments.map((data,index)=>{
                                return (
                                    <Card 
                                        key={`comment${index}`}
                                        style={{
                                            container: {
                                                width: Dimensions.get('window').width/100 * 95,
                                                padding: 10
                                            }
                                        }}
                                    >
                                        <Text
                                            style={{
                                                marginBottom: 5,
                                                fontSize: 14,
                                                color: COLOR.black
                                            }}
                                        >
                                            {data.Comment}
                                        </Text>
                                        <Divider />
                                        <Text>By: {data.By}</Text>
                                    </Card>
                                );
                            }) :
                            <Text>No comments on this post yet...</Text>
                        }
                    </ScrollView>
                </ScrollView>
            </ThemeProvider>
        );
    }
}

class CreatePost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            message: '',
            by: firebase.auth().currentUser.displayName
        };
        this.createPost = this.createPost.bind(this);
    }
    static navigationOptions = {
        title: 'Create New Post',
        tabBarLabel: 'Chat'
    }
    createPost() {
        firebase.database().ref('Discussion').once('value', (snap)=>{
            var allPosts = snap.val();
            allPosts.push({
                Title: this.state.title,
                Message: this.state.message,
                By: this.state.by,
                ByUID: firebase.auth().currentUser.uid
            })
            firebase.database().ref('Discussion').set(allPosts);
        })
        this.props.navigation.goBack();        
    }
    render () {
        return (
            <ThemeProvider uiTheme={uiTheme}>
                <ScrollView
                    contentContainerStyle={{paddingTop:35}}
                >
                    <Card
                        style={{
                            container: {
                                padding: 10
                            }
                        }}
                    >   
                        <Text
                            style={{marginTop: 10,
                                marginBottom: 10
                            }}
                        >
                            Your title should either be a very brief description or should mention the topic of your message.
                        </Text>
                        <TextInput
                            maxLength={40}
                            placeholder='Title'
                            value={this.state.title}
                            onChangeText={(text)=>{this.setState({title:text})}}
                        />
                        <Text
                            style={{textAlign:'right',marginBottom:5}}
                        >
                            {this.state.title.length}/40
                        </Text>
                        <Divider style={{paddingTop:1}} />
                        <Text
                            style={{
                                marginTop: 10,
                                marginBottom: 10
                            }}
                        >
                            Don't share your password or any confidential information in your post.
                            Keep your messages as short as possible and stick to the point to help keep 
                            the discussions relevant.
                        </Text>
                        <TextInput 
                            multiline
                            maxLength={400}
                            numberOfLines={10}
                            placeholder='Message'
                            value={this.state.message}
                            onChangeText={(text)=>{this.setState({message:text})}}
                        />
                        <Text
                            style={{textAlign:'right',marginBottom:5}}                        
                        >
                            {this.state.message.length}/400
                        </Text>
                        <Text
                            style={{
                                marginBottom: 10
                            }}
                        >
                            By: {this.state.by}
                        </Text>
                        <Button 
                            primary
                            raised
                            text='CREATE POST'
                            onPress={this.createPost}
                        />
                        <Button 
                            accent
                            raised
                            text='CANCEL'
                            style={{container:{marginTop:5,marginBottom:10}}}
                            onPress={()=>{this.props.navigation.goBack()}}
                        />
                    </Card>
                </ScrollView>
            </ThemeProvider>
        );
    }
}

export default Discussion = StackNavigator({
    Home: { screen: DiscussionHome},
    Post: { screen: PostItem},
    Create: { screen: CreatePost}
},{
    index: 0,
    initialRouteName: 'Home',
    navigationOptions: {
        gesturesEnabled: false
    }
});