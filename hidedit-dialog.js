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

function Dialog(captionText, contentURL, ui) {
	this.ui = ui;
	this.ui.setDlg(this);
	this.initDialog(captionText, contentURL);
}

Dialog.prototype.initDialog = function (captionText, contentURL) {
	this.dlgParent = document.createElement('DIV');
	this.dlgParent.className = "DialogParent";
	addClass(this.dlgParent, "hidden");

	this.item = document.createElement('DIV');
	this.item.className = "Dialog";
	this.dlgParent.appendChild(this.item);

	this.caption = document.createElement('DIV');
	this.caption.className = "DialogCaption";
	this.caption.textContent = captionText;
	this.item.appendChild(this.caption);

	var btn = document.createElement('DIV');
	btn.className = "DialogCaptionButton";
	btn.dlg = this;
	btn.onclick = function () { this.dlg.close() };
	btn.onmousedown = function () { addClass(this, "pressed"); };
	btn.onmouseup = function () { delClass(this, "pressed"); };
	btn.onmouseout = function () { delClass(this, "pressed"); };
	this.caption.appendChild(btn);

	this.content = document.createElement('IFRAME');
	//this.content = document.createElement('DIV');
	this.content.className = "DialogContent";
	this.content.src = contentURL;
	this.item.appendChild(this.content);

	document.body.appendChild(this.dlgParent);
}

Dialog.prototype.setSize = function (width, height) {
	this.item.style.width = width + "px";
	this.item.style.height = height + "px";
}

Dialog.prototype.show = function (data) {
	this.ui.initUI();
	this.ui.loadData(data);
	delClass(this.dlgParent, "hidden");
};

Dialog.prototype.close = function () {
	addClass(this.dlgParent, "hidden");
};

EditItemDialogUI = function () {
	this.dlg = null;
}

EditItemDialogUI.prototype.setDlg = function (dlg) {
	this.dlg = dlg;
}

EditItemDialogUI.prototype.initUI = function () {
	// "Item" drop-down list
	var select = this.dlg.content.contentDocument.getElementById("ItemType");
	// Clear the list
	while (select.childNodes.length > 0)
		select.removeChild(select.childNodes[0]);
	// Fill the list with all known HIDItem tags
	for (var typeName in HIDItemType) {
		var type = HIDItemType[typeName];
		if (typeof type.tags !== 'object')
			continue;

		for (var tagName in type.tags) {
			var tag = type.tags[tagName];
			if (typeof tag.value !== 'number')
				continue;
			var option = addItemDlg.content.contentDocument.createElement("OPTION");
			option.textContent = tag.name;
			option.value = type.tags.name + "." + tagName;
			select.appendChild(option);
		}
	}
}

EditItemDialogUI.prototype.loadData = function (item) {
	if (item == null)
		return;

	// "Item" drop-down list
	var select = this.dlg.content.contentDocument.getElementById("ItemType");
	for (var index = 0; index < select.options.length; index++) {
		var tag = eval(select.options[index].value);
		if (tag == item.tag) {
			select.selectedIndex = index;
			break;
		}
	}
}
