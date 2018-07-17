//import libraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, Alert } from 'react-native';
import { ShakeEventExpo } from '../../lib/ShakeEventExpo'
import { Container, Content, Icon, Thumbnail, Header, Left, Right, Body, Button } from 'native-base';
import YTSearch from 'youtube-api-search';
import SearchBar from '../SearchBar';
import VideoList from '../VideoList';

const API_KEY = 'AIzaSyBuzmw6vQhDjPKQK2k22b2NqqbI0DKiakg';

// create a component
class AddVideoTab extends Component {
    state = {
        loading: false,
        videos: []
      }
    
      onPressSearch = term => {
        this.searchYT(term);
      }
    
      searchYT = term => {
        this.setState({ loading: true });
        YTSearch({ key: API_KEY, term }, videos => {
          console.log(videos);
          this.setState({
            loading: false,
            videos
          });
        });
      }

    static navigationOptions = {
        tabBarIcon: ({tintColor})=>(
            <Icon name="ios-film-outline" style={{color:tintColor}}/>
        )
    }

    componentWillMount() {
        ShakeEventExpo.addListener(() => {
            Alert.alert('Shaking!!!');
        });
       }

    prequel() {
        this.props.navigation.navigate('Main')
    }
    profile() {
        this.props.navigation.navigate('Profile')
    }

    render() {
        const { loading, videos } = this.state;

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
        
            }
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
                        <Text>
                            Videos
                        </Text>
                    </Body>
                    <Right>
                        <Button transparent onPress={this.profile.bind(this)}>
                            <Icon name='ios-menu-outline' style={{paddingLeft:10, color:'black' }} />
                        </Button>
                    </Right>
                </Header>
                <View style={{ flex: 1, backgroundColor: '#ddd' }}>
        <SearchBar
          loading={loading}
          onPressSearch={this.onPressSearch}
        />
        <VideoList videos={videos} />
      </View>
            </Container>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default AddVideoTab;
