//import libraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, StatusBar } from 'react-native';
import { Container, Icon, Header, Left, Right, Body, Button } from 'native-base';
import CardComponent from '../CardComponent'
import { connect } from 'react-redux';
import Footer from './Footer';
import { BASE_URL, WALLS_CONTROLLER } from '../../reducer';
import '@expo/vector-icons';
import _ from 'lodash';


// create a component
class HomeTab extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
          contentLength: 0,
          hasMore: false,
          data: [],
          page: 1,
          loading: false,
          error: null,
          refreshing: false,
        };
    }

    static navigationOptions = {
        tabBarIcon: ({tintColor})=>(
            <Icon name='ios-apps-outline' style={{color:tintColor}}/>
        ),
        header: null
    }

    componentDidMount() {
        this.setState({hasMore: true});
        this.makeRemoteRequest();
    }

    makeRemoteRequest = () => {
        const url = BASE_URL + WALLS_CONTROLLER + this.props.wallSlug;
        const { page } = this.state;
        this.setState({ loading: true });
    
        fetch(url)
          .then(res => res.json())
          .then(res => {
                if(this.state.contentLength == res.data.length){
                    this.setState({
                        hasMore: false,
                        data: this.state.data,
                        error: res.error || null,
                        loading: false,
                        refreshing: false,
                    });                  
                }else{
                    newData = this.state.data.concat(res.data);
                    this.setState({
                        hasMore: false,
                        data: page === 1 ? res.data : _.uniqWith(newData, _.isEqual),
                        error: res.error || null,
                        loading: false,
                        refreshing: false,
                    });
                }
          })
          .catch(error => {
            this.setState({ error, loading: false });
          });
    };

    handleRefresh = () => {
        console.log('_onRefresh');
        this.setState(
            {
            page: 1,
            hasMore: true,
            refreshing: true,
            },
            () => {
            this.makeRemoteRequest();
            }
        );  
    };

    handleLoadMore = () => {
        console.log('_onEndReached');
        this.setState(
            {
              hasMore: true,
              page: this.state.page + 1,
            },
            () => {
              this.makeRemoteRequest();
            }
        );
    };

    prequel() {
        this.props.navigation.navigate('Main')
    }

    profile() {
        this.props.navigation.navigate('Profile')
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
            container: {
                flex: 1,
                backgroundColor: '#fff',
            },
        });

        const { media } = this.props;
        
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
                            {this.props.wallName}
                        </Text>
                    </Body>
                    <Right>
                        <Button transparent onPress={this.profile.bind(this)}>
                            <Icon name='ios-menu-outline' style={{paddingLeft:10, color:'black' }} />
                        </Button>
                    </Right>
                </Header>
        
                <View>
                    <FlatList
                        data={this.state.data}
                        renderItem={({ item }) => (
                            <CardComponent navigation = {this.props.navigation} item = {item} />
                        )}
                        keyExtractor={item => item.id}
                        onRefresh={this.handleRefresh}
                        refreshing={this.state.refreshing}
                        onEndReached={this.handleLoadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={
                            <Footer hasMore={this.state.hasMore} isLoading={this.state.loading} />
                        }
                    />
                </View>
            </Container>
        );
    }
}

const mapStateToProps = ({wallSlug, wallID, wallName}) => ({
    wallSlug,
    wallID,
    wallName
});

const mapDispatchToProps = {
};

//make this component available to the app
export default connect(mapStateToProps, mapDispatchToProps)(HomeTab);
