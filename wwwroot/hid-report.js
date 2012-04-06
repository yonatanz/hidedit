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

var HIDReportType = {
    Input:      { value: 0, name: "Input" },
    Output:     { value: 1, name: "Output" },
    Feature:    { value: 2, name: "Feature" },
    name: "HIDReportType"
};

function HIDReportEntryAttributes(item) {
	// Parse the item.data
	switch (item.tag) {
		case HIDItemMainTag.Input:
			break;
		case HIDItemMainTag.Output:
			break;
		case HIDItemMainTag.Feature:
			break;
		default:
			throw "This item tag does not have attribute data: " + item.tag.name;
	}
}

HIDReportEntryAttributes.prototype.hasAttribute = function (attr) {
	return false;
}

HIDReportEntryAttributes.prototype.makeDescription = function () {
	return "TBD";
}

function HIDReportEntry(attributes, usage, bits) {
    this.usage = usage;
    this.bits = bits;
    this.attributes = attributes;
    this.attributesDesc = attributes.makeDescription();
    // #### Todo: 
    /*
    this.logicalMin = ;
    this.logicalMax = ;
    this.physicalMin = ;
    this.physicalMax = ;
    ... etc
    */
};

function HIDReport(type, id) {
    this.type = type;
    this.id = id;
    this.entries = new Array();
}

HIDReport.prototype.addData = function (item, state) {
	var attr = new HIDReportEntryAttributes(item);

	var num;
	for (num = 0; num < state.repCount; num++) {
		var usage = state.dequeueUsage();
		var entry = new HIDReportEntry(attr, usage, state.repSize);
		this.entries.push(entry);
	}
	return attr.makeDescription();
}

HIDReport.prototype.makeDescription = function () {
    // #### Todo: Parse data bits and return them as human readable string
//    return this.data;
};

HIDReport.prototype.getBitSize = function () {
    var bits = 0;
    for (var index in this.entries) {
        var entry = this.entries[index];
        bits += entry.bits;
    }
    return bits;
}

HIDReport.prototype.getByteSize = function () {
    return Math.floor((this.getBitSize() + 7) / 8);
}

HIDReport.prototype.getID = function () {
//    return this.state.repID;
}

