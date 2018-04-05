import React from 'react';
import {Button, View, Text, StyleSheet, FlatList, Image} from 'react-native';

class EventList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            events: []
        }
        fetch('http://events-aggregator-workshop.anadea.co:8080/events')
            .then((r) => r.json())
            .then((responseJson) => {
                this.setState({events: responseJson})
            })

    }
  static navigationOptions = {
    title: 'Events',
  };
    
    render() {
        // debugger
        const {events} = this.state
        return (
            <View style={styles.container}>
                {

                    <FlatList
                        data={events}
                        renderItem={({item}) => (
                          <View style={styles.item}>
                            <Text>{item.title}</Text>
                            <View style={{width: 40}} >
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
    
  },
});


export default EventList