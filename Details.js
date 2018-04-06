
import React from 'react';
import {Button, View, Text, Image, StyleSheet} from 'react-native';
import { StackNavigator } from 'react-navigation';

class DetailsScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      event: {}
    }
    const id = props.navigation.state.params.id
    fetch(`http://events-aggregator-workshop.anadea.co:8080/events/${id}`)
      .then((r) => r.json())
      .then((responseJson) => {
        this.setState({event: responseJson})
      })

  }

    static navigationOptions = ({ navigation }) => {
      const { params } = navigation.state;
  
      return {
        title: params ? params.eventTitle : 'Details',
      }
    };
  
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column' }}>
                <Image style={{
                  alignSelf: 'center',
                  height: 150,
                  width: 150,
                  borderWidth: 1,
                  borderRadius: 75,
                  resizeMode: 'cover'
                }} source={{uri: this.state.event.hero_image_url}}  />
              <View style={{ width: '100%' }}>
                <Text style={textStyles.titleText}>{this.state.event.title}</Text>
              </View>
            </View>
        );
    }
}

const textStyles = StyleSheet.create({
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default  DetailsScreen