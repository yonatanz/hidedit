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
	Input: { value: 0, name: "Input" },
	Output: { value: 1, name: "Output" },
	Feature: { value: 2, name: "Feature" },
	name: "HIDReportType"
};

var HIDReportEntryAttribute = {
	Data:        { bit: 0, value: 0, name: "Data" },
	Constant:    { bit: 0, value: 1, name: "Constant" },
	Array:       { bit: 1, value: 0, name: "Array" },
	Variable:    { bit: 1, value: 1, name: "Variable" },
	Absolute:    { bit: 2, value: 0, name: "Absolute" },
	Relative:    { bit: 2, value: 1, name: "Relative" },
	NoWrap:      { bit: 3, value: 0, name: "No Wrap" },
	Wrap:        { bit: 3, value: 1, name: "Wrap" },
	Linear:      { bit: 4, value: 0, name: "Linear" },
	NonLinear:   { bit: 4, value: 1, name: "Non Linear" },
	Preferred:   { bit: 5, value: 0, name: "Preferred State" },
	NoPreferred: { bit: 5, value: 1, name: "No Preferred" },
	NoNullPos:   { bit: 6, value: 0, name: "No Null position" },
	NullState:   { bit: 6, value: 1, name: "Null state" },
	NonVolatile: { bit: 7, value: 0, name: "Non Volatile" },
	Volatile:    { bit: 7, value: 1, name: "Volatile" },
	BitField:    { bit: 8, value: 0, name: "Bit Field" },
	BufferBytes: { bit: 8, value: 1, name: "Buffered Bytes" },
	name: "HIDReportEntryAttribute"
};

function HIDReportEntryAttributes(data) {
	this.data = data;
	this.attrs = Array();
	for (var attrName in HIDReportEntryAttribute) {
		var attr = HIDReportEntryAttribute[attrName];
		if (typeof attr.bit !== 'number')
			continue;
		if (this.hasAttribute(attr))
			this.attrs.push(attr);
	}
}

HIDReportEntryAttributes.prototype.hasAttribute = function (attr) {
	return (((this.data >> attr.bit) & 1) == attr.value);
}

HIDReportEntryAttributes.prototype.makeDescription = function () {
	var desc = "";
	for (var index in this.attrs) {
		var attr = this.attrs[index];
		if (attr.bit <= 2) {
			if (desc.length > 0)
				desc += ",";
			desc += attr.name;
		}
	}
	return desc;
}

function HIDReportEntry(attributes, usage, bits) {
    this.usage = usage;
    this.bits = bits;
    this.attributes = attributes;
    this.attributesDesc = attributes.makeDescription();
    // Todo, record more information about this report entry, such as:
    /*
    this.logicalMin = ;
    this.logicalMax = ;
    this.physicalMin = ;
    this.physicalMax = ;
	unit, etc.
    */
};

function HIDReport(type, id) {
    this.type = type;
    this.id = id;
    this.entries = new Array();
}

HIDReport.prototype.addData = function (item, state) {
	var attr = new HIDReportEntryAttributes(item.data);

	var num;
	for (num = 0; num < state.repCount; num++) {
		var usage = state.dequeueUsage();
		var entry = new HIDReportEntry(attr, usage, state.repSize);
		this.entries.push(entry);
	}
	return attr.makeDescription();
}

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

