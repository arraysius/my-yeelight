import React, { Component } from 'react';
import { RefreshControl } from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  Left,
  Right,
  Body,
  List,
  Toast
} from 'native-base';

import Yeelight from "../controller/yeelight";
import BulbListItem from '../components/BulbListItem';

export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      bulbs: []
    };

    this.yeelight = new Yeelight();
  }

  componentDidMount() {
    this.discoverBulbs();
  }

  render() {
    return (
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>My Yeelight</Title>
          </Body>
          <Right />
        </Header>
        <Content
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              colors={['#3F51B5']}
              onRefresh={() => this.discoverBulbs()}
            />
          }>
          <List>
            {
              this.state.bulbs.map((bulb, index) => {
                return (
                  <BulbListItem
                    key={index}
                    bulb={bulb}
                    onPress={() => this.props.navigation.navigate('Bulb', { bulb: bulb })}
                  />
                )
              })
            }
          </List>
        </Content>
      </Container>
    )
  }

  discoverBulbs() {
    let newState = this.state;
    newState.refreshing = true;
    newState.bulbs = [];
    this.setState(newState);

    this.yeelight.discoverBulbs(bulbs => {
      if (bulbs !== null) {
        let newState = this.state;
        newState.refreshing = false;
        newState.bulbs = bulbs;
        this.setState(newState);
      } else {
        let newState = this.state;
        newState.refreshing = false;
        this.setState(newState);

        Toast.show({
          text: 'Unable to find any bulbs in local network',
          buttonText: 'Okay'
        });
      }
    });
  }
}
