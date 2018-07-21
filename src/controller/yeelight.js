var dgram = require('react-native-udp');
global.Buffer = global.Buffer || require('buffer').Buffer;
var net = require('react-native-tcp');

import Bulb from './bulb';
import { b64Encode, b64Decode } from './helper';

export default class Yeelight {
  config = {
    multicastHost: '239.255.255.250',
    multicastPort: 1982
  }

  discoverBulbs(callback) {
    bulbs = [];

    const intKeys = [
      'bright',
      'color_mode',
      'ct',
      'fw_ver',
      'hue',
      'rgb',
      'sat'
    ]

    // Yeelight discover message
    let message = Buffer.from(
      'M-SEARCH * HTTP/1.1\r\n' +
      'HOST: 239.255.255.250:1982\r\n' +
      'MAN: \"ssdp:discover\"\r\n' +
      'ST: wifi_bulb\r\n'
    );

    // Timeout
    let discoveryTimeout = setTimeout(() => {
      client.close();
      callback(null);
    }, 10000);

    let client = dgram.createSocket('udp4');

    client.on('message', (msg, rinfo) => {
      client.close();
      clearTimeout(discoveryTimeout);

      let newBulbInfo = {}

      msg = msg.toString().split('\r\n');
      msg = msg.slice(1, msg.length - 1);

      // Message to object
      msg.forEach(line => {
        let key = line.substr(0, line.indexOf(':')).trim();
        let value = line.substr(line.indexOf(':') + 1).trim();

        if (intKeys.includes(key)) {
          newBulbInfo[key] = parseInt(value);
        } else if (key === 'name') {
          newBulbInfo[key] = b64Decode(value);
        } else if (key === 'support') {
          newBulbInfo[key] = value.split(' ');
        } else {
          newBulbInfo[key] = value;
        }

        // Put additional ip and port info
        if (key === 'Location') {
          let bulbUrl = value.replace('yeelight://', '');
          let [bulbIp, bulbPort] = bulbUrl.split(':');
          newBulbInfo['ip'] = bulbIp.trim();
          newBulbInfo['port'] = parseInt(bulbPort.trim());
        }
      });

      bulbs.push(new Bulb(newBulbInfo));
      callback(bulbs);
    });

    // Send multicast udp
    client.send(message, 0, message.length, this.config.multicastPort, this.config.multicastHost, (err, bytes) => {
      if (err) {
        client.close();
        clearTimeout(discoveryTimeout);
        callback(null);
      };
    });
  }

  sendCommand(ip, port, command, callback) {
    // Callback returns success:boolean

    let client = net.createConnection(port, ip, () => {
      client.write(JSON.stringify(command) + '\r\n');
    });

    client.setTimeout(3000, () => {
      client.destroy();
      callback(false);
    });

    client.on('data', data => {
      client.destroy();

      response = JSON.parse(data.toString());

      if (response.result !== undefined) {
        let success = response.result[0] === 'ok' ? true : false;
        callback(success);
      } else if (response.error !== undefined) {
        callback(false);
      }
    });

    client.on('error', error => {
      client.destroy();
      callback(false);
    });
  }

  togglePower(ip, port, msgId, callback) {
    // Callback returns success:boolean

    let command = {
      id: msgId,
      method: 'toggle',
      params: []
    };

    this.sendCommand(ip, port, command, callback);
  }

  setName(ip, port, msgId, name, callback) {
    // Callback returns success:boolean

    let command = {
      id: msgId,
      method: 'set_name',
      params: [b64Encode(name)]
    };

    this.sendCommand(ip, port, command, callback);
  }

  setBrightness(ip, port, msgId, brightnessValue, callback) {
    // Callback returns success:boolean

    let command = {
      id: msgId,
      method: 'set_bright',
      params: [
        brightnessValue,
        'smooth',
        500
      ]
    };

    this.sendCommand(ip, port, command, callback);
  }

  setColourTemperature(ip, port, msgId, ctValue, callback) {
    // Callback returns success:boolean

    let command = {
      id: msgId,
      method: 'set_ct_abx',
      params: [
        ctValue,
        'smooth',
        500
      ]
    };

    this.sendCommand(ip, port, command, callback);
  }

  setRgbColour(ip, port, msgId, rgbInt, callback) {
    let command = {
      id: msgId,
      method: 'set_rgb',
      params: [
        rgbInt,
        'smooth',
        500
      ]
    };

    this.sendCommand(ip, port, command, callback);
  }
}
