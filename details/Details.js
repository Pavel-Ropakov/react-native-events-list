import React from 'react';
import {Button, View, Text, StyleSheet, Linking, Dimensions, Image, ScrollView} from 'react-native';
import HTML from "react-native-render-html";
import { MapView } from 'expo';


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


  renderers = {
    img: (attribs, children, cssStyles, { key }) => {
      const src = attribs.src
      const uri = src[0] === '/' ? `https://events.dev.by${src}` : src;
      return  (
        <View style={{flexDirection: 'row', justifyContent:'center', height: 100}}>
          <Image key={key} style={{width: '100%', height: '100%'}} source={{uri}}/>
        </View>
        )
    },
  };
  
    render() {
      const {event} = this.state
      const start = new Date(event.start_date)
      const end = new Date(event.finish_date)
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const startdate = start.toLocaleDateString("en-US",options)
      const enddate = end.toLocaleDateString("en-US",options)

      const coordinate = event.geo ? {
        latitude: parseFloat(event.geo.latitude),
        longitude: parseFloat(event.geo.longitude),
      } : {}
      
        return (
          <ScrollView>
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', paddingTop: 20}}>
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
                <Text style={textStyles.titleText}>
                  More info:
                </Text>
                <View style={{ width: '90%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 'auto', marginTop: 20, marginBottom: 20, padding: 10,
                  borderWidth: 1,
                  borderColor: '#d2d5d8',
                  backgroundColor: 'white',
                  borderRadius: 7
                }}>
                {
                  event.content &&
                    <HTML 
                      renderers={this.renderers}
                      html={event.content}
                      imagesMaxWidth={Dimensions.get('window').width}
                      baseFontStyle={{
                        color: 'rgb(51, 51, 51)',
                        fontSize: 14,
                      }}
                      allowedStyles={[]}
                    />
                }
                </View>

                {
                  !!event.geo &&
                  !!event.geo.latitude &&
                  !!event.geo.longitude && (
                    <View style={{ width: '100%', height: 200, flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                      backgroundColor: 'white',
                    }}>
    
                          <MapView
                              style={{ width: '100%', height: '100%'}}
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
            </View>
          </ScrollView>
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