/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { storiesOf } from '@storybook/react-native';
// import { text, withKnobs } from '@storybook/addon-knobs';

import EventList from './EventList';

storiesOf('EventList', module)
  // .addDecorator(withKnobs)
  .add('base', () => (
    <EventList/>
  ));
