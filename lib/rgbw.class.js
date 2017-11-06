module.exports = class rgbwLight {
    constructor(Device, { startChannel, channels }) {
        this._device = Device;
        this.startChannel = startChannel;

        this.channels = {
            r: startChannel + channels.r,
            g: startChannel + channels.g,
            b: startChannel + channels.b,
            w: startChannel + channels.w
        };

        this.values = {
            h: 0,
            s: 0,
            l: 0,
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

        this._device.on('get', 'Hue', (callback) => {
            callback(null, this.values.h);
        });

        this._device.on('get', 'Saturation', (callback) => {
            callback(null, this.values.s);
        });

        this._device.on('get', 'Brightness', (callback) => {
            callback(null, this.values.l);
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

        this._device.on('set', 'Hue', (value, callback) => {
            this.values.h = +value;
            updateDMX();

            callback();
        });

        this._device.on('set', 'Saturation', (value, callback) => {
            this.values.s = +value;
            updateDMX();

            callback();
        });

        this._device.on('set', 'Brightness', (value, callback) => {
            this.values.l = +value;
            updateDMX();

            callback();
        });
    }

    updateDMX(zero) {
        let rgbw = hsl2rgbw(this.values.h, this.values.s, this.values.l);

        global.d2HK.DMX.set(this.channels.r, zero ? 0 : rgbw.r);
        global.d2HK.DMX.set(this.channels.g, zero ? 0 : rgbw.g);
        global.d2HK.DMX.set(this.channels.b, zero ? 0 : rgbw.b);
        global.d2HK.DMX.set(this.channels.w, zero ? 0 : rgbw.w);
    }
}

function hsl2rgbw(H, S, L) {
    let rgbw = {}, cos_h, cos_1047_h;

    H = H % 360;
    H = Math.PI * H / 180;

    S = S > 0 ? (S < 1 ? S : 1) : 0;
    L = L > 0 ? (L < 1 ? L : 1) : 0;

    if(H < 2.09439) {
        cos_h = Math.cos(H);
        cos_1047_h = Math.cos(1.047196667 - H);
        rgbw.r = S * 255 * L / 3 * (1 + cos_h / cos_1047_h);
        rgbw.g = S * 255 * L / 3 * (1 + (1 - cos_h / cos_1047_h));
        rgbw.b = 0;
        rgbw.w = 255 * (1 - S) * L;
    } else if(H < 4.188787) {
        H = H - 2.09439;
        cos_h = Math.cos(H);
        cos_1047_h = Math.cos(1.047196667 - H);
        rgbw.r = 0;
        rgbw.g = S * 255 * L / 3 * (1 + cos_h / cos_1047_h);
        rgbw.b = S * 255 * L / 3 * (1 + (1 - cos_h / cos_1047_h));
        rgbw.w = 255 * (1 - S) * L;
    } else {
        H = H - 4.188787;
        cos_h = Math.cos(H);
        cos_1047_h = Math.cos(1.047196667 - H);
        rgbw.r = S * 255 * L / 3 * (1 + (1 - cos_h / cos_1047_h));
        rgbw.g = 0;
        rgbw.b = S * 255 * L / 3 * (1 + cos_h / cos_1047_h);
        rgbw.w = 255 * (1 - S) * L;
    }

    rgbw.r = +rgbw.r.toFixed(0);
    rgbw.g = +rgbw.g.toFixed(0);
    rgbw.b = +rgbw.b.toFixed(0);
    rgbw.w = +rgbw.w.toFixed(0);

    return rgbw;
}