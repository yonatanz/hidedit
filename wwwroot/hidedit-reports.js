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
function Reports(elemID) {
    this.elemID = elemID;
    this.elem = document.getElementById(this.elemID);
}

Reports.prototype.clear = function () {
    while (this.elem.childNodes.length > 0)
        this.elem.removeChild(this.elem.childNodes[0]);
};

Reports.prototype.show = function (reports) {
    this.clear();
    for (var index in reports) {
        var report = reports[index];

        var reportElem = document.createElement('DIV');
        reportElem.className = "report";

        var textElem = document.createElement('TextNode');
        textElem.textContent = report.type.name;
        reportElem.appendChild(textElem);

        this.elem.appendChild(reportElem);
    }
};

var reportsView = new Reports("reportview");
