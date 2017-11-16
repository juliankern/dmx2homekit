#!/usr/bin/env node

var DMX = require('dmx');
var dmx = new DMX();

var universe = dmx.addUniverse('demo', 'enttec-usb-dmx-pro', '/dev/cu.usbserial-EN223883');

var r = 0;
var g = 0;
var b = 0;


setInterval(() => {
    r+=0.015;
    g+=0.024;
    b+=0.013;

    var rv = (Math.sin(r) / 2 + 0.5) * 255;
    var gv = (Math.sin(g) / 2 + 0.5) * 255;
    var bv = (Math.sin(b) / 2 + 0.5) * 255;

    // console.log([ rv, gv, bv ]);
    universe.update({ "0": rv, "1": gv, "2": bv, "4": 255 });
}, 10);
