import React from 'react';
import EventList from "./eventList/EventList";
import {YellowBox, Easing, Animated} from 'react-native';
YellowBox.ignoreWarnings(['Warning: ...']);
import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';

class Index extends React.Component {
    render() {
        return <EventList/>
    }
}

export const storage = new Storage({
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    sync : {
        event({ id, reject, resolve }) {
            try {

                fetch(`http://events-aggregator-workshop.anadea.co:8080/events/${id}`)
                    .then((r) => r.json())
                    .then((responseJson) => {
                        storage.save({ key: 'event', id, data: responseJson }).then(() => {
                            resolve(responseJson);
                        })
                    })
            } catch (err) {
                reject(err);
            }
        },
    }
})

export default Index