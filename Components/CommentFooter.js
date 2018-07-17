import React from 'react'
import PropTypes from 'prop-types' // 15.6.0
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native'

class CommentFooter extends React.Component {
  static propTypes = {
    hasMore: PropTypes.bool,
    isLoading: PropTypes.bool,
    data: PropTypes.array,
  }

  static defaultProps = {
    hasMore: false,
    isLoading: false,
  }

  render() {
    const { data, hasMore, isLoading } = this.props
    let title = ""
    if(data.length === 0){
        title = "Noch keine Kommentare vorhanden, sei der Erste...!"
    } else {
        title = hasMore ? 'Loading more...' : ''
    }
    
    return (
      <View style={styles.container}>
        <ActivityIndicator style={{ opacity: hasMore ? 1 : 0 }} animating={isLoading} />
        <Text style={styles.title}>
          {title}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    flexDirection: 'row',
  },
  title: {
    opacity: 0.7,
    marginLeft: 8,
    marginRight: 20,
  },
})

export default CommentFooter
