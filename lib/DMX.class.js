const DMX = require('dmx');
var dmx = new DMX();

class DMXWrapper {
    constructor() {
        this.universe = dmx.addUniverse('demo', 'enttec-usb-dmx-pro', '/dev/cu.usbserial-EN223883');
        // this.universe = dmx.addUniverse('demo', 'null');
    }

    set(channel, value) {
        if (isNaN(+channel)) {
            let data = {};
            Object.keys(channel).forEach((c) => {
                data[(+c - 1) + ''] = channel[c];
            });
            
            console.log('[DMX] set', data);
            this.universe.update(data);
        } else {
            let temp = {};
            temp[channel - 1] = value;
            console.log('[DMX] set', temp);
            this.universe.update(temp);
        }
    }
}


module.exports = new DMXWrapper();