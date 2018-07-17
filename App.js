import React, { Component } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { BASE_URL } from './reducer';
import 'moment/locale/de';

import reducer from './reducer';
import Prequel from './Components/Prequel';
import QrCodeScan from './Components/QrCodeScan';
import HomeTab from './Components/AppTabNavigator/HomeTab';
import AddTextTab from './Components/AppTabNavigator/AddTextTab';
import AddPictureTab from './Components/AppTabNavigator/AddPictureTab';
import AddVideoTab from './Components/AppTabNavigator/AddVideoTab';
import CommentComponent from './Components/CommentComponent';
import Profile from './Components/Profile';
import EditProfile from './Components/EditProfile';
import Watchbutton from './Components/WatchButton';

const client = axios.create({
  baseURL: BASE_URL,
  responseType: 'json'
});

const store = createStore(reducer, applyMiddleware(axiosMiddleware(client)));

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppStackNavigator />
      </Provider> 
    );
  }
}

const AppTabNavigator = createBottomTabNavigator({
  HomeTab: {
      screen: HomeTab,
      navigationOptions: ({navigation}) =>({
        header: null,
      }),
  },
  AddTextTab: {
      screen: AddTextTab,
      navigationOptions: ({navigation}) =>({
        header: null,
      }),
  },
  AddPictureTab: {
      screen: AddPictureTab,
      navigationOptions: ({navigation}) =>({
        header: null,
      }),
  },
  AddVideoTab: {
      screen: AddVideoTab,
      navigationOptions: ({navigation}) =>({
        header: null,
      }),
  }

}, {
  swipeEnabled: true,
  tabBarPosition: "bottom",
  tabBarOptions: {
      style: {
          ...Platform.select({
              android: {
                  backgroundColor: 'white'
              }
          })
      },
      activeTintColor: '#000',
      inactiveTintColor: '#d1cece',
      showLabel: false,
      showIcon: true
  }
});

const AppStackNavigator = createStackNavigator({
  Main: {
    screen: Prequel,
    navigationOptions: ({navigation}) =>({
      header: null,
    }),
  },
  QR: {
    screen: QrCodeScan,
    navigationOptions: ({navigation}) =>({
      title: "QR-Code Scannen",
    }),
  },
  Comment: {
    screen: CommentComponent,
    navigationOptions: ({navigation}) =>({
      header: null,
    }),
  },
  Profile: {
    screen: Profile,
    navigationOptions: ({navigation}) =>({
      header: null,
    }),
  },
  EditProfile: {
    screen: EditProfile,
    navigationOptions: ({navigation}) =>({
      header: null,
    }),
  },
  Watchbutton: {
    screen: Watchbutton,
    navigationOptions: ({navigation}) =>({
      header: null,
    }),
  },
  Home: {
    screen: AppTabNavigator,
    navigationOptions: ({navigation}) =>({
      header: null,
    }),
  },
}, {
    initialRouteName: 'Main',
    swipeEnabled: true,
    //mode: 'modal'
});

