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
	btn.onclick = function () { this.dlg.ui.onCancel() };
	btn.onmousedown = function () { addClass(this, "pressed"); };
	btn.onmouseup = function () { delClass(this, "pressed"); };
	btn.onmouseout = function () { delClass(this, "pressed"); };
	this.caption.appendChild(btn);

	this.content = document.createElement('IFRAME');
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
	this.ui.data = data;
	this.ui.initUI();
	this.ui.loadData();
	delClass(this.dlgParent, "hidden");
};

Dialog.prototype.close = function (bSaveData) {
	if (bSaveData)
		this.ui.saveData();
	addClass(this.dlgParent, "hidden");
};

EditItemDialogUI = function (onOK) {
	this.dlg = null;
	this.itemType = null;
	this.selectedItemTypeData = null;
	this.onOK = onOK;
}

EditItemDialogUI.prototype.setDlg = function (dlg) {
	this.dlg = dlg;
}

EditItemDialogUI.prototype.initUI = function () {
	var btn = this.dlg.content.contentDocument.getElementById("btnOK");
	btn.dlgui = this;
	btn.onclick = function () { this.dlgui.onOK() };
	var btn = this.dlg.content.contentDocument.getElementById("btnCancel");
	btn.dlgui = this;
	btn.onclick = function () { this.dlgui.onCancel() };

	// "Item" drop-down list
	this.itemType = this.dlg.content.contentDocument.getElementById("ItemType");
	this.itemType.dlgui = this;
	this.itemType.onchange = function () { this.dlgui.onItemTypeChange(this) };
	// Clear the item type list
	while (this.itemType.childNodes.length > 0)
		this.itemType.removeChild(this.itemType.childNodes[0]);
	// Fill the list with all known HIDItem tags
	for (var typeName in HIDItemType) {
		var type = HIDItemType[typeName];
		if (typeof type.tags !== 'object')
			continue;

		var group = this.dlg.content.contentDocument.createElement("OPTGROUP");
		group.label = type.name;
		group.type = type;

		for (var tagName in type.tags) {
			var tag = type.tags[tagName];
			if (typeof tag.value !== 'number')
				continue;
			var option = this.dlg.content.contentDocument.createElement("OPTION");
			option.textContent = tag.name;
			option.tag = tag;
			option.value = type.tags.name + "." + tagName;
			group.appendChild(option);
		}

		this.itemType.appendChild(group);
	}
}

EditItemDialogUI.prototype.onCancel = function () {
	this.dlg.close(false);
}

EditItemDialogUI.prototype.onItemTypeChange = function () {
	var div = this.dlg.content.contentDocument.getElementById("ItemTypeData");
	// Empty the contents DIV
	while (div.childNodes.length > 0)
		div.removeChild(div.childNodes[0]);

	var selectedTag = this.itemType.options[this.itemType.selectedIndex].tag;
	switch (selectedTag) {
		case HIDItemMainTag.Input:
		case HIDItemMainTag.Output:
		case HIDItemMainTag.Feature:
			this.initUIReport(div);
			break;
		case HIDItemMainTag.Collection:
			this.initUICollection(div);
			break;
		case HIDItemGlobalTag.UsagePage:
			this.initUISelect(div, HIDUsagePage, "Usage page: ", null);
			break;
		case HIDItemLocalTag.Usage:
		case HIDItemLocalTag.UsageMinimum:
		case HIDItemLocalTag.UsageMaximum:
			if (this.data.usagePage != null)
				this.initUISelect(div, this.data.usagePage.usage, "Usage: ", "From Usage-Page: " + this.data.usagePage.name);
			else
				this.initUINone(div, "No usage page selected");
			break;
		case HIDItemGlobalTag.PhysicalMinimum:
		case HIDItemGlobalTag.PhysicalMaximum:
		case HIDItemGlobalTag.LogicalMinimum:
		case HIDItemGlobalTag.LogicalMaximum:
		case HIDItemGlobalTag.ReportSize:
		case HIDItemGlobalTag.ReportID:
		case HIDItemGlobalTag.ReportCount:
		case HIDItemGlobalTag.UnitExponent:
		case HIDItemLocalTag.DesignatorIndex:
		case HIDItemLocalTag.DesignatorMinimum:
		case HIDItemLocalTag.DesignatorMaximum:
		case HIDItemLocalTag.StringIndex:
		case HIDItemLocalTag.StringMinimum:
		case HIDItemLocalTag.StringMaximum:
		case HIDItemLocalTag.Delimiter:
			this.initUINum(div, selectedTag.name + ": ");
			break;
		case HIDItemGlobalTag.Unit:
			this.initUIUnit(div);
			break;
		default:
			this.initUINone(div, "This item type has no properties");
	}
}

