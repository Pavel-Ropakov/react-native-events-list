import React from 'react';
import {View, Dimensions} from 'react-native';
import HTML from "react-native-render-html";
import {compose, withState} from "recompose";
import {loader as loaderIcon} from '../eventList/EventList'
import AutoScaledImage from "./AutoScaledImage";
import { TEXT_TAGS, MIXED_TAGS } from 'react-native-render-html/src/HTMLUtils';

const imgViewStyles = {    justifyContent: 'center',
  alignItems: 'center',}

const screenWidth = Dimensions.get('window').width
const contentSize = screenWidth * 0.9 - 20

const TEXT_TAGS_HASH = {
  undefined: true,
  ...TEXT_TAGS.reduce((obj, tag) => ({ ...obj, [tag]: true }), {}),
};

const MIXED_TAGS_HASH = {
  ...MIXED_TAGS.reduce((obj, tag) => ({ ...obj, [tag]: true }), {}),
};

const renderers = {
  img: (attribs, children, cssStyles, {key}) => {
    const src = attribs.src
    const uri = src[0] === '/' ? `https://events.dev.by${src}` : src;
    return (
      <View key={key} style={imgViewStyles}>
        <AutoScaledImage maxWidth={contentSize} uri={uri}/>
      </View>
    )
  },
}

const ignoredStyles = ['font-family', 'color', 'text-align']
const fontStyle = {
  color: 'rgb(51, 51, 51)',
  fontSize: 14,
}

const childrenAreTextTags = children => children.every(
  node =>
    TEXT_TAGS_HASH[node.name] ||
    (MIXED_TAGS_HASH[node.name] && Html.childrenAreTextTags(node.children))
);

class Html extends React.PureComponent {
  constructor(props) {
    super(props)
    this.htmlParsingFinished = this.htmlParsingFinished.bind(this)
  }

  htmlParsingFinished() {
    this.props.setHtmlReady(true)
  }

  onAlterChildren (node) {
    const nodeChildren = [];

    if (TEXT_TAGS_HASH[node.name] && !childrenAreTextTags(node.children)) {
      let child = node.children[0];

      let children = [];

      let wrapperNode = {
        name: 'p',
        type: 'tag',
        next: null,
        prev: null,
        parent: node,
        attribs: {},
        children,
      };

      nodeChildren[nodeChildren.length] = wrapperNode;

      while (child !== null) {
        if (
          TEXT_TAGS_HASH[child.name] ||
          (MIXED_TAGS_HASH[child.name] && childrenAreTextTags(child.children))
        ) {
          children[children.length] = child;
          child.parent = wrapperNode;
          child = child.next;
        } else {
          wrapperNode.next = child;

          nodeChildren[nodeChildren.length] = child;

          children = [];

          wrapperNode = {
            name: 'p',
            type: 'tag',
            next: null,
            prev: child,
            parent: node,
            attribs: {},
            children,
          };

          const newChild = child.next;

          child.next = wrapperNode;
          child = newChild;

          nodeChildren[nodeChildren.length] = wrapperNode;
        }
      }

      return nodeChildren;
    }

    return undefined;
  }

  render() {
    const {htmlReady, content} = this.props
    
    
    const loader = htmlReady === false ? loaderIcon : null

    return (
      <React.Fragment>
        {
          loader
        }
        {
          content &&
          <HTML
            alterChildren={this.onAlterChildren}
            ignoredStyles={ignoredStyles}
            onParsed={this.htmlParsingFinished}
            renderers={renderers}
            html={content}
            imagesMaxWidth={screenWidth}
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