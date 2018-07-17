import React , { Component } from 'react';
import { Button } from 'react-native-elements';
import { View, Text, StyleSheet, Platform, StatusBar, Alert, TextInput, KeyboardAvoidingView, Keyboard, Image } from 'react-native';
import { connect } from 'react-redux';
import { BASE_URL, wallID,  STD_API_KEY, STD_USER_ID, setApiKey, setUserID, USERS_CONTROLLER, STD_IMAGE, isAnon, VIDEO_POST_CONTROLLER } from '../reducer';


class WatchButton extends Component {
  constructor(props) {
    super(props);
    this.state = { videoId: null };
  }

  sendVideosToBackend = () => {
    console.log(this.state)
    console.log(this.props)
    let key = (this.props.isAnon? STD_API_KEY : this.props.apiKey)
    let id = (this.props.isAnon? STD_USER_ID : this.props.userID)
    let userData = {};
    userData["user_id"] = id
    userData["wall_id"] = this.props.wallID
    userData["contend"] = this.props.videoId
      
  
    let data = {
      method: 'POST',
      body: JSON.stringify({
        video_post: userData
      }),
      headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key
      }
    }
    let URL = BASE_URL+VIDEO_POST_CONTROLLER
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
    Alert.alert("Video wurde übermittelt.")
  }


  render() {
    let {videoId} = this.props

    return (
      <Button
      raised
      title="Zur Wall Hinzufügen"
      icon={{ name: 'play-arrow' }}
      containerViewStyle={{ marginTop: 10 }}
      backgroundColor="#E62117"
      onPress={() => {
        this.sendVideosToBackend(videoId);
      }}
    />
    );
  }
}

const mapStateToProps = ({userID, apiKey, isAnon, wallID}) => ({
  userID,
  apiKey,
  isAnon,
  wallID
});

const mapDispatchToProps = {

};

//make this component available to the app
export default connect(mapStateToProps, mapDispatchToProps)(WatchButton);