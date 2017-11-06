let HomeKit;

try {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies, import/no-unresolved
    HomeKit = require('homekit');
} catch (e) {
    console.log('> HomeKit fake loaded');

    HomeKit = new HKFake();
}

module.exports = HomeKit;

function HKFake() {
    const functions = {
        on: () => {},
        addService: () => functions,
        getService: () => functions,
        setCharacteristic: () => functions,
        getCharacteristic: () => functions,
        publish: () => functions,
        destroy: () => functions,
    };

    this.uuid = { generate: () => 1 };
    this.Accessory = class Accessory {
        constructor() {
            Object.assign(this, functions);
        }
    };

    this.Service = {};
    this.Characteristic = {
        TemperatureDisplayUnits: {
            CELSIUS: 0,
            FAHRENHEIT: 1,
        },
        TargetHeatingCoolingState: {
            OFF: 0,
            HEAT: 1,
            COOL: 2,
            AUTO: 3,
        },
        CurrentHeatingCoolingState: {
            OFF: 0,
            HEAT: 1,
            COOL: 2,
        },
    };
}
