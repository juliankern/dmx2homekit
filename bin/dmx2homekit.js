const HomeKit = require('../lib/HomeKit.class');
const Devices = require('../devices.json');
const Config = require('../config.json');

global.d2HK = {};
global.d2HK.DMX = require('../lib/DMX.class');

let accessoryCounter = 0;

Config.devices.forEach((d) => {
    let device = Devices[d.type];
    // console.log('device', device);

    device.dmxStartChannel = d.dmxStartChannel;

    device.defaultChannelValues.forEach((value, channel) => {
        global.d2HK.DMX.set(device.dmxStartChannel + channel, value);
    });

    device.accessories.forEach((accessory) => {
        // console.log('accessory', accessory);
        let className;
        let HKDeviceHandler;
        let HKDevice = new HomeKit({
            id: 'dmx2homekit',
            deviceName: `${device.model} ${accessory.name}`,
            model: device.model,
            service: accessory.type.charAt(0).toUpperCase() + accessory.type.slice(1),
            serial: 'A000000' + accessoryCounter++
        });

        if (accessory.color) {
            className = accessory.color;
        } else {
            className = 'light';
        }

        try {
            HKDeviceHandler = require(`../lib/${className}.class`);
        } catch (e) {
            throw `${className}.class.js not found! ` + e;
        }

        new HKDeviceHandler(HKDevice, { startChannel: device.dmxStartChannel, channels: accessory.dmxChannels });
    });
});