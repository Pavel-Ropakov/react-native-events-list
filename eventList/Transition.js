import React from 'react';
import {
  Text,
  View,
  Image,
  ListView,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const maxWidth = Dimensions.get('window').width;

export default class Transition extends React.PureComponent {
  destinationDimension = {
    width: maxWidth,
    height: 300,
    pageX: 0,
    pageY: 0,
  };

  sourceDimension = this.props.sourceDimension;

  componentDidMount() {
    this.props.imageDidMount();
  }

  render() {
    const { openProgress, image } = this.props;

    const destRightDimension = {
      width: this.destinationDimension.width,
      height: this.destinationDimension.height,
      pageX: this.destinationDimension.pageX,
      pageY: this.destinationDimension.pageY
    };

    const translateInitX = this.sourceDimension.pageX + this.sourceDimension.width / 2;
    const translateInitY = this.sourceDimension.pageY + this.sourceDimension.height / 2;

    const translateDestX =
      destRightDimension.pageX + destRightDimension.width / 2;
    const translateDestY =
      destRightDimension.pageY + destRightDimension.height / 2;

    const openingInitTranslateX = translateInitX - translateDestX;
    const openingInitTranslateY = translateInitY - translateDestY - this.props.statusBarHeight;

    const openingInitScaleX = this.sourceDimension.width / destRightDimension.width;
    const openingInitScaleY = this.sourceDimension.height / destRightDimension.height;

    const opacity = openProgress.interpolate({
      inputRange: [0, 0.995, 1],
      outputRange: [1, 1, 0]
    });

    const translateX = openProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [openingInitTranslateX, 0]
    });

    const translateY = openProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [openingInitTranslateY, 0]
    });

    const scaleX = openProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [openingInitScaleX, 1]
    });

    const scaleY = openProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [openingInitScaleY, 1]
    });

    const transform = [
      {
        translateX,
      },
      {
        translateY,
      },
      {
        scaleX,
      },
      {
        scaleY,
      }
    ];

    return (
      <Animated.Image
        source={image}
        style={{
          position: 'absolute',
          width: destRightDimension.width,
          height: destRightDimension.height,
          left: destRightDimension.pageX,
          top: destRightDimension.pageY,
          opacity,
          transform,
        }}
      />
    );
  }
}
