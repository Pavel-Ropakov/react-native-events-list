import React from 'react';
import {StackNavigator} from "react-navigation";
import EventList from "./EventList";
import Details from "./Details";

export default class App extends React.Component {
    render() {
        return <RootStack />;
    }
}

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
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      },
    }
);
