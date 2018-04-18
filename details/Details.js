
import React from 'react';
import {Button, View, Text, Image, StyleSheet, Linking} from 'react-native';
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
      const {event} = this.state
      const start = new Date(event.start_date)
      const end = new Date(event.finish_date)
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const startdate = start.toLocaleDateString("en-US",options)
      const enddate = end.toLocaleDateString("en-US",options)
        return (
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', paddingTop: 20 }}>
                <Image style={{
                  alignSelf: 'center',
                  height: 150,
                  width: 150,
                  borderWidth: 1,
                  borderRadius: 75,
                  resizeMode: 'cover'
                }} source={{uri: this.state.event.hero_image_url}}  />
              <View style={{ width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingTop: 20 }}>
                <Text style={textStyles.titleText}>{event.title}</Text>
                <Text>Start: {`${startdate} ${event.start_time}`}</Text>
                <Text>End: {`${enddate} ${event.finish_time}`}</Text>
                <Text>Phone: {event.phone_number}</Text>
                <Text>Adress: {event.address}</Text>
                <Text>Price: {event.price}</Text>
                <Text style={{color: 'blue'}}
                      onPress={() => Linking.openURL(event.link)}>
                  Open in browser
                </Text>
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