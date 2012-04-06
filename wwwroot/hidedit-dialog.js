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

function Dialog(captionText, contentURL) {
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
	this.content.className = "DialogContent";
	this.content.src = contentURL;
	this.item.appendChild(this.content);

	document.body.appendChild(this.dlgParent);
}

Dialog.prototype.setSize = function (width, height) {
	this.item.style.width = width + "px";
	this.item.style.height = height + "px";
}

Dialog.prototype.show = function () {
	delClass(this.dlgParent, "hidden");
};

Dialog.prototype.close = function () {
	addClass(this.dlgParent, "hidden");
};
