const HomeKit = require('./HomeKit.class');

module.exports = class rgbwLight extends HomeKit {
    constructor(device, { startChannel, channels }) {
        super(device);

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
            on: false
        };

        this.init();
    }

    init() {
        super.onBoth('On', (callback) => {
            console.log('HK Get On:', this.values.on);
            callback(null, this.values.on);
        }, (value, callback) => {
            console.log('HK Set On:', value);
            this.values.on = !!value;

            if (!this.values.on) {
                this.updateDMX(true);
            } else {
                this.updateDMX();
            }
            callback();
        });

        super.onBoth('Hue', (callback) => {
            console.log('HK Get Hue:', this.values.h);
            callback(null, this.values.h);
        }, (value, callback) => {
            console.log('HK Set Hue:', +value);
            this.values.h = +value;
            this.updateDMX();
            callback();
        });

        super.onBoth('Saturation', (callback) => {
            console.log('HK Get Saturation:', this.values.s);
            callback(null, this.values.s);
        }, (value, callback) => {
            console.log('HK Set Saturation:', +value);
            this.values.s = +value;
            this.updateDMX();
            callback();
        });

        super.onBoth('Brightness', (callback) => {
            console.log('HK Get Brightness:', this.values.l);
            callback(null, this.values.l);
        }, (value, callback) => {
            console.log('HK Set Brightness:', +value);
            this.values.l = +value;
            this.updateDMX();
            callback();
        });

        super.publish();
    }

    updateDMX(zero) {
        let rgbw = hsv2rgbw(this.values.h, this.values.s, this.values.l);
        let data = {};

        data[this.channels.r] = zero ? 0 : rgbw.r;
        data[this.channels.g] = zero ? 0 : rgbw.g;
        data[this.channels.b] = zero ? 0 : rgbw.b;
        data[this.channels.w] = zero ? 0 : rgbw.w;

        global.d2HK.DMX.set(data);
    }
}

function hsvToRgb(h, s, v) {
    var r, g, b;
    var i;
    var f, p, q, t;
     
    // Make sure our arguments stay in-range
    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(100, s));
    v = Math.max(0, Math.min(100, v));
     
    // We accept saturation and value arguments from 0 to 100 because that's
    // how Photoshop represents those values. Internally, however, the
    // saturation and value are calculated from a range of 0 to 1. We make
    // That conversion here.
    s /= 100;
    v /= 100;
     
    if(s == 0) {
        // Achromatic (grey)
        r = g = b = v;

        return {
            r: Math.round(r * 255), 
            g: Math.round(g * 255), 
            b: Math.round(b * 255)
        };
    }
     
    h /= 60; // sector 0 to 5
    i = Math.floor(h);
    f = h - i; // factorial part of h
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));
     
    switch(i) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
     
        case 1:
            r = q;
            g = v;
            b = p;
            break;
     
        case 2:
            r = p;
            g = v;
            b = t;
            break;
     
        case 3:
            r = p;
            g = q;
            b = v;
            break;
     
        case 4:
            r = t;
            g = p;
            b = v;
            break;
     
        default: // case 5:
            r = v;
            g = p;
            b = q;
    }

    return {
        r: Math.round(r * 255), 
        g: Math.round(g * 255), 
        b: Math.round(b * 255)
    };
}

function hsv2rgbw(H, S, B) {
    return rgbToRgbw(hsvToRgb(H, S, B), S, B);
}
 
// Example function.
function rgbToRgbw(rgb, S, B) {
    let white = 0;
    let rgbw = { red: rgb.r, green: rgb.g, blue: rgb.b, white };
    rgbw.white = ((B - S) / 100) * 255;
    if (rgbw.white < 0) rgbw.white = 0;

    return { 
        r: rgbw.red, 
        g: rgbw.green, 
        b: rgbw.blue, 
        w: rgbw.white
    };
}