EditItemDialogUI.prototype.initUINone = function (div, commentText) {
	if (commentText != null) {
		var comment = this.dlg.content.contentDocument.createElement("TextNode");
		comment.textContent = commentText;
		comment.className = "Comment";
		div.appendChild(comment);
	}
	this.getUIData = function () { return 0; }
}

EditItemDialogUI.prototype.initUINum = function (div, labelText) {
	var label = this.dlg.content.contentDocument.createElement("LABEL");
	label.textContent = labelText;
	label.htmlFor = "typeDataNum";
	div.appendChild(label);

	var editbox = this.dlg.content.contentDocument.createElement("INPUT");
	editbox.type = "TEXT";
	editbox.name = label.htmlFor;
	editbox.id = label.htmlFor;
	div.appendChild(editbox);

	editbox.value = this.data.data;

	this.getUIData = function () { return this.dlg.content.contentDocument.getElementById("typeDataNum").value; }
}

EditItemDialogUI.prototype.initUISelect = function (div, enumType, labelText, commentText) {
	var label = this.dlg.content.contentDocument.createElement("LABEL");
	label.textContent = labelText;
	label.htmlFor = "typeDataSelect";
	div.appendChild(label);

	var select = this.dlg.content.contentDocument.createElement("SELECT");
	select.name = label.htmlFor;
	select.id = label.htmlFor;
	div.appendChild(select);

	if (enumType != null) {
		for (var typeName in enumType) {
			var type = enumType[typeName];
			if (typeof type !== 'object')
				continue;
			if (typeof type.value !== 'number') {
				var valueFrom = type.value[0];
				var valueTo = type.value[1];
				// don't fill the drop-down list with too much junk
				if (valueTo > valueFrom + 100)
					valueTo = valueFrom + 100;
				for (var value = valueFrom; value <= valueTo; value++) {
					var option = this.dlg.content.contentDocument.createElement("OPTION");
					option.value = value;
					option.textContent = dec2hex(value, 2) + ": " + type.name;
					select.appendChild(option);
				}
			}
			else {
				var option = this.dlg.content.contentDocument.createElement("OPTION");
				option.value = type.value;
				option.textContent = dec2hex(type.value, 2) + ": " + type.name;
				select.appendChild(option);
			}
		}
	}

	for (var index = 0; index < select.options.length; index++) {
		if (select.options[index].value == this.data.data) {
			select.selectedIndex = index;
			break;
		}
	}

	if (commentText != null) {
		var br = this.dlg.content.contentDocument.createElement("BR");
		div.appendChild(br);

		var comment = this.dlg.content.contentDocument.createElement("TextNode");
		comment.textContent = commentText;
		comment.className = "Comment";
		div.appendChild(comment);
	}

	this.getUIData = function () {
		var select = this.dlg.content.contentDocument.getElementById("typeDataSelect");
		return select.options[select.selectedIndex].value;
	}
}

