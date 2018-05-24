import React from 'react';
import {Button, View, Text, StyleSheet, Linking, Dimensions, Image, ScrollView, TouchableOpacity, Animated} from 'react-native';
import {MapView} from 'expo';
import Html from "./html";
import {storage} from "../index";
import * as Alert from "react-native/Libraries/Alert/Alert";
import { Ionicons } from '@expo/vector-icons';
import Expo from "expo";

const mapContainer = {
  width: '100%', height: 200, flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
  backgroundColor: 'white',
}

const maxWidth = Dimensions.get('window').width;

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
  // height: 150,
  // width: 150,
  // borderWidth: 1,
  // borderRadius: 75,
  resizeMode: 'cover',
  width: maxWidth,
  height: 300,
}

const containerStyles = {
  flex: 1,
  justifyContent: 'flex-start',
  alignItems: 'center',
  flexDirection: 'column',
  paddingTop: 0
}

const linkStyle = {color: 'blue'}

class DetailsScreen extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      event: {},
      htmlReady: false,
      localPhoto: null,
      showContent: new Animated.Value(0),
    }
    this.onFetchEvent = this.onFetchEvent.bind(this)
  }

  onFetchEvent (event) {
        if (event && event.id) {
          fetch(`http://events-aggregator-workshop.anadea.co:8080/events/${event.id}`)
            .then((r) => r.json())
            .then((responseJson) => {
              this.setState({event: responseJson})
            })
          // try {
          //     storage.load({
          //         id: event.id,
          //         key: 'event',
          //     }).then((data) => {
          //
          //         this.setState({
          //             event: data
          //         });
          //     })
          //
          // } catch (err) {
          //   debugger
          //     // Alert.alert(
          //     //     'Error while loading event',
          //     //     [
          //     //         { text: 'Ok', onPress: this.props.onClose },
          //     //     ],
          //     // );
          // }
        }
    };

  componentWillReceiveProps(nextProps) {
    const { isAnimating } = nextProps;
    if (isAnimating && this.props.isAnimating !== isAnimating) {
      this.onFetchEvent(nextProps.event);
    }
    if (!isAnimating && this.props.isAnimating !== isAnimating) {
      this.setState({show: true})
      this.setState({showContent: new Animated.Value(0)}, () => {
        this.state.showContent.interpolate({
          inputRange: [0.005, 0.01],
          outputRange: [1, 0]
        })
        Animated.timing(this.state.showContent, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        }).start();
      })
    }

    const { photo } = nextProps;
    if (photo) {
      this.setState({ localPhoto: photo });
    } else  this.setState({ localPhoto: null });
  }

  render() {
    const {event, localPhoto, showContent} = this.state
    const {openProgress} = this.props

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
    const containerScrollStyles = StyleSheet.absoluteFill
    containerScrollStyles.marginTop = Expo.Constants.statusBarHeight
    if (localPhoto) {
      return (
        <ScrollView style={[containerScrollStyles]}>
          <View style={containerStyles}>
            <Animated.Image style={{
              width: maxWidth, height: 300, opacity: openProgress.interpolate({
                inputRange: [0, 0.99, 0.995],
                outputRange: [0, 0, 1]
              })
            }} source={localPhoto.props.source}/>


            <Animated.View
              style={[
                styles.body,
                {
                  opacity: showContent,
                  backgroundColor: '#fff',
                }
              ]}
            >

              <TouchableOpacity
                onPress={() => this.props.onClose()}
                style={{
                  alignItems:'center',
                  justifyContent:'center',
                  width:50,
                  height:50,
                  backgroundColor:'#fff',
                  borderRadius:100,
                }}
              >
                <Ionicons name="md-arrow-round-back" size={20} color="black" />
              </TouchableOpacity>
              
              
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
            </Animated.View>
          </View>
        </ScrollView>
      );
    }
    return <View />;
  }


  static navigationOptions = ({navigation}) => {
    const {params} = navigation.state;
    return {
      title: params ? params.eventTitle : 'Details',
    }
  }
}

const styles = StyleSheet.create({
  title: {
    color: '#000',
    fontSize: 22,
    fontWeight: '600',
    // fontFamily: 'Avenir Next',
    lineHeight: 50
  },
  description: {
    color: '#333',
    fontSize: 14
    // fontFamily: 'Avenir Next'
  },
  body: { width: maxWidth, padding: 15 },
  closeText: { color: 'white', backgroundColor: 'transparent' },
  closeButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'white',
    padding: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'white',
    borderRadius: 5
  }
});

const textStyles = StyleSheet.create({
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default DetailsScreen

