const ftdi = require('ftdi');

const settings = {
    // 'baudrate': 250000,
    // 'baudrate': 250000 / 4,
    'baudrate': 115200 / 2,
    'databits': 8,
    'stopbits': 2,
    'parity'  : 'none',
};

const sleepTime = 0.026 * 1000;

class DMX {
    constructor() {
        this.universe = Buffer.alloc(512, 0, 'binary');

        let i = 0;
        while(i < this.universe.length){
            this.universe[i] = parseInt(0);
            i++;
        }

        ftdi.find((err, devices) => {
            console.log(devices);
            device = new ftdi.FtdiDevice(devices[0]);
            device.open(settings, () => {
                this._writeLoop();
            });
        });
    }

    set(channel, value) {
        this.universe[+channel - 1] = +value;
        console.log('[DMX] ' + channel + ':' + value);
    }

    get(channel) {
        return +this.universe[+channel - 1];
    }

    _writeLoop(){
        clearTimeout(loopTimer);

        setTimeout(function(){
            device.write([0x00]);
            device.write(universe);

            loopTimer = setTimeout(this._writeLoop, sleepTime);
        }, 88);
    }
}

module.exports = new DMX();