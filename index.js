import React from 'react';
import {StackNavigator} from "react-navigation";
import EventList, {colorPrimary} from "./eventList/EventList";
import Details from "./details/Details";
import {YellowBox, Easing, Animated} from 'react-native';
YellowBox.ignoreWarnings(['Warning: ...']);
import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';

class Index extends React.Component {
    render() {
        return <RootStack />;
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


const RootStack = StackNavigator(
    {
        EventList: {
            screen: EventList,
        },
        Details: {
            screen: Details,
        },
    },
    {
        initialRouteName: 'EventList',
        /* The header config from HomeScreen is now here */
        navigationOptions: {
            headerStyle: {
                backgroundColor: 'white',
            },
            headerTintColor: colorPrimary,
            headerTitleStyle: {
                fontWeight: 'bold',
                textAlign: 'center',
                width: '100%',
                marginHorizontal: 0
            },
        },
        transitionConfig: () => ({
            transitionSpec: {
                duration: 300,
                easing: Easing.out(Easing.poly(4)),
                timing: Animated.timing,
            },
            screenInterpolator: sceneProps => {
                const { layout, position, scene } = sceneProps

                const thisSceneIndex = scene.index
                const width = layout.initWidth

                const translateX = position.interpolate({
                    inputRange: [thisSceneIndex - 1, thisSceneIndex],
                    outputRange: [width, 0],
                })

                return { transform: [ { translateX } ] }
            },
        })
    }
);

export default Index