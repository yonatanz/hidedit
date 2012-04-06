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

Reports.prototype.showError = function (error) {
	this.clear();

	var reportElem = document.createElement('DIV');
	reportElem.className = "reportError";
	reportElem.textContent = error;
	this.elem.appendChild(reportElem);
};

Reports.prototype.show = function (reports) {
    this.clear();
    for (var index in reports) {
        var report = reports[index];

        var reportElem = document.createElement('DIV');
        reportElem.className = "report";

        var elem;
        elem = document.createElement('P');
        elem.className = "Type";
        elem.textContent = report.type.name + " report";
        reportElem.appendChild(elem);

        if (report.getID() != null) {
            elem = document.createElement('P');
            elem.className = "ID";
            elem.textContent = "ID: " + report.getID();
            reportElem.appendChild(elem);
        }

        elem = document.createElement('P');
        elem.className = "Size";
        elem.textContent = "Size: " + report.getByteSize() + " bytes";
        reportElem.appendChild(elem);

        var table, tr, td;

        table = document.createElement('TABLE');
        tr = document.createElement('TR');

        td = document.createElement('TH');
        td.textContent = "Usage";
        tr.appendChild(td);
        td = document.createElement('TH');
        td.textContent = "Bits";
        tr.appendChild(td);
        td = document.createElement('TH');
        td.textContent = "Data";
        tr.appendChild(td);

        table.appendChild(tr);


        for (var entryIndex in report.entries) {
            var entry = report.entries[entryIndex];

            tr = document.createElement('TR');

            td = document.createElement('TD');
            if (entry.usage != null)
                td.textContent = entry.usage.name;
            else
                td.textContent = "Unused";
            tr.appendChild(td);
            td = document.createElement('TD');
            td.textContent = entry.bits;
            tr.appendChild(td);
            td = document.createElement('TD');
            td.textContent = entry.data;
            tr.appendChild(td);

            table.appendChild(tr);
        }

        reportElem.appendChild(table);

        this.elem.appendChild(reportElem);
    }
};
