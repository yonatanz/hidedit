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

var HIDUnitSystem = {
    SILinear:       { value: 0, name: "SI Linear",        units: { 1:"Centimeter", 2:"Gram", 3:"Seconds", 4:"Kelvin",     5:"Ampere", 6:"Candela" } },
    SIRotation:     { value: 1, name: "SI Rotation",      units: { 1:"Radians",    2:"Gram", 3:"Seconds", 4:"Kelvin",     5:"Ampere", 6:"Candela" } },
    EnglishLinear:  { value: 2, name: "English Linear",   units: { 1:"Inch",       2:"Slug", 3:"Seconds", 4:"Fahrenheit", 5:"Ampere", 6:"Candela" } },
    EnglishRotation:{ value: 3, name: "English Rotation", units: { 1:"Degrees",    2:"Slug", 3:"Seconds", 4:"Fahrenheit", 5:"Ampere", 6:"Candela" } },
    name: "HIDUnitSystem"
};

function HIDCollection(type, state) {
    this.type = type;
    this.state = state;
}

function HIDUnit(system) {
    this.system = system;
    this.parts = new Array();
}

HIDUnit.prototype.makeDescription = function()
{
    if (this.parts.length != 6)
        throw "Invalid amount of unit parts: " + this.parts.length;
    var ret = "";
    for (var partIndex = 0; partIndex < this.parts.length; partIndex++)
    {
        var part = this.parts[partIndex];
        if (part.exp == 0)
            continue;
        if (ret.length > 0)
            ret += " * ";
        ret += part.unit + "^" + part.exp;
    }
    ret = this.system.name + ": " + ret;
    return ret;
}

function HIDRun(descriptor) {
    // Run's parameters
    this.descriptor = descriptor;

    // Run's report state
    this.state = new HIDRunState();
    this.collectionStack = new Array();
    // Run's internal state
    this.useReportIDs = false;

    // Run's output
    this.reports = new Array();
}

HIDRun.prototype.findReportByTypeAndID = function (type, id) {
    for (var index in this.reports) {
        var report = this.reports[index];

        if (report.type != type)
            continue;
        if ((report.id == 0) && (id == 0))
            return report;
        if ((report.id != 0) && (id != 0) && (report.id == id))
            return report;
    }

    var report = new HIDReport(type, id);
    this.reports.push(report);
    return report;
}

HIDRun.prototype.addToReport = function (item) {
    this.checkReportState();

    var report = this.findReportByTypeAndID(item.tag.type, this.useReportIDs ? this.state.repID : 0);

    item.dataDesc = report.addData(item, this.state);

    // Revert back to collection's local state
    this.state.assignLocalState(this.collectionStack[this.collectionStack.length - 1].state);
}

HIDRun.prototype.countItemsByTag = function (items, tag) {
    var count = 0;
    for (var index in items) {
        var item = items[index];
        if (item.tag == tag)
            count++;
    }
    return count;
}

HIDRun.prototype.parseUnitExponent = function (val) {
    if ((val >= 0) && (val <= 7))
        return val;
    if ((val >= 8) && (val <= 15))
        return val - 16;
    throw "Invalid unit exponent value";
}

HIDRun.prototype.parseUnit = function (data) {
    var nibbles = new Array();
    for (var nib = 0; nib < 8; nib++)
    {
        var value = data & 0x0F;
        nibbles.push(value);
        data = data >> 4;
    }

    var system = parseEnum(nibbles[0], HIDUnitSystem);

    var unitObject = new HIDUnit(system);
    for (nib = 1; nib < 7; nib++)
    {
        var part = new Array();
        part.unit = system.units[nib];
        part.exp = this.parseUnitExponent(nibbles[nib]);
        unitObject.parts.push(part);
    }
    return unitObject;
}

