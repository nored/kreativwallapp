import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, Alert, TextInput, KeyboardAvoidingView, Keyboard, Image } from 'react-native';
import { ShakeEventExpo } from '../../lib/ShakeEventExpo'
import { Container, Content, Icon, Thumbnail, Header, Left, Right, Body, Button } from 'native-base';
import { BASE_URL, wallID, COMMENTS_CONTROLLER, STD_API_KEY, STD_USER_ID, setApiKey, setUserID, USERS_CONTROLLER, STD_IMAGE, isAnon, TEXT_POST_CONTROLLER } from '../../reducer';
import { connect } from 'react-redux';
import PopupDialog, {DialogTitle, DialogButton, SlideAnimation, ScaleAnimation, FadeAnimation, } from 'react-native-popup-dialog';

const slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });
// create a component
class AddTextTab extends Component {

    constructor (props) {
        super(props);
        this.state = {
          newValue: '',
          value: '',
          height: 40,
          dialogShow: false,
        }
      }

      sendTextsToBackend = () => {
        let key = (this.props.isAnon? STD_API_KEY : this.props.apiKey)
        let id = (this.props.isAnon? STD_USER_ID : this.props.userID)
        let userData = {};
        userData["user_id"] = id
        userData["wall_id"] = this.props.wallID
        userData["contend"] = this.state.value;
          
    
        let data = {
          method: 'POST',
          body: JSON.stringify({
            text_post: userData
          }),
          headers: {
            'Accept':       'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + key
          }
        }
        let URL = BASE_URL+TEXT_POST_CONTROLLER
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
    
    updateSize = (height) => {
        this.setState({
            height
        });
    }

    showSlideAnimationDialog = () => {
        Keyboard.dismiss()
        this.slideAnimationDialog.show();
        ShakeEventExpo.addListener(() => {
            this.sendTextsToBackend()
        });
    }

    hideSlideAnimationDialog = () => {
        this.slideAnimationDialog.dismiss();
    }


    static navigationOptions = {
        tabBarIcon: ({tintColor})=>(
            <Icon name="ios-create-outline" style={{color:tintColor}}/>
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

    render() {

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

        const {newValue, height} = this.state;

        let newStyle = {
            height
        }

        return (
            <Container style={styles.container}>

                <Header style={[styles.androidHeader]}>
                    <Left>
                        <Button transparent onPress={this.prequel.bind(this)}>
                            <Icon name='ios-close-circle-outline' style={{paddingLeft:10, color:'black' }} />
                        </Button>
                    </Left>
                    <Body style={[styles.androidHeaderTitle]}>
                        <Text>
                            Text
                        </Text>
                    </Body>
                    <Right>
                        <Button transparent onPress={this.profile.bind(this)}>
                            <Icon name='ios-menu-outline' style={{paddingLeft:10, color:'black' }} />
                        </Button>
                    </Right>
                </Header>
                <View style={styles.input}>
                    <KeyboardAvoidingView style={styles.keyboardAvoidContainer} behavior="height" >
                        <TextInput
                            placeholder="Füge einen Text hinzu"
                            autoFocus
                            onChangeText={(value) => this.setState({value})}
                            style={[newStyle]}
                            editable={true}
                            multiline={true}
                            onSubmitEditing={this.showSlideAnimationDialog}
                            returnKeyType="done"
                            value={this.state.value}
                            onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
                        />
                    </KeyboardAvoidingView>
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
export default connect(mapStateToProps, mapDispatchToProps)(AddTextTab);
