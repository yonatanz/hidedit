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
loadScript("hid-run.js", true);

var example = "05 01\n" +
              "09 02\n" +
              "A1 01\n" +
              "09 01\n" +
              "A1 00\n" +
              "05 09\n" +
              "19 01\n" +
              "29 08\n" +
              "15 00\n" +
              "25 01\n" +
              "75 01\n" +
              "95 08\n" +
              "81 02\n" +
              "05 01\n" +
              "09 30\n" +
              "09 31\n" +
              "09 38\n" +
              "09 B8\n" +
              "15 81\n" +
              "25 7F\n" +
              "75 08\n" +
              "95 04\n" +
              "81 06\n" +
              "C0\n" +
              "C0\n"

function write(str) {
    var log = document.getElementById('log');
    var text = document.createElement('TextNode');
    text.textContent = str;
    log.appendChild(text);
}

function onScriptLoaded() {
    var s = new ReadStream(example);
    write(s.data + "\n");

    var desc = new HIDDescriptor();
    desc.parse(s);

    s = new WriteStream();
    desc.pack(s);
    write(s.getData() + "\n");

    var run = new HIDRun(desc);
    var result = run.run();
    write(result);

    console.log(run.reports);

    return true;
}
