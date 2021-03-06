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
import ListItem from "./ListItem";

export const colorPrimary = '#DC734A';
const itemHeight = 130
export const loader = <ActivityIndicator size="large" color={colorPrimary}/>
const footerStyle = {height: 100, width: '100%', alignItems: 'center', justifyContent: 'center'}
const loaderStyles = {height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}

class EventList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      events: [],
      loading: false,
      refreshing: false,
      page: null,
      touchedId: null
    }
    this.fetchInitialData()
    
  }

  async fetchData(page = 0) {
    const res = await fetch(`http://events-aggregator-workshop.anadea.co:8080/events?page=${page}`)
    return res.json();
  }

  async fetchInitialData() {
    const responseJson = await this.fetchData(0)
    this.setState({events: responseJson, refreshing: false, page: 1})
  }

  onRefresh = async () => {
    this.setState({refreshing: true});
    this.fetchInitialData()
  };


  onGetRefreshControl() {
    const {refreshing} = this.state;

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
    const {loading, refreshing, page} = this.state;
    if (loading || refreshing || page === null) {
      return;
    }
    this.setState({loading: true});
    const newEvents = await this.fetchData(page);
    this.setState({
      events: [...this.state.events, ...newEvents],
      loading: false,
      page: newEvents.length === 10 ? page + 1 : null,
    });
  };

  onGetFooter() {
    const {page} = this.state;
    if (page === null) {
      return null;
    }
    return (
      <View style={footerStyle}>
        {loader}
      </View>
    )
  }

  onGetItemLayout = (_, index) => {
    return {length: itemHeight, offset: itemHeight * index, index};
  }

  keyExtractor = item => item._id;

  render() {
    const {events} = this.state
    return (
      <View style={styles.container}>
          <FlatList
            data={events}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
              <View style={loaderStyles}>
                {loader}
              </View>
            }
            keyExtractor={this.keyExtractor}
            getItemLayout={this.onGetItemLayout}
            ListFooterComponent={this.onGetFooter.bind(this)}
            refreshControl={this.onGetRefreshControl()}
            renderItem={({item}) => (
              <ListItem item={item} navigation={this.props.navigation}/> 
            )}
          />
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
    borderRadius: 7
  },
  itemAnimated: {
    borderWidth: 0,
  },
});

export default EventList