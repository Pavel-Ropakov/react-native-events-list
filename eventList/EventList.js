import React from 'react';
import {Button, View, Text, StyleSheet, FlatList, Image, RefreshControl} from 'react-native';
// import * as Animated from "react-native";

export const colorPrimary = '#DC734A';
const itemHeight = 80

class EventList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      events: [],
      loading: false,
      refreshing: false,
      page: null,
      // animatedScrollY: new Animated.Value(0),
    }
    this.fetchInitialData()
  }

  static async fetchData(page = 0) {
    const res = await fetch(`http://events-aggregator-workshop.anadea.co:8080/events?${page}`)
    return res.json();
  }

  fetchInitialData = async () => {
    const responseJson = await EventList.fetchData()
    this.setState({events: responseJson, refreshing: false, page: 0})
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

    this.setState(({ events }) => ({
      events: [...events, ...newEvents],
      loading: false,
      page: newEvents.length === 10 ? page + 1 : null,
    }));
  };

  // onScroll = Animated.event(
  //   [{ nativeEvent: { contentOffset: { y: this.state.animatedScrollY } } }],
  //   { useNativeDriver: true }
  // );

  render() {
    const {events} = this.state
    return (
      <View style={styles.container}>
        {

          <FlatList
            // onScroll={this.onScroll}
            data={events}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={1}
            animatedScrollY={this.state.animatedScrollY}
            refreshControl={this.onGetRefreshControl()}
            renderItem={({item}) => (
              <View style={styles.item}>
                <View style={{flexBasis: '80%'}}>
                  <Text>{item.title}</Text>
                </View>
                <View style={{flexBasis: '20%'}}>
                  <Button
                    title="-->"
                    onPress={() => {
                      this.props.navigation.navigate('Details', {id: item._id, eventTitle: item.title})
                    }}
                  />
                </View>
              </View>
            )}
          />

        }
      </View>
    );
  }
  static navigationOptions = {
    title: 'Events',
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    backgroundColor: '#4D243D',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    height: itemHeight,
    marginTop: 2

  },
});


export default EventList