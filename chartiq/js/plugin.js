// -------------------------------------------------------------------------------------------
// Copyright 2012-2016 by ChartIQ, Inc
// -------------------------------------------------------------------------------------------
(function (definition) {
    "use strict";

    if (typeof exports === "object" && typeof module === "object") {
        module.exports = definition(require('./thirdparty/iscroll'),require('./chartiq'),require('./studies'));
    } else if (typeof define === "function" && define.amd) {
        define(['thirdparty/iscroll','chartiq','studies'], definition);
    } else if (typeof window !== "undefined" || typeof self !== "undefined") {
		var global = typeof window !== "undefined" ? window : self;
		definition(global,global,global);
    } else {
		throw new Error("Only CommonJS, RequireJS, and <script> tags supported for plugin.js.");
    }

})(function(iscroll, _exports, studies) {
	console.log("plugin.js",_exports);
	var CIQ=_exports.CIQ;
	var IScroll5=iscroll.IScroll5;

	/**
	 * Namespace for managing iscrolls (scrollable elements by touch of mousewheel).
	 * @name  CIQ.iscroll
	 */
	CIQ.iscroll=function(){};

	/**
	 * The scrollers in use
	 * @type {Array}
	 * @memberOf CIQ.iscroll
	 */
	CIQ.iscroll.scrollers=[];

	/**
	 * Create a new iscroll
	 * @param  {object} node   The element to attach the scroller to
	 * @param  {object} [params] Parameters for the scroller as defined by iscroll library
	 * @return {object}        Returns the scroller
	 * @memberOf CIQ.iscroll
	 */
	CIQ.iscroll.newScroller=function(node, params){
		if(!params) params={
			tap:true,
			scrollbars:true,
			interactiveScrollbars: true,
			mouseWheel: true
		};
		var iscroll = new IScroll5(node, params);
		iscroll.utils = IScroll5.utils;
		CIQ.iscroll.scrollers.push(iscroll);
		return iscroll;
	};

	/**
	 * Refreshes all iscrolls on the page
	 * @memberOf CIQ.iscroll
	 */
	CIQ.iscroll.refresh=function(){
		for(var i=0;i<CIQ.iscroll.scrollers.length;i++){
			var iscroll=CIQ.iscroll.scrollers[i];
			iscroll.refresh();
		}
	};

	
	
	/**
	 * ** This namespace is maintained for legacy implementations only (not using web components). New implementations should use functionality included in the web components (stxUI.js) **<br>
	 * A widget for managing modal dialogs. It maintains an internal stack so that multiple dialogs may be open simultaneously.
	 * Optionally set useOverlay to true in order to create an overlay for dimming the screen
	 * @namespace
	 * @name CIQ.DialogManager
	 */
	CIQ.DialogManager=function(){};

	/**
	 * Whether to use overlay for closing dialogs
	 * @type {Boolean}
	 * @memberOf CIQ.DialogManager
	 */
	CIQ.DialogManager.useOverlay=false;
	CIQ.DialogManager.stack=[];

	/**
	 * Makes charts unresponsive during modal
	 * @memberOf CIQ.DialogManager
	 */
	CIQ.DialogManager.modalBegin=function(){
		if(CIQ.MenuManager) CIQ.MenuManager.menusDisabledDialog=true;
		for(var i=0;i<CIQ.ChartEngine.registeredContainers.length;i++){
			var stx=CIQ.ChartEngine.registeredContainers[i].stx;
			stx.modalBegin();
		}
	};

	/**
	 * Releases modal
	 * @memberOf CIQ.DialogManager
	 */
	CIQ.DialogManager.modalEnd=function(){
		if(CIQ.MenuManager) CIQ.MenuManager.menusDisabledDialog=false;
		for(var i=0;i<CIQ.ChartEngine.registeredContainers.length;i++){
			var stx=CIQ.ChartEngine.registeredContainers[i].stx;
			stx.modalEnd();
		}
	};

	/**
	 * Displays the dialog. Optionally displays the overlay if CIQ.DialogManager.useOverlay is set
	 * @param  {string} id ID of the dialog
	 * @memberOf CIQ.DialogManager
	 */
	CIQ.DialogManager.displayDialog=function(id){
		CIQ.hideKeyboard();
		CIQ.DialogManager.modalBegin();
		if(CIQ.DialogManager.useOverlay && !CIQ.DialogManager.bodyOverlay){
			CIQ.DialogManager.bodyOverlay=CIQ.newChild(document.body, "DIV", "stxDialogOverlay");
		}
		if(CIQ.DialogManager.useOverlay){
			CIQ.DialogManager.bodyOverlay.style.display="block";
		}
		var node=id;
		if(typeof id=="string") node=$$(id);
		node.style.display="block";
		CIQ.DialogManager.stack.push(node);
	};

	/**
	 * Dismisses any active dialogs
	 * @memberOf CIQ.DialogManager
	 */
	CIQ.DialogManager.dismissDialog=function(){
		document.activeElement.blur();	// Hide keyboard on touch devices
		var node=CIQ.DialogManager.stack.pop();
		if(!node) return;
		node.style.display="none";
		if(node.colorPickerDiv) node.colorPickerDiv.style.display="none";

		if(!CIQ.DialogManager.stack.length){
			if(CIQ.DialogManager.bodyOverlay && CIQ.DialogManager.bodyOverlay.style.display=="block"){
				CIQ.DialogManager.bodyOverlay.style.display="none";
			}
			CIQ.DialogManager.modalEnd();
		}
		CIQ.fixScreen();
	};
	
	return _exports;

});
