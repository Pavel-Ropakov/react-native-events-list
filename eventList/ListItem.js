import React from 'react';
import {
  Button,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Animated,
  RefreshControl,
  ActivityIndicator, TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const colorPrimary = '#DC734A';
const itemHeight = 130
export const loader = <ActivityIndicator size="large" color={colorPrimary}/>

const AnimatedBackgroundImage = Animated.createAnimatedComponent(Image);

class ListItem extends React.Component {
  constructor(props) {
    super(props)

    this.animatedScale = new Animated.Value(1)
  }

  onPressIn() {
    springAnimation(this.animatedScale, {toValue: 1.1});
  }

  onPressOut() {
    springAnimation(this.animatedScale, {toValue: 1});
  }


  render() {
    const {item, navigation} = this.props
    const animatedStyle = {
      transform: [{scale: this.animatedScale}],
    }
    const today = new Date(item.start_date)
    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    const string = today.toLocaleDateString("en-US", options)

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate('Details', {id: item._id, eventTitle: item.title})
        }}
        onPressIn={() => this.onPressIn()}
        onPressOut={() => this.onPressOut()}
        delayPressOut={100}
      >
        <Animated.View style={[styles.item, animatedStyle, styles.itemAnimated]}>
          <View style={{flexBasis: '60%', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: 5,}}>
            <Text style={{fontWeight: 'bold', padding: 5}}>{item.title}</Text>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 10, alignItems: 'center'}}>
              <Ionicons style={{paddingRight: 10}} name="md-time" size={16} color="black" />
              <Text>{string} {item.start_time && item.finish_time ? ` | ${item.start_time} - ${item.finish_time}`: ''}</Text>
            </View>
          </View>
          <View style={{flexBasis: '40%', overflow: 'hidden'}}>
            <Image style={{
              width: '100%',
              height: '100%',
              borderBottomRightRadius: 5,
              borderTopRightRadius: 5,
            }} source={{uri: item.hero_image_url}}/>
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
  });

  if (autoplay) {
    animated.start();
  }

  return animated;
}


export default ListItem