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

function HIDRunState() {
    this.initState();
}

HIDRunState.prototype.initState = function () {
    this.initGlobalState();
    this.initLocalState();

    this.usageQueue = new Array();
}

HIDRunState.prototype.initGlobalState = function () {
    this.usagePage = null;
    this.logicalMin = null;
    this.logicalMax = null;
    this.physicalMin = null;
    this.physicalMax = null;
    this.unitExp = null;
    this.unit = null;
    this.repSize = null;
    this.repID = null;
    this.repCount = null;
}

HIDRunState.prototype.initLocalState = function () {
    this.usage = null;
    this.usageMin = null;
    this.usageMax = null;
    this.desIndex = null;
    this.desMin = null;
    this.desMax = null;
    this.strIndex = null;
    this.strMin = null;
    this.strMax = null;
    this.delim = null;
}

HIDRunState.prototype.dequeueUsage = function () {
    if (this.usageQueue.length < 1)
        return null;
    var usage = this.usageQueue.shift();
    return usage;
}

HIDRunState.prototype.handleNewState = function () {
    // Add usage min/max to usage queue
    if ((this.usageMin !== null) && (this.usageMax !== null) && (this.usagePage != null)) {
        if (this.usagePage.usage == null)
            throw "Usage page " + this.usagePage.name + " does not contain usages";
        var num;
        for (num = this.usageMin.value; num <= this.usageMax.value; num++) {
            var usage = parseEnum(num, this.usagePage.usage);
            this.usageQueue.push(usage);
        }
        this.usageMin = null;
        this.usageMax = null;
    }
    // Add single usage to usage queue
    if (this.usage != null) {
        this.usageQueue.push(this.usage);
        this.usage = null;
    }
}

HIDRunState.prototype.clone = function () {
    var ret = new HIDRunState();
    ret.assignFrom(this);
    return ret;
}

HIDRunState.prototype.assignLocalState = function (other) {
    // Copy local state
    this.usage = other.usage;
    this.usageMin = other.usageMin;
    this.usageMax = other.usageMax;
    this.desIndex = other.desIndex;
    this.desMin = other.desMin;
    this.desMax = other.desMax;
    this.strIndex = other.strIndex;
    this.strMin = other.strMin;
    this.strMax = other.strMax;
    this.delim = other.delim;
}

HIDRunState.prototype.assignFrom = function (other) {
    // Copy global state
    this.usagePage = other.usagePage;
    this.logicalMin = other.logicalMin;
    this.logicalMax = other.logicalMax;
    this.physicalMin = other.physicalMin;
    this.physicalMax = other.physicalMax;
    this.unitExp = other.unitExp;
    this.unit = other.unit;
    this.repSize = other.repSize;
    this.repID = other.repID;
    this.repCount = other.repCount;

    this.assignLocalState(other);
}
