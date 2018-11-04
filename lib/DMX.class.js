const DMX = require('dmx');
let dmx = new DMX();

class DMXWrapper {
    constructor() {
        this.universe = dmx.addUniverse('demo', 'enttec-usb-dmx-pro', '/dev/ttyUSB0');
        // this.universe = dmx.addUniverse('demo', 'enttec-usb-dmx-pro', '/dev/cu.usbserial-EN223883');
        // this.universe = dmx.addUniverse('demo', 'null');
    }

    set(channel, value) {
        if (isNaN(+channel)) {
            let data = {};
            Object.keys(channel).forEach((c) => {
                data[(+c - 1) + ''] = channel[c];
            });
            
            console.log('[DMX] set', data);
            return {
                render: () => this.render(data),
                animate: () => this.animate(data),
            };
        }
        
        let temp = {};
        temp[channel - 1] = value;
        console.log('[DMX] set', temp);
        return {
            render: () => this.render(temp),
            animate: () => this.animate(temp),
        };
    }

    render(data) {
        this.universe.update(temp);
    }

    animate(data) {
        let animation = new DMX.Animation();
        animation.add(data, 1000, {});
        animation.run(this.universe)
    }
}


module.exports = new DMXWrapper();