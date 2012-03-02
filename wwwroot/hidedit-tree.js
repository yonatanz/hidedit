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
function Tree(elemID) {
    this.elemID = elemID;
    this.elem = document.getElementById(this.elemID);
}

Tree.prototype.clear = function () {
    while (this.elem.childNodes.length > 0)
        this.elem.removeChild(this.elem.childNodes[0]);
};

Tree.prototype.show = function (descriptor) {
    this.clear();
    for (var index in descriptor.items) {
        var item = descriptor.items[index];

        var itemElem = document.createElement('DIV');
        itemElem.className = "treeitem";

        var indentElem = null;
        for (var i = 0; i < item.indent; i++) {
            indentElem  = document.createElement('DIV');
            indentElem.className = "treeitemindent";
            itemElem.appendChild(indentElem);
        }

        var textElem = document.createElement('TextNode');
        textElem.textContent = item.tag.name + "(" + item.dataDesc + ")";
        itemElem.appendChild(textElem);

        this.elem.appendChild(itemElem);
    }
};

var treeView = new Tree("itemtree");
