function HIDRunState() {
    this.initState();
}

HIDRunState.prototype.initState = function () {
    this.initGlobalState();
    this.initLocalState();
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
