import React, { Component } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Text, KeyboardAvoidingView, TextInput, SafeAreaView, Dimensions, Platform, StatusBar } from 'react-native';
import { List, ListItem, SearchBar } from 'react-native-elements'; // 0.18.5
import CommentFooter from './CommentFooter';
import '@expo/vector-icons'; // 6.2.2
import moment from 'moment';
import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Icon, Container, Header, } from 'native-base';
import { BASE_URL, WALLS_CONTROLLER, COMMENTS_CONTROLLER, STD_API_KEY, STD_USER_ID, setApiKey, setUserID, USERS_CONTROLLER, STD_IMAGE, isAnon } from '../reducer';
import { connect } from 'react-redux';

class CommentComponent extends Component {
  static navigationOptions = {
    tabBarIcon: ({tintColor})=>(
        <Icon name='ios-apps-outline' style={{color:tintColor}}/>
    ),
    header: null
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      text: '',
      error: null,
      refreshing: false,
      userId: 'aaa',
      apiKey: 'aaa',
      FirstName: 'aaa',
      LastName: 'aaa',
      ProfilePicture: 'http://www.tiptoncommunications.com/components/com_easyblog/themes/wireframe/images/placeholder-image.png',
    };
  }

  componentWillMount(){
    this.setState(
      {
        userId: (this.props.isAnon? STD_USER_ID : this.props.userID),
        apiKey: (this.props.isAnon? STD_API_KEY: this.props.apiKey)
      }
    )
  }
  componentDidMount() {
    this.setComments();
    this.makeRemoteRequest(this.state.userId);
    console.log(this.state)
    console.log(this.props.isAnon)
  }

  sendCommentsToBackend = () => {
    let key = (this.props.isAnon? STD_API_KEY : this.props.apiKey)
    let id = (this.props.isAnon? STD_USER_ID : this.props.userID)
    let instance = this.props.navigation.state.params.instance
    let postID = this.props.navigation.state.params.id
    let userData = {};
    userData["user_id"] = id
    if(instance === 't'){
      userData["text_post_id"] = postID;
    } else if(instance === 'p'){
      userData["picture_post_id"] = postID;
    } else {
      userData["video_post_id"] = postID;
    }
    userData["body"] = this.state.text;
      

    let data = {
      method: 'POST',
      body: JSON.stringify({
        comment: userData
      }),
      headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key
      }
    }
    let URL = BASE_URL+COMMENTS_CONTROLLER
    fetch(URL, data)
      .then(res => res.json())
      .then(res => {
        if(res.id != null){
          this.state.data.push(res)
        }
        this.forceUpdate()                  
    })
    .catch(error => {
        this.setState({ error, loading: false });
        console.log(error)
    });
    this.props.navigation.push('Home');
  }

  makeRemoteRequest = (id) => {
    const url = BASE_URL + USERS_CONTROLLER + id;
    fetch(url)
    .then(res => res.json())
    .then(res => {
        this.setState({
            userId: res.id,
            FirstName: res.name,
            LastName: res.surname,
            ProfilePicture: res.picture.url,
            loading: false,
            refreshing: false,
        }),
        this.forceUpdate()                  
    })
    .catch(error => {
        this.setState({ error, loading: false });
    });
};

  setComments() {
    data = this.props.navigation.state.params.data.reverse()
    this.setState({
        data: data,
        loading: false,
        refreshing: false,
    }, console.log(this.state)
  )
  };

  home(){
    this.props.navigation.navigate('Home')
  }

  render() {
    return (
      <Container style={styles.background}>
            <Header style={[styles.androidHeader]}>
            <Left>
                <Button transparent onPress={this.home.bind(this)}>
                    <Icon name='ios-arrow-back-outline' style={{paddingLeft:10, color:'blue' }} />
                </Button>
            </Left>
            <Body style={[styles.androidHeaderTitle]}>
                <Text>
                Kommentare
                </Text>
            </Body>
            <Right>
                <Button transparent >
                    
                </Button>
            </Right>
        </Header>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={styles.keyboardAvoidContainer} behavior="height" >
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <Card>
                <CardItem>
                  <Left>
                    <Thumbnail source={{uri: item.picture}} style={{paddingTop: 20}} />
                    <Body>
                      <Text>{item.username} </Text>
                    </Body>
                  </Left>
                </CardItem>
                <CardItem cardBody>
                  <Text style={{ marginLeft: 82, marginRight: 20, textAlign: 'justify', height: 50, width: null, flex: 1 }}>{item.body}</Text>
                </CardItem>
              </Card>
            )}
            keyExtractor={item => item.created_at}
            inverted={true}
          />
          <Card style={{width: '100%', paddingBottom: Dimensions.get("window").height / 4, }}>
            <CardItem style={{height:75}} >
              <Left>
                <Thumbnail source={{uri: this.state.ProfilePicture}}/>
                <Body>
                  <Text>{this.state.FirstName} {this.state.LastName}</Text>
                  <Text></Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem cardBody>
              <TextInput
                autoFocus
                style={styles.input}
                value={this.state.text}
                onChangeText={(text) => this.setState({text})}
                placeholder="Füge ein Kommentar hinzu..."
                multiline = {true}
                returnKeyType="send"
                blurOnSubmit={true}
                onSubmitEditing={this.sendCommentsToBackend.bind(this)}
              />
            </CardItem>
          </Card>
        </KeyboardAvoidingView>
      </SafeAreaView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
    androidHeader: {
      ...Platform.select({
          android: {
              marginTop: StatusBar.currentHeight,
              backgroundColor: 'white'
          }
      })
    },
    androidHeaderTitle: {
        ...Platform.select({
            android: {
                alignItems: 'flex-end'
            }
        })

    },
    container: {
      flex: 1,
    },
    keyboardAvoidContainer: {
      flex: 1,
    },
    title: {
      opacity: 0.7,
      marginLeft: 8,
    },
    input: {
      marginLeft: 82, marginRight: 20, marginTop: 5, textAlign: 'justify', height: 50, width: null, flex: 1
    }
})
const mapStateToProps = ({userID, apiKey, isAnon}) => ({
  userID,
  apiKey,
  isAnon
});

const mapDispatchToProps = {

};

//make this component available to the app
export default connect(mapStateToProps, mapDispatchToProps)(CommentComponent);