HIDRun.prototype.runItem = function (item) {
	switch (item.tag) {
		case HIDItemGlobalTag.UsagePage:
			this.state.usagePage = parseEnum(item.data, HIDUsagePage);
			item.dataDesc = this.state.usagePage.name;
			break;
		case HIDItemLocalTag.Usage:
			if (this.state.usagePage.usage == null)
				throw "Usage page " + this.state.usagePage.name + " does not contain usages";
			item.usagePage = this.state.usagePage;

			this.state.usage = parseEnum(item.data, this.state.usagePage.usage);
			item.dataDesc = this.state.usage.name;
			break;
		case HIDItemLocalTag.UsageMinimum:
			if (this.state.usagePage.usage == null)
				throw "Usage page " + this.state.usagePage.name + " does not contain usages";
			item.usagePage = this.state.usagePage;

			this.state.usageMin = parseEnum(item.data, this.state.usagePage.usage);
			item.dataDesc = this.state.usageMin.name;
			break;
		case HIDItemLocalTag.UsageMaximum:
			if (this.state.usagePage.usage == null)
				throw "Usage page " + this.state.usagePage.name + " does not contain usages";
			item.usagePage = this.state.usagePage;

			this.state.usageMax = parseEnum(item.data, this.state.usagePage.usage);
			item.dataDesc = this.state.usageMax.name;
			break;
		case HIDItemGlobalTag.PhysicalMinimum:
			this.state.physicalMin = item.data;
			item.dataDesc = this.state.physicalMin;
			break;
		case HIDItemGlobalTag.PhysicalMaximum:
			this.state.physicalMax = item.data;
			item.dataDesc = this.state.physicalMax;
			break;
		case HIDItemGlobalTag.LogicalMinimum:
			this.state.logicalMin = item.data;
			item.dataDesc = this.state.logicalMin;
			break;
		case HIDItemGlobalTag.LogicalMaximum:
			this.state.logicalMax = item.data;
			item.dataDesc = this.state.logicalMax;
			break;
		case HIDItemGlobalTag.ReportSize:
			this.state.repSize = item.data;
			item.dataDesc = this.state.repSize;
			break;
		case HIDItemGlobalTag.ReportID:
			this.state.repID = item.data;
			item.dataDesc = this.state.repID;
			break;
		case HIDItemGlobalTag.ReportCount:
			this.state.repCount = item.data;
			item.dataDesc = this.state.repCount;
			break;
		case HIDItemGlobalTag.Unit:
			var unitObj = this.parseUnit(item.data);
			this.state.unit = unitObj;
			item.dataDesc = unitObj.makeDescription();
			break;
		case HIDItemGlobalTag.UnitExponent:
			this.state.unitExp = item.data;
			item.dataDesc = this.state.unitExp;
			break;
		case HIDItemMainTag.Input:
		case HIDItemMainTag.Output:
		case HIDItemMainTag.Feature:
			this.addToReport(item);
			break;
		case HIDItemMainTag.Collection:
			var usage = this.state.dequeueUsage();
			var collType = parseEnum(item.data, HIDItemCollectionType);
			this.collectionStack.push(new HIDCollection(collType, this.state.clone()));
			item.dataDesc = collType.name;
			break;
		case HIDItemMainTag.EndCollection:
			if (this.collectionStack.length < 1)
				throw "EndCollection without collection";
			var coll = this.collectionStack.pop();
			item.dataDesc = coll.type.name;
			break;
		default:
			throw "Unsupported item tag during run: " + item.tag.name;
	}
	this.state.handleNewState();
}

HIDRun.prototype.checkReportState = function () {
/*
    if (this.state.usageQueue.length == 0)
        throw "Report must have a usage";
*/
    if (this.state.usagePage == null)
        throw "Report must have a usage page";
    if (this.state.logicalMin == null)
        throw "Report must have a logical minimum";
    if (this.state.logicalMax == null)
        throw "Report must have a logical maximum";
    if (this.state.repSize == null)
        throw "Report must have a size";
    if (this.state.repCount == null)
        throw "Report must have a count";
    if (this.collectionStack.length < 1)
        throw "Report must be in a collection";
}

function HIDRunException(error, item) {
    this.error = error;
    this.item = item;
}

HIDRun.prototype.run = function () {
    this.state.initState();
    this.reports = new Array();
    this.collectionStack = new Array();
    this.useReportIDs = (this.countItemsByTag(this.descriptor.items, HIDItemGlobalTag.ReportID) > 0);

    for (var index in this.descriptor.items) {
        var item = this.descriptor.items[index];
		try
		{
			this.runItem(item);
		}
		catch (error)
		{
			throw new HIDRunException(error, item);
		}
    }
};
