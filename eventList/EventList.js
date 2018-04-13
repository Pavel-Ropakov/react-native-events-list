import React from 'react';
import {
  Button,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import styled from 'styled-components';

export const colorPrimary = '#DC734A';
const itemHeight = 130
const loader = <ActivityIndicator size="large" color={colorPrimary} />

class EventList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      events: [],
      loading: false,
      refreshing: false,
      page: null,
    }
    this.fetchInitialData()
  }

  async fetchData (page=0) {
    const res = await fetch(`http://events-aggregator-workshop.anadea.co:8080/events?page=${page}`)
    return res.json();
  }

  async fetchInitialData () {
    const responseJson = await this.fetchData(0)
    this.setState({events: responseJson, refreshing: false, page: 1})
  }

  onRefresh = async () => {
    this.setState({ refreshing: true});
    this.fetchInitialData()
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
      events: [...this.state.events, ...newEvents],
      loading: false,
      page: newEvents.length === 10 ? page + 1 : null,
    });
  };

  onGetFooter() {
    const { page } = this.state;

    if (page === null) {
      return null;
    }

    return loader
  }


  onGetItemLayout = (_, index) => {
    return { length: itemHeight, offset: itemHeight * index, index };
  };
  keyExtractor = item => item._id;

  render() {
    const {events} = this.state
    return (
      <View style={styles.container}>
        {

          <FlatList
            // onScroll={this.onScroll}
            data={events}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={loader}
            keyExtractor={this.keyExtractor}

            getItemLayout={this.onGetItemLayout}
            ListFooterComponent={this.onGetFooter.bind(this)}
            // animatedScrollY={this.state.animatedScrollY}
            refreshControl={this.onGetRefreshControl()}
            renderItem={({item}) => {
              const today = new Date(item.start_date)
              const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
              const string = today.toLocaleDateString("en-US",options)
              return (
                <View style={styles.item}>
                  <View style={{flexBasis: '60%'}}>
                    <Text>{item.title}</Text>
                    <Text>Date: {string}</Text>
                    <Text>Time: {item.start_time} - {item.finish_time}</Text>
                  </View>
                  <View style={{flexBasis: '40%', overflow: 'hidden'}}>
                    <Image style={{
                      width: '100%',
                      height: '100%',
                      borderBottomRightRadius: 5,
                      borderTopRightRadius: 5,
                    }} source={{uri: item.hero_image_url}}/>
                  </View>
                </View>
              )
            }
            }
          />
        }
      </View>
    );
  }
  static navigationOptions = {
    title: 'Events',
  };
}

export const Bacground = styled.View`
  background-color: 'white';
  min-width: 100%;
  min-height: 100%;
`;

// export const Scroll = styled(Animated.createAnimatedComponent(FlatList)).attrs({
//   contentContainerStyle: {
//     minWidth: '100%',
//     minHeight: '100%',
//   },
// })`
//   margin-top: ${Expo.Constants.statusBarHeight}px;
// `;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f5f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    backgroundColor: 'white',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    height: itemHeight,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#d2d5d8',
    borderRadius: 7

  },
});


export default EventList