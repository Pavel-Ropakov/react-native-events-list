import React from 'react';
import Expo from 'expo';
import {
  View,
  StyleSheet,
  FlatList,
  Animated,
  RefreshControl,
  ActivityIndicator, Dimensions,
} from 'react-native';
import ListItem from './ListItem';
import DetailsScreen from '../details/Details';
import Transition from './Transition';
import {maxWidth} from "./Transition";
import { Ionicons } from '@expo/vector-icons';

export const colorPrimary = '#DC734A';
const itemHeight = 130;
const screenWidth = (Dimensions.get('window').width - 20)
const imgWidth = screenWidth * 0.4
const imgX = screenWidth * 0.6
export const loader = <ActivityIndicator size="large" color={colorPrimary}/>;
const Scroll = Animated.createAnimatedComponent(FlatList)

const footerStyle = {
  height: 100,
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
};

const loaderStyles = {
  height: '100%',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
};

class EventList extends React.PureComponent {
  state = {
    page: null,
    events: [],
    loading: false,
    touchedId: null,
    refreshing: false,
    animatedScrollY: new Animated.Value(0),
    // search: ''
  };

  animatedScrollY = 0
  openProgress = new Animated.Value(0);

  _images = {};

  imageDidMount = false;
  contentDidMount = false;

  componentDidMount() {
    this.fetchInitialData();
  }

  async fetchData(page = 0) {
    const res = await fetch(
      `http://events-aggregator-workshop.anadea.co:8080/events?page=${page}`,
    );
    return res.json();
  }

  async fetchInitialData() {
    const responseJson = await this.fetchData(0);

    this.setState({
      page: 1,
      events: responseJson,
      refreshing: false,
    });
  }

  onRefresh = async () => {
    this.setState({ refreshing: true });
    this.fetchInitialData();
  };

  onGetRefreshControl() {
    const { refreshing } = this.state;

    return (
      <RefreshControl
        colors={[colorPrimary]}
        tintColor={colorPrimary}
        onRefresh={this.onRefresh}
        refreshing={refreshing}
      />
    );
  }

  onEndReached = async () => {
    const { loading, refreshing, page } = this.state;

    if (loading || refreshing || page === null) {
      return;
    }

    this.setState({ loading: true });

    const newEvents = await this.fetchData(page);

    this.setState({
      page: newEvents.length === 10 ? page + 1 : null,
      events: [...this.state.events, ...newEvents],
      loading: false,
    });
  };

  onGetFooter = () => {
    const { page } = this.state;

    if (page === null) {
      return null;
    }

    return <View style={footerStyle}>{loader}</View>;
  };

  resetActive = () => {
    this.imageDidMount = false;
    this.contentDidMount = false;

    this.setState({ activeEvent: null }, () => this.openProgress.setValue(0));
  };

  onImageRef = (photo, imageRef) => {
    this._images[photo._id] = imageRef;
  };

  onGetItemLayout = (_, index) => {
    return { length: itemHeight, offset: itemHeight * index, index };
  };

  openListItem = (activeEvent, index) => {
    const sourceDimensionImage = this.getDimensionImage(this._images[activeEvent.id], index);

    console.log(sourceDimensionImage);

    this.setState({ activeEvent, sourceDimensionImage});
  };

  getDimensionImage = (refImage, index) => {
    const page1Y = (itemHeight + 10) * index - this.animatedScrollY
    return {
      width: imgWidth,
      height: itemHeight,
      pageX: imgX,
      pageY: page1Y,
    };
  };

  onImageDidMount = () => {
    this.imageDidMount = true;

    this.animateImageAndContent();
  };

  onContentDidMount = () => {
    this.contentDidMount = true;

    this.animateImageAndContent();
  };

  animateImageAndContent = () => {
    this.setState({ animatedAll: false })
    if(this.imageDidMount && this.contentDidMount) {
      Animated.timing(this.openProgress, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => (
        setTimeout(() => this.setState({ animatedAll: true }) , 100)
      ));
    }
  };

  keyExtractor = item => item._id;

  // onClearSearch = () => {
  //   this.setState({search: ''})
  //   this.fetchInitialData()
  // }
  //
  // onSearch = async (text) => {
  //   if(text && text.length) {
  //     this.setState({ loading: true, search: text });
  //
  //     const newEvents = await this.fetchData(0);
  //
  //     this.setState({
  //       page: newEvents.length === 10 ? 1 : 0,
  //       events: [ ...newEvents],
  //       loading: false,
  //     });
  //   } else {
  //     this.fetchInitialData()
  //   }
  //  
  // }

  _onScroll123 = e => {
    this.animatedScrollY = e.nativeEvent.contentOffset.y;
  }
  
  onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: this.state.animatedScrollY } } }],
    { listener: this._onScroll123, useNativeDriver: true }
  );


  render() {
    const { events } = this.state;
    
    // const searchBar =  <SearchBar
    //   clearIcon={{ color: '#86939e', name: 'clear' }}
    //   lightTheme
    //   containerStyle={{width: maxWidth}}
    //   onChangeText={this.onSearch}
    //   onClearText={this.onClearSearch}
    //   placeholder='Search'
    // />

    return (
      <View style={styles.container}>
       
        <Scroll
          onScroll={this.onScroll}
          scrollEventThrottle={16}
          data={events}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={<View style={loaderStyles}>{loader}</View>}
          keyExtractor={this.keyExtractor}
          getItemLayout={this.onGetItemLayout}
          ListFooterComponent={this.onGetFooter}
          refreshControl={this.onGetRefreshControl()}
          renderItem={({ item, index }) => (
            <ListItem
              key={item._id}
              onImageRef={this.onImageRef}
              open={(li) => this.openListItem(li, index)}
              item={item}
            />
          )}
        />

        {
          this.state.activeEvent && <Transition
            image={this.state.activeEvent.image}
            openProgress={this.openProgress}
            imageDidMount={this.onImageDidMount}
            statusBarHeight={Expo.Constants.statusBarHeight}
            sourceDimension={this.state.sourceDimensionImage}
          />
        }

        {
          this.state.activeEvent &&
          <DetailsScreen
            event={this.state.activeEvent}
            onClose={this.resetActive}
            openProgress={this.openProgress}
            animatedAll={this.state.animatedAll}
            onContentDidMount={this.onContentDidMount}
          />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: Expo.Constants.statusBarHeight,
    flex: 1,
    backgroundColor: '#f2f5f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    backgroundColor: 'white',
    flexDirection: 'row',
    flex: 1,
    height: itemHeight,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#d2d5d8',
    borderRadius: 7,
  },
  itemAnimated: {
    borderWidth: 0,
  },
});

export default EventList;
