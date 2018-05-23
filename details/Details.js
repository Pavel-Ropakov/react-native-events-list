import React from 'react';
import {Button, View, Text, StyleSheet, Linking, Dimensions, Image, ScrollView, TouchableOpacity, Animated} from 'react-native';
import {MapView} from 'expo';
import Html from "./html";
import {storage} from "../index";
import * as Alert from "react-native/Libraries/Alert/Alert";

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

class DetailsScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      event: {},
      htmlReady: false
    }
  }


    componentDidMount() {
      this.onFetchEvent();
    }

    onFetchEvent () {
        // const { id } = this.props.navigation.state.params;
        const { id } = this.props.params;
        try {
            storage.load({
                id,
                key: 'event',
            }).then((data) => {

                this.setState({
                    event: data
                });
            })

        } catch (err) {
            Alert.alert(
                'Error while loading event',
                [
                    { text: 'Ok', onPress: this.props.navigation.goBack },
                ],
            );
        }
    };

  componentWillReceiveProps(nextProps) {
    const { isAnimating } = nextProps;
    if (!isAnimating && this.props.isAnimating !== isAnimating) {
      this.setState({show : true})
    }
  }

  render() {
    const {event} = this.state
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

    return (
      <ScrollView style={[StyleSheet.absoluteFill]}>
        <View style={containerStyles}>
          {this.state.show  && <Image style={imgStyle} source={imgUri} />}

        </View>
      </ScrollView>
    );
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
  body: { flex: 1, padding: 15 },
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