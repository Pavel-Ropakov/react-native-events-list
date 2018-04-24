import React from 'react';
import {Button, View, Text, StyleSheet, Linking, Dimensions, Image, ScrollView} from 'react-native';
import {MapView} from 'expo';
import Html from "./html";

const mapContainer = {
  width: '100%', height: 200, flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
  backgroundColor: 'white',
}

const fullWidth = {width: '100%', height: '100%'}

const htmlContainer = {
  width: '90%',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  margin: 'auto',
  marginTop: 20,
  marginBottom: 20,
  padding: 10,
  borderWidth: 1,
  borderColor: '#d2d5d8',
  backgroundColor: 'white',
  borderRadius: 7
}

const imgStyle = {
  alignSelf: 'center',
  height: 150,
  width: 150,
  borderWidth: 1,
  borderRadius: 75,
  resizeMode: 'cover'
}

const containerStyles = {
  flex: 1,
  justifyContent: 'flex-start',
  alignItems: 'center',
  flexDirection: 'column',
  paddingTop: 20
}

const linkStyle = {color: 'blue'}

class DetailsScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      event: {},
      htmlReady: false
    }
    const id = props.navigation.state.params.id
    fetch(`http://events-aggregator-workshop.anadea.co:8080/events/${id}`)
      .then((r) => r.json())
      .then((responseJson) => {
        this.setState({event: responseJson})
      })
  }

  render() {
    const {event} = this.state

    const start = new Date(event.start_date)
    const end = new Date(event.finish_date)
    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    const startdate = start.toLocaleDateString("en-US", options)
    const enddate = end.toLocaleDateString("en-US", options)

    const coordinate = event.geo ? {
      latitude: parseFloat(event.geo.longitude),
      longitude: parseFloat(event.geo.latitude),
    } : {}
    
    const imgUri = {uri: event.hero_image_url}

    return (
      <ScrollView>
        <View style={containerStyles}>
          <Image style={imgStyle} source={imgUri} />
          
          <Text style={textStyles.titleText}>{event.title}</Text>
          <Text>Start: {`${startdate} ${event.start_time}`}</Text>
          <Text>End: {`${enddate} ${event.finish_time}`}</Text>
          <Text>Phone: {event.phone_number}</Text>
          <Text>Adress: {event.address}</Text>
          <Text>Price: {event.price}</Text>
          <Text style={linkStyle} onPress={() => Linking.openURL(event.link)}>
            Open in browser
          </Text>
          <Text style={textStyles.titleText}>
            More info:
          </Text>

          <View style={htmlContainer}>
            <Html content={event.content}/>
          </View>

          {
            !!event.geo &&
            !!event.geo.latitude &&
            !!event.geo.longitude && (
              <View style={mapContainer}>
                <MapView
                  style={fullWidth}
                  initialRegion={{
                    ...coordinate,
                    latitudeDelta: 0.0043,
                    longitudeDelta: 0.0034,
                  }}
                >
                  <MapView.Marker
                    coordinate={coordinate}
                  />
                </MapView>
              </View>
            )
          }
        </View>
      </ScrollView>
    );
  }


  static navigationOptions = ({navigation}) => {
    const {params} = navigation.state;
    debugger
    return {
      title: params ? params.eventTitle : 'Details',
    }
  }
}

const textStyles = StyleSheet.create({
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default DetailsScreen