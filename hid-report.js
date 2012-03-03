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
    name: "HIDReportType",
    Input:      { value: 0, name: "Input" },
    Output:     { value: 1, name: "Output" },
    Feature:    { value: 2, name: "Feature" },
};

function HIDReport(type, data, state) {
    this.type = type;
    this.data = data;
    this.state = state.clone();
}

HIDReport.prototype.makeDescription = function () {
    // #### Todo: Parse data bits and return them as human readable string
    return this.data;
};
