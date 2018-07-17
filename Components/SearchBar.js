import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import { Button } from 'react-native-elements';

class SearchBar extends Component {
  state = { term: '' };

  render() {
    const {
      containerStyle,
      searchTextStyle,
      buttonStyle
    } = styles;

    return (
      <View style={containerStyle}>
        <TextInput
          placeholder="Nach Videos Suchen"
          placeholderTextColor= "#000"
          color= "#000"
          style={searchTextStyle}
          onChangeText={term => this.setState({ term })}
          value={this.state.term}
        />
        <Button
          buttonStyle={buttonStyle}
          title={this.props.loading ? 'Loading...' : 'Search'}
          onPress={() => this.props.onPressSearch(this.state.term)}
        />
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    marginTop: 0,
    backgroundColor: '#fff',
    flexDirection: 'row'
  },
  searchTextStyle: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    color : "#000"
  },
  buttonStyle: {
    height: 60,
    width: 100,
    marginBottom: 0,
    marginRight:0.
    
  }
};


export default SearchBar;
