//import libraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, Alert, Image, Dimensions } from 'react-native';
import { ShakeEventExpo } from '../../lib/ShakeEventExpo'
import { Container, Content, Icon, Thumbnail, Header, Left, Right, Body, Button, ImageBackground } from 'native-base';
import { ImagePicker } from 'expo';
import { BASE_URL, wallID, COMMENTS_CONTROLLER, STD_API_KEY, STD_USER_ID, setApiKey, setUserID, USERS_CONTROLLER, STD_IMAGE, isAnon, PICTURE_POST_CONTROLLER } from '../../reducer';
import { connect } from 'react-redux';
import PopupDialog, {DialogTitle, DialogButton, SlideAnimation, ScaleAnimation, FadeAnimation, } from 'react-native-popup-dialog';

const slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });


// create a component
class AddPictureTab extends Component {
    constructor (props) {
        super(props);
        this.state = {
          image: "https://i.imgur.com/AxTtOGK.png",
          base64Picture: null,
        }
      }

      sendPicturesToBackend = () => {
        let key = (this.props.isAnon? STD_API_KEY : this.props.apiKey)
        let id = (this.props.isAnon? STD_USER_ID : this.props.userID)
        let userData = {};
        userData["user_id"] = id
        userData["wall_id"] = this.props.wallID
        userData["contend"] = "data:image/png;base64," + this.state.base64Picture
          
    
        let data = {
          method: 'POST',
          body: JSON.stringify({
            picture_post: userData
          }),
          headers: {
            'Accept':       'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + key
          }
        }
        let URL = BASE_URL+PICTURE_POST_CONTROLLER
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
    

    showSlideAnimationDialog = () => {
        this.slideAnimationDialog.show();
        ShakeEventExpo.addListener(() => {
            this.sendPicturesToBackend();
        });
    }

    hideSlideAnimationDialog = () => {
        this.slideAnimationDialog.dismiss();
    }

    static navigationOptions = {
        tabBarIcon: ({tintColor})=>(
            <Icon name="ios-image-outline" style={{color:tintColor}}/>
        )
    }

    componentWillMount() {
       }

    prequel() {
        this.props.navigation.navigate('Main')
    }
    profile() {
        this.props.navigation.navigate('Profile')
    }
         
    componentWillUnmount() {
    ShakeEventExpo.removeListener();
    }

    _pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
          base64: true,
      });
  
      if (!result.cancelled) {
        this.setState(
          {
              image: result.uri,
              base64Picture: result.base64, 
          }
        );
      }
    };

    sendButton(){
      if(this.state.base64Picture != null){
        return <Button transparent onPress={this.showSlideAnimationDialog} style={{width: '70%', justifyContent: 'center', marginTop: 100, marginLeft: 53, backgroundColor:"green"}}>
          <Text>Absenden</Text>
        </Button>
      }
    }

    render() {
        let { image } = this.state;

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
        input: {
            padding: 20,
        },
        keyboardAvoidContainer: {
            flex: 1,
        },
        container: {
            flex: 1,
            backgroundColor: "white",
          },
          dialogContentView: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          },
          navigationBar: {
            borderBottomColor: '#b5b5b5',
            borderBottomWidth: 0.5,
            backgroundColor: '#ffffff',
          },
          navigationTitle: {
            padding: 10,
          },
          navigationButton: {
            padding: 10,
          },
          navigationLeftButton: {
            paddingLeft: 20,
            paddingRight: 40,
          },
          navigator: {
            flex: 1,
            // backgroundColor: '#000000',
          },
        });

        return (
            <Container style={styles.container}>

                <Header style={[styles.androidHeader]}>
                    <Left>
                        <Button transparent onPress={this.prequel.bind(this)}>
                            <Icon name='ios-close-circle-outline' style={{paddingLeft:10, color:'black' }} />
                        </Button>
                    </Left>
                    <Body style={[styles.androidHeaderTitle]}>
                        <Text>Bilder</Text>
                    </Body>
                    <Right>
                        <Button transparent onPress={this.profile.bind(this)}>
                            <Icon name='ios-menu-outline' style={{paddingLeft:10, color:'black' }} />
                        </Button>
                    </Right>
                </Header>
                <View style={{ flex: 1, }}>
                    {image &&
                        <Image source={{ uri: image }} style={{ marginTop: 150, marginLeft: Dimensions.get("window").width / 4.2, width: 200, height: 200 }} />}
                    {this.sendButton()}

                    <Button transparent onPress={this._pickImage} style={{width: '70%', justifyContent: 'center', marginTop: 50, marginLeft: 53, backgroundColor:"pink"}}>
                        <Text>Gallerie Öffnen</Text>
                    </Button>    
                </View>
                <PopupDialog
                    dialogTitle={<DialogTitle title="Zum Senden, Geste nachahmen..." />}
                    ref={(popupDialog) => {
                        this.slideAnimationDialog = popupDialog;
                    }}
                    dialogAnimation={slideAnimation}
                    >
                    <View style={styles.dialogContentView}>
                        <Image source={require('../../assets/g.gif')} />
                    </View>
                    <DialogButton 
                        text="Abbrechen"
                        onPress={this.hideSlideAnimationDialog}
                        textContainerStyle={{width: '100%', marginLeft: 0, backgroundColor:"pink"}}
                    />
                </PopupDialog>
            </Container>
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
export default connect(mapStateToProps, mapDispatchToProps)(AddPictureTab);
