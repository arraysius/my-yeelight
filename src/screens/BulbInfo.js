import React, { Component } from 'react';
import { View, Slider, Switch } from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  Left,
  Right,
  Body,
  Button,
  Icon,
  Text,
  Toast,
  Footer,
  FooterTab
} from 'native-base';
import { Grid, Row, Col } from 'react-native-easy-grid';
import Dialog from 'react-native-dialog';
import { TriangleColorPicker, fromHsv } from 'react-native-color-picker';

import styles from '../styles';

export default class BulbInfo extends Component {
  constructor(props) {
    super(props);

    let bulbParam = this.props.navigation.getParam('bulb', null);

    this.state = {
      bulb: bulbParam,
      dialogVisible: false,
      tempNewBulbName: bulbParam.name,
      activePicker: bulbParam.color_mode === 2 ? 'ct' : 'rgb'
    }
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.goBack()}
            >
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Bulb Information</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <Grid style={styles.bulbInfoGridPadding}>
            {/* Name row */}
            <Row>
              <Col size={15}>
                <Icon
                  type='MaterialCommunityIcons'
                  name={this.state.bulb.power === 'on' ? 'lightbulb-on-outline' : 'lightbulb-outline'}
                  style={styles.bulbInfoBulbIcon}
                />
              </Col>
              <Col size={75} style={styles.bulbInfoNameColumn}>
                <Text style={styles.bulbInfoNameText}>
                  {this.state.bulb.name !== '' ? this.state.bulb.name : this.state.bulb.Location}
                </Text>
              </Col>
              <Col size={15}>
                <Button
                  transparent
                  onPress={() => this.showDialog()}
                >
                  <Icon
                    type='MaterialIcons'
                    name='edit'
                    style={styles.bulbInfoEditNameButton}
                  />
                </Button>
              </Col>
            </Row>

            {/* Brightness and power label row */}
            <Row style={styles.brightnessPowerLabelRow}>
              <Col size={7}>
                <Text style={styles.bulbInfoFontSize}>Brightness: {this.state.bulb.bright}</Text>
              </Col>
              <Col size={2}>
                <Text style={styles.bulbInfoFontSize}>Power: </Text>
              </Col>
              <Col size={2}>
                <Switch
                  value={this.state.bulb.power === 'on'}
                  onValueChange={isSwitchOn => this.toggleBulbPower(isSwitchOn)}
                  style={styles.powerSwitchScale}
                />
              </Col>
            </Row>

            {/* Brightness slider row */}
            <Row>
              <Col>
                <Slider
                  disabled={this.state.bulb.power === 'off'}
                  minimumValue={1}
                  maximumValue={100}
                  step={1}
                  value={this.state.bulb.bright}
                  onValueChange={value => this.setBrightness(value)}
                />
              </Col>
            </Row>

            {/* Colour Temperature or RGB Picker */}
            {
              this.state.activePicker === 'ct' ?
                // Colour Temperature
                <View style={styles.pickerView}>
                  <View
                    style={[
                      styles.colourTemperatureBox,
                      { backgroundColor: this.colorTemperatureToRGB(this.state.bulb.ct) }
                    ]}
                  />
                  <Text style={styles.colourTemperatureText}>Colour Temperature: {this.state.bulb.ct}</Text>
                  <Slider
                    disabled={this.state.bulb.power === 'off'}
                    minimumValue={1700}
                    maximumValue={6500}
                    step={100}
                    value={this.state.bulb.ct}
                    onValueChange={ctValue => this.setColourTemperature(ctValue)}
                  />
                </View>
                :
                // RGB Picker
                <View style={styles.pickerView}>
                  <TriangleColorPicker
                    colour={this.rgbIntToHexStr(this.state.bulb.rgb)}
                    onColorChange={colour => this.setRgbColour(colour)}
                    style={styles.rgbPicker}
                  />
                  <Text style={[styles.bulbInfoFontSize, styles.rgbText]}>{this.rgbIntToHexStr(this.state.bulb.rgb)}</Text>
                </View>
            }
          </Grid>
        </Content>

        <Footer>
          <FooterTab>
            <Button
              vertical
              active={this.state.activePicker === 'ct'}
              onPress={() => this.changePicker('ct')}
            >
              <Icon name='thermometer' />
              <Text>Colour Temperature</Text>
            </Button>

