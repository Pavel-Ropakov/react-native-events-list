import React from 'react';
import {Button, View, Text, StyleSheet, Linking, Dimensions, Image, ScrollView} from 'react-native';


class AutoScaledImage extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      width: null,
      height: null
    }
    const maxWidth = props.maxWidth
    Image.getSize(props.uri, (width, height) => {
      if (width > maxWidth) {
        this.setState({width: maxWidth, height: height*(maxWidth/width)})
      } else {
        this.setState({width, height})
      }
    })
  }

  render() {
    const {width, height} = this.state
    return (
      width && height && 
      <Image resizeMode='cover' style={{width, height, borderRadius: 5}} source={{uri: this.props.uri}}/>
    )
  }
}


export default AutoScaledImage