import React, { Component } from 'react';
import { Switch } from 'react-native';
import {
  Right,
  Body,
  Text,
  ListItem,
  Icon,
  Toast
} from 'native-base';

import styles from '../styles';

export default class BulbListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bulb: this.props.bulb
    };
  }

  render() {
    return (
      <ListItem
        button
        onPress={this.props.onPress}
        style={styles.listItemPadding}
      >
        <Icon
          type='MaterialCommunityIcons'
          style={styles.listComponentScale}
          name={this.state.bulb.power === 'on' ? 'lightbulb-on-outline' : 'lightbulb-outline'}
        />
        <Body>
          <Text style={styles.bulbListItemText}>
            {this.state.bulb.name !== '' ? this.state.bulb.name : this.state.bulb.Location}
          </Text>
        </Body>
        <Right>
          <Switch
            value={this.state.bulb.power === 'on'}
            style={styles.listComponentScale}
            onValueChange={isSwitchOn => this.toggleBulbPower(isSwitchOn)}
          />
        </Right>
      </ListItem>
    )
  }

  toggleBulbPower(isSwitchOn) {
    this.state.bulb.togglePower(success => {
      let newState = this.state;
      if (success) {
        newState.bulb.power = isSwitchOn ? 'on' : 'off';
        this.setState(newState);
      } else {
        Toast.show({
          text: 'Unable to toggle bulb',
          buttonText: 'Okay'
        });
      }
    });
  }
}
