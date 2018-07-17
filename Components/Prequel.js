//import libraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, Keyboard, Image, ImageBackground, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import {setSlug, setWallID, setWallName, BASE_URL, WALLS_CONTROLLER, setApiKey, setUserID, STD_API_KEY, STD_USER_ID, isAnon, setAnon, userID } from '../reducer';
import { Container, Header, Body, Button, Item, Input } from 'native-base';
import axios from 'axios';
import FlashMessage from "react-native-flash-message";
import { showMessage } from "react-native-flash-message";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

var backgroundImage = require('../assets/back.jpg')
var logoImage = require('../assets/logo.png')
// create a component
class Prequel extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
          wallSlug: ''
        };
    }
    
    onLogin() {
        Keyboard.dismiss()
        this.checkExists(this.state.wallSlug);
    }

    qr() {
        this.props.navigation.navigate('QR')
    }

    componentDidMount(){
        AsyncStorage.getItem("apiKey").then((kvalue) => {
            kvalue != null ? this.props.setApiKey(kvalue) : this.props.setApiKey(STD_API_KEY);
        }).done();
        AsyncStorage.getItem("userID").then((uvalue) => {
            uvalue != null ? this.props.setUserID(uvalue) : this.props.setUserID(STD_USER_ID);
        }).done();
        this.props.STD_USER_ID == this.props.userID ? this.props.setAnon(true) : this.props.setAnon(false)
    }
    
    checkExists(slug) {
        query = BASE_URL + WALLS_CONTROLLER + slug;
        axios.get(query)
            .then((response) => {
                var data = response.data ? response.data : false;
                if (data) {;
                    this.props.setWallID(data.id);
                    this.props.setWallName(data.name);
                    this.props.setSlug(slug);
                    this.props.navigation.navigate('Home');
                    this.setState({wallSlug: ''});
                }
            }).catch((error) => {
                console.log(error);
                showMessage({
                    message: "Entschuldige bitte, die Wall \"" + slug + "\" konnte nicht gefunden werden.",
                    type: "danger",
                    duration: "5000"
                  });
            });
    }
    
    static navigationOptions = {
        header: null,
        tabBarIcon: ({tintColor})=>(
            <Icon name='ios-apps-outline' style={{color:tintColor}}/>
        )
    }

    render() {
        const {loading} = this.props;
        if (loading) return <Text>Loading...</Text>;
        const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>
        const I = (props) => <Text style={{fontStyle: 'italic'}}>{props.children}</Text>

        const styles = StyleSheet.create({
            androidHeader: {
                ...Platform.select({
                    android: {
                        marginTop: StatusBar.currentHeight,
                        backgroundColor: 'white',
                        alignItems: 'center'
                    }
                })
            },
            container: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              },
            textArea: {
                flex: 1,
                alignItems: 'center',
                paddingTop: 52,
            },
            input: {
                width: 245,
                height: 54,
                padding: 10,
                borderWidth: 1,
                borderColor: 'white',
                marginBottom: 10,
                //color: '#fff'
                //backgroundColor: '#ecf0f1',
            },
            backgroundImage: {
                flex: 1,
                width: null,
                height: null,
                resizeMode: 'cover'
            },
            androidHeaderTitle: {
                ...Platform.select({
                    android: {
                        alignItems: 'center'
                    }
                })
        
            },
            logoContainer:{
                marginTop:150,
                justifyContent:'center',
                alignItems:'center'
            
            },
            logo:{
                height:150,
                width:150
            }
        });

        const QRCode = () =>
            <Button transparent onPress={this.qr.bind(this)} >
                <Icon name="qrcode-scan" size={24} color='white'/>
            </Button>

        return (
            <Container>
                <Header style={[styles.androidHeader]}>
                    <Body style={[styles.androidHeaderTitle]}>
                        <Text>
                            <I>Kreativ</I><B>Wall</B>
                        </Text>
                    </Body>
                </Header>
                <ImageBackground style={styles.container} source={backgroundImage}>
                    <View style={styles.logoContainer}>
                        <Image style={styles.logo}
                            source={logoImage}
                        />
                    </View>
                    <View style={styles.textArea}>
                        <Item style={styles.input} >
                            <Input 
                                placeholder=" Enter Wall Name"
                                placeholderTextColor= "#fff"
                                color= "#fff"
                                value={this.state.wallSlug}
                                onChangeText={(wallSlug) => this.setState({ wallSlug })}
                                onSubmitEditing={this.onLogin.bind(this)}
                                returnKeyType="search"
                                autoCorrect={false}
                                autoCapitalize="none"
                                style={{color : "#fff"}}
                            />
                            <QRCode />
                        </Item>
                    </View>
                </ImageBackground>
                <FlashMessage position="bottom" />
            </Container>            
        );
    }
}

const mapStateToProps = ({wallSlug, wallID, wallName, isAnon, userID}) => ({
      wallSlug,
      wallID,
      wallName,
      isAnon,
      userID
  });

const mapDispatchToProps = {
    setSlug,
    setWallID,
    setWallName,
    setApiKey, 
    setUserID,
    setAnon,
};

//make this component available to the app
export default connect(mapStateToProps, mapDispatchToProps)(Prequel);
