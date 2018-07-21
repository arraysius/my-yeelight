import Yeelight from "./yeelight";

export default class Bulb {
  constructor(info) {
    // Set object variables
    this.msgId = 1;
    for (let key in info) {
      this[key] = info[key];
    }

    this.yeelight = new Yeelight();
  }

  togglePower(callback) {
    // Callback return success of action
    this.yeelight.togglePower(this.ip, this.port, this.msgId++, success => {
      callback(success);
    });
  }

  setName(newName, callback) {
    // Callback return success of action
    this.yeelight.setName(this.ip, this.port, this.msgId++, newName, success => {
      callback(success);
    });
  }

  setBrightness(brightnessValue, callback) {
    // Callback return success of action
    this.yeelight.setBrightness(this.ip, this.port, this.msgId++, brightnessValue, success => {
      callback(success);
    });
  }

  setColourTemperature(ctValue, callback) {
    // Callback return success of action
    this.yeelight.setColourTemperature(this.ip, this.port, this.msgId++, ctValue, success => {
      callback(success);
    });
  }

  setRgbColour(rgbInt, callback) {
    // Callback return success of action
    this.yeelight.setRgbColour(this.ip, this.port, this.msgId++, rgbInt, success => {
      callback(success);
    })
  }
}