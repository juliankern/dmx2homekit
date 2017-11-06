module.exports = class rgbwLight {
    constructor(Device, { startChannel, channels }) {
        this._device = Device;
        this.startChannel = startChannel;

        this.channels = {
            brightness: startChannel + channels.brightness,
        };

        this.values = {
            brightness: 0,
            on: 0
        };

        this.init();
    }

    init() {
        // getter
        //
        this._device.on('get', 'On', (callback) => {
            callback(null, this.values.on);
        });

        this._device.on('get', 'Brightness', (callback) => {
            callback(null, this.values.brightness);
        });

        // setter
        //
        this._device.on('set', 'On', (value, callback) => {
            this.values.on = !!value;

            if (!this.values.on) {
                updateDMX(true);
            } else {
                updateDMX();
            }

            callback();
        });

        this._device.on('set', 'Brightness', (value, callback) => {
            this.values.brightness = +value;
            updateDMX();

            callback();
        });
    }

    updateDMX(zero) {
        global.d2HK.DMX.set(this.channels.brightness, zero ? 0 : this.values.brightness);
    }
}
