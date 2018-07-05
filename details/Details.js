import React from 'react';
import {
  Button,
  View,
  Text,
  StyleSheet,
  Linking,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated
} from 'react-native';
import { MapView } from 'expo';
import Html from "./html";
import { storage } from "../index";
import * as Alert from "react-native/Libraries/Alert/Alert";
import { Ionicons } from '@expo/vector-icons';
import Expo from "expo";

const mapContainer = {
  width: '100%', height: 200, flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
  backgroundColor: 'white',
}

const maxWidth = Dimensions.get('window').width;

const fullWidth = { width: '100%', height: '100%' }

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
};

const imgStyle = {
  alignSelf: 'center',
  resizeMode: 'cover',
  width: maxWidth,
  height: 300,
};

const containerStyles = {
  flex: 1,
  justifyContent: 'flex-start',
  alignItems: 'center',
  flexDirection: 'column',
  paddingTop: 0
};

const linkStyle = { color: 'blue' };

class DetailsScreen extends React.PureComponent {
  state = {
    event: {},
    htmlReady: false,
  };

  x = new Animated.Value(0);
  showContent = new Animated.Value(0);

  componentDidMount() {
    this.fetchEvent(this.props.event);
    this.props.onContentDidMount();
  }

  slide = () =>
    Animated.timing(this.x, {
      toValue: -1000,
      duration: 500,
      useNativeDriver: true
    }).start(this.props.onClose);

  async fetchEvent(shortEventInfo) {
    try {
      const event = await storage.load({
        id: shortEventInfo.id,
        key: 'event',
      });

      this.setState({ event }, () => Animated.timing(this.showContent, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start());

    } catch (err) {
      Alert.alert(
        'Error while loading event',
        [
          { text: 'Ok', onPress: this.props.onClose },
        ],
      );
    }
  };

  render() {
    const { event, showContent } = this.state;
    const { openProgress, isAnimating } = this.props;

    const start = new Date(event.start_date);
    const end = new Date(event.finish_date);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const startdate = start.toLocaleDateString("en-US", options);
    const enddate = end.toLocaleDateString("en-US", options);

    const coordinate = event.geo ? {
      latitude: parseFloat(event.geo.latitude),
      longitude: parseFloat(event.geo.longitude),
    } : {};

    const containerScrollStyles = StyleSheet.absoluteFill;
    containerScrollStyles.marginTop = Expo.Constants.statusBarHeight;

    return (
      <Animated.ScrollView style={[containerScrollStyles, {
        transform: [
          {
            translateX: this.x
          }
        ]
      }]}>

        <Animated.View
          style={{
            position: 'absolute',
            top: 230,
            left: 30,
            opacity: showContent,
            zIndex: 999,
          }}
          pointerEvents={isAnimating ? 'none' : 'auto'}
        >
          <TouchableOpacity
            onPress={this.slide}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 50,
              height: 50,
              backgroundColor: '#fff',
              borderRadius: 100,
            }}
          >
            <Ionicons name="md-arrow-round-back" size={20} color="black"/>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={{
            position: 'absolute',
            top: 230,
            right: 30,
            opacity: showContent,
            zIndex: 999,
          }}
          pointerEvents={isAnimating ? 'none' : 'auto'}
        >
          <TouchableOpacity
            onPress={this.props.onClose}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 50,
              height: 50,
              backgroundColor: '#fff',
              borderRadius: 100,
            }}
          >
            <Ionicons name="md-calendar" size={20} color="black"/>
          </TouchableOpacity>
        </Animated.View>


        <View style={containerStyles}>

          <Animated.Image style={{
            width: maxWidth, height: 300, opacity: openProgress.interpolate({
              inputRange: [0, 0.99, 0.995],
              outputRange: [0, 0, 1]
            })
          }} source={this.props.event.image}/>

          <Animated.View
            style={[
              styles.body,
              {
                opacity: showContent,
                transform: [
                  {
                    translateY: openProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [500, 0]
                    })
                  }
                ],
                backgroundColor: '#fff',
              }
            ]}
          >
            <View style={[containerStyles, { margin: 10, marginBottom: 0, textAlign: 'center' }]}>
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
            </View>
            <View style={containerStyles}>
              <View style={htmlContainer}>
                <Html content={event.content}/>
              </View>

              {
                this.props.animatedAll &&
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
          </Animated.View>
        </View>
      </Animated.ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    color: '#000',
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 50
  },
  description: {
    color: '#333',
    fontSize: 14
  },
  body: { width: maxWidth },
  closeText: { color: 'white', backgroundColor: 'transparent' },
  closeButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
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
});

export default DetailsScreen

