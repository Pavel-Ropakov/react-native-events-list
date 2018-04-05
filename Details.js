
import React from 'react';
import {Button, View, Text, Image} from 'react-native';
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
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Image style={{width: 50, height: 50}} source={{uri: this.state.event.hero_image_url}}  />
              <Text>Details Screen</Text>
            </View>
        );
    }
}

export default  DetailsScreen