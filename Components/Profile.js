import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Switch,
  AsyncStorage,
  Platform,
  StatusBar
} from "react-native";
import { Container, Header, Left, Right, Body, Button, Input, Icon } from 'native-base';
import { BASE_URL, STD_API_KEY, STD_USER_ID, setApiKey, setUserID, USERS_CONTROLLER, STD_IMAGE, isAnon, setAnon } from '../reducer';
import { connect } from 'react-redux';
import MIcon from "react-native-vector-icons/Ionicons";


var backgroundImage = require('../assets/back.jpg')

class Profile extends Component {
  static navigationOptions = {
    tabBarIcon: ({tintColor})=>(
        <Icon name='ios-apps-outline' style={{color:tintColor}}/>
    ),
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      userId: 14,
      isOn: false,
      FirstName: "FirstName",
      LastName: "LastName",
      ProfilePicture: STD_IMAGE
    };
  }

  componentDidMount() {
    this.makeRemoteRequest()    
  }

    _toggleAnon(){ 
    a = this.props.isAnon
    this.props.setAnon(!a)
    this.glasses()
    this.makeRemoteRequest()
    this.props.navigation.push('Profile')
    };

  glasses(){
    if(this.props.isAnon){
      return <MIcon
      style={styles.micon}
      name="ios-glasses"
      color="darkgrey"
      size={Dimensions.get("window").width / 4}
    />
    }else{
      return <MIcon
      style={styles.micon}
      name="ios-glasses-outline"
      color="darkgrey"
      size={Dimensions.get("window").width / 4}
    />
    }
  }

  makeRemoteRequest = () => {
      this.props.isAnon == true ? id = STD_USER_ID : id = this.props.userID
      const url = BASE_URL + USERS_CONTROLLER + id;
      fetch(url)
        .then(res => res.json())
        .then(res => {
          this.setState({
              userId: res.id,
              FirstName: res.name,
              LastName: res.surname,
              ProfilePicture: res.picture.url,
          })                  
      })
      .catch(error => {
          this.setState({ error, loading: false });
      });
  };

  editProfile() {
    this.props.navigation.navigate('EditProfile')
  }

  home() {
    this.props.navigation.navigate('Home')
  }


  render() {
    return (
      <Container style={styles.background}>
            <Header style={[styles.androidHeader]}>
            <Left>
                <Button transparent onPress={this.home.bind(this)}>
                    <Icon name='ios-arrow-back-outline' style={{paddingLeft:10, color:'black' }} />
                </Button>
            </Left>
            <Body style={[styles.androidHeaderTitle]}>
                <Text>
                  Profilübersicht
                </Text>
            </Body>
            <Right>
                <Button transparent onPress={this.editProfile.bind(this)}>
                  <Icon name="ios-settings" style={{paddingLeft:10, color:'black' }} />
                </Button>
            </Right>
        </Header>
      <ImageBackground style={styles.container} source={backgroundImage}>
        <ScrollView contentContainerStyle={styles.container}>
          <Image
            style={styles.profileImage}
            source={{ uri: this.state.ProfilePicture }}
          />

          <View style={styles.center}>
            <View>
              <Text style={styles.username}>{this.state.FirstName} {this.state.LastName}</Text>
            </View>
            <View style={styles.center}>
              <Text style={styles.textgrey} >Identität verschleiern?</Text>
            </View>
            <View style={styles.samerow}>
              <Switch
                  onValueChange={ this._toggleAnon.bind(this) }
                  value={this.props.isAnon}
              />
              {this.glasses()}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
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
  background:{
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Dimensions.get("window").width / 8
  },

  profileImage: {
    width: Dimensions.get("window").width / 1.5,
    height: Dimensions.get("window").width / 1.5,
  },

  username: {
    paddingTop: Dimensions.get("window").width / 15,
    fontSize: Dimensions.get("window").width / 10,
    color: "white"
  },
  micon:{
    paddingLeft: 30,
  },
  samerow: {
    justifyContent: 'center',
    alignItems: "center",
    flexDirection: "row",
    height: 100
  },

  textgrey: {
    paddingTop: Dimensions.get("window").width / 12,
    fontSize: Dimensions.get("window").width / 18,
    color: "#808080"
  },

  center: {
    alignItems: "center"
  }
});


const mapStateToProps = ({userID, apiKey, isAnon}) => ({
    userID,
    apiKey,
    isAnon
});

const mapDispatchToProps = {
    setApiKey,
    setUserID,
    setAnon
};

//make this component available to the app
export default connect(mapStateToProps, mapDispatchToProps)(Profile);