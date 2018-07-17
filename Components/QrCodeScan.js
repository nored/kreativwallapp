//import libraries
import React, { Component } from 'react';
import {
    Alert,
    Linking,
    Dimensions,
    LayoutAnimation,
    Text,
    View,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { BarCodeScanner, Permissions } from 'expo';
import { connect } from 'react-redux';
import { setSlug, setWallID, setWallName, BASE_URL, WALLS_CONTROLLER } from '../reducer';

// create a component
class QrCodeScan extends Component {
    state = {
        hasCameraPermission: null,
        lastScannedUrl: null,
    };

    componentDidMount() {
        this._requestCameraPermission();
    }

    _requestCameraPermission = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermission: status === 'granted',
        });
    };

    _handleBarCodeRead = result => {
        if (result.data !== this.state.lastScannedUrl) {
            LayoutAnimation.spring();
            this.setState({ lastScannedUrl: result.data });
        }
    };

    render() {
        return (
            <View style={styles.container}>

            {this.state.hasCameraPermission === null
                ? <Text>Requesting for camera permission</Text>
                : this.state.hasCameraPermission === false
                    ? <Text style={{ color: '#fff' }}>
                        Camera permission is not granted
                    </Text>
                    : <BarCodeScanner
                        onBarCodeRead={this._handleBarCodeRead}
                        style={{
                        height: Dimensions.get('window').height,
                        width: Dimensions.get('window').width,
                        }}
                    />}

            {this._maybeRenderUrl()}
            <StatusBar hidden />
            </View>
        );
    }

    _checkExists() {
        query = BASE_URL + WALLS_CONTROLLER + this.state.lastScannedUrl;
        axios.get(query)
            .then((response) => {
                var data = response.data ? response.data : false;
                if (data) {
                    this.props.setWallID(data.id);
                    this.props.setWallName(data.name);
                    this.props.setSlug(this.state.lastScannedUrl);
                    this.props.navigation.navigate('Home');
                }
            }).catch((error) => {
                console.log(error);
                Alert.alert("Entschuldige bitte, die Wall \"" + this.state.lastScannedUrl + "\" konnte nicht gefunden werden.");
                this.setState({ lastScannedUrl: null });
            });
    }

    _handlePressCancel = () => {
        this.setState({ lastScannedUrl: null });
    };

    _maybeRenderUrl = () => {
        if (!this.state.lastScannedUrl) {
            return;
        }

        return (
            <View style={styles.bottomBar}>
                <Text style={styles.text}>{this.state.lastScannedUrl}</Text>
                <View style={styles.bottomBarIncludes}>
                    <TouchableOpacity style={styles.url} onPress={this._checkExists.bind(this)}>
                        <Text numberOfLines={1} style={styles.urlText}>
                        Öffnen
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={this._handlePressCancel}>
                        <Text style={styles.cancelButtonText}>
                        Abbrechen
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
}

// define your styles
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000',
    },
    text: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      color: '#fff',
      fontSize: 30,
      paddingBottom: 30,

    },
    bottomBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: 15,
      paddingBottom: 200,
      flexDirection: 'column',
    },
    bottomBarIncludes: {
        flexDirection: 'row',
    },
    url: {
      flex: 1,
    },
    urlText: {
      color: '#fff',
      fontSize: 20,
    },
    cancelButton: {
      marginLeft: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButtonText: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 18,
    },
  });

//make this component available to the app

const mapStateToProps = ({wallSlug, wallID, wallName}) => ({
    wallSlug,
    wallID,
    wallName
});

const mapDispatchToProps = {
  setSlug,
  setWallID,
  setWallName
};

//make this component available to the app
export default connect(mapStateToProps, mapDispatchToProps)(QrCodeScan);

