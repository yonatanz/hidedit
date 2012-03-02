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

function ReadStream(data) {
    this.data = cleanHex(data);
    this.position = 0;
}

ReadStream.prototype.atEnd = function () {
    return this.position >= this.data.length;
};

ReadStream.prototype.getByte = function () {
    return hex2dec(this.getBuffer(1));
};

ReadStream.prototype.getBuffer = function (size) {
    var ret = this.data.substr(this.position, size * 2);
    this.position += size * 2;
    return ret;
};

ReadStream.prototype.rewind = function () {
    this.position = 0;
};

function WriteStream(data) {
    this.data = "";
}

WriteStream.prototype.getData = function () {
    return this.data;
};

WriteStream.prototype.writeByte = function (byte) {
    this.data += dec2hex(byte, 2);
};

WriteStream.prototype.writeData = function (data, size) {
    if (size > 0)
        this.data += dec2hex(data, size*2);
};

WriteStream.prototype.writeBuffer = function (buffer) {
    this.data += cleanHex(buffer);
};
