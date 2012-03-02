/*
    This file is part of hidedit.
    (C) Copyright 2012 Ilan Tayari

    hidedit is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    hidedit is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with hidedit.  If not, see http://www.gnu.org/licenses/
*/

// Infrastructure:
function loadScript(url, islast) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    if (islast) {
        script.onreadystatechange = onScriptLoaded;
        script.onload = onScriptLoaded;
    }
    head.appendChild(script);
}

function makeStruct(names) {
    var names = names.split(' ');
    var count = names.length;
    function constructor() {
        for (var i = 0; i < count; i++) {
            this[names[i]] = arguments[i];
        }
    }
    return constructor;
}

function dec2hex(dec, padToLength) {
    var ret = dec.toString(16).toUpperCase();
    if (padToLength) {
        while (ret.length < padToLength)
            ret = "0" + ret;
    }
    return ret;
}

function hex2dec(hex) {
    return parseInt(hex, 16);
}

function error(msg) {
    alert(msg);
}

function parseEnum(value, type) {
    for (var candName in type) {
        var candObj = type[candName];
        if (typeof candObj.value === 'number') {
            if (candObj.value == value)
                return candObj;
        } else if (typeof candObj.value === 'object') {
            if ((value >= candObj.value[0]) && (value <= candObj.value[1]))
                return candObj;
        }
    }
    error("Value " + value + " (0x" + dec2hex(value) + ") is not part of " + type.name);
}

function cleanHex(data) {
    var hex = "";
    for (var i = 0; i < data.length; i++) {
        var c = data.charAt(i);
        if ((c >= '0') && (c <= '9'))
            hex += c;
        else if (((c >= 'a') && (c <= 'f')) || ((c >= 'A') && (c <= 'F')))
            hex += c.toUpperCase();
    }
    return hex;
}

loadScript("hid-stream.js");
loadScript("hut.js");
loadScript("hid.js");
loadScript("hid-run-state.js");
loadScript("hid-report.js");
loadScript("hid-run.js");
loadScript("hidedit-tree.js");
loadScript("hidedit-reports.js");
loadScript("hidedit-ui.js", true);

var example = "05 01 09 02 A1 01 09 01 A1 00 05 09 19 01 29 08 15 00 25 01 75 01 95 08 81 02 05 01 09 30 09 31 09 38 09 B8 15 81 25 7F 75 08 95 04 81 06 C0 C0";

function writelog(str) {
    var log = document.getElementById('log');
    var text = document.createElement('TextNode');
    text.textContent = str;
    log.appendChild(text);
}

function onScriptLoaded() {
    var s = new ReadStream(example);
    //writelog(s.data + "\n");

    var descriptor = new HIDDescriptor();
    descriptor.parse(s);

    //s = new WriteStream();
    //desc.pack(s);
    //writelog(s.getData() + "\n");

    var run = new HIDRun(descriptor);
    var result = run.run();

    treeView.show(descriptor);
    reportsView.show(run.reports);

    //writelog(result);

    //console.log(run.reports);

    return true;
}
