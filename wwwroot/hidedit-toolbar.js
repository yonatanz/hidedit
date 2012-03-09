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

var ToolbarButton = {
    name: "ToolbarButton",
    New:        { value: 0, name: "New",        title: "New descriptor" },
    Load:       { value: 1, name: "Load",       title: "Load descriptor..." },
    Save:       { value: 2, name: "Save",       title: "Save descriptor..." },
    AddItem:    { value: 3, name: "AddItem",    title: "Add item..." },
    DelItem:    { value: 4, name: "DelItem",    title: "Delete selected item" },
    EditItem:   { value: 5, name: "EditItem",   title: "Edit selected item..." },
    AddReport:  { value: 6, name: "AddReport",  title: "Add report..." },
    DelReport:  { value: 7, name: "DelReport",  title: "Delete report..." },
};

var curToolbar = null;

function clearToolbarState()
{
    if (curToolbar == null)
        return;
    curToolbar.className="tbbtn";
}

function onToolbarMouseDown(o)
{
    clearToolbarState();
    curToolbar = o;
    curToolbar.className="tbbtn pressed";
}

function onToolbarMouseUp(o)
{
    clearToolbarState();
    curToolbar = null;
}

function onToolbarMouseEnter(o)
{
    clearToolbarState();
    curToolbar = o;
}

function onToolbarMouseOut(o)
{
    clearToolbarState();
    curToolbar = null;
}

function populateToolbar() {
    var tb = document.getElementById("toolbar");

    for (var typeName in ToolbarButton)
    {
        var typeObj = ToolbarButton[typeName];
        if (typeof typeObj !== 'object')
            continue;

        var buttonElem = document.createElement('DIV');
        buttonElem.className = "tbbtn";
        buttonElem.id = typeObj.name;
        buttonElem.title = typeObj.title;
        buttonElem.onclick = function() {eval('on' + this.id + 'Clicked()');};
        buttonElem.onmousedown = function() {onToolbarMouseDown(this);};
        buttonElem.onmouseup = function() {onToolbarMouseUp(this);};
        buttonElem.onmouseenter = function() {onToolbarMouseEnter(this);};
        buttonElem.onmouseout = function() {onToolbarMouseOut(this);};
        buttonElem.style.backgroundPosition = "-" + (typeObj.value*32) + "px 0px";

        tb.appendChild(buttonElem);
    }
}

populateToolbar()

function onNewClicked()
{
    // Empty descriptor
    var descriptor = new HIDDescriptor();
    var run = new HIDRun(descriptor);
    treeView.show(descriptor);
    reportsView.show(run.reports);
}

function onLoadClicked()
{
    var example1 = "05 01 09 02 A1 01 09 01 A1 00 05 09 19 01 29 08 15 00 25 01 75 01 95 08 81 02 05 01 09 30 09 31 09 38 09 B8 15 81 25 7F 75 08 95 04 81 06 C0 C0";
    var example2 = "05 01 09 02 A1 01 09 01 A1 00 05 09 19 01 29 05 15 00 25 01 95 05 75 01 81 02 95 01 75 03 81 01 05 01 09 30 09 31 09 38 15 81 25 7F 75 08 95 03 81 06 C0 C0";

    var s = new ReadStream(example1);
    var descriptor = new HIDDescriptor();
    descriptor.parse(s);
    var run = new HIDRun(descriptor);
    run.run();
    treeView.show(descriptor);
    reportsView.show(run.reports);
}

function onSaveClicked()
{
}

function onAddItemClicked()
{
}

function onDelItemClicked()
{
}

function onEditItemClicked()
{
}

function onAddReportClicked()
{
}

function onDelReportClicked()
{
}
