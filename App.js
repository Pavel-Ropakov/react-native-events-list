import React from 'react';
import {StackNavigator} from "react-navigation";
import EventList, {colorPrimary} from "./eventList/EventList";
import Details from "./details/Details";

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
    }
);
