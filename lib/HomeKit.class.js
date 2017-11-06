// const EventEmitter = require('events');
const HomeKit = require('./homekit');

module.exports = class HomeKitClass {
    /**
     * SmartNodeHomeKit contructor
     *
     * @author Julian Kern <mail@juliankern.com>
     *
     * @param  {object} data holds the data needed to init the plugin
     */
    constructor({
        id,
        deviceName,
        model,
        service,
        serial = 'A0000001',
        manufacturer = 'juliankern.com',
    }) {
        const uuid = HomeKit.uuid.generate(`homekit:${id}`);
        this.accessory = new HomeKit.Accessory(deviceName, uuid);

        this.accessory.getService(HomeKit.Service.AccessoryInformation)
            .setCharacteristic(HomeKit.Characteristic.Manufacturer, manufacturer)
            .setCharacteristic(HomeKit.Characteristic.Model, model)
            .setCharacteristic(HomeKit.Characteristic.SerialNumber, serial);

        this.service = service;
        this.accessory.addService(HomeKit.Service[service], deviceName);

        this.Characteristic = HomeKit.Characteristic;

        this.timer = null;
    }

    onIdentify(callback) {
        this.accessory.on('identify', callback);
    }

    on(method, characteristic, callback) {
        if (this.timer) clearTimeout(this.timer);

        this.timer = setTimeout(() => {
            this.accessory.getService(HomeKit.Service[this.service])
                .getCharacteristic(HomeKit.Characteristic[characteristic])
                .on(method, callback);
        }, 100);
    }

    onBoth(characteristic, getCallback, setCallback) {
        this.on('get', characteristic, getCallback);
        this.on('set', characteristic, setCallback);
    }

    set(characteristic, value) {
        this.accessory.getService(HomeKit.Service[this.service])
            .setCharacteristic(HomeKit.Characteristic[characteristic], value);
    }

    publish(properties) {
        this.accessory.publish(properties);
    }

    destroy() {
        this.accessory.destroy();
    }

    static get Characteristic() {
        return HomeKit.Characteristic;
    }
};
