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

function HIDCollection(type, state) {
    this.type = type;
    this.state = state;
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

    item.dataDesc = report.addData(item.data, this.state);

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

HIDRun.prototype.runItem = function (item) {
    switch (item.tag) {
        case HIDItemGlobalTag.UsagePage:
            this.state.usagePage = parseEnum(item.data, HIDUsagePage);
            item.dataDesc = this.state.usagePage.name;
            break;
        case HIDItemLocalTag.Usage:
            if (this.state.usagePage.usage == null)
                throw "Usage page " + this.state.usagePage.name + " does not contain usages";

            this.state.usage = parseEnum(item.data, this.state.usagePage.usage);
            item.dataDesc = this.state.usage.name;
            break;
        case HIDItemLocalTag.UsageMinimum:
            this.state.usageMin = item.data;
            item.dataDesc = this.state.usageMin;
            break;
        case HIDItemLocalTag.UsageMaximum:
            this.state.usageMax = item.data;
            item.dataDesc = this.state.usageMax;
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
            item.indent--;
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
    item.indent += this.collectionStack.length;
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

var log = "";

HIDRun.prototype.run = function () {
    this.state.initState();
    this.reports = new Array();
    this.collectionStack = new Array();
    this.useReportIDs = (this.countItemsByTag(this.descriptor.items, HIDItemGlobalTag.ReportID) > 0);

    for (var index in this.descriptor.items) {
        var item = this.descriptor.items[index];
        this.runItem(item);
        log += "Run item: " + item.tag.name + "(" + item.dataDesc + ")\n";
    }
};
