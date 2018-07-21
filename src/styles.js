import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
  listItemPadding: {
    paddingLeft: 5,
    paddingTop: 20,
    paddingBottom: 20
  },
  listComponentScale: {
    transform: [
      { scaleX: 1.2 },
      { scaleY: 1.2 }
    ]
  },
  bulbListItemText: {
    fontSize: 18
  },
  bulbInfoGridPadding: {
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 30,
    marginRight: 30
  },
  bulbInfoBulbIcon: {
    marginTop: 10,
    marginRight: 10,
    transform: [
      { scaleX: 1.2 },
      { scaleY: 1.2 }
    ]
  },
  bulbInfoNameColumn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bulbInfoNameText: {
    fontSize: 20
  },
  bulbInfoEditNameButton: {
    marginTop: 10,
    marginLeft: 10,
    transform: [
      { scaleX: 1.2 },
      { scaleY: 1.2 }
    ]
  },
  bulbInfoFontSize: {
    fontSize: 18
  },
  brightnessPowerLabelRow: {
    marginTop: 30,
    marginBottom: 15,
    marginLeft: 15,
    marginRight: 15
  },
  powerSwitchScale: {
    transform: [
      { scaleX: 1.1 },
      { scaleY: 1.1 }
    ]
  },
  pickerView: {
    marginTop: 30
  },
  colourTemperatureBox: {
    width: 250,
    height: 250,
    marginBottom: 30,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 125,
    borderWidth: 2,
    borderColor: 'black'
  },
  colourTemperatureText: {
    marginBottom: 15,
    fontSize: 18,
    marginLeft: 15
  },
  rgbText: {
    textAlign: 'center'
  },
  rgbPicker: {
    width: 330,
    height: 330,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
});
