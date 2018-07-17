//import libraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, WebView } from 'react-native';
import moment from 'moment';
import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Icon } from 'native-base';
import { BASE_URL, LIKES_CONTROLLER, userID, apiKey, isAnon, STD_API_KEY, STD_USER_ID } from '../reducer';
import { connect } from 'react-redux';

// create a component
class CardComponent extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
          likes: parseInt(this.props.item.likesize),
        };
    }

    content() {
        if(this.props.item.instance === 't'){
            return <Text style={{ marginLeft: 20, marginRight: 20, textAlign: 'justify', height: 200, width: null, flex: 1 }}>{this.props.item.content.content}</Text>
        } else if (this.props.item.instance === 'p'){
            return <Image source={{uri: this.props.item.content.content.url}} style={{ height: 200, width: null, flex: 1 }} /> 
        } else if (this.props.item.instance === 'v'){
            return <WebView style={{ height: 200, width: null, flex: 1 }} javaScriptEnabled={true} domStorageEnabled={true} source={{uri: 'https://www.youtube.com/embed/'+ this.props.item.content.content }}/>
        }
    }

    like(){
        this.setState({likes: parseInt(this.state.likes +1)})
        this.sendLikesToBackend()
    }

    sendLikesToBackend = () => {
        let key = (this.props.isAnon? STD_API_KEY : this.props.apiKey)
        let id = (this.props.isAnon? STD_USER_ID : this.props.userID)
        let instance = this.props.item.instance
        let postID = this.props.item.content.id
        let userData = {};
        userData["user_id"] = id
        if(instance === 't'){
          userData["text_post_id"] = postID;
        } else if(instance === 'p'){
          userData["picture_post_id"] = postID;
        } else {
          userData["video_post_id"] = postID;
        }
          
    
        let data = {
          method: 'POST',
          body: JSON.stringify({
            like: userData
          }),
          headers: {
            'Accept':       'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + key
          }
        }
        let URL = BASE_URL+LIKES_CONTROLLER
        fetch(URL, data)
          .then(res => res.json())
          .then(res => {
              console.log(res)                 
        })
        .catch(error => {
            this.setState({ error, loading: false });
            console.log(error)
        });
      }

    comment(){
        this.props.navigation.push('Comment', { data : this.props.item.comments, id: this.props.item.content.id, instance: this.props.item.instance})
    }

    render() {

        return (
            <Card>
                <CardItem>
                    <Left>
                        <Thumbnail source={{uri: this.props.item.avatar}}/>
                        <Body>
                            <Text>{this.props.item.username} </Text>
                            <Text note>{moment(this.props.item.content.created_at).format('dd, Do MMMM YYYY')}</Text>
                        </Body>
                    </Left>
                </CardItem>
                <CardItem cardBody>
                    {this.content()}
                </CardItem>
                <CardItem style={{height:45}} >
                    <Left>
                        <Button transparent onPress={this.like.bind(this)} >
                            <Icon name="ios-heart-outline"
                            style={{color:"black"}}/>
                        </Button>
                        <Text>{this.state.likes}</Text>
                        <Text>     </Text>
                        <Button transparent onPress={this.comment.bind(this)} >
                            <Icon name="ios-chatbubbles-outline"
                            style={{color:'black'}}/>
                        </Button>
                        <Text>{this.props.item.commentsize}</Text>
                    </Left>
                </CardItem>
            </Card>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

//make this component available to the app
const mapStateToProps = ({userID, apiKey, isAnon}) => ({
    userID,
    apiKey,
    isAnon
});

const mapDispatchToProps = {
};

//make this component available to the app
export default connect(mapStateToProps, mapDispatchToProps)(CardComponent);
