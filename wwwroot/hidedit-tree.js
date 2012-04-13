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
    this.root = document.getElementById(this.elemID);
    this.descriptor = null;

    this.selectedItem = null;
    this.errorItem = null;
    this.savedSelectionIndex = null;

    this.clear();
}

Tree.prototype.clear = function () {
	while (this.root.childNodes.length > 0)
		this.root.removeChild(this.root.childNodes[0]);
	this.selectedItem = null;
	this.errorItem = null;
	this.enableToolbar();
};

Tree.prototype.show = function (descriptor) {
	this.clear();
	this.descriptor = descriptor;
	for (var index in descriptor.items) {
		var item = descriptor.items[index];

		var itemElem = document.createElement('BUTTON');
		item.elem = itemElem;
		itemElem.className = "treeitem";
		itemElem.onclick = function () { treeView.toggleSelectItem(this); };
		itemElem.ondblclick = function () { onEditItemClicked(); };
		itemElem.itemIndex = index;

		var indentElem = null;
		for (var i = 0; i < item.indent; i++) {
			indentElem = document.createElement('DIV');
			indentElem.className = "treeitemindent";
			itemElem.appendChild(indentElem);
		}

		var textElem = document.createElement('TextNode');
		textElem.textContent = item.tag.name + "(" + item.dataDesc + ")";
		itemElem.appendChild(textElem);

		this.root.appendChild(itemElem);
	}
	this.enableToolbar();
};

Tree.prototype.enableToolbar = function () {
	toolbar.enableButton(ToolbarButton.AddItem, true);
	var enable = (this.selectedItem != null);
	toolbar.enableButton(ToolbarButton.DelItem, enable);
	toolbar.enableButton(ToolbarButton.EditItem, enable);
}

Tree.prototype.selectIndex = function (index) {
	if (this.root.childNodes.length < 1)
		return;

	if (index >= this.root.childNodes.length)
		index = this.root.childNodes.length - 1;

	this.toggleSelectItem(this.root.childNodes[index]);
}

Tree.prototype.toggleSelectItem = function (treeItem) {
	var oldSelected = this.selectedItem;
	if (this.selectedItem != null) {
		delClass(this.selectedItem, "selectedItem");
		this.selectedItem = null;
	}

	if ((treeItem != null) && (treeItem != oldSelected)) {
		this.selectedItem = treeItem;
		addClass(this.selectedItem, "selectedItem");
	}
	this.enableToolbar();
};

Tree.prototype.setErrorItem = function (treeItem) {
	var oldError = this.errorItem;
	if (this.errorItem != null) {
		delClass(this.errorItem, "errorItem");
		this.errorItem = null;
	}

	if ((treeItem != null) && (treeItem != oldError)) {
		this.errorItem = treeItem;
		addClass(this.errorItem, "errorItem");
	}
};

Tree.prototype.saveSelectionIndex = function () {
	if (treeView.selectedItem == null)
		this.savedSelectionIndex = null;
	else
		this.savedSelectionIndex = treeView.selectedItem.itemIndex;
};

Tree.prototype.restoreSelectionIndex = function () {
	if (this.savedSelectionIndex != null)
		treeView.selectIndex(this.savedSelectionIndex);
};

