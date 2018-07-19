import React from 'react';
import {
  Animated,
  Dimensions,
} from 'react-native';

export const maxWidth = Dimensions.get('window').width;

const destinationDimension = {
  width: maxWidth,
  height: 300,
  pageX: 0,
  pageY: 0,
};

export default class Transition extends React.PureComponent {
  componentDidMount() {
    this.props.imageDidMount();
  }

  render() {
    const { openProgress, image, sourceDimension } = this.props;

    const destRightDimension = {
      width: destinationDimension.width,
      height: destinationDimension.height,
      pageX: destinationDimension.pageX,
      pageY: destinationDimension.pageY
    };

    const translateInitX = sourceDimension.pageX + sourceDimension.width / 2;
    const translateInitY = sourceDimension.pageY + sourceDimension.height / 2;

    const translateDestX =
      destRightDimension.pageX + destRightDimension.width / 2;
    const translateDestY =
      destRightDimension.pageY + destRightDimension.height / 2;

    const openingInitTranslateX = translateInitX - translateDestX;
    const openingInitTranslateY = translateInitY - translateDestY - this.props.statusBarHeight;

    const openingInitScaleX = sourceDimension.width / destRightDimension.width;
    const openingInitScaleY = sourceDimension.height / destRightDimension.height;

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
    
    const imgStyle = {
      position: 'absolute',
      width: destRightDimension.width,
      height: destRightDimension.height,
      left: destRightDimension.pageX,
      top: destRightDimension.pageY,
      opacity,
      transform,
    }

    return (
      <Animated.Image
        source={image}
        style={imgStyle}
      />
    );
  }
}
