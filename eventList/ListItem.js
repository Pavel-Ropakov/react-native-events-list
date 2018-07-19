import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  ActivityIndicator, TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const colorPrimary = '#DC734A';
const itemHeight = 130
export const loader = <ActivityIndicator size="large" color={colorPrimary}/>

const containerStyle = {flexBasis: '60%', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: 5,}
const textStyle = {fontWeight: 'bold', padding: 5}
const timeStyle = {flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 10, alignItems: 'center'}
const iconStyle = {paddingRight: 10}
const imageContainer = {flexBasis: '40%', overflow: 'hidden'}
const imgStyle = {
  width: '100%',
  height: '100%',
  borderBottomRightRadius: 5,
  borderTopRightRadius: 5,
}
const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};

class ListItem extends React.PureComponent {
  constructor(props) {
    super(props)

    this.animatedScale = new Animated.Value(1)
    this.onPressIn = this.onPressIn.bind(this)
    this.onPressOut = this.onPressOut.bind(this)
  }

  onPressIn() {
    springAnimation(this.animatedScale, {toValue: 0.95});
  }

  onPressOut() {
    springAnimation(this.animatedScale, {toValue: 1});
  }

  render() {
    const {item, open} = this.props
    const animatedStyle = {
      transform: [{scale: this.animatedScale}],
    }
    const today = new Date(item.start_date)

    const string = today.toLocaleDateString("en-US", options)

    const imgScr = {uri: item.hero_image_url}

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          open({id: item._id, eventTitle: item.title, image: imgScr})
        }}
        // onPressIn={this.onPressIn}
        // onPressOut={this.onPressOut}
        delayPressOut={100}
      >
        <Animated.View style={[styles.item, animatedStyle, styles.itemAnimated]}>
          <View style={containerStyle}>
            <Text style={textStyle}>{item.title}</Text>
            <View style={timeStyle}>
              <Ionicons style={iconStyle} name="md-time" size={16} color="black" />
              <Text>{string} {item.start_time && item.finish_time ? ` | ${item.start_time} - ${item.finish_time}`: ''}</Text>
            </View>
          </View>
          <View style={imageContainer}>
            <Image
              ref={(i) => {
                this.props.onImageRef(item, i);
              }}
              style={imgStyle}
              source={imgScr}/>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flexDirection: 'row',
    flex: 1,
    height: itemHeight,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 7
  }
});

export function springAnimation(value, options) {
  const {toValue, tension, friction, autoplay = true, useNativeDriver = true} = options;

  const animated = Animated.spring(value, {
    toValue,
    tension,
    friction,
    useNativeDriver,
  })

  if (autoplay) {
    animated.start();
  }

  return animated;
}


export default ListItem
