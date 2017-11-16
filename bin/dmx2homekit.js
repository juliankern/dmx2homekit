const HomeKit = require('../lib/homekit');
// const HomeKit = require('../lib/HomeKit.class');
const Devices = require('../devices.json');
const Config = require('../config.json');

global.d2HK = {};
global.d2HK.DMX = require('../lib/DMX.class');

let accessoryCounter = 0;

const storage = require('node-persist');
storage.initSync();

Config.devices.forEach((d) => {
    let device = Devices[d.type];
    // console.log('device', device);

    device.dmxStartChannel = d.dmxStartChannel;

    device.defaultChannelValues.forEach((value, channel) => {
        global.d2HK.DMX.set(device.dmxStartChannel + channel, value);
    });

    device.accessories.forEach((accessory) => {
        let enabled = !!accessory.enabled;
        
        // console.log('accessory', accessory);
        if (accessory.name in d.accessories) enabled = !!d.accessories[accessory.name];
        if (!enabled) return true;

        console.log('inited', accessory.name);

        let className;
        let HKDeviceHandler;


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

        let HKDevice = new HKDeviceHandler({
            id: 'dmx2homekit',
            deviceName: `${device.model} ${accessory.name}`,
            model: device.model,
            service: accessory.type.charAt(0).toUpperCase() + accessory.type.slice(1),
            serial: 'A000000' + accessoryCounter++,
            startChannel: device.dmxStartChannel,
        }, { startChannel: device.dmxStartChannel, channels: accessory.dmxChannels });
    });
});

process.stdin.resume();