            <Button
              vertical
              active={this.state.activePicker === 'rgb'}
              onPress={() => this.changePicker('rgb')}
            >
              <Icon name="color-palette" />
              <Text>Colour Picker</Text>
            </Button>
          </FooterTab>
        </Footer>

        {/* Popup dialog */}
        <Dialog.Container visible={this.state.dialogVisible}>
          <Dialog.Title>Edit name</Dialog.Title>
          <Dialog.Input
            multiline={false}
            placeholder={'Name of yeelight bulb'}
            value={this.state.tempNewBulbName}
            onChangeText={(text) => {
              newState = this.state;
              newState.tempNewBulbName = text;
              this.setState(newState);
            }}
          />
          <Dialog.Button label="Cancel" onPress={() => this.cancelDialog()} />
          <Dialog.Button label="Save" onPress={() => this.saveDialog()} />
        </Dialog.Container>
      </Container>
    );
  }

  showDialog() {
    let newState = this.state;
    newState.dialogVisible = true;
    this.setState(newState);
  }

  cancelDialog() {
    let newState = this.state;
    newState.dialogVisible = false;
    newState.tempNewBulbName = newState.bulb.name;
    this.setState(newState);
  }

  saveDialog() {
    this.state.bulb.setName(this.state.tempNewBulbName, success => {
      let newState = this.state;

      if (success) {
        newState.bulb.name = this.state.tempNewBulbName;
      } else {
        Toast.show({
          text: 'Unable to set name',
          buttonText: 'Okay'
        });
      }

      newState.dialogVisible = false;
      this.setState(newState);
    });
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

  setBrightness(brightnessValue) {
    this.state.bulb.setBrightness(brightnessValue, success => {
      if (success) {
        let newState = this.state;
        newState.bulb.bright = brightnessValue;
        this.setState(newState);
      } else {
        Toast.show({
          text: 'Unable to change brightness',
          buttonText: 'Okay'
        });
      }
    });
  }

  changePicker(pickerType) {
    let newState = this.state;
    newState.activePicker = pickerType;
    this.setState(newState);
  }

  setColourTemperature(ctValue) {
    this.state.bulb.setColourTemperature(ctValue, success => {
      if (success) {
        let newState = this.state;
        newState.bulb.color_mode = 2;
        newState.bulb.ct = ctValue;
        this.setState(newState);
      } else {
        Toast.show({
          text: 'Unable to change colour temperature',
          buttonText: 'Okay'
        });
      }
    });
  }

  // Adapted from http://www.tannerhelland.com/4435/convert-temperature-rgb-algorithm-code/
  colorTemperatureToRGB(kelvin) {
    let temperature = kelvin / 100;
    let red, green, blue;

    const limit = (value) => {
      if (value < 0) {
        return 0;
      } else if (value > 255) {
        return 255;
      } else {
        return Math.round(value);
      }
    }

    if (temperature <= 66) {
      red = 255;
      green = 99.4708025861 * Math.log(temperature) - 161.1195681661;

      if (temperature <= 19) {
        blue = 0;
      } else {
        blue = temperature - 10;
        blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
      }
    } else {
      red = temperature - 60;
      red = 329.698727446 * Math.pow(red, -0.1332047592);

      green = temperature - 60;
      green = 288.1221695283 * Math.pow(green, -0.0755148492);

      blue = 255;
    }

    let rgb = '#';

    const colours = [red, green, blue];
    colours.forEach(colour => {
      rgb += ('00' + limit(colour).toString(16)).substr(-2);
    });

    return rgb;
  }

  rgbIntToHexStr(rgbInt) {
    return '#' + ('000000' + rgbInt.toString(16)).substr(-6);
  }

  rgbHexStrToInt(rgbHexStr) {
    return parseInt(rgbHexStr.substr(1), 16);
  }

  setRgbColour(rgbHsv) {
    if (this.state.bulb.power !== 'on') {
      Toast.show({
        text: 'Bulb must be powered on',
        buttonText: 'Okay'
      });
      return;
    }

    let rgbInt = this.rgbHexStrToInt(fromHsv(rgbHsv));
    this.state.bulb.setRgbColour(rgbInt, success => {
      if (success) {
        let newState = this.state;
        newState.bulb.color_mode = 1;
        newState.bulb.rgb = rgbInt;
        this.setState(newState);
      } else {
        Toast.show({
          text: 'Unable to change colour',
          buttonText: 'Okay'
        });
      }
    });
  }
}
