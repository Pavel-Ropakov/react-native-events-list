import React from 'react';
import {Button, View, Text, StyleSheet, Linking, Dimensions, Image, ScrollView} from 'react-native';
import HTML from "react-native-render-html";
import {compose, withState} from "recompose";
import {loader as loaderIcon} from '../eventList/EventList'

const imgViewStyles = {flexDirection: 'row', justifyContent: 'center', height: 100}
const imgStyles = {width: '100%', height: '100%'}

const renderers = {
  img: (attribs, children, cssStyles, {key}) => {
    const src = attribs.src
    const uri = src[0] === '/' ? `https://events.dev.by${src}` : src;
    return (
      <View style={imgViewStyles}>
        <Image key={key} style={imgStyles} source={{uri}}/>
      </View>
    )
  },
}

class Html extends React.PureComponent {
  constructor(props) {
    super(props)
    this.htmlParsingFinished = this.htmlParsingFinished.bind(this)
  }
  
  htmlParsingFinished() {
    this.props.setHtmlReady(true)
  }

  render() {
    const {htmlReady, content} = this.props
    const fontStyle = {
      color: 'rgb(51, 51, 51)',
      fontSize: 14,
    }
    const width = Dimensions.get('window').width
    const loader = htmlReady === false ? loaderIcon : null
    

    return (
      <React.Fragment>
        {
          loader
        }
        {
          content &&
          <HTML
            onParsed={this.htmlParsingFinished}
            renderers={renderers}
            html={content}
            imagesMaxWidth={width}
            baseFontStyle={fontStyle}
          />
        }
      </React.Fragment>
    )
  }
}

const DataLayer = compose(
  withState(
    'htmlReady',
    'setHtmlReady',
    false
  )
)


export default DataLayer(Html)