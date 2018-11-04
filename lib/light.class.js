const HomeKit = require('./HomeKit.class');

module.exports = class rgbwLight extends HomeKit {
    constructor(device, { startChannel, channels, switchType = 'render' } = {}) {
        super(device);

        this.startChannel = startChannel;

        this.channels = {
            brightness: startChannel + channels.brightness,
        };

        this.values = {
            brightness: 0,
            on: 0
        };

        this.switchType = switchType;

        this.init();
    }

    init() {
        // getter
        //
        super.on('get', 'On', (callback) => {
            callback(null, this.values.on);
        });

        super.on('get', 'Brightness', (callback) => {
            callback(null, this.values.brightness * 100);
        });

        // setter
        //
        super.on('set', 'On', (value, callback) => {
            this.values.on = !!value;

            if (!this.values.on) {
                this.updateDMX(true);
            } else {
                this.updateDMX();
            }

            callback();
        });

        super.on('set', 'Brightness', (value, callback) => {
            this.values.brightness = +value / 100;
            this.updateDMX();

            callback();
        });

        super.publish();
    }

    updateDMX(zero) {
        global.d2HK.DMX
            .set(this.channels.brightness, zero ? 0 : this.values.brightness * 255)
            [this.switchType]();
    }
}
