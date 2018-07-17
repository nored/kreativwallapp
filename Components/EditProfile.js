import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  ImageBackground,
  Alert,
  AsyncStorage,
  Image,
  Platform,
  StatusBar
} from "react-native";
import { Container, Icon, Header, Left, Right, Body, Button, Input } from 'native-base';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { BASE_URL, STD_API_KEY, STD_USER_ID, setApiKey, setUserID, USERS_CONTROLLER, STD_IMAGE } from '../reducer';
import { connect } from 'react-redux';
import { ImagePicker, Permissions  } from 'expo';

var backgroundImage = require('../assets/back.jpg')


class EditProfile extends Component {
  static navigationOptions = {
    tabBarIcon: ({tintColor})=>(
        <Icon name='ios-apps-outline' style={{color:tintColor}}/>
    ),
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: true,
      hasCameraRollPermission: true,
      userId: null,
      FirstName: "",
      LastName: "",
      fnError: null,
      lnError: null,
      ProfilePicture: STD_IMAGE,
      Base64Picture: null,
    };
  }

  componentDidMount(){
      if(!(this.props.userID == STD_USER_ID)){
        this.makeRemoteRequest(this.props.userID)
      }
  }

  makeRemoteRequest = (id) => {
    const url = BASE_URL + USERS_CONTROLLER + id;
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
            userId: res.id,
            FirstName: res.name == null ? '' : res.name,
            LastName: res.surname == null ? '' : res.surname,
            ProfilePicture: res.picture.url,
        }),
        this.forceUpdate()                  
    })
    .catch(error => {
        this.setState({ error, loading: false });
    });
  };

  sendToBackend = () => {
    let userData = {}
    userData["name"] = this.state.FirstName
    userData["surname"] = this.state.LastName
    if(this.state.Base64Picture != null){
      userData["picture"] = "data:image/png;base64," + this.state.Base64Picture
    }
    
    let data = {
      method: this.props.userID === STD_USER_ID ? 'POST' : "PATCH",
      body: JSON.stringify({
        user: userData
      }),
      headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (this.props.apiKey === STD_API_KEY ? '' : this.props.apiKey)
      }
    }
    let userid = this.props.userID === STD_USER_ID ? '' : this.props.userID
    let URL = BASE_URL+USERS_CONTROLLER+userid
    fetch(URL, data)
      .then(res => res.json())
      .then(res => {
        if(res.api_key != null){
          this.props.setApiKey(res.api_key),
          this.props.setUserID(res.id),
          AsyncStorage.setItem("apiKey", JSON.stringify(res.api_key));
          AsyncStorage.setItem("userID", JSON.stringify(res.id));
        }
        console.log(res)                  
    })
    .catch(error => {
        this.setState({ error, loading: false });
        console.log(error)
    });
  }

  _pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    });

    if (!result.cancelled) {
      this.setState(
        {
           ProfilePicture: result.uri,
           Base64Picture: result.base64, 
        }
      );
    }
  };

  _requestCameraPermission = async () => {
    const { cstatus } = await Permissions.askAsync(Permissions.CAMERA);
    const { rstatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this._pickImage()
  };

  buttonPress = () => {
    this.firstNameValidate();
    this.lastNameValidate();
    if (this.state.fnError != null || this.state.lnError != null) {
      var error = (this.state.fnError == null ? '' : this.state.fnError) + "\n" + (this.state.lnError == null ? '' : this.state.lnError)
      Alert.alert(error);
    } else {
      if(this.state.FirstName.length > 0 && this.state.LastName.length > 0){
        this.sendToBackend();
        Alert.alert("Die Änderungen wurden gespeichert");
        this.props.navigation.push('Profile');
      }
    }
  };

  firstNameValidate = FirstName => {
    FirstName == null ? FirstName=this.state.FirstName : FirstName
    const re = /^[A-Za-z]+$/;
    if (FirstName.length == 0) {
      this.setState({ fnError: "First Name cannot be left blank" });
    } else if (re.test(String(FirstName)) == false) {
      this.setState({ fnError: "this is not a valid name" });
    } else {
      this.setState(
        {
          fnError: null,
          FirstName: FirstName,
        }
        );
    }
  };

  lastNameValidate = LastName => {
    const re = /^[A-Za-z]+$/;
    LastName == null ? LastName=this.state.LastName : LastName
    if (LastName.length == 0) {
      this.setState({ lnError: "Last Name cannot be left blank" });
    } else if (re.test(String(LastName)) == false) {
      this.setState({ lnError: "This is not a valid last name" });
    } else {
      this.setState(
        {
          lnError: null,
          LastName: LastName,
        }
      );
    }
  };

  profile() {
    this.props.navigation.push('Profile')
  }

  render() {
    const FirstName = this.state.FirstName;
    const LastName = this.state.LastName;
    const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>

    return (
      <Container style={styles.background}>
            <Header style={[styles.androidHeader]}>
            <Left>
                <Button transparent onPress={this.profile.bind(this)}>
                    <Icon name='ios-arrow-back-outline' style={{paddingLeft:10, color:'black' }} />
                </Button>
            </Left>
            <Body style={[styles.androidHeaderTitle]}>
                <Text>
                Einstellungen
                </Text>
            </Body>
            <Right>
                <Button transparent >
                    
                </Button>
            </Right>
        </Header>
        <ImageBackground style={styles.background} source={backgroundImage}>
            <KeyboardAwareScrollView contentContainerStyle={styles.container}>
                <TouchableHighlight onPress={this._requestCameraPermission}>
                    <Image
                        style={styles.profileImage}
                        source={{ uri: this.state.ProfilePicture }}
                    />
                </TouchableHighlight>
                <View style={styles.nametext} >
                    <Input
                        placeholderTextColor= "#fff"
                        color= "#fff"
                        returnKeyType="next"
                        autoCorrect={false}
                        style={{color : "#fff"}}
                        value={FirstName}
                        placeholder="Vorname"
                        onChangeText={this.firstNameValidate}
                        errorMessage={this.state.fnError}
                    />
                </View>

                <View style={styles.nametext} >
                    <Input
                        placeholderTextColor= "#fff"
                        color= "#fff"
                        returnKeyType="done"
                        autoCorrect={false}
                        style={{color : "#fff"}}
                        value={LastName}
                        placeholder="Nachname"
                        onChangeText={this.lastNameValidate}
                        errorMessage={this.state.lnError}
                    />
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={this.buttonPress.bind(this)}
                  >
                  <Text style={styles.buttontext}> Speichern </Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
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
    alignItems: "center",
    paddingVertical: Dimensions.get("window").width / 8
  },
  profileImage: {
    width: Dimensions.get("window").width / 1.5,
    height: Dimensions.get("window").width / 1.5,
    marginBottom: 15,
  },

  button: {
    margin: 50,
    justifyContent: "center",
    //alignItems: "center",
    backgroundColor: "#4DBD33",
    borderRadius: Dimensions.get("window").width / 40
  },

  nametext: {
    width: 245,
    height: 54,
    padding: 10,
    borderWidth: 1,
    borderColor: 'white',
    marginBottom: 10,
  },

  buttontext: {
    color: "white",
    padding: 12,
    justifyContent: "center",
    fontSize: Dimensions.get("window").width / 15
  }
});


const mapStateToProps = ({userID, apiKey}) => ({
    userID,
    apiKey,
});

const mapDispatchToProps = {
    setApiKey,
    setUserID,
};

//make this component available to the app
export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
