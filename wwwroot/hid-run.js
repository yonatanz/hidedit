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

    // Run's state
    this.state = new HIDRunState();
    this.collectionStack = new Array();

    // Run's output
    this.reports = new Array();
}

HIDRun.prototype.addReport = function (item) {
    var check = this.checkReportState();
    if (check != null)
        return check;

    var report = null;
    switch (item.tag) {
        case HIDItemMainTag.Input:
            report = new HIDReport(HIDReportType.Input, item.data, this.state);
            break;
        case HIDItemMainTag.Output:
            report = new HIDReport(HIDReportType.Output, item.data, this.state);
            break;
        case HIDItemMainTag.Feature:
            report = new HIDReport(HIDReportType.Feature, item.data, this.state);
            break;
        default:
            return "Cannot add report. Unknown report type";
    }

    item.dataDesc = report.makeDescription();

    this.reports.push(report);

    // Revert back to collection's local state
    this.state.assignLocalState(this.collectionStack[this.collectionStack.length - 1].state);
    return null;
}

HIDRun.prototype.runItem = function (item) {
    switch (item.tag) {
        case HIDItemGlobalTag.UsagePage:
            this.state.usagePage = parseEnum(item.data, HIDUsagePage);
            item.dataDesc = this.state.usagePage.name;
            break;
        case HIDItemLocalTag.Usage:
            if (this.state.usagePage.usage != null) {
                this.state.usage = parseEnum(item.data, this.state.usagePage.usage);
                item.dataDesc = this.state.usage.name;
            }
            else
                item.dataDesc = item.data;
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
            return this.addReport(item);
        case HIDItemMainTag.Collection:
            var collType = parseEnum(item.data, HIDItemCollectionType);
            this.collectionStack.push(new HIDCollection(collType, this.state.clone()));
            item.dataDesc = collType.name;
            break;
        case HIDItemMainTag.EndCollection:
            if (this.collectionStack.length < 1)
                return "EndCollection without collection";
            var coll = this.collectionStack.pop();
            item.dataDesc = coll.type.name;
            break;
        default:
            return "Unsupported item tag during run: " + item.tag.name;
    }
    return null;
}

HIDRun.prototype.checkReportState = function () {
    if (this.state.usage == null)
        return "Report must have a usage";
    if (this.state.usagePage == null)
        return "Report must have a usage page";
    if (this.state.logicalMin == null)
        return "Report must have a logical minimum";
    if (this.state.logicalMax == null)
        return "Report must have a logical maximum";
    if (this.state.repSize == null)
        return "Report must have a size";
    if (this.state.repCount == null)
        return "Report must have a count";
    if (this.collectionStack.length < 1)
        return "Report must be in a collection";
    return null;
}

HIDRun.prototype.run = function () {
    var log = "";
    this.state.initState();
    this.reports = new Array();
    this.collectionStack = new Array();
    for (var index in this.descriptor.items) {
        var item = this.descriptor.items[index];
        var ret = this.runItem(item);
        if (ret != null)
            return log + ret;
        log += "Run item: " + item.tag.name + "(" + item.dataDesc + ")\n";
    }
    return log;
};
