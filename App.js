import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';
import { Root } from 'native-base';

import Main from './src/screens/Main';
import BulbInfo from './src/screens/BulbInfo';

export default class App extends Component {
  render() {
    return (
      <Root>
        <AppStackNavigator />
      </Root>
    )
  }
}

const AppStackNavigator = createStackNavigator(
  {
    Main: Main,
    Bulb: BulbInfo
  },
  {
    initialRouteName: 'Main',
    headerMode: 'none'
  });