EditItemDialogUI.prototype.initUICollection = function (div) {
	var collType = parseEnum(this.data.data, HIDItemCollectionType);

	// Fill the div with all known collection types
	for (var typeName in HIDItemCollectionType) {
		var type = HIDItemCollectionType[typeName];
		if (typeof type !== 'object')
			continue;

		var radio = this.dlg.content.contentDocument.createElement("INPUT");
		radio.type = "radio";
		radio.name = "collectionType";
		radio.value = type.value;
		radio.id = HIDItemCollectionType.name + "." + type.name;
		if (type == collType)
			radio.checked = true;
		div.appendChild(radio);

		var label = document.createElement('LABEL');
		label.htmlFor = radio.id;
		label.textContent = type.name;
		div.appendChild(label);

		if (type == HIDItemCollectionType.VendorDefined) {
			label.textContent += ": ";
			var editbox = this.dlg.content.contentDocument.createElement("INPUT");
			editbox.type = "TEXT";
			editbox.name = "otherValue";
			editbox.id = "otherValue";
			if (type == collType)
				editbox.value = this.data.data
			div.appendChild(editbox);
		}
		var br = this.dlg.content.contentDocument.createElement("BR");
		div.appendChild(br);
	}
	this.getUIData = function () {
		var div = this.dlg.content.contentDocument.getElementById("ItemTypeData");
		var ret = 0;
		for (var index = 0; index < div.childNodes.length; index++) {
			var elem = div.childNodes[index];
			if (elem.tagName != "INPUT")
				continue;
			if (elem.checked) {
				ret = elem.value;
				break;
			}
		}
		return ret;
	}
}

EditItemDialogUI.prototype.initUIReport = function (div) {
	// Input/Output/Feature radio buttons
	// Fill the div with all known report attributes

	// TODO: quirk - Input main-item doesn't support the Volatile/NonVolatile bit 7 (it is reserved)
	for (var attrName in HIDReportEntryAttribute) {
		var attr = HIDReportEntryAttribute[attrName];
		if (typeof attr !== 'object')
			continue;

		var radio = this.dlg.content.contentDocument.createElement("INPUT");
		radio.type = "radio";
		radio.name = "attr" + attr.bit;
		radio.value = attr.value;
		radio.attr = attr;
		radio.id = HIDReportEntryAttribute.name + "." + attr.name;
		div.appendChild(radio);

		var label = document.createElement('LABEL');
		label.htmlFor = radio.id;
		label.textContent = attr.name;
		div.appendChild(label);

		if (attr.value == 1) {
			var br = this.dlg.content.contentDocument.createElement("BR");
			div.appendChild(br);
		}
	}

	var attrs = new HIDReportEntryAttributes(this.data.data);
	for (var attrIndex = 0; attrIndex < attrs.attrs.length; attrIndex++) {
		var attr = attrs.attrs[attrIndex];
		this.dlg.content.contentDocument.getElementById(HIDReportEntryAttribute.name + "." + attr.name).checked = true;
	}

	this.getUIData = function () {
		var div = this.dlg.content.contentDocument.getElementById("ItemTypeData");
		var ret = 0;
		for (var index = 0; index < div.childNodes.length; index++) {
			var elem = div.childNodes[index];
			if (elem.tagName != "INPUT")
				continue;
			if (!elem.checked)
				continue;

			ret |= elem.attr.value << elem.attr.bit;
		}
		return ret;
	}
}

EditItemDialogUI.prototype.initUIUnit = function (div, unit) {
	// TODO:
	// SELECT element for unit-system (list at HIDUnitSystem)
	// Sliders(?) for exponents for each of the 6 units of the selected system (range -8 .. 7)
}

EditItemDialogUI.prototype.loadData = function () {
	var item = this.data;
	if (item == null)
		return;

	// "Item" drop-down list
	var selectedTag = null;
	for (var index = 0; index < this.itemType.options.length; index++) {
		var tag = eval(this.itemType.options[index].value);
		if (tag == item.tag) {
			this.itemType.selectedIndex = index;
			selectedTag = tag;
			break;
		}
	}
	this.itemType.onchange();
}

EditItemDialogUI.prototype.saveData = function () {
	var item = this.data;
	if (item == null)
		return;

	var selectedOption = this.itemType.options[this.itemType.selectedIndex];
	var group = selectedOption.parentElement;
	item.tag = selectedOption.tag;
	item.type = group.type;
	item.data = this.getUIData();
}
