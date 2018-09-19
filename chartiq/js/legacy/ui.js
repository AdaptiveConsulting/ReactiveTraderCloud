// -------------------------------------------------------------------------------------------
// Copyright 2012-2016 by ChartIQ, Inc
// -------------------------------------------------------------------------------------------
(function (definition) {
    "use strict";

    if (typeof exports === "object" && typeof module === "object") {
        module.exports = definition(require("../thirdparty/iscroll"), require('../chartiq'));
    } else if (typeof define === "function" && define.amd) {
        define(["thirdparty/iscroll",'chartiq'], definition);
    } else if (typeof window !== "undefined" || typeof self !== "undefined") {
		var global = typeof window !== "undefined" ? window : self;
		definition(global, global, global);
    } else {
		throw new Error("Only CommonJS, RequireJS, and <script> tags supported for ui.js.");
    }

})(function(_iscroll, _exports) {
	//console.log("ui.js",_exports);
	var $$=_exports.$$;
	var $$$=_exports.$$$;
	var CIQ=_exports.CIQ;
	var IScroll5=_iscroll.IScroll5;

	var CIQTouchAction="onmouseup";
	if(CIQ.touchDevice && (CIQ.ipad || CIQ.iphone)) CIQTouchAction="ontouchend";

	/**
	 * Sets click or touch events depending on the device
	 * @deprecated  Use CIQ.safeClickTouch instead
	 */
	CIQ.androidDoubleTouch=null;
	CIQ.clickTouch=function(div, fc){
		// Annoyingly, Android default browser sometimes registers onClick events twice, so we ignore any that occur
		// within a half second
		function closure(div, fc){
			return function(e){
				if(!CIQ.androidDoubleTouch){
					CIQ.androidDoubleTouch=new Date().getTime();
				}else{
					if(new Date().getTime()-CIQ.androidDoubleTouch<500) return;
					CIQ.androidDoubleTouch=new Date().getTime();
				}
				(fc)(e);
			};
		}
		if(CIQ.ipad || CIQ.iphone){
			div.ontouchend=fc;
		}else{
			if(CIQ.isAndroid){
				div.onclick=closure(div, fc);
			}else{
				div.onclick=fc;
			}
		}
	};

	/**
	 * Gets the absolute screen position of a nested DOM element. This is useful if you need to position additional elements or canvas
	 * elements relative to a nested DOM element.
	 * @param  {object} el A valid DOM element
	 * @return {object}    {x,y} absolute screen position of the nested element
	 * @memberOf CIQ
	 */
	CIQ.getPos=function(el) {
	    for (var lx=0, ly=0;
	         el;
	         lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
	    return {x: lx,y: ly};
	};

	/**
	 * Returns true if a point, in absolute screen position, is within an element
	 * @param  {object} node A valid DOM element to check whether the point overlaps
	 * @param  {number} x    Absolute screen X position of point
	 * @param  {number} y    Absolute screen Y position of pointer
	 * @return {boolean}      True if the point lies inside of the DOM element
	 * @memberOf CIQ
	 */
	CIQ.withinElement=function(node, x, y){
		var xy=CIQ.getPos(node);
		if(x<=xy.x) return false;
		if(y<=xy.y) return false;
		if(x>=xy.x+node.offsetWidth) return false;
		if(y>=xy.y+node.offsetHeight) return false;
		return true;
	};

	/**
	 * Creates a box on the canvas with containing text (a label)
	 * @param  {number} x     Left position of label
	 * @param  {number} y     Top position of label
	 * @param  {string} text  Text to print in the label
	 * @param  {object} stx   Chart object
	 * @param  {string} style Class name from which style should be applied
	 * @memberOf CIQ
	 */
	CIQ.textLabel = function (x, y, text, stx, style) {
		stx.canvasFont(style);
		//var m=stx.chart.context.measureText(text);
		var fontHeight=stx.getCanvasFontSize(style);
		var s=stx.canvasStyle(style);
		var context=stx.chart.context;
		var arr=text.split("\n");
		var maxWidth=0;
		var i;
		for(i=0;i<arr.length;i++){
			var m=stx.chart.context.measureText(arr[i]);
			if(m.width>maxWidth) maxWidth=m.width;
		}
		var height=arr.length*fontHeight;
		context.textBaseline="alphabetic";
		context.strokeStyle=s["border-left-color"];
		context.fillStyle=s["background-color"];
		context.beginPath();
		context.moveTo(x, y);
		context.lineTo(x+maxWidth+10, y);
		context.lineTo(x+maxWidth+10, y+height+2);
		context.lineTo(x, y+height+2);
		context.lineTo(x, y);
		context.stroke();
		context.fill();
		context.closePath();
		context.strokeStyle=s.color;
		context.fillStyle=s.color;
		context.textBaseline="top";
		var y1=0;
		for(i in arr){
			context.fillText(arr[i], x+5, y+y1+1);
			y1+=fontHeight;
		}
	};

	/* TOC()************* DEPRECATED ************** */

	// Don't use, just for crosshairs
	var blocks=[];

	/**
	 * @deprecated
	 */
	CIQ.createDIVBlock=function(left, width, top, height){
		var block=document.createElement("div");
		block.style.position="fixed";
		block.style.left=left + "px";
		block.style.width=width + "px";
		block.style.top=top + "px";
		block.style.height=height + "px";
		document.body.appendChild(block);
		blocks[blocks.length]=block;
		return block;
	};

	/**
	 * @deprecated
	 */
	CIQ.horizontalIntersect=function(vector, x, y){
		if(x<Math.max(vector.x0, vector.x1) && x>Math.min(vector.x0, vector.x1)) return true;
		return false;
	};

	/**
	 * @deprecated
	 */
	CIQ.twoPointIntersect=function(vector, x, y, radius){
		return CIQ.boxIntersects(x-radius, y-radius, x+radius, y+radius, vector.x0, vector.y0, vector.x1, vector.y1, "segment");
	};

	/**
	 * @deprecated
	 */
	CIQ.boxedIntersect=function(vector, x, y){
		if(x>Math.max(vector.x0, vector.x1) || x<Math.min(vector.x0, vector.x1)) return false;
		if(y>Math.max(vector.y0, vector.y1) || y<Math.min(vector.y0, vector.y1)) return false;
		return true;
	};

	/**
	 * @deprecated
	 */
	CIQ.isInElement=function(div, x, y){
		if(x<div.offsetLeft) return false;
		if(x>div.offsetLeft+div.clientWidth) return false;
		if(y<div.offsetTop) return false;
		if(y>div.offsetTop+div.clientHeight) return false;
		return true;
	};



	/* TOC()************* STORAGE MANAGER ************** */

	/**
	 * A widget for saving and getting name value pairs. Uses browser localStorage by default but you can override
	 * the remove, get and store functions, or derive a new class, to save to a different data store.
	 * @namespace
	 * @name  CIQ.StorageManager
	 */
	CIQ.StorageManager=function(){};

	/**
	 * Get the value for a given key from storage
	 * @param  {string} key The key
	 * @param {Function} [cb] Optionally receive the result in a callback. Required for asynchronous interfaces.
	 * @return {object}     The data in JSON format ( sample: "[{"list 1":["IBM","GE","INTC"]},{"list 2":["G","T","W","K"]}]")
	 * @memberOf CIQ.StorageManager
	 * @since  2015-03-01 Added optional callback
	 */
	CIQ.StorageManager.get=function(key, cb){
		if(!CIQ.localStorage) return null;
		var datum=CIQ.localStorage.getItem(key);
		if(cb){
			cb(null, datum);
		}
		return datum;
	};

	/**
	 * Save the key value pair in storage
	 * @param  {string} key   The key
	 * @param  {object} value The value in Json format ( sample: "[{"list 1":["IBM","GE","INTC"]},{"list 2":["G","T","W","K"]}]")
	 * @memberOf CIQ.StorageManager
	 */
	CIQ.StorageManager.store=function(key, value){
		CIQ.localStorage.setItem(key, value);
	};

	/**
	 * Remove the key from storage
	 * @param  {string} key The key
	 * @memberOf CIQ.StorageManager
	 */
	CIQ.StorageManager.remove=function(key){
		CIQ.localStorage.removeItem(key);
	};

	/**
	 * Provides a closure that can be passed in to other CIQ UI components for storage or removal.
	 * @param  {string} key The key for the closure
	 * @return {fc}     A closure of form fc(value, stx)
	 * @example
	 * // This provides the ThemeManager with a mechanism for saving its data, under the key "themes"
	 * CIQ.ThemeManager.themesToMenu(node, node, stx, CIQ.StorageManager.callbacker("themes"));
	 * @memberOf CIQ.StorageManager
	 */
	CIQ.StorageManager.callbacker=function(key){
		return function(value, stx){
			if(value===null){
				CIQ.StorageManager.remove(key);
			}else{
				CIQ.StorageManager.store(key, value);
			}
		};
	};

	/**
	 * DropDownManager
	 *
	 * A simple widget for managing drop downs.
	 */
	CIQ.DropDownManager=function(){};
	CIQ.DropDownManager.dropDowns=[];
	CIQ.DropDownManager.callback=null;
	CIQ.DropDownManager.listeners={};
	CIQ.DropDownManager.newDropDown=function(dropDown){
		function toggle(dropDown){
			return function(e){
				if($$$("ul", dropDown).style.display=="block"){
					$$$("ul", dropDown).style.display="none";
					return;
				}
				$$$("ul", dropDown).style.display="block";
				CIQ.DropDownManager.callback=function(dropDown){
					return function(e){
						var inside=false;
						if((e.which && e.which>=2) || (e.button && e.button>=2)) return; // right click
						var menu=$$$("ul", dropDown);
						if(!CIQ.withinElement(dropDown, e.pageX, e.pageY) && !CIQ.withinElement(menu, e.pageX, e.pageY)){
							menu.style.display="none";
							e.stopPropagation(); // Prevent the event from being received by any DOM element except those in the menu
							e.preventDefault();	// Prevent the browser from doing things like checking checkboxes, selectboxes, etc
							inside=true;
						}
						for(var event in CIQ.DropDownManager.listeners){
							document.removeEventListener(event, CIQ.DropDownManager.listeners[event], true);
						}
						if(inside) return false;
					};
				}(dropDown);
				// Set a temporary listener on the entire document. This will prevent anything on the page from responding
				// to normal touch/click events. Note that we use logic here to attach the same (similar) type of event
				// as was received on the menu to begin with. Given that touch devices receive multiple event types this may
				// need some refinement
				setTimeout(function(){
					if(e.type=="click"){
						document.addEventListener("click", CIQ.DropDownManager.callback, true);
						CIQ.DropDownManager.listeners.click=CIQ.DropDownManager.callback;
					}
					if(e.type=="pointerup"){
						document.addEventListener("pointerdown", CIQ.DropDownManager.callback, true);
						CIQ.DropDownManager.listeners.pointerdown=CIQ.DropDownManager.callback;
					}
					if(e.type=="touchend"){
						document.addEventListener("touchstart", CIQ.DropDownManager.callback, true);
						CIQ.DropDownManager.listeners.touchstart=CIQ.DropDownManager.callback;
					}
				},0);
			};
		}
		$$$("ul", dropDown).style.display="none";
		CIQ.safeClickTouch(dropDown, toggle(dropDown));
	};
	CIQ.DropDownManager.initialize=function(){
		var dropDowns=document.querySelectorAll(".stx-dropdown");
		for(var i=0;i<dropDowns.length;i++){
			var dropDown=dropDowns[i];
			CIQ.DropDownManager.newDropDown(dropDown);
		}
	};


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
	 *
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

	/**
	 * ** This namespace is maintained for legacy implementations only (not using web components). New implementations should use functionality included in the web components (stxUI.js) **<br>
	 *
	 * This widget manages menus. First, it ensures that charts do not react to users clicking or tapping on menus that overlap
	 * the charting area. Then it also allows users to close menus by tapping outside of the menu area. This is accomplished
	 * through the use of invisible, temporary overlay divs. Menu manager is a singleton. It automatically exists and only one is required per page.
	 * Simply register your charts with the manager in order for it to automatically engage.
	 * @namespace
	 * @name  CIQ.MenuManager
	 */
	CIQ.MenuManager=function(){};
	CIQ.MenuManager.registeredCharts=[];
	CIQ.MenuManager.openMenu=null;
	CIQ.MenuManager.useOverlay=true;
	CIQ.MenuManager.menusDisabled=false;	// Set to true when menus are disabled based on state. Menus with "alwaysOn" will still function.
	CIQ.MenuManager.menusDisabledDialog=false;	// Set to true for instance when opening a dialog. No menus will function, even "alwaysOn".
	CIQ.MenuManager.onClass=null;
	CIQ.MenuManager.offClass=null;
	CIQ.MenuManager.menus=[];
	//CIQ.MenuManager.closeCurrent=null;	// function callback to close current menu
	CIQ.MenuManager.stack=[];

	/**
	 * Clears out the MenuManager, eliminating all stxx references.
	 * To destroy the complete chart and related UI use {@link CIQ.destroy}
	 * @memberOf CIQ.MenuManager
	 */
	CIQ.MenuManager.destroy=function(){
		this.registeredCharts=[];
		if(CIQ.MenuManager.bodyOverlay){
			CIQ.MenuManager.bodyOverlay.parentNode.removeChild(CIQ.MenuManager.bodyOverlay);
		}
	};

	/**
	 * Registers a chart with the menuManager. This should be called for each chart on the screen.
	 * @param  {object} stx The chart object
	 * @memberOf CIQ.MenuManager
	 */
	CIQ.MenuManager.registerChart=function(stx){
		CIQ.MenuManager.registeredCharts.push(stx);
		if(!CIQ.MenuManager.bodyOverlay){
			CIQ.MenuManager.bodyOverlay=CIQ.newChild(document.body, "DIV", "stxBodyOverlay");
		}
	};

	/**
	 * Override whether or not to use overlays. If overlays are not enabled then menus will still co-react
	 * but no overlay will be generated to allow tapping outside of the menus
	 * @memberOf CIQ.MenuManager
	 */
	CIQ.MenuManager.useOverlays=function(useOverlay){
		CIQ.MenuManager.useOverlay=useOverlay;
	};

	/**
	 * Cancels a single click event that might otherwise have been picked up by a chart object when the user taps on the overlay to close the menu
	 * @memberOf CIQ.MenuManager
	 */
	CIQ.MenuManager.cancelSingleClick=function(){
		for(var i=0;i<CIQ.MenuManager.registeredCharts.length;i++){
			CIQ.MenuManager.registeredCharts[i].cancelTouchSingleClick=true;
		}
	};

	/**
	 * Turns on a menu and disables touch and mouse events. Typically managed automatically but can be called programatically.
	 * @param {string} name Name of menu. This should be unique so that clicking one menu will close an already open menu
	 * @param {function} callback This function will be called when the user taps outside of the menu, and passed the name
	 * @param {boolean} cascading Set to true if the menu is a cascade (2nd level) menu
	 * @memberOf CIQ.MenuManager
	 */
	CIQ.MenuManager.menuOn=function(name, callback, cascading){
		function tapMe(callback, name){
			return function(e){
				CIQ.MenuManager.menuOff();
				//callback(name);
			};
		}
		if(!CIQ.MenuManager.registeredCharts.length) return;
		if(CIQ.MenuManager.openMenu){
			if(name==CIQ.MenuManager.openMenu) return;	// menu already open and manager active
			if(!cascading) CIQ.MenuManager.menuOff(true);
			//CIQ.MenuManager.closeCurrentMenu();
		}
		CIQ.MenuManager.openMenu=name;
		if(!cascading && CIQ.MenuManager.useOverlay){
			CIQ.MenuManager.bodyOverlay.style.display="block";
			CIQ.MenuManager.bodyOverlay[CIQTouchAction]=tapMe(name);
			//CIQ.MenuManager.closeCurrent=callback;
		}
		CIQ.MenuManager.stack.push({closeCurrentMenu:callback, cascading:cascading});
		//CIQ.MenuManager.closeCurrentMenu=callback;
		for(var i=0;i<CIQ.MenuManager.registeredCharts.length;i++){
			CIQ.MenuManager.registeredCharts[i].openDialog=name;
		}
	};

	/**
	 * Hides any menus that are currently showing and re-enables touch and mouse events.
	 * @param {boolean} [closeAll] If true then all menus will be closed, otherwise just the top cascading menu will be closed
	 * @param {boolean} [dontBlur] Dont blur the currently active element, for instance when you have purposefully focused an element
	 * @memberOf CIQ.MenuManager
	 */
	CIQ.MenuManager.menuOff=function(closeAll, dontBlur){
		if(!CIQ.MenuManager.stack.length) return;
		if(!CIQ.MenuManager.registeredCharts.length) return;
		if(!dontBlur && document.activeElement && document.activeElement.tagName!="BODY" && document.activeElement.blur) document.activeElement.blur();	// Hide keyboard on touch devices
		/*if(CIQ.MenuManager.closeCurrent){
			var fc=CIQ.MenuManager.closeCurrent;
			CIQ.MenuManager.closeCurrent=null; // prevent infinite loop
			fc(CIQ.MenuManager.openMenu);
		}*/
		//CIQ.MenuManager.closeCurrent=null;
		while(CIQ.MenuManager.stack.length){
			var obj=CIQ.MenuManager.stack.pop();
			obj.closeCurrentMenu();
			if(!closeAll) break;
		}
		if(!CIQ.MenuManager.stack.length){
			CIQ.MenuManager.openMenu=null;
			if(CIQ.MenuManager.useOverlay){
				CIQ.MenuManager.bodyOverlay.style.display="none";
				CIQ.MenuManager.bodyOverlay[CIQTouchAction]=null;
			}
		}
		this.cancelSingleClick();
		if(!CIQ.DialogManager.stack.length){
			for(var i=0;i<CIQ.MenuManager.registeredCharts.length;i++){
				CIQ.MenuManager.registeredCharts[i].openDialog="";
			}
		}
	};

	/**
	 * Initializes the menuing system. Menus should be of specified format, using class stxMenu to indicate an object that can be clicked
	 * to create a menu. class menuOutline should be assigned to a sub-element of the menu that is displayed or hidden. stxToggle should
	 * be assigned to any active element of the menu.
	 * The code in stxToggle will be run through either eval() or parsing of a JSON string with objects fn for the function name and args as the arguments array.
	 *  For example, stxToggle='{"fn":"STXUI.changePeriodicity","args":["day"]}' which is the same as
	 *  stxToggle='STXUI.changePeriodicity(day)' except the former avoids eval and automatically makes the element clicked available as
	 *  'this' in the function.
	 * @memberOf CIQ.MenuManager
	 */
	CIQ.MenuManager.makeMenus=function(){
		function toggle(div, menu){
			return function(e){
				function turnMeOff(div){
					return function(){
						div.style.display="none";
						if(div.colorPickerDiv) div.colorPickerDiv.style.display="none";
					};
				}
				var dom=CIQ.getEventDOM(e);
				do{
					if(dom.className && dom.className.indexOf("menuOutline")!=-1) return;	// clicked inside the menuDisplay and not the menu button
					if(dom.className && dom.className.indexOf("stxMenu")!=-1) break; // clicked the actual button
					dom=dom.parentNode;
				}while(dom);
				if(div.style.display=="none"){
					var menuName=CIQ.uniqueID();
					if((CIQ.MenuManager.menusDisabled && !menu.alwaysOn) || CIQ.MenuManager.menusDisabledDialog) return;
					CIQ.MenuManager.menuOn(menuName, turnMeOff(div));
					div.style.display="block";
					if(div.className.indexOf("menuScroll")!=-1){
						if(!this.iscroll){
							this.iscroll = CIQ.iscroll.newScroller(div, {tap:true, scrollbars:false, interactiveScrollbars:false, mouseWheel:true});
						}else{
							this.iscroll.refresh();
						}
					}
				}else{
					CIQ.MenuManager.menuOff();
					div.style.display="none";
				}
			};
		}
		function activate(menuOutline){
			CIQ.MenuManager.menuOff();
			menuOutline.style.display="none";
			var action=this.getAttribute("stxToggle");
			try{
				var f=JSON.parse(action);
				var props=f.fn.split(".");
				f.fn=window;
				for(var p=0;p<props.length;p++) f.fn=f.fn[props[p]];
				f.fn.apply(this,f.args);
			}catch(e){
				/*jslint evil: true */ /*jshint -W061 */ /*eslint no-eval: 0 */
				eval(action);
				/*jslint evil: false */ /*jshint +W061 */ /*eslint no-eval: 1 */
			}
		}
		CIQ.MenuManager.menus=document.querySelectorAll(".stxMenu");
		function menuSafeClick(m,c){
			return function(e){activate.call(c,m);e.stopPropagation();};
		}
		for(var i=0;i<CIQ.MenuManager.menus.length;i++){
			var menu=CIQ.MenuManager.menus[i];
			var menuOutline=menu.querySelectorAll(".menuOutline")[0];
			menu.alwaysOn=(menu.className.indexOf("stxAlwaysOn")!=-1);
			menu[CIQTouchAction]=toggle(menuOutline, menu);

			var clickables=menuOutline.querySelectorAll("*[stxToggle]");
			for(var j=0;j<clickables.length;j++){
				CIQ.safeClickTouch(clickables[j],(menuSafeClick(menuOutline,clickables[j])));
			}
		}
	};

	/**
	 * Disable the menuing system (for instance when a dialog is open)
	 * @memberOf CIQ.MenuManager
	 */
	CIQ.MenuManager.disableMenus=function(){
		CIQ.MenuManager.menusDisabled=true;
		for(var i=0;i<CIQ.MenuManager.menus.length;i++){
			var menu=CIQ.MenuManager.menus[i];
			if(CIQ.MenuManager.onClass) CIQ.unappendClassName(menu, CIQ.MenuManager.onClass);
			if(CIQ.MenuManager.offClass) CIQ.appendClassName(menu, CIQ.MenuManager.offClass);
		}
	};

	/**
	 * Enable the menuing system (for instance after disabling it)
	 * @memberOf CIQ.MenuManager
	 */
	CIQ.MenuManager.enableMenus=function(){
		CIQ.MenuManager.menusDisabled=false;
		for(var i=0;i<CIQ.MenuManager.menus.length;i++){
			var menu=CIQ.MenuManager.menus[i];
			if(CIQ.MenuManager.offClass) CIQ.unappendClassName(menu, CIQ.MenuManager.offClass);
			if(CIQ.MenuManager.onClass) CIQ.appendClassName(menu, CIQ.MenuManager.onClass);
		}};

	/**
	 * Close the menu that an element lives in. For instance, when hitting enter in an input box contained
	 * within a menu simply send the input box itself in and the library will find and close the menu for you.
	 * @memberOf CIQ.MenuManager
	 */
	CIQ.MenuManager.closeThisMenu=function(el){
		while(el && typeof(el.className)!="undefined" && el.className.indexOf("menuOutline")==-1){
			el=el.parentNode;
		}
		if(el && el.style){
			el.style.display="none";
		}
		CIQ.MenuManager.menuOff();
	};

	/**
	 * Attach a color picker to a div (swatch).
	 *
	 * @param {object} colorClick - Should be the swatch DOM element
	 *
	 * @param {object} cpHolder - Should be a DOM element that contains the color picker. If the color picker is within a dialog
	 * or menu then cpHolder should be that dialog or menu in order to assure that the color picker is closed
	 * when the menu or dialog is closed
	 *
	 * @param {function} cb - The callback when the color is selected fc(color)
	 *
	 * @param {boolean} noMenuBehavior - When set to true bypasses the menuing system, otherwise the color picker is treated as a menu
	 * element and will close whenever another menu is opened. Always use noMenuBehavior when the color picker
	 * is contained within a parent menu otherwise the color picker could get orphaned on the screen.
	 * @memberOf CIQ.MenuManager
	 */
	CIQ.MenuManager.attachColorPicker = function(colorClick, cpHolder, cb, noMenuBehavior){
		var closure=function(colorClick, cpHolder, cb){
			return function(color){
				if(cpHolder.colorPickerDiv) cpHolder.colorPickerDiv.style.display="none";
				colorClick.style.backgroundColor="#"+color;
				if(cb) cb(color);
				if(!noMenuBehavior) CIQ.MenuManager.menuOff();
			};
		};
		function closeMe(cpHolder){
			return function(){
				if(cpHolder.colorPickerDiv) cpHolder.colorPickerDiv.style.display="none";
			};
		}

		colorClick[CIQTouchAction]=(function(fc, cpHolder){ return function(){
			if(!noMenuBehavior) CIQ.MenuManager.menuOn("colorPicker", closeMe(cpHolder));
			if(!cpHolder.colorPickerDiv){
				cpHolder.colorPickerDiv=document.createElement("DIV");
				cpHolder.colorPickerDiv.className="ciqColorPicker";
				document.body.appendChild(cpHolder.colorPickerDiv);
			}
			CIQ.createColorPicker(cpHolder.colorPickerDiv, fc);
			cpHolder.colorPickerDiv.style.display="block";
			var xy=CIQ.getPos(this);
			var x=xy.x+this.clientWidth;
			if((x+cpHolder.colorPickerDiv.offsetWidth)>CIQ.pageWidth())
				x-=(x+cpHolder.colorPickerDiv.offsetWidth)-CIQ.pageWidth()+20;
			cpHolder.colorPickerDiv.style.left=x+"px";

			var y=(xy.y);
			if(y+cpHolder.colorPickerDiv.clientHeight>CIQ.pageHeight())
				y-=(y+cpHolder.colorPickerDiv.clientHeight)-CIQ.pageHeight();
			cpHolder.colorPickerDiv.style.top=y+"px";
		};})(closure(colorClick, cpHolder, cb), cpHolder);
	};




	/**
	 * ** This namespage is maintained for legacy implementations only (not using web components). New implementations should use functionality included in the web components (stxUI.js) **<br>
	 * A widget for managing chart colors and themes. The dialog functionality assumes that color picker
	 * divs have been set up with a class that matches one of the stx chart configuration classes (such as stx_candle_up)
	 *
	 * The classMapping determines which classes are mapped to each color picker. If null then apply to the container itself.
	 *
	 * See the following tutorial if you wish to programatically create **custom color themes**: {@tutorial Custom Color Themes}
	 *
	 * @namespace
	 * @name  CIQ.ThemeManager
	 */
	CIQ.ThemeManager=function(){};

	/**
	 * Basic initialization of ThemeManager values.
	 * Use this to set stx and cb as opposed to CIQ.ThemeManager.themesToMenu, in the event you do not wish to use the automatic themes menu generation.
	 * @memberOf CIQ.ThemeManager
	 * @param {object} stx - a chart
	 * @param {function} cb - A callback method for storing the themes (i.e. to localStorage)
	 */
	CIQ.ThemeManager.initialize=function(stx, cb){
		CIQ.ThemeManager.stx=stx;
		CIQ.ThemeManager.storageCB=cb;
	};

	/**
	 * List of built in themes. Override this with your built in themes.
	 * @memberOf CIQ.ThemeManager
	 * @type {Object}
	 */
	CIQ.ThemeManager.builtInThemes={};
	CIQ.ThemeManager.themes={
			enabledTheme:null,
			customThemes:{}
	};

	/**
	 * Clears out the ThemeManager, eliminating all references to stx objects.
	 * To destroy the complete chart and related UI use {@link CIQ.destroy}
	 * @memberOf CIQ.ThemeManager
	 */
	CIQ.ThemeManager.destroy=function(){
		this.builtInThemes={};
		this.themes.customThemes={};
		this.themes.enabledTheme=null;
	};

	/**
	 * Determines which underlying classes are overridden by each of the dialog swatches a user can change.
	 * @type {Object}
	 * @memberOf CIQ.ThemeManager
	 */
	CIQ.ThemeManager.classMapping={
		stx_candle_up: {stx_candle_up:true, stx_bar_up:true, stx_hollow_candle_up:true, stx_line_up:true, stx_baseline_up:true},
		stx_candle_down: {stx_candle_down:true, stx_bar_down:true, stx_hollow_candle_down:true ,stx_line_down:true, stx_baseline_down:true},
		stx_candle_shadow: {stx_candle_shadow:true, stx_bar_even:true, stx_bar_chart:true, stx_line_chart:true, stx_hollow_candle_even:true},			stx_candle_shadow_up: {stx_candle_shadow_up:true},
		stx_candle_shadow_down: {stx_candle_shadow_down:true},
		stx_grid: {stx_grid:true},
		stx_grid_dark: {stx_grid_dark:true},
		stx_xaxis_dark: {stx_xaxis_dark:true, stx_xaxis:true, stx_yaxis:true, stx_yaxis_dark:true},
		stx_mountain: {stx_mountain_chart:true},
		stx_market_session: {stx_market_session:true},
		backgroundColor: null
	};

	/**
	 * Populate a dialog with the existing colors from a chart.
	 * @param {string} id Name of the theme dialog
	 * @param {object} stx The chart object
	 * @memberOf CIQ.ThemeManager
	 */
	CIQ.ThemeManager.populateDialog=function(id, stx){
		var mountainGradientCheckbox=$$$("#mountainGradientOn",$$(id));  //backwards compatibility

		function toggleBorders(noDraw){
			if($$$("#candleBordersOn",$$(id)).checked){
				stx.styles.stx_candle_up["border-left-color"]=$$(id).querySelectorAll(".stx-border-color.stx_candle_up")[0].style.backgroundColor;
				stx.styles.stx_candle_down["border-left-color"]=$$(id).querySelectorAll(".stx-border-color.stx_candle_down")[0].style.backgroundColor;
			}else{
				stx.styles.stx_candle_up["border-left-color"]="transparent";
				stx.styles.stx_candle_down["border-left-color"]="transparent";
			}
			if(!noDraw && stx.displayInitialized) stx.draw();
		}
		function toggleMountainGradient(){
			if(mountainGradientCheckbox && mountainGradientCheckbox.checked){
				stx.styles.stx_mountain_chart.color=CIQ.hexToRgba($$(id).querySelectorAll(".stx-border-color.stx_mountain")[0].style.backgroundColor,1);
				stx.styles.stx_mountain_chart.backgroundColor=CIQ.hexToRgba($$(id).querySelectorAll(".stx-border-color.stx_mountain")[0].style.backgroundColor,50);
			}else{
				stx.styles.stx_mountain_chart.color=$$(id).querySelectorAll(".stx-border-color.stx_mountain")[0].style.backgroundColor;
				stx.styles.stx_mountain_chart.backgroundColor=$$(id).querySelectorAll(".stx-border-color.stx_mountain")[0].style.backgroundColor;
			}
			if(stx.displayInitialized) stx.draw();
		}
		function chooseColor(property, className){
			return function(color){
				var mapping=CIQ.ThemeManager.classMapping[className];
				if(mapping){
					for(var mapped in mapping){
						stx.canvasStyle(mapped);
						stx.styles[mapped][property]="#"+color;
						if(className=="stx_mountain"){	// Hacked in here. Ideally we would expand class mapping to accept specific css fields
							if(mountainGradientCheckbox && mountainGradientCheckbox.checked){
								stx.styles[mapped].color=CIQ.hexToRgba("#"+color,1);
								stx.styles[mapped].backgroundColor=CIQ.hexToRgba("#"+color,50);
							}else{
								stx.styles[mapped].color="#"+color;
								stx.styles[mapped].backgroundColor="#"+color;
							}
							stx.styles[mapped].borderTopColor="#"+color;
						}
					}
				}else{
					stx.chart.container.style[className]="#" + color;
				}
				if(stx.displayInitialized) stx.draw();
				if(property=="border-left-color" && color && color!="transparent"){
					$$$("#candleBordersOn", $$(id)).checked=true;
				}
			};
		}
		$$$("#candleBordersOn",$$(id)).checked=false;
		$$$("#candleBordersOn",$$(id)).onclick=toggleBorders;

		if(mountainGradientCheckbox){
			mountainGradientCheckbox.checked=false;
			mountainGradientCheckbox.onclick=toggleMountainGradient;
		}

		var computed="#FFFFFF";
		if(stx.chart.container){
			computed=getComputedStyle(stx.chart.container);
		}
		for(var className in CIQ.ThemeManager.classMapping){
			var mapping=CIQ.ThemeManager.classMapping[className];
			var color=null;
			var borderColor=null;

			if(mapping){
				var firstClass=CIQ.first(mapping);
				var style=stx.canvasStyle(firstClass);
				color=style.color;
				borderColor=style["border-left-color"];
				if(!borderColor || borderColor=="transparent") borderColor=style.borderLeftColor;
			}else{
				color=computed[className];
				if(CIQ.isTransparent(color) && className=="backgroundColor") color=stx.containerColor;
			}

			var picker=$$(id).querySelectorAll(".stx-color." + className)[0];
			if(picker){
				picker.style.backgroundColor=color;
				if(!picker[CIQTouchAction]){
					CIQ.MenuManager.attachColorPicker(picker, CIQ.DialogManager, chooseColor("color", className));
				}
			}

			picker=$$(id).querySelectorAll(".stx-border-color." + className)[0];
			if(picker){
				picker.style.backgroundColor=borderColor;
				if(!picker[CIQTouchAction]){
					CIQ.MenuManager.attachColorPicker(picker, CIQ.DialogManager, chooseColor("border-left-color", className));
				}
				if(borderColor && borderColor!="transparent") $$$("#candleBordersOn", $$(id)).checked=true;
				if(mountainGradientCheckbox && color && color.indexOf("rgba("===0)) mountainGradientCheckbox.checked=true;
			}
		}
		toggleBorders(true);
	};

	/**
	 * Convert colors from an existing chart into a theme object
	 * @param {object} stx The chart object
	 * @return {Object} The theme object
	 * @memberOf CIQ.ThemeManager
	 */
	CIQ.ThemeManager.createTheme=function(stx){
		var theme={};
		if(CIQ.ThemeManager.baseTheme) theme.baseTheme=CIQ.ThemeManager.baseTheme;
		for(var className in CIQ.ThemeManager.classMapping){
			var mapping=CIQ.ThemeManager.classMapping[className];
			if(mapping){
				var firstClass=CIQ.first(mapping);
				var style=stx.canvasStyle(firstClass);
				theme[className]={color:style.color};
				if(style.borderTopColor) theme[className].borderTopColor=style.borderTopColor;
				if(style.backgroundColor) theme[className].backgroundColor=style.backgroundColor;
				if(style["border-left-color"] && style["border-left-color"]!="transparent"){
					theme[className]["border-left-color"]=style["border-left-color"];
				}else{
					theme[className]["border-left-color"]="transparent";
				}
			}else{
				if(stx.chart.container)
					theme[className]=stx.chart.container.style[className];
			}
		}
		return theme;
	};

	/**
	 * Save a theme by name. Optional callback function when finished of fc(str) where str is a stringified version of the themes
	 * that can be used for saving to a server or to local storage
	 * @param {string} name The name of the theme
	 * @param {object} stx The chart object
	 * @memberOf CIQ.ThemeManager
	 */
	CIQ.ThemeManager.saveTheme=function(name, stx){
		var theme=CIQ.ThemeManager.createTheme(stx);
		CIQ.ThemeManager.themes.customThemes[name]=theme;
		CIQ.ThemeManager.themes.enabledTheme=name;
		if(CIQ.ThemeManager.storageCB) CIQ.ThemeManager.storageCB(JSON.stringify(CIQ.ThemeManager.themes), stx);
		CIQ.ThemeManager.themesToMenu(CIQ.ThemeManager.el, CIQ.ThemeManager.el2, CIQ.ThemeManager.stx, CIQ.ThemeManager.storageCB);
	};

	/**
	 * Delete a custom theme by name.
	 * @param {object} stx The chart object
	 * @param {string} theme The name of the theme
	 * @memberOf CIQ.ThemeManager
	 */
	CIQ.ThemeManager.deleteTheme=function(stx, theme){
		if(CIQ.ThemeManager.themes.customThemes[theme]){
			if(theme==CIQ.ThemeManager.themes.enabledTheme) CIQ.ThemeManager.enableBuiltInTheme(stx, CIQ.ThemeManager.baseTheme);
			delete CIQ.ThemeManager.themes.customThemes[theme];
			if(CIQ.ThemeManager.storageCB) CIQ.ThemeManager.storageCB(JSON.stringify(CIQ.ThemeManager.themes), stx);
		}
	};

	/**
	 * Sets themes from a serialized object
	 * @param {object} obj Serialized themes
	 * @param {object} stx The chart object
	 * @memberOf CIQ.ThemeManager
	 */
	CIQ.ThemeManager.setThemes=function(obj, stx){
		if(obj){
			if(obj.customThemes) CIQ.ThemeManager.themes.customThemes=obj.customThemes;
			CIQ.ThemeManager.themes.enabledTheme=obj.enabledTheme;
			if(CIQ.ThemeManager.themes.enabledTheme){
				CIQ.ThemeManager.enableTheme(stx, CIQ.ThemeManager.themes.enabledTheme);
			}
		}
	};

	/**
	 * Enables a specific theme. Custom themes are objects that contain color choices on top of a base theme (CSS File).
	 * @param  {object} stx   The chart object
	 * @param  {string} theme The theme name
	 * @memberOf CIQ.ThemeManager
	 */
	CIQ.ThemeManager.enableTheme=function(stx, theme){
		function addCustomizations(){
			var obj=CIQ.ThemeManager.themes.customThemes[theme];
			for(var className in obj){
				if(className=="baseTheme") continue;
				var mapping=CIQ.ThemeManager.classMapping[className];
				if(mapping){
					for(var mapped in mapping){
						stx.canvasStyle(mapped);
						stx.styles[mapped].color=obj[className].color;
						if(obj[className]["border-left-color"]){
							stx.styles[mapped]["border-left-color"]=obj[className]["border-left-color"];
						}
						if(className=="stx_mountain"){ // Hacked in. See other note.
							stx.styles[mapped].backgroundColor=obj[className].backgroundColor;
							stx.styles[mapped].borderTopColor=obj[className].borderTopColor;
							if(!stx.styles[mapped].backgroundColor) stx.styles[mapped].backgroundColor=obj[className].color;
							if(!stx.styles[mapped].borderTopColor) stx.styles[mapped].borderTopColor=obj[className].color;
						}
					}
				}else{
					if(stx.chart.container) stx.chart.container.style[className]=obj[className];
				}
			}
			if(stx.chart.container){
				stx.clearPixelCache();	// force new yAxis to be drawn
				stx.draw();
			}
		}
		//sets containerColor to the proper value.
		var obj=CIQ.ThemeManager.themes.customThemes[theme];
		if(obj){
			var baseTheme=obj.baseTheme;
			CIQ.ThemeManager.loadBuiltInTheme(stx, baseTheme, addCustomizations);
			CIQ.ThemeManager.themes.enabledTheme=theme;
			if(CIQ.ThemeManager.storageCB) CIQ.ThemeManager.storageCB(JSON.stringify(CIQ.ThemeManager.themes), stx);
		}else{
			CIQ.ThemeManager.loadBuiltInTheme(stx, theme);
		}
	};

	/**
	 * Enables a built in theme. Built in themes are CSS files.
	 * @param  {object} stx   The chart object
	 * @param  {string} theme The theme name
	 * @memberOf CIQ.ThemeManager
	 */
	CIQ.ThemeManager.enableBuiltInTheme=function(stx, theme){
		CIQ.ThemeManager.loadBuiltInTheme(stx, theme);
		CIQ.ThemeManager.themes.enabledTheme=theme;
		if(CIQ.ThemeManager.storageCB) CIQ.ThemeManager.storageCB(JSON.stringify(CIQ.ThemeManager.themes), stx);
	};

	/**
	 * Loads a built in theme by dynamically linking the CSS that defines that theme.
	 * @param {object} stx The chart object
	 * @param {string} theme The theme to load. Pass null to remove the current built in theme (not supported in mylty chart mode).
	 * @param {function} cb Callback function when theme is successfully loaded
	 * @memberOf CIQ.ThemeManager
	 */
	CIQ.ThemeManager.loadBuiltInTheme=function(stx, theme, cb){
		if(!theme){
			if(cb) cb();
			return;
		}
		var themeName;
		for(var thisTheme in CIQ.ThemeManager.builtInThemes) {
			themeName=CIQ.ThemeManager.builtInThemes[thisTheme];
			if(typeof themeName!="string") themeName=thisTheme;

			if(stx.wrapper)
				CIQ.unappendClassName($$$(stx.wrapper), themeName);
			else
				CIQ.unappendClassName($$$("body"), themeName);
		}

		themeName=CIQ.ThemeManager.builtInThemes[theme];
		if(typeof themeName!="string") themeName=theme;

		if(stx.wrapper)
			CIQ.appendClassName($$$(stx.wrapper), themeName);
		else
			CIQ.appendClassName($$$("body"), themeName);

		stx.styles={};
		stx.chart.container.style.backgroundColor="";
		CIQ.ThemeManager.baseTheme=theme;
		//sets containerColor to the proper value.
		stx.getDefaultColor();
		if(stx.displayInitialized){
			//stx.initializeChart(); -- don't need to initialize the chart just because the colors changed. Initializing also removes the drawings
			stx.headsUpHR();
			stx.clearPixelCache();	// force new yAxis to be drawn
			stx.draw();
		}
		if(cb) cb();
		stx.updateListeners("theme");  // tells listening objects that theme has changed
	};


	/**
	 * Construct a menu from available themes
	 * @param {object} el - The menu element where custom themes will be added
	 * @param {object} el2 - The menu element where built-in themes will be added
	 * @param {object} stx - a chart
	 * @param {function} cb - A callback method for storing the themes (i.e. to localStorage)
	 * @memberOf CIQ.ThemeManager
	 */
	CIQ.ThemeManager.themesToMenu=function(el, el2, stx, cb){
		CIQ.ThemeManager.el=el;
		CIQ.ThemeManager.el2=el2;
		CIQ.ThemeManager.stx=stx;
		CIQ.ThemeManager.storageCB=cb;

		if(!el) return;

		function useBuiltInTheme(theme){
			return function(){
				CIQ.ThemeManager.enableBuiltInTheme(stx, theme);
			};
		}
		function useTheme(theme){
			return function(){
				CIQ.ThemeManager.enableTheme(stx, theme);
			};
		}

		function deleteTheme(theme){
			return function(){
				CIQ.ThemeManager.deleteTheme(stx, theme);
				CIQ.ThemeManager.themesToMenu(el, el2, stx, cb);
			};
		}
		var els=el.querySelectorAll("li");
		for(var i=0;i<els.length;i++){
			if(els[i].style.display=="block")
				el.removeChild(els[i]);
		}

		var template=el.querySelectorAll(".themeSelectorTemplate")[0];
		var theme,li;
		for(theme in CIQ.ThemeManager.themes.customThemes){
			li=template.cloneNode(true);
			li.style.display="block";
			var stxItem=$$$(".stxItem",li);
			stxItem.innerHTML=theme;
			stxItem[CIQTouchAction]=useTheme(theme);
			el.appendChild(li);
			$$$(".stxClose", li)[CIQTouchAction]=deleteTheme(theme);
		}
		CIQ.clearNode(el2);
		for(theme in CIQ.ThemeManager.builtInThemes){
			li=CIQ.newChild(el2, "li");
			li[CIQTouchAction]=useBuiltInTheme(theme);
			li.appendChild(CIQ.translatableTextNode(stx,theme));
		}
	};




	/**
	 * ** This class is maintained for legacy implementations only (not using web components). New implementations should use functionality included in the web components (stxUI.js) **<br>
	 * The drawing toolbar is dynamic, displaying various configuration options depending on the tool that is enabled.
	 * This object manages the drawing toolbar.
	 * @constructor
	 * @param {HTMLElement} htmlElement The toolbar htmlElement
	 * @param {CIQ.ChartEngine} stx CIQ.ChartEngine object associated with this toolbar.
	 * @param {function} [callback] Set this to receive a notification whenever a change is made to the toolbar. Examine stx.currentVectorParameters for the change.
	 * @name  CIQ.DrawingToolbar
	 */
	CIQ.DrawingToolbar=function(htmlElement, stx, callback){
		this.stx=stx;
		this.callback=callback;
		this.initialize(htmlElement);
		this.setVectorType(null);
	};


	/**
	 * Initializes the drawing toolbar. It finds the toolbar through class stx-toolbar. Be sure to copy that HTML verbatim into your project
	 * if you aren't using the demo as a starting point. Call this function when you initialize your UI.
	 * Automatically called when a `new CIQ.DrawingToolbar(htmlElement, stx, callback);` is instantiated.
	 * @param {HTMLElement} htmlElement The toolbar htmlElement
	 * @memberOf CIQ.DrawingToolbar
	 */
	CIQ.DrawingToolbar.prototype.initialize=function(htmlElement){
		this.htmlElement=htmlElement;
		htmlElement.DrawingToolbar=this;
		function setLineColor(self){
			return function(color){
				if(color=="000000" || color=="ffffff") self.stx.currentVectorParameters.currentColor="auto";
				else self.stx.currentVectorParameters.currentColor="#" + color;
				if(self.callback) self.callback();
			};
		}
		function setFillColor(self){
			return function(color){
				self.stx.currentVectorParameters.fillColor="#" + color;
				if(self.callback) self.callback();
			};
		}
		var toolbar=this.htmlElement;

		var lineColorPicker=$$$(".stxLineColorPicker", toolbar);
		if(this.stx.currentVectorParameters.currentColor=="auto")
			this.stx.currentVectorParameters.currentColor=lineColorPicker.style.backgroundColor;
		else
			lineColorPicker.style.backgroundColor=this.stx.currentVectorParameters.currentColor;
		CIQ.MenuManager.attachColorPicker(lineColorPicker, toolbar, setLineColor(this));

		var fillColorPicker=$$$(".stxFillColorPicker", toolbar);
		if(this.stx.currentVectorParameters.fillColor=="auto")
			this.stx.currentVectorParameters.fillColor=fillColorPicker.style.backgroundColor;
		else
			fillColorPicker.style.backgroundColor=this.stx.currentVectorParameters.fillColor;
		CIQ.MenuManager.attachColorPicker(fillColorPicker, toolbar, setFillColor(this));

		var display=$$$(".stxAxisLabel", toolbar);
		if(display) {
			CIQ.unappendClassName(display, !this.stx.currentVectorParameters.axisLabel);
			CIQ.appendClassName(display, this.stx.currentVectorParameters.axisLabel);
		}
		if(this.stx.currentVectorParameters.annotation.font.style=="italic")
			CIQ.appendClassName($$$(".stx-toolbar .stx-annotation-italic", htmlElement), "active");
		if(this.stx.currentVectorParameters.annotation.font.weight=="bold")
			CIQ.appendClassName($$$(".stx-toolbar .stx-annotation-bold", htmlElement), "active");
		if(this.stx.currentVectorParameters.annotation.font.size) CIQ.DrawingToolbar.setFont(htmlElement, this.stx.currentVectorParameters.annotation.font.size);
		if(this.stx.currentVectorParameters.annotation.font.family) CIQ.DrawingToolbar.setFont(htmlElement, this.stx.currentVectorParameters.annotation.font.family);
		this.setLine(this.stx.currentVectorParameters.lineWidth, this.stx.currentVectorParameters.pattern);
	};

	/**
	 * Old version of initialize for use with old static version of CIQ.DrawingToolbar
	 * @deprecated
	 */
	CIQ.DrawingToolbar.initialize=function(){}; // @deprecated, this remains for backward compatibility

	/**
	 * Sets the current drawing line color based on what is picked in the toolbar
	 * @param {CIQ.ChartEngine} stx CIQ.ChartEngine object associated with this toolbar.
	 * @memberOf CIQ.DrawingToolbar
	 */
	CIQ.DrawingToolbar.prototype.setLineColor=function(stx){
		var lineColorPicker=$$$(".stxLineColorPicker", this.htmlElement);
		if(this.stx.currentVectorParameters.currentColor=="transparent"){
			lineColorPicker.style.backgroundColor=stx.defaultColor;
		}else{
			lineColorPicker.style.backgroundColor=this.stx.currentVectorParameters.currentColor;
		}
	};


	/**
	 * This object determines which toolbar configuration widgets are available for any given drawing type.
	 * The default settings can be changed by overriding these defaults on your own files.
	 * When adding a new drawing type, set it to false for any given widget to disable the widget for that drawing.
	 * @type {Object}
	 * @memberOf CIQ.DrawingToolbar
	 * @example
	 * 	CIQ.DrawingToolbar.configurator={
			".stxToolbarFill":{			"measure":false, "line":false, "ray":false, "segment":false, "annotation":false, "horizontal":false, "vertical":false,									   "continuous":false 					},
			".stxToolbarLine":{},
			".stxToolbarLinePicker":{																 "annotation":false,																							   "fibonacci":false},
			".stxToolbarNone":{			"measure":false, "line":false, "ray":false, "segment":false, "annotation":false, "horizontal":false, "vertical":false,									   "continuous":false, "fibonacci":false},
			".stxToolbarDotted":{},
			".stxToolbarDashed":{},
			".stxToolbarAxisLabel":{	"measure":false, "line":false, "ray":false, "segment":false, "annotation":false,				 					   "rectangle":false, "ellipse":false, "continuous":false, "fibonacci":false},
			".stxToolbarAnnotation":{	"measure":false, "line":false, "ray":false, "segment":false, 					 "horizontal":false, "vertical":false, "rectangle":false, "ellipse":false, "continuous":false, "fibonacci":false},
			".stxToolbarStylePicker":{  "measure":false, "line":false, "ray":false, "segment":false, "annotation":false, "horizontal":false, "vertical":false, "rectangle":false, "ellipse":false, "continuous":false                   },
			"#stx-toolbar-settings":{	"measure":false, "line":false, "ray":false, "segment":false, "annotation":false, "horizontal":false, "vertical":false, "rectangle":false, "ellipse":false, "continuous":false 					}
		};
	 */
	CIQ.DrawingToolbar.configurator={
			".stxToolbarFill":{			"measure":false, "line":false, "ray":false, "segment":false, "annotation":false, "horizontal":false, "vertical":false,									   "continuous":false 					},
			".stxToolbarLine":{},
			".stxToolbarLinePicker":{																 "annotation":false,																							   "fibonacci":false},
			".stxToolbarNone":{			"measure":false, "line":false, "ray":false, "segment":false, "annotation":false, "horizontal":false, "vertical":false,									   "continuous":false, "fibonacci":false},
			".stxToolbarDotted":{},
			".stxToolbarDashed":{},
			".stxToolbarAxisLabel":{	"measure":false, "line":false, "ray":false, "segment":false, "annotation":false,				 					   "rectangle":false, "ellipse":false, "continuous":false, "fibonacci":false},
			".stxToolbarAnnotation":{	"measure":false, "line":false, "ray":false, "segment":false, 					 "horizontal":false, "vertical":false, "rectangle":false, "ellipse":false, "continuous":false, "fibonacci":false},
			".stxToolbarStylePicker":{  "measure":false, "line":false, "ray":false, "segment":false, "annotation":false, "horizontal":false, "vertical":false, "rectangle":false, "ellipse":false, "continuous":false                   },
			"#stx-toolbar-settings":{	"measure":false, "line":false, "ray":false, "segment":false, "annotation":false, "horizontal":false, "vertical":false, "rectangle":false, "ellipse":false, "continuous":false 					}
	};

	CIQ.extend(CIQ.DrawingToolbar.configurator, {
		".stxToolbarFill":{											  "freeform":false, "pitchfork":false,								   "crossline":false,																		   "regression":false},
		".stxToolbarLine":{},
		".stxToolbarLinePicker":{},
		".stxToolbarNone":{			"channel":false, "gartley":false, "freeform":false, "pitchfork":false, "callout":false,                "crossline":false, "speedline":false, "speedarc":false, "gannfan":false, "timecycle":false, "regression":false, "quadrant":false, "tirone":false},
		".stxToolbarDotted":{},
		".stxToolbarDashed":{},
		".stxToolbarAxisLabel":{	"channel":false, "gartley":false, "freeform":false, "pitchfork":false, "callout":false, "shape":false,					  "speedline":false, "speedarc":false, "gannfan":false, "timecycle":false, "regression":false, "quadrant":false, "tirone":false},
		".stxToolbarAnnotation":{	"channel":false, "gartley":false, "freeform":false, "pitchfork":false,				    "shape":false, "crossline":false, "speedline":false, "speedarc":false, "gannfan":false, "timecycle":false, "regression":false, "quadrant":false, "tirone":false},
		".stxToolbarStylePicker":{	"channel":false, "gartley":false, "freeform":false, "pitchfork":false, "callout":false,                "crossline":false, "speedline":false, "speedarc":false, "gannfan":false, "timecycle":false, "regression":false, "quadrant":false, "tirone":false},
		"#stx-toolbar-settings":{	"channel":false, "gartley":false, "freeform":false, "pitchfork":false, "callout":false, "shape":false, "crossline":false, "speedline":false, "speedarc":false, "gannfan":false, "timecycle":false, "regression":false, "quadrant":false, "tirone":false}
	});
	/**
	 * Sets the line type (CIQ.ChartEngine.currentVectorParameters) from the toolbar selections.
	 * @param {Number} width   The width of the line
	 * @param {string} pattern The type of line ("solid","dotted","dashed" or "none")
	 * @memberOf CIQ.DrawingToolbar
	 * @private
	 */
	CIQ.DrawingToolbar.prototype.setLine=function(width, pattern){
		var className="stx-line stxLineDisplay weight" + Math.floor(width);
		this.stx.currentVectorParameters.lineWidth=width;
		if(this.stx.currentVectorParameters.lineWidth==Math.floor(this.stx.currentVectorParameters.lineWidth))
				this.stx.currentVectorParameters.lineWidth+=0.1;	// Use 1.1 instead of 1 to get good anti-aliasing on Android Chrome
		if(pattern=="solid"){
			this.stx.currentVectorParameters.pattern="solid";
			className+=" style1";
		}else if(pattern=="dotted"){
			this.stx.currentVectorParameters.pattern="dotted";
			className+=" style2";
		}else if(pattern=="dashed"){
			this.stx.currentVectorParameters.pattern="dashed";
			className+=" style3";
		}else if(pattern=="none"){
			this.stx.currentVectorParameters.pattern="none";
		}
		var display=$$$(".stx-toolbar .stxLineDisplay", this.htmlElement);
		if(display) display.className=className;
		if(this.callback) this.callback();
	};

	/**
	 * Sets the line type (CIQ.ChartEngine.currentVectorParameters) from the toolbar selections.
	 * @param {Number} width   The width of the line
	 * @param {string} pattern The type of line ("solid","dotted","dashed" or "none")
	 * @param  {HTMLElement} div The HTMLElement comtaining the toolbar
	 * @memberOf CIQ.DrawingToolbar
	 */
	CIQ.DrawingToolbar.setLine=function(width, pattern, div){
		var self=CIQ.DrawingToolbar.findInstance(div);
		self.setLine(width, pattern);
	};

	/**
	 * Displays the Fib settings dialog.
	 * @private
	 */
	CIQ.DrawingToolbar.prototype.settingsDialog=function(){
		if(this.stx.currentVectorParameters.fibonacci){
			CIQ.FibDialog.display(this);
		}
	};

	/**
	 * Displays the Fib settings dialog.
	 * @param  {HTMLElement} div The HTMLElement comtaining the toolbar
	 */
	CIQ.DrawingToolbar.settingsDialog=function(div){
		var self=CIQ.DrawingToolbar.findInstance(div);
		self.settingsDialog();
	};
	/**
	 * Toggles the axis label from the drawing toolbar.
	 * @memberOf CIQ.DrawingToolbar
	 * @private
	 */
	CIQ.DrawingToolbar.prototype.toggleAxisLabel=function(){
		this.stx.currentVectorParameters.axisLabel=!this.stx.currentVectorParameters.axisLabel;
		var display=$$$(".stx-toolbar .stxAxisLabel", this.htmlElement);
		if(display) {
			CIQ.unappendClassName(display,(!this.stx.currentVectorParameters.axisLabel).toString());
			CIQ.appendClassName(display,this.stx.currentVectorParameters.axisLabel.toString());
		}
		if(this.callback) this.callback();
	};

	/**
	 * Toggles the axis label from the drawing toolbar.
	 * @param  {HTMLElement} div The HTMLElement comtaining the toolbar
	 * @memberOf CIQ.DrawingToolbar
	 */
	CIQ.DrawingToolbar.toggleAxisLabel=function(div){
		var self=CIQ.DrawingToolbar.findInstance(div);
		self.toggleAxisLabel();
	};

	/**
	 * Sets the font from the drawing toolbar.
	 * @param  {HTMLElement} div The HTMLElement comtaining the toolbar
	 * @param  {string} txt A valid font name or font family, size ( "12px", for example), "italic, "bold" or "Default".
	 * @memberOf CIQ.DrawingToolbar
	 */
	CIQ.DrawingToolbar.setFont=function(div, txt){
		var fontSizeRegEx=new RegExp("[0-9]+px");
		var self=CIQ.DrawingToolbar.findInstance(div);
		var button;
		if(txt=="italic"){
			button=$$$(".stx-toolbar .stx-annotation-italic", self.htmlElement);
			if(self.stx.currentVectorParameters.annotation.font.style=="italic"){
				self.stx.currentVectorParameters.annotation.font.style=null;
				CIQ.unappendClassName(button, "active");
			}else{
				self.stx.currentVectorParameters.annotation.font.style="italic";
				CIQ.appendClassName(button, "active");
			}
		}else if(txt=="bold"){
			button=$$$(".stx-toolbar .stx-annotation-bold", self.htmlElement);
			if(self.stx.currentVectorParameters.annotation.font.weight=="bold"){
				self.stx.currentVectorParameters.annotation.font.weight=null;
				CIQ.unappendClassName(button, "active");
			}else{
				self.stx.currentVectorParameters.annotation.font.weight="bold";
				CIQ.appendClassName(button, "active");
			}
		}else if(fontSizeRegEx.test(txt)){
			self.stx.currentVectorParameters.annotation.font.size=txt;
			$$$(".stx-toolbar .stx-annotation-size > span", self.htmlElement).innerHTML=CIQ.stripPX(txt);
		}else if(txt=="Default"){
			self.stx.currentVectorParameters.annotation.font.family=null;
			$$$(".stx-toolbar .stx-annotation-family > span", self.htmlElement).innerHTML=txt;
		}else{
			self.stx.currentVectorParameters.annotation.font.family=txt;
			$$$(".stx-toolbar .stx-annotation-family > span", self.htmlElement).innerHTML=txt;
		}
		if(self.callback) self.callback();
	};

	/**
	 * Changes the currently selected drawing type (vectorType). The drawing type should match the name of the Drawing object.
	 * <P>
	 * Requires an html node with ID of "toolSelection" to display the currently selected drawing tool. Defaults to "Select Tool".
	 * <br>Example: `<span id="toolSelection"></span>`
	 * <P>
	 * @param {string} vectorType The drawing type
	 * @memberOf CIQ.DrawingToolbar
	 * @private
	 */
	CIQ.DrawingToolbar.prototype.setVectorType=function(vectorType){
		var stx=this.stx;
		stx.clearMeasure();
		var all,i,j;
		if(!vectorType){
			stx.changeVectorType("");
			for(i in CIQ.DrawingToolbar.configurator){
				all=this.htmlElement.querySelectorAll(i);
				for(j=0;j<all.length;j++){
					all[j].style.display="none";
				}
			}
			$$$("#toolSelection", this.htmlElement).innerHTML="";
			$$$("#toolSelection", this.htmlElement).appendChild(CIQ.translatableTextNode(stx,"Select Tool"));
			return;
		}
		for(i in CIQ.DrawingToolbar.configurator){
			all=this.htmlElement.querySelectorAll(i);
			var baseVectorType;
			try{
				baseVectorType=(new CIQ.Drawing[vectorType]()).configurator;
			}catch(e){}
			if(!baseVectorType) baseVectorType=vectorType;
			for(j=0;j<all.length;j++){
				if(CIQ.DrawingToolbar.configurator[i][baseVectorType]===false){
					all[j].style.display="none";
				}else{
					all[j].style.display="";
				}
			}
		}
		if(stx.currentVectorParameters.pattern=="none" && !CIQ.DrawingToolbar.configurator[".stxToolbarNone"][vectorType])
			this.setLine(stx.currentVectorParameters.lineWidth, "solid");
		stx.changeVectorType(vectorType);
		$$$("#toolSelection", this.htmlElement).innerHTML="";
		$$$("#toolSelection", this.htmlElement).appendChild(CIQ.translatableTextNode(stx,vectorType.capitalize()));
		this.setLineColor(stx);
	};

	/**
	 * Old version of setVectorType for use with old static version of CIQ.DrawingToolbar
	 * @deprecated
	 */
	CIQ.DrawingToolbar.setVectorType=function(stx, vectorType, div){
		var self=CIQ.DrawingToolbar.findInstance(div);
		if(!self){	// First time through we initialize the default instance
			self=CIQ.DrawingToolbar._default=new CIQ.DrawingToolbar($$$(".stx-toolbar"), stx);
		}
		self.stx=stx;
		self.setVectorType(vectorType);
	};

	/**
	 * Changes the currently selected drawing type. The drawing type should match the name of the Drawing object.
	 * <P>
	 * Requires an html node with ID of "toolSelection" to display the currently selected drawing tool. Defaults to "Select Tool".
	 * <br>Example: `<span id="toolSelection"></span>`
	 * <P>
	 * @param {string} vectorType The drawing type
	 * @param  {HTMLElement} div The HTMLElement comtaining the toolbar
	 * @memberOf CIQ.DrawingToolbar
	 */
	CIQ.DrawingToolbar.setDrawingType=function(vectorType, div){
		var self=CIQ.DrawingToolbar.findInstance(div);
		self.setVectorType(vectorType);
	};

	/**
	 * Locates the CIQ.DrawingToobar instance associated with the particular HTML element. If none can be found
	 * then it reverts to the default instance
	 * @param  {HTMLElement} div The HTMLElement that was interacted with (via stxToggle)
	 * @return {CIQ.DrawingToolbar}     The instance associated with the element, or the default
	 * @private
	 * @memberOf CIQ.DrawingToolbar
	 */
	CIQ.DrawingToolbar.findInstance=function(div){
		if(!div) return CIQ.DrawingToolbar._default;
		for(var i=0;i<40;i++){
			if(CIQ.hasClassName(div, "stx-toolbar")) break;
			div=div.parentNode;
			if(!div) return CIQ.DrawingToolbar._default;
		}
		if(div.DrawingToolbar) return div.DrawingToolbar;
		return CIQ.DrawingToolbar._default;
	};

	/**
	 * Turns crosshairs on or off based on the toolbar selection. Note that crosshairs can be turned on or off
	 * anytime by simply setting stx.layout.crosshair to true or false.
	 * @param  {boolean} state True if the crosshairs should be on, otherwise false
	 * @memberOf CIQ.DrawingToolbar
	 * @private
	 */
	CIQ.DrawingToolbar.prototype.crosshairs=function(state){
		var stx=this.stx;
		this.setVectorType(null);
		stx.layout.crosshair=state;
		$$$("#toolSelection", this.htmlElement).innerHTML="";
		if(state){
			$$$("#toolSelection", this.htmlElement).appendChild(CIQ.translatableTextNode(stx,"Crosshairs"));
		}else{
			$$$("#toolSelection", this.htmlElement).appendChild(CIQ.translatableTextNode(stx,"Select Tool"));
		}


		/* sane crosshair state on touch devices */
		stx.doDisplayCrosshairs();
		stx.findHighlights(false, true); // turn off sticky and crosshairs
		stx.changeOccurred("layout");
		stx.draw();
		stx.updateChartAccessories();
	};

	/**
	 * Old version of crosshairs for use with old static version of CIQ.DrawingToolbar
	 * @deprecated
	 */
	CIQ.DrawingToolbar.crosshairs=function(stx, state, div){
		var self=CIQ.DrawingToolbar.findInstance(div);
		self.stx=stx;
		self.crosshairs(state);

	};

	/**
	 * Turns crosshairs on or off. Note that crosshairs can be turned on or off
	 * anytime by simply setting stx.layout.crosshair to true or false.
	 * @param  {boolean} state True if the crosshairs should be on, otherwise false
	 * @param  {HTMLElement} div The HTMLElement comtaining the toolbar
	 * @memberOf CIQ.DrawingToolbar
	 */
	CIQ.DrawingToolbar.setCrosshairs=function(state, div){
		var self=CIQ.DrawingToolbar.findInstance(div);
		self.crosshairs(state);
	};




	/**
	 * Initializes and interacts with the settings tool for fibonacci
	 * @name CIQ.FibDialog
	 */
	CIQ.FibDialog=function(){

	};

	CIQ.FibDialog.initialize=function(element){
		var template=$$$(".fib-template", element);
		var fibs=[-0.786, -0.618, -0.5, -0.382, -0.236, 0, 0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.382, 1.618, 2.618, 4.236];
		for(var i=0;i<fibs.length;i++){
			var fib=fibs[i];
			var li=template.cloneNode(true);
			li.style.display="block";
			$$$(".stx-fib-level", li).innerHTML=fib;
			li.fib=fib;
			li.id="stx-fib-" + fib.toString().replace(".","");
			template.parentNode.appendChild(li);
		}
	};

	CIQ.FibDialog.restore=function(fibonacci){
		CIQ.FibDialog.fibonacci=fibonacci;
		var fibTemplates=document.querySelectorAll(".fib-template");
		var i;
		for(i=0;i<fibTemplates.length;i++){
			$$$(".check input", fibTemplates[i]).checked=false;
		}
		for(i=0;i<fibonacci.fibs.length;i++){
			var fibdef=fibonacci.fibs[i];
			var template=$$$("#stx-fib-" + fibdef.level.toString().replace(".",""));
			if(!template) continue;
			$$$(".check input", template).checked=true;
		}
	};

	CIQ.FibDialog.save=function(){
		var fibonacci=CIQ.FibDialog.fibonacci; // for now recall initial settings, eventually derive the entire fibonacci settings from dialog
		fibonacci.fibs=[];
		var fibTemplates=document.querySelectorAll(".fib-template");
		for(var i=0;i<fibTemplates.length;i++){
			var fibTemplate=fibTemplates[i];
			if($$$(".check input", fibTemplate).checked){
				fibonacci.fibs.push({
					level:fibTemplate.fib,
					color:"auto",
					parameters:{pattern:"solid", opacity:0.25, lineWidth:1}
				});
			}
		}
		if(CIQ.FibDialog.drawingToolbar){
			CIQ.FibDialog.drawingToolbar.stx.currentVectorParameters.fibonacci=fibonacci;
			if(CIQ.FibDialog.drawingToolbar.callback) CIQ.FibDialog.drawingToolbar.callback();
		}
		return fibonacci;
	};

	CIQ.FibDialog.setLine=function(weight, pattern, htmlElement){
		alert(pattern);
	};

	CIQ.FibDialog.display=function(drawingToolbar){
		var dialog=$$$("#fibDialog");
		CIQ.FibDialog.drawingToolbar=drawingToolbar; // stash the toolbar, which has a reference to the current stx
		CIQ.FibDialog.restore(drawingToolbar.stx.currentVectorParameters.fibonacci); // set the dialog to reflect the current fib settings
		CIQ.DialogManager.displayDialog(dialog); // display the dialog
	};




	/**
	 * ** This class is maintained for legacy implementations only (not using web components). New implementations should use functionality included in the web components (stxUI.js) **<br>
	 * This is a widget that can be used to display search results
	 * @constructor
	 * @name  CIQ.LookupWidget
	 * @param {object} config Configuration for widget
	 * @param {object} config.stx - the chart object
	 * @param {object} config.input - DOM input field to attach the lookup widget
	 * @param {function} config.textCallback - function to call when a search string is entered of format func(this, txt, filter)
	 * @param {function} config.selectCallback - function to call when the user selects a search result or hits enter func(this, txt, filter)
	 * @param {array} config.filters - an array of security classes to filter on. Valid values at this time for symbols are: ALL, STOCKS, FOREX, INDEXES. Null to not provide a filter.
	 * @param {boolean} config.cascade - set to true to allow the lookup window to cascade on top of another window ( example: the comparison window in the advanced package).
	 * @param {boolean} config.mustSelect - set to true to disable pressing enter in the input box.  A selection from the list must occur.
	 * @param {boolean} config.allowSymbolObject - set to true to return a symbol object from the search dropdown instead of just a symbol string. **Please note that only if an item from the drop down is selected, can the corresponding object be returned**. If the user enters text and presses enter or the add button, only that text will be returned as it is not derived from the dropdown list, wich contains the additional object information. See {@link CIQ.ChartEngine#newChart} for details on how to use charts with a symbol object.		@name CIQ.LookupWidget
	 * @example
		var config={
			input: $$$("#symbol"),						// input field from the GUI
			textCallback: textCallbackChartIQ,			// Function used to do lookup - If you don't have a symbol lookup then just leave this blank
			selectCallback: selectCallback,             // Function used to act on the symbol selected. Normally used to create a new chart with the new symbol.
			filters:["ALL","STOCKS","FUNDS","FOREX","INDEXES"],	// Names of the filters you are supporting
			allowSymbolObject : false,                   // set to true to return a symbol object from the search insted of just a symbol string
	    	stx: stxx									// the chart object -- needed for translations
		};
		var stxLookupWidget=new CIQ.LookupWidget(config);
	*/

	CIQ.LookupWidget=function(config){
		this.config=config;
		this.div=null;
		this.currentFilter=null;
		this.filterButtons=[];
		this.height=480;
	};

	/**
	 * Call this function with the results from your search.
	 * @param {object} results Results to display on the dropdown. See `Example` for format.
	 * @example
	 * // Results should be an array of the following object:
	 * {
	 * 		symbol: symbol,
	 * 		description: full name of security,
	 * 		exchange: optional exchange
	 * }
	 * @memberOf CIQ.LookupWidget
	 */
	CIQ.LookupWidget.prototype.displayResults=function(results){
		function select(that, symbol){
			return function(e){
				if(typeof symbol == 'object') {
					that.config.input.value=symbol.symbol;
				} else {
					that.config.input.value=symbol;
				}
				that.config.selectCallback(that, symbol, that.currentFilter);
				that.close();
				that.config.input.blur();
			};
		}
		if(this.ul) CIQ.clearNode(this.ul);
		if(results.length>0){
			this.display();
		}else{
			if(!this.config.filters && this.div) this.div.style.display="none";
			return;
		}
		for(var i=0;i<results.length;i++){
			var result=results[i];
			var li=CIQ.newChild(this.ul, "LI");
			var symbolSpan=CIQ.newChild(li, "span");
			symbolSpan.innerHTML=result.symbol;
			var descriptionSpan=CIQ.newChild(li, "span");
			if(result.description===null || typeof(result.description)=="undefined") result.description=result.name;
			descriptionSpan.innerHTML=result.description;
			var exchangeSpan=CIQ.newChild(li, "span");
			if(result.exchange===null || typeof(result.exchange)=="undefined") result.exchange=result.exchDisp;
			if(result.exchange) exchangeSpan.appendChild(this.config.stx? CIQ.translatableTextNode(this.config.stx,result.exchange) : result.exchange);
			if ( this.config.allowSymbolObject )
				CIQ.ScrollManager.attach(li, select(this, result));
			else
				CIQ.ScrollManager.attach(li, select(this, result.symbol));
		}
		if(!this.iscroll){
			this.iscroll = CIQ.iscroll.newScroller(this.ul.parentNode);
		}else{
			this.iscroll.refresh();
			this.iscroll.scrollTo(0,0);
		}
	};

	/**
	 * Initializes the lookup widget by attaching keyup and click events to the input.
	 * Also will start the chartIQ service if enabled.
	 * @memberOf CIQ.LookupWidget
	 */
	CIQ.LookupWidget.prototype.init=function(){
		function closure(that){
			return function(e){
				var div=CIQ.getEventDOM(e);
				var key = (window.event) ? event.keyCode : e.keyCode;
				switch(key){
					case 13:
						if(that.config.mustSelect) break;
						var symbol=div.value;
						that.close();
						that.config.selectCallback(that, symbol, that.currentFilter);
						div.blur();
						break;
					case 27:
						that.close();
						div.blur();
						break;
					default:
						//TODO, clear symbol icon
						that.config.textCallback(that, div.value, that.currentFilter, false);	// false means user typed in input box
						break;
				}
				e = e||event;
				if(e.stopPropagation){
					e.stopPropagation();
				}else{
					e.cancelBubble = true;
				}
			};
		}
		function closure2(that){
			return function(e){
				var div=CIQ.getEventDOM(e);
				that.config.textCallback(that, div.value, that.currentFilter, true);	// true means user clicked in input box
			};
		}
		this.config.input.onkeyup=closure(this);
		this.config.input.onclick=closure2(this);
	};

	/**
	 * Displays the lookup widget results. The lookup widget behaves like a menu. It will close if you click out of it or if you click on another menu.
	 * @memberOf CIQ.LookupWidget
	 */
	CIQ.LookupWidget.prototype.display=function(){
		function pressFilter(that, div, filter){
			return function(){
				for(var i=0;i<that.filterButtons.length;i++){
					CIQ.unappendClassName(that.filterButtons[i],"on");
				}
				CIQ.appendClassName(div, "on");
				that.currentFilter=filter;
				that.config.textCallback(that, that.config.input.value, that.currentFilter);
			};
		}
		if(!this.div){
			this.div=CIQ.newChild(this.config.input.parentNode, "DIV", "menuOutline stxLookupResults");
			var ul=CIQ.newChild(this.div, "UL", "stxResults");
			var li;
			if(this.config.filters){
				li=CIQ.newChild(ul, "LI", "stxLookupFilter");
				for(var i=0;i<this.config.filters.length;i++){
					var filter=this.config.filters[i];
					var div=CIQ.newChild(li, "div", "stx-btn");
					div.appendChild(this.config.stx? CIQ.translatableTextNode(this.config.stx,filter) : filter);
					div[CIQTouchAction]=pressFilter(this, div, filter);
					this.filterButtons.push(div);
				}
				CIQ.newChild(ul, "LI", "divider");
			}
			li=CIQ.newChild(ul, "LI");
			this.ul=CIQ.newChild(li, "UL", "menuSelect");
			var lookupClassName=this.config.className;
			if(!lookupClassName) lookupClassName="stxLookupSymbols";
			CIQ.appendClassName(this.ul, lookupClassName);
			li.style.maxHeight=this.height + "px";
			if(!this.config.cascade) CIQ.MenuManager.menuOff(true, true);
		}else{
			if(this.div.style.display=="none"){
				if(!this.config.cascade) CIQ.MenuManager.menuOff(true, true);
			}
			this.div.style.display="inline-block";
		}

		function closeCallback(that){
			return function(){
				if(that.div) that.div.style.display="none";
			};
		}
		CIQ.MenuManager.menuOn("lookup", closeCallback(this), this.config.cascade);

	};

	/**
	 * Closes the lookup results window
	 * @memberOf CIQ.LookupWidget
	 */
	CIQ.LookupWidget.prototype.close=function(){
		if(this.div) this.div.style.display="none";
		CIQ.MenuManager.menuOff(true);
	};




	/**
	 * ** This namespace is maintained for legacy implementations only (not using web components). New implementations should use functionality included in the web components (stxUI.js) **<br>
	 * Lets users pick a local timezone for display on the xaxis of charts.
	 * Creates a menu structure which can be used to provide a user with timezone selection
	 * First level tier is the region. Each region has an array of cities. If the array is empty
	 * then no cities are available for that region. The timezone should be reconstructed as
	 * region/city. For instance, "America/New_York". Or for regions without cities simply "Iran".
	 * The reconstructed value can then be passed into stxx.setTimeZone();
	 * @namespace
	 * @name  CIQ.TimeZoneWidget
	 */
	CIQ.TimeZoneWidget=function(){};

	/**
	 * Initializes the TimeZoneWidget. This method is called once, automatically. Do not call directly. It iterates
	 * through the known timezomes as provided by timeZoneData.js and creates a comprehensive timezone menu from those items.
	 * @private
	 * @memberOf CIQ.TimeZoneWidget
	 */
	CIQ.TimeZoneWidget.init=function(){
		if(typeof timezoneJS!="undefined"){
			CIQ.TimeZoneWidget.timezoneMenu={};

			for(var i in timezoneJS.timezone.zones){
				//if(typeof timezoneJS.timezone.zones[i]=="string") continue;	// translations
				var s=i.split("/");
				var region=s[0];
				if(!CIQ.TimeZoneWidget.timezoneMenu[region]) CIQ.TimeZoneWidget.timezoneMenu[region]=[];

				if(s.length>1){
					var city=s[1];
					if(s.length>2) city+="/" + s[2];
					CIQ.TimeZoneWidget.timezoneMenu[region].push(city);
				}
			}
		}
	};

	/**
	 * Selects a time zone and enables it in all registered charts.
	 * @param {string} zone A valid time zone
	 * @memberOf CIQ.TimeZoneWidget
	 */
	CIQ.TimeZoneWidget.setTimeZone=function(zone){
		CIQ.ChartEngine.defaultDisplayTimeZone=zone;
		for(var i=0;i<CIQ.ChartEngine.registeredContainers.length;i++){
			var stx=CIQ.ChartEngine.registeredContainers[i].stx;
			stx.setTimeZone(stx.dataZone, zone);
			if(stx.chart.symbol) stx.draw();
		}
	};

	/**
	 * Removes the time zone from registered charts, and also from the attached storage mechanism.
	 * @memberOf CIQ.TimeZoneWidget
	 */
	CIQ.TimeZoneWidget.removeTimeZone=function(){
		CIQ.ChartEngine.defaultDisplayTimeZone=null;
		for(var i=0;i<CIQ.ChartEngine.registeredContainers.length;i++){
			var stx=CIQ.ChartEngine.registeredContainers[i].stx;
			stx.displayZone=null;
			stx.setTimeZone();
			if(CIQ.TimeZoneWidget.storageCB){
				CIQ.TimeZoneWidget.storageCB(null);
			}
			if(stx.displayInitialized) stx.draw();
		}
	};

	/**
	 * Populates the timezone dialog. This generates a list from CIQ.timeZoneMap. Generally this method
	 * is called when the menu is enabled.
	 * @memberOf CIQ.TimeZoneWidget
	 */
	CIQ.TimeZoneWidget.populateDialog=function(id){
		if(!CIQ.TimeZoneWidget.timezoneMenu) CIQ.TimeZoneWidget.init();

		function setTimezone(zone){
			return function(e){
				CIQ.DialogManager.dismissDialog();
				var translatedZone=CIQ.timeZoneMap[zone];
				CIQ.TimeZoneWidget.setTimeZone(translatedZone);
				if(CIQ.TimeZoneWidget.storageCB){
					CIQ.TimeZoneWidget.storageCB(translatedZone);
				}
			};
		}
		if(typeof timezoneJS=="undefined") return;
		var el=$$(id);
		if(!el) return;
		var ul=el.querySelector("ul");
		var template=ul.querySelector("li#timezoneTemplate").cloneNode(true);
		CIQ.clearNode(ul);
		ul.appendChild(template);
		var arr=[];
		var zone;
		for(zone in CIQ.timeZoneMap){
			arr.push(zone);
		}
		for(var i=0;i<arr.length;i++){
			zone=arr[i];
			var display=zone;
			var li=template.cloneNode(true);
			li.style.display="block";
			li.innerHTML=display;
			CIQ.ScrollManager.attach(li, setTimezone(zone));
			ul.appendChild(li);
		}
		if(!CIQ.TimeZoneWidget.iscroll){
			CIQ.TimeZoneWidget.iscroll = CIQ.iscroll.newScroller('#timezoneDialogWrapper', {tap:true, scrollbars:false, interactiveScrollbars:false, mouseWheel:true});
		}else{
			CIQ.TimeZoneWidget.iscroll.refresh();
		}
	};

	/**
	 * Initialize the time zone manager with a prior saved timezone (initialTimeZone) and a callback
	 * mechanism for saving the timezone. Call this function when you initialize your UI.
	 * @param {string} [initialTimeZone] Default timezone to use
	 * @param {function} [cb] Callback function to store a different timezone that the user might pick through the menu fc(string)
	 * @memberOf CIQ.TimeZoneWidget
	 */
	CIQ.TimeZoneWidget.initialize=function(initialTimeZone, cb){
		if(initialTimeZone){
			CIQ.TimeZoneWidget.setTimeZone(initialTimeZone);
		}
		CIQ.TimeZoneWidget.storageCB=cb;
	};




	/**
	 * ScrollManager
	 *
	 * This is a widget for detecting whether a user has scrolled between the time that they press the mouse and let go. Otherwise
	 * the act of scrolling a dialog would cause a selection of items in the dialog. To use, register start as your mousedown or touchstart event. Then
	 * call isClick(e) during your mouseup or touchend event to determine whether the user truly clicked or not.
	 * @name CIQ.ScrollManager
	 */
	CIQ.ScrollManager=function(){};

	CIQ.ScrollManager.x=0;
	CIQ.ScrollManager.y=0;
	CIQ.ScrollManager.downTime=0;
	/**
	 * Use this method to attach a click event to a node that is within an iscroll. Use this instead of onclick, onmousedown or ontouchstart.
	 * @param {object} node The DOM element that is clickable
	 * @param {function} fc Callback method when node is clicked
	 * @memberOf CIQ.ScrollManager
	 */
	CIQ.ScrollManager.attach=function(node, fc){
		if(navigator.pointerEnabled){
			node.addEventListener("pointerdown", CIQ.ScrollManager.start);
		}else if(navigator.msMaxTouchPoints>1){
			node.addEventListener("MSPointerDown", CIQ.ScrollManager.start);
		}else{
			node.addEventListener("mousedown", CIQ.ScrollManager.start);
			node.addEventListener("touchstart", CIQ.ScrollManager.start);
		}
		node.addEventListener("tap", function(fc){
			return function(e){
			if(!node.tapped || Date.now()-node.tapped>750) fc(e);
				node.tapped=Date.now();
			};
		}(fc));
		node.addEventListener("click", function(fc){
			return function(e){
				if(CIQ.ScrollManager.isClick(e)){
					if(!node.tapped || Date.now()-node.tapped>750) fc(e);
					node.tapped=Date.now();
				}
			};
		}(fc));
	};

	/**
	 * Begins a scroll event
	 * @private
	 * @memberOf CIQ.ScrollManager
	 */
	CIQ.ScrollManager.start=function(e){
		CIQ.ScrollManager.x=e.pageX;
		CIQ.ScrollManager.y=e.pageY;
		if(e.touches && e.touches.length>=1){
			CIQ.ScrollManager.x=e.touches[0].pageX;
			CIQ.ScrollManager.y=e.touches[0].pageY;
		}
		CIQ.ScrollManager.downTime=new Date().getTime();
	};

	/**
	 * True if the click was an actual click. This depends on how long the user held their finger/mouse down (under 2 seconds) and whether
	 * their finger or mouse moved significantly in that time (over 10 pixels). If either of those conditions is true then likely the user
	 * was scrolling, not clicking
	 * @private
	 * @memberOf CIQ.ScrollManager
	 */
	CIQ.ScrollManager.isClick=function(e){
		var now=new Date().getTime();
		if(now-CIQ.ScrollManager.downTime>2000) return false;	// Over two seconds from mouse down to mouse up is not a click
		if(Math.abs(e.pageX-CIQ.ScrollManager.x)>10) return false;	// Moved mouse or finger too much
		if(Math.abs(e.pageY-CIQ.ScrollManager.y)>10) return false;
		return true;
	};

	/**
	 * Use this method to attach a right click event to a node. Second argument is the callback function.
	 * @param {object} node DOM element that is "right clickable"
	 * @param {function} fc Callback when user right clicks
	 * @memberOf CIQ.ScrollManager
	 */
	CIQ.ScrollManager.attachRightClick=function(node, fc){
		function closure(fc){
			return function(e){
				if((e.which && e.which>=2) || (e.button && e.button>=2)){
					fc(e);
				}
			};
		}
		if(navigator.pointerEnabled){
			node.addEventListener("pointerup", closure(fc));
		}else if(navigator.msMaxTouchPointers>1){
			node.addEventListener("MSPointerUp", closure(fc));
		}else{
			node.addEventListener("mouseup", closure(fc));
		}
		node.rightClickable=true;
	};

	/**
	 * This method kills the context menu (default browser behavior) if the target is right clickable. It assumes that
	 * CIQ.ScrollManager.attachRightClick has been called on that node. This is automatic and should not be called directly
	 * @private
	 * @memberOf CIQ.ScrollManager
	 */
	CIQ.ScrollManager.onContextMenu=function(e){
		if(e.target.rightClickable){ // If node is right clickable then kill context menu, which will allow the mouseup event to trigger
			e.preventDefault();
			return false;
		}
		// otherwise the standard context menu will appear
	};

	document.addEventListener("contextmenu", CIQ.ScrollManager.onContextMenu, false);	// To support right clicking




	/**
	 * ** This class is maintained for legacy implementations only (not using web components). New implementations should use functionality included in the web components (stxUI.js) **<br>
	 * Native implementation of watch lists. Uses a CIQ.StorageManager object for saving and loading lists
	 * @constructor
	 * @name CIQ.Watch
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Watch=function(){};

	/**
	 * The array of available lists. If you modify this directly then be sure to call CIQ.Watch.refreshDisplay
	 * @type {Array}
	 * @memberOf CIQ.Watch
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Watch.lists=[];

	/**
	 * The index into the CIQ.Watch.lists array of the currently selected list
	 * @type {number}
	 * @memberOf CIQ.Watch
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Watch.currentList=null;

	/**
	 * The index into the currently selected list of the currently selected symbol
	 * @type {Number}
	 * @memberOf CIQ.Watch
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Watch.currentSymbol=0;

	/**
	 * Opens the dialog to create a new list
	 * @memberOf CIQ.Watch
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Watch.openNewListDialog=function(){
		$$$("#stxWatchEditName").value="";
		$$$("#stxWatchEditTA").value="";
		CIQ.DialogManager.displayDialog("stxWatchEditDialog");
	};

	/**
	 * Opens the dialog to edit an existing list
	 * @memberOf CIQ.Watch
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Watch.openEditListDialog=function(){
		var list=CIQ.Watch.lists[CIQ.Watch.currentList];
		var listName=CIQ.first(list);
		$$$("#stxWatchEditName").value=listName;
		var str="";
		var first=true;
		for(var i=0;i<list[listName].length;i++){
			if(first){
				first=false;
			}else{
				str+=" ";
			}
			str+=list[listName][i];
		}
		$$$("#stxWatchEditTA").value=str;
		CIQ.DialogManager.displayDialog("stxWatchEditDialog");
	};

	/**
	 * Called from the new and edit list dialogs to save the updated list when the user hits the "save" button
	 * @memberOf CIQ.Watch
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Watch.saveEditList=function(){
		var ta=$$$("#stxWatchEditTA");
		var listName=$$$("#stxWatchEditName").value;
		if(!listName) return;
		var list={};
		var existing=false;
		var i;
		for(i=0;i<CIQ.Watch.lists.length;i++){
			if(CIQ.first(CIQ.Watch.lists[i])==listName){
				existing=true;
				list=CIQ.Watch.lists[i];
			}
		}
		if(!existing){
			CIQ.Watch.lists.push(list);
			CIQ.Watch.currentList=CIQ.Watch.lists.length-1;
			CIQ.Watch.currentSymbol=-1;
			CIQ.unappendClassName($$$("#stxWatchDown"),"false");
		}
		CIQ.DialogManager.dismissDialog();
		var w=ta.value.split(/\s/);
		var arr=[];
		for(i in w){
			if(!w[i]) continue;
			arr.push(w[i].toUpperCase());
		}
		list[listName]=arr;
		CIQ.Watch.refreshDisplay();
		CIQ.Watch.stxStorageManager.store("stx-watchLists", JSON.stringify(CIQ.Watch.lists));
	};

	/**
	 * Deletes the current list
	 * @memberOf CIQ.Watch
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Watch.deleteCurrentList=function(){
		CIQ.Watch.lists.splice(CIQ.Watch.currentList,1);
		if(CIQ.Watch.currentList>=CIQ.Watch.lists.length) CIQ.Watch.currentList=CIQ.Watch.lists.length-1;
		if(CIQ.Watch.currentList<0) CIQ.Watch.currentList=0;
		CIQ.Watch.enableList(CIQ.Watch.currentList);
		if(!CIQ.Watch.lists.length){
			CIQ.Watch.stxStorageManager.remove("stx-watchLists");
		}else{
			CIQ.Watch.stxStorageManager.store("stx-watchLists", JSON.stringify(CIQ.Watch.lists));
		}
	};

	/**
	 * Enables the selected list
	 * @param  {number} location The index into the list array to enable
	 * @memberOf CIQ.Watch
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Watch.enableList=function(location){
		CIQ.Watch.currentList=location;
		CIQ.Watch.currentSymbol=-1;
		CIQ.Watch.refreshDisplay();
		if(CIQ.Watch.lists.length>0){
			CIQ.Watch.enableSymbol(-1);
		}
	};

	/**
	 * Enables a symbol in the list using the selectCallback function to activate a new symbol. See {@link CIQ.Watch.initialize} for instructions on how to assign a selectCallback function.
	 * @param  {number} location        The index in the current list of the symbol to enable
	 * @param  {boolean} dontChangeChart If true then the chart will not update, otherwise the chart is updated via the lookup widget ( selectCallback )
	 * @memberOf CIQ.Watch
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Watch.enableSymbol=function(location, dontChangeChart){
		var list=CIQ.Watch.lists[CIQ.Watch.currentList];
		var symbols=list[CIQ.first(list)];
		var symbol;

		var symbolNodes=document.querySelectorAll("#stxWatch-inner li");
		for(var i=0;i<symbolNodes.length;i++){
			var li=symbolNodes[i];
			li.className=null;
			if(i==location){
				CIQ.Watch.currentSymbol=location;
				symbol=symbols[location];
				li.className="current";
			}
		}
		if(CIQ.Watch.currentSymbol<=0){
			CIQ.appendClassName($$$("#stxWatchPrev"),"false");
			CIQ.appendClassName($$$("#stxWatchUp"),"false");
		}else{
			CIQ.unappendClassName($$$("#stxWatchPrev"),"false");
			CIQ.unappendClassName($$$("#stxWatchUp"),"false");
		}

		if(CIQ.Watch.currentSymbol==symbols.length-1){
			CIQ.appendClassName($$$("#stxWatchNext"),"false");
			CIQ.appendClassName($$$("#stxWatchDown"),"false");
		}else{
			CIQ.unappendClassName($$$("#stxWatchNext"),"false");
			CIQ.unappendClassName($$$("#stxWatchDown"),"false");
		}
		if(symbol){
			$$$("#stxWatchSymbol").innerHTML=symbol;
			CIQ.Watch.stxLookupWidget.config.selectCallback(null, symbol);	// Load symbol in chart
		}else{
			$$$("#stxWatchSymbol").innerHTML="&nbsp;";
		}
	};

	/**
	 * Right clicks or left clicks can enable the symbol
	 * @private
	 * @memberOf CIQ.Watch
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Watch.rightClickSymbol=function(location, dontChangeChart){
		return CIQ.Watch.enableSymbol(location, dontChangeChart);
	};

	/**
	 * Moves the symbol selector up or down by the suggested distance
	 * @param  {number} distance Distance to move. Negative number to move up the list.
	 * @memberOf CIQ.Watch
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Watch.move=function(distance){
		if(CIQ.Watch.lists.length<=0) return;
		CIQ.Watch.currentSymbol+=distance;
		if(CIQ.Watch.currentSymbol<0) CIQ.Watch.currentSymbol=0;
		var list=CIQ.Watch.lists[CIQ.Watch.currentList];
		var symbols=list[CIQ.first(list)];
		if(CIQ.Watch.currentSymbol>=symbols.length) CIQ.Watch.currentSymbol=symbols.length-1;
		CIQ.Watch.enableSymbol(CIQ.Watch.currentSymbol);
		CIQ.Watch.symbolScroll.scrollToElement('#stxWatch-inner li:nth-child(' + (CIQ.Watch.currentSymbol) + ')', 250);
		CIQ.Watch.symbolScroll.refresh();
	};

	/**
	 * Updates the HTML with the symbol or list name
	 * @param  {object} listEntry DOM element to update
	 * @param  {string} text      The symbol or list name
	 * @memberOf CIQ.Watch
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Watch.createSymbolEntry=function(listEntry,text){
		listEntry.innerHTML=text;
	};

	/**
	 * Updates the display of the watch lists. This is called whenever the screen is resized or the panel is opened or closed in order
	 * that the iscroll can update itself.
	 * @memberOf CIQ.Watch
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Watch.refreshDisplay=function(){
		var listWrapper=$$$("#stxWLWrapper");
		CIQ.clearNode(listWrapper);
		var symbolsWrapper=$$$("#stxWatch-inner");
		CIQ.clearNode(symbolsWrapper);

		function leftSymbol(ii){
			return function(e){CIQ.Watch.enableSymbol(ii);};
		}
		function rightSymbol(ii){
			return function(e){CIQ.Watch.rightClickSymbol(ii);};
		}
		function leftList(ii){
			return function(e){CIQ.Watch.enableList(ii);};
		}
		for(var i=0;i<CIQ.Watch.lists.length;i++){
			var list=CIQ.Watch.lists[i];
			var li=CIQ.newChild(listWrapper, "li");
			CIQ.newChild(li, "div", "save");
			var edit=CIQ.newChild(li, "div", "edit");
			CIQ.safeClickTouch(edit,CIQ.Watch.openEditListDialog);

			var del=CIQ.newChild(li, "div", "delete");
			CIQ.safeClickTouch(del,CIQ.Watch.deleteCurrentList);

			var div=CIQ.newChild(li, "div", "list");
			var listName=CIQ.first(list);
			div.innerHTML=listName;
			if(CIQ.Watch.currentList==i){
				li.className="current";
				var symbols=list[listName];
				for(var j=0;j<symbols.length;j++){
					var li2=CIQ.newChild(symbolsWrapper, "li");
					CIQ.Watch.createSymbolEntry(li2,symbols[j]);
					if(CIQ.Watch.currentSymbol==j) li2.className="current";
					CIQ.ScrollManager.attach(li2, leftSymbol(j));
					CIQ.ScrollManager.attachRightClick(li2, rightSymbol(j));
				}
			}
			CIQ.ScrollManager.attach(li, leftList(i));
		}
		// Don't allow empty list containers, Safari chokes on that
		if(!listWrapper.childNodes.length){
			CIQ.newChild(listWrapper, "li");
		}
		if(!symbolsWrapper.childNodes.length){
			CIQ.newChild(symbolsWrapper, "li");
		}
		if(CIQ.Watch.lists.length>0){
			CIQ.swapClassName($$$("#stxWatch"),"true","false");
		}else{
			CIQ.swapClassName($$$("#stxWatch"),"false","true");
			CIQ.appendClassName($$$("#stxWatchUp"),"false");
			CIQ.appendClassName($$$("#stxWatchDown"),"false");
		}
		var symbolScroller=$$$("#stxWatch-symbols").parentNode;
		var panelHeight=$$$(".stx-panel-side").clientHeight;
		symbolScroller.style.height=(panelHeight-symbolScroller.offsetTop) +"px";
		CIQ.Watch.symbolScroll.refresh();
		CIQ.Watch.listScroll.refresh();
		//todo scroll list scroll if current list is off screen (such as when adding new list)
	};

	/**
	 * Initializes the watch list functionality. This requires an CIQ.StorageManager object to store changes and an CIQ.LookupWidget to enable
	 * symbol changes when users select symbols from their watch list. Call this method when you initialize the UI. You may need to call refreshDisplay()
	 * if HTML changes are made after CIQ.Watch is initialized.
	 * @param  {object} stxStorageManager {@link CIQ.StorageManager} for getting and saving watch lists
	 * @param  {object} stxLookupWidget   {@link CIQ.LookupWidget} for changing the chart
	 * @memberOf CIQ.Watch
	 * @version ChartIQ Advanced Package
	 * @example
		function selectCallback(that, result, filter){

			// This is where you would translate the symbol entered by the user
			// if your externally displayed symbols are different than what the chart needs to request from your quotefeed.
			// Remember to set `stxx.chart.symbolDisplay` as needed so the right description is displayed on the chart label.
			// Set `symbol` as needed before calling `newChart()`

			symbol = result.toUpperCase();
			if(symbol) {
				CIQLoader(true);
				stxx.newChart(symbol, null, null, finishedLoadingNewChart(stxx.chart.symbol, symbol)); // Send just a stock symbol to newChart
			}
		}

		var config={
			selectCallback: selectCallback,     // Function used to act on the symbol selected. Normally used to create a new chart with the new symbol.
		    stx: stxx                           // the chart object -- needed for translations
		};

		var stxLookupWidget=new CIQ.LookupWidget(config);
		stxLookupWidget.init();

		CIQ.Watch.initialize(CIQ.StorageManager, stxLookupWidget);
	 */
	CIQ.Watch.initialize=function(stxStorageManager, stxLookupWidget){
		CIQ.Watch.stxLookupWidget=stxLookupWidget;
		CIQ.Watch.stxStorageManager=stxStorageManager;
		var str=stxStorageManager.get("stx-watchLists");
		if(str){
			CIQ.Watch.lists=JSON.parse(str);
		}
		$$$("#stxNewWatchList").onclick=CIQ.Watch.openNewListDialog;
		$$$("#stxWatchCancelEdit").onclick=CIQ.DialogManager.dismissDialog;
		$$$("#stxWatchSaveEdit").onclick=CIQ.Watch.saveEditList;
		$$$("#stxWatchUp").onclick=function(i){return function(){CIQ.Watch.move(i);};}(-1);
		$$$("#stxWatchDown").onclick=function(i){return function(){CIQ.Watch.move(i);};}(1);
		$$$("#stxWatchPrev").onclick=function(i){return function(){CIQ.Watch.move(i);};}(-1);
		$$$("#stxWatchNext").onclick=function(i){return function(){CIQ.Watch.move(i);};}(1);
		if(CIQ.Watch.lists.length>0){
			CIQ.Watch.currentList=0;
		}
		CIQ.Watch.symbolScroll = CIQ.iscroll.newScroller($$$("#stxWatch-symbols").parentNode, {tap:true, scrollbars:false, interactiveScrollbars:false, mouseWheel:true});
		CIQ.Watch.listScroll = CIQ.iscroll.newScroller($$$("#stxWatchLists").parentNode, {tap:true, scrollbars:false, interactiveScrollbars:false, mouseWheel:true});
		CIQ.Watch.enableList(0);
		window.addEventListener("resize", CIQ.Watch.refreshDisplay);
	};




	/**
	 * ** This class is maintained for legacy implementations only (not using web components). New implementations should use functionality included in the web components (stxUI.js) **<br>
	 * Native implementation of multiple views. Views are accessible in the footer. Requires an CIQ.StorageManager for serializing views.
	 * @constructor
	 * @name CIQ.Views
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Views=function(){};

	/**
	 * Contains the list of available views
	 * @type {Array}
	 * @memberOf CIQ.Views
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Views.views=[];

	/**
	 * Index into CIQ.Views.views of the current view. -1 if no current view is enabled.
	 * @type {Number}
	 * @memberOf CIQ.Views
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Views.currentView=-1;

	/**
	 * Saves the current layout as a new view. The name of the view is taken from the dialog.
	 * @memberOf CIQ.Views
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Views.saveView=function(){
		var viewName=$$$("#stxViewEditName").value;
		var view;
		for(var i=0;i<CIQ.Views.views.length;i++){
			view=CIQ.Views.views[i];
			if(viewName==CIQ.first(view)){
				CIQ.Views.currentView=i;
				CIQ.Views.refreshDisplay();
				break;
			}
		}
		if(i==CIQ.Views.views.length){
			view={};
			view[viewName]={};
			CIQ.Views.views.push(view);
			CIQ.Views.currentView=CIQ.Views.views.length-1;
			CIQ.Views.refreshDisplay();
		}
		CIQ.DialogManager.dismissDialog();
		view[viewName]=CIQ.Views.stx.exportLayout();
		delete view[viewName].candleWidth;
		CIQ.Views.stxStorageManager.store("stx-views", JSON.stringify(CIQ.Views.views));
	};

	/**
	 * Opens the save view dialog
	 * @memberOf CIQ.Views
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Views.openNewViewDialog=function(){
		$$$("#stxViewEditName").value="";
		CIQ.DialogManager.displayDialog("stxViewSaveDialog");
	};


	/**
	 * Called when a view is enabled to update any required GUI elements.
	 * Set to a function as required by your UI.
	 * @param  {number} i Index into CIQ.Views.views of the requested view
	 * @memberOf CIQ.Views
	 * @version ChartIQ Advanced Package
	 * @since 2016-06-21
	 */
	CIQ.Views.updateGUI=null;

	/**
	 * Returns the index of a view given the name
	 * @param  {string} name Name of the view
	 * @return  {number} Index of the view (or -1 if not found)
	 * @memberOf CIQ.Views
	 * @version ChartIQ Advanced Package
	 * @since 09-2016-19
	 */
	CIQ.Views.indexOf=function(name){
		for(var v=0;v<CIQ.Views.views.length;v++){
			if(CIQ.Views.views[v][name]) return v;
		}
		return -1;
	};

	/**
	 * Enables the requested view
	 * @param  {number} i Index into CIQ.Views.views of the requested view
	 * @memberOf CIQ.Views
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Views.enableView=function(i){
		var view=CIQ.Views.views[i];
		var layout=view[CIQ.first(view)];
		CIQ.Views.stx.importLayout(layout, CIQ.Views.managePeriodicity, true);
		CIQ.Views.currentView=i;
		CIQ.Views.refreshDisplay();
		if (CIQ.Views.updateGUI) CIQ.Views.updateGUI(i);
		if(CIQ.Views.stx.changeCallback){
			CIQ.Views.stx.changeCallback(CIQ.Views.stx, "layout");
		}
	};

	/**
	 * Deletes the selected view
	 * @param  {number} i Index into CIQ.Views.views of the view to delete
	 * @memberOf CIQ.Views
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Views.deleteView=function(i){
		var currentViewName=CIQ.first(CIQ.Views.views[i]);
		CIQ.Views.views.splice(i,1);
		CIQ.Views.currentView=-1;
		for(var j=0;j<CIQ.Views.length;j++){
			if(currentViewName==CIQ.first(CIQ.Views.views[j])) CIQ.Views.currentView=j;
		}
		CIQ.Views.refreshDisplay();
		if(!CIQ.Views.views.length){
			CIQ.Views.stxStorageManager.remove("stx-views");
		}else{
			CIQ.Views.stxStorageManager.store("stx-views", JSON.stringify(CIQ.Views.views));
		}
	};

	/**
	 * Refreshes the views display. This is called whenever the screensize changes so that iscrolls can refresh themselves. Call this
	 * manually if HTML changes affect the size of the footer.
	 * @memberOf CIQ.Views
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Views.refreshDisplay=function(){
		var wrapper=$$$("#stxViewWrapper");
		if(!wrapper) return;
		CIQ.clearNode(wrapper);
		function leftView(ii){
			return function(e){CIQ.Views.enableView(ii);};
		}
		function rightView(ii){
			return function(e){CIQ.Views.deleteView(ii);};
		}
		for(var i=0;i<CIQ.Views.views.length;i++){
			var view=CIQ.Views.views[i];
			var li=CIQ.newChild(wrapper, "li");
			li.innerHTML=CIQ.first(view);
			if(CIQ.Views.currentView==i) li.className="current";
			CIQ.ScrollManager.attach(li, leftView(i));
			CIQ.ScrollManager.attachRightClick(li, rightView(i));
		}
		var panel=$$$("#stxViews");
		var scroller=$$$("#stxSavedViews").parentNode;
		scroller.rightClickable=true;
		var rightMargin=panel.clientWidth-$$$("#stxNewView").offsetLeft;
		scroller.style.width=(panel.clientWidth-scroller.offsetLeft-rightMargin)+"px";
		CIQ.Views.scroll.refresh();
	};

	/**
	 * Initializes the CIQ.Views object. Requires an CIQ.StorageManager for serializing views.
	 * @param  {object} stx               The chart object
	 * @param  {object} stxStorageManager CIQ.StorageManager
	 * @param  {boolean} [managePeriodicity=false] If true then periodicity will be controlled by views. The default behavior is that views are independent of periodicity.
	 * @memberOf CIQ.Views
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Views.initialize=function(stx, stxStorageManager, managePeriodicity){
		CIQ.Views.managePeriodicity=managePeriodicity;
		CIQ.Views.stx=stx;
		CIQ.Views.stxStorageManager=stxStorageManager;
		var str=stxStorageManager.get("stx-views");
		if(str){
			CIQ.Views.views=JSON.parse(str);
		}
		if(!$$$("#stxNewView")) return;
		$$$("#stxNewView").onclick=CIQ.Views.openNewViewDialog;
		$$$("#stxViewCancelEdit").onclick=CIQ.DialogManager.dismissDialog;
		$$$("#stxViewSaveEdit").onclick=CIQ.Views.saveView;
		CIQ.Views.scroll = CIQ.iscroll.newScroller($$$("#stxSavedViews").parentNode, {tap:true, scrollbars:false, interactiveScrollbars:false, mouseWheel:true, scrollY:false, scrollX:true});
		CIQ.Views.refreshDisplay();
		window.addEventListener("resize", CIQ.Views.refreshDisplay);
	};



	/**
	 * Creates an object which allows searching of a word list
	 * @param {Array} list Array of objects.  Object takes the form:
	 * 						{id:"id", name:"name", keywords:"space delimited list of keywords", category:"filterable category"}
	 * @param {integer} maxResults Maximum results to return, defaults to 50
	 * @param {boolean} contains If true, will search within a word for a match
	 * @memberOf CIQ
	 * @since  2015-11-1
	 */
	CIQ.SearchableWordList=function(list, maxResults, contains){

		if(!list) return;
		if(!maxResults) maxResults=50;
		if(!contains) contains=false;

		var container = {
			"records":[],
			"words":[]
		};

		for(var r=0;r<list.length;r++){
			var record=list[r];
			if(!record.name) record.name=record.id;
			record.index=container.records.push(record)-1;
			var descs=record.name.split(" ");
			if(record.keywords) descs=descs.concat(record.keywords.split(" "));
			for(var j=0;j<descs.length;j++){
				var word=descs[j].toUpperCase();
				var subIdx="_";
				var subIdx2="_";
				if(word.charCodeAt(0)>=33 && word.charCodeAt(0)<=126) subIdx=word.charAt(0);
				if(!container.words[subIdx]) container.words[subIdx]=[];
				if(word.length>1){
					if(word.charCodeAt(1)>=33 && word.charCodeAt(1)<=126) subIdx2=word.charAt(1);
				}else{
					subIdx2=" ";
				}
				if(!container.words[subIdx][subIdx2]) container.words[subIdx][subIdx2]=[];
				container.words[subIdx][subIdx2].push({index:record.index,word:word});
			}
		}

		/**
		 * Creates a list of matches to the criteria.  This is a subset of the Array of objects comprising the entire list.
		 * @param {string} input Text to search for, * will search for all
		 * @param {string} category Filter results matching this category
		 * @param {function} cb optional callback function which is passed the results
		 * @return {Array} results of search, only returned if cb is not passed.
		 * @memberOf CIQ.SearchableWordList
		 * @since  2015-11-1
		 */
		this.lookup=function(input, category, cb){
			var results=[];

			//sorting...first the id matches
			function sortId(a,b){
				if(a.id > b.id) return 1;
				else if(a.id < b.id) return -1;

				return a.weight > b.weight ? 1 : -1;
			}

			//sorting...first the weights
			function sortWeight(a, b){
				if(a.weight > b.weight) return 1;
				else if(a.weight < b.weight) return -1;

				return a.name > b.name ? 1 : -1;
			}

			//sorting...description weights
			function sortDescWeight(a, b){
				a.weight=0;
				b.weight=0;
				for(var j=0;j<keys.length;j++){
					var KEY=keys[j].toUpperCase();
					var aIndex=a.name.toUpperCase().indexOf(KEY);
					var bIndex=b.name.toUpperCase().indexOf(KEY);
					if(aIndex==-1) return 1;
					else if(bIndex==-1) return -1;

					a.weight+=aIndex;
					b.weight+=bIndex;
				}
				if(a.weight > b.weight) return 1;
				else if(a.weight < b.weight) return -1;

				return a.name > b.name ? 1 : -1;
			}

			//remove duplicates from array
			function noDups(res){
				var returnArray=[];
				var previousId="";
				for(var r=0;r<res.length;r++){
					if(previousId==res[r].id) continue;
					returnArray.push(res[r]);
					previousId=res[r].id;
				}
				return returnArray;
			}

			if(input && container){

				var foundBitMap=[];
				var keyword=input.toUpperCase();
				var exacts=[];

				var d, entry;
				for(d=0;d<container.records.length;d++){
					entry=container.records[d];
					if(foundBitMap[entry.index]) continue;  // match found already
					if(category && entry.category!=category) continue;  // wrong category
					var name=entry.name.toUpperCase();
					if(keyword=="*"){
						exacts.push(CIQ.extend(container.records[entry.index],{weight:0}));
						foundBitMap[entry.index]=true;
					}else{
						var i=name.indexOf(keyword);
						if(i>-1){
							var weight=name.length-keyword.length;
							if(!contains && i>0) continue;
							(weight?results:exacts).push(CIQ.extend(container.records[entry.index],{weight:weight}));
							foundBitMap[entry.index]=true;
						}
					}
				}

				var keys=keyword.split(" ");
				var k1="_";
				var k2="_";
				var myKey=keys[0].toUpperCase();
				var descResults=[];
				if(myKey.charCodeAt(0)>=33 && myKey.charCodeAt(0)<=126) k1=myKey.charAt(0);
				if(myKey.length>1){
					if(myKey.charCodeAt(1)>=33 && myKey.charCodeAt(1)<=126) k2=myKey.charAt(1);
				}else{
					k2=" ";
				}

				if(container.words[k1]){
					for(var kk in container.words[k1]){
						if(kk.length>1) continue;
						if(k2!=" ") kk=k2;
						for(d=0;container.words[k1][kk] && d<container.words[k1][kk].length;d++){
							entry=container.words[k1][kk][d];
							if(entry.word.toUpperCase().indexOf(myKey)!==0) continue;  // not a match
							if(foundBitMap[entry.index]) continue;  // match found already
							if(category && container.records[entry.index].category!=category) continue;  // wrong category
							descResults.push(CIQ.clone(container.records[entry.index]));
							foundBitMap[entry.index]=true;
						}
						if(k2!=" ") break;
					}
				}
				// now see if additional keywords supplied
				for(var extraKeys=1;extraKeys<keys.length;extraKeys++){
					myKey=keys[extraKeys].toUpperCase();
					for(var res=descResults.length-1;res>=0;res--){
						var words=descResults[res].name.split(" ");
						if(descResults[res].keywords) words=words.concat(descResults[res].keywords.split(" "));
						var match=false;
						for(var wd=0;wd<words.length;wd++){
							if(words[wd].toUpperCase().indexOf(myKey)===0){
								match=true;
								break;
							}
						}
						if(!match) descResults.splice(res,1);
					}
				}

				exacts.sort(sortId);
				exacts=noDups(exacts);

				results.sort(sortId);
				results=noDups(results);
				results.length=Math.min(results.length,maxResults);

				descResults.sort(sortId);
				descResults=noDups(descResults);

				//now that dups were removed sort by weight (closeness to match)
				results=exacts.sort(sortWeight).concat(results.sort(sortWeight),descResults.sort(sortDescWeight));
				results.length=Math.min(results.length,maxResults);
			}

			if(cb) cb(results);
			else return results;
		};
	};

	/**
	 * Renders a study dialog in standard form. The study dialog must be of specific format as provided in sample html files.
	 * @param  {object} stx   Chart object
	 * @param  {string} study Study type (as in studyLibrary)
	 * @param  {object} div   The study dialog DOM element which should already exist in the HTML
	 * @param {object} [override] Optional input and output map to override the defaults (used when editing existing study)
	 * @param {object} [override.inputs] Override inputs
	 * @param {object} [override.outputs] Override outputs
	 * @param {object} [override.parameters] Override additional parameters
	 * @memberOf CIQ.Studies
	 */
	CIQ.Studies.studyDialog=function(stx, study, div, override){
		div.study=study;
		div.stx=stx;
		if(override && override.inputs && override.inputs.id)
			div.replaceID=override.inputs.id;
		else if(div.replaceID)
			delete div.replaceID;
		var chart=stx.chart;	// Currently the dialog only supports adding studies to the primary chart

		var divInputs=div.querySelectorAll("#inputs")[0];
		var inputItems=divInputs.querySelectorAll(".inputTemplate");
		var i;
		for(i=0;i<inputItems.length;i++){
			if(inputItems[i].style.display!="none"){
				divInputs.removeChild(inputItems[i]);
			}
		}
		var divOutputs=div.querySelectorAll("#outputs")[0];
		var outputItems=divOutputs.querySelectorAll(".outputTemplate");
		for(i=0;i<outputItems.length;i++){
			if(outputItems[i].style.display!="none"){
				divOutputs.removeChild(outputItems[i]);
			}
		}

		var sd=CIQ.Studies.studyLibrary[study];
		if(!sd) sd={};
		if(typeof(sd.inputs)=="undefined") sd.inputs={"Period":14};
		if(typeof(sd.outputs)=="undefined") sd.outputs={"Result":"auto"};

		var addOption = function addOption(value, text, formField) {
			var option = document.createElement("OPTION");
			option.value = value;
			option.text = stx.translateIf(text);
			formField.add(option, null);
		};

		for(i in sd.inputs){
			var newInput=inputItems[0].cloneNode(true);
			divInputs.appendChild(newInput);
			newInput.style.display="block";
			newInput.querySelectorAll(".stx-heading")[0].appendChild(CIQ.translatableTextNode(stx,i));
			newInput.querySelectorAll(".stx-heading")[0].fieldName=i;
			var formField=null;
			var acceptedData=sd.inputs[i];
			var defaultValue=(override && override.inputs && override.inputs[i]!==null && typeof override.inputs[i]!="undefined")?override.inputs[i]:acceptedData;
			if(acceptedData.constructor==Number){
				formField=document.createElement("input");
				formField.setAttribute("type", "number");
				formField.value=defaultValue;
			}else if(acceptedData.constructor==String){
				if(acceptedData=="ma" || acceptedData=="ema" || acceptedData=="tma" || acceptedData=="vma" || acceptedData=="wma" || acceptedData=="tsma" || acceptedData=="smma" || acceptedData=="vdma"){
					formField=document.createElement("select");
					addOption("simple", "Simple", formField);
					addOption("exponential", "Exponential", formField);
					addOption("time series", "Time Series", formField);
					addOption("triangular", "Triangular", formField);
					addOption("variable", "Variable", formField);
					addOption("vidya", "VIDYA", formField);
					addOption("weighted", "Weighted", formField);
					addOption("welles wilder", "Welles Wilder", formField);
					formField.value=defaultValue;
					if(defaultValue=="ma") formField.selectedIndex=0;
					if(defaultValue=="ema") formField.selectedIndex=1;
					if(defaultValue=="tsma") formField.selectedIndex=2;
					if(defaultValue=="tma") formField.selectedIndex=3;
					if(defaultValue=="vma") formField.selectedIndex=4;
					if(defaultValue=="vdma") formField.selectedIndex=5;
					if(defaultValue=="wma") formField.selectedIndex=6;
					if(defaultValue=="smma") formField.selectedIndex=7;
				}else if(acceptedData=="field"){
					formField=document.createElement("select");
					var count=0;
					for(var field in chart.dataSet[chart.dataSet.length-1]){
						if(["Open","High","Low","Close","Adj_Close","hl/2","hlc/3","hlcc/4", "ohlc/4"].indexOf(field) == -1){
							//if(["Date","DT","projection","split","distribution", "atr", "stch_14", "ratio","transform","cache"].indexOf(field) >= 0) continue;
							//if(field=="Volume") {if(!stx.panels["vchart"]) continue;}
							//else if(CIQ.Studies.actualOutputs.indexOf(field)==-1) continue;
							if(CIQ.Studies.actualOutputs.indexOf(field)==-1) continue;
							var found=false;
							if(override){
								for(var output in override.sd.outputMap){
									// here we make sure that the output, and not a warted version of it, is in the field before skipping it.
									if(field.indexOf(output)!=-1 && field.indexOf(output+"-")==-1) found=true;
								}
							}
							if (found) continue;
						}
						addOption(field, field, formField);
						if(field=="Close") formField.selectedIndex=count;
						count++;
					}
					if(defaultValue!="field"){
						formField.value=defaultValue;
					}
				}else{
					formField=document.createElement("input");
					formField.type="text";
					formField.value=defaultValue;
				}
			}else if(acceptedData.constructor==Boolean){
				formField=document.createElement("input");
				formField.setAttribute("type","checkbox");
				if(defaultValue===true || defaultValue=="true") formField.checked=true;
				if( (i == "Overlay")  && override && override.parameters.editMode ) {
					if(formField.checked) formField.disabled = true;
					else newInput.style.display="none";
				}
			}else if(acceptedData.constructor==Array){
				formField=document.createElement("select");
				for(var ii=0;ii<acceptedData.length;ii++){
					addOption(acceptedData[ii], acceptedData[ii], formField);
				}
				if(defaultValue.constructor!=Array){
					formField.value=defaultValue;
				}
			}
			if(formField) newInput.querySelectorAll(".stx-data")[0].appendChild(formField);
		}
		for(i in sd.outputs){
			var newOutput=outputItems[0].cloneNode(true);
			divOutputs.appendChild(newOutput);
			newOutput.style.display="block";
			newOutput.querySelectorAll(".stx-heading")[0].appendChild(CIQ.translatableTextNode(stx,i));
			newOutput.querySelectorAll(".stx-heading")[0].fieldName=i;
			var colorClick=newOutput.querySelectorAll(".stx-color")[0];
			var value=sd.outputs[i];
			if(override && override.outputs && override.outputs[i]) value=override.outputs[i];
			if(value!="auto"){
				colorClick.style.backgroundColor=value;
				CIQ.unappendClassName(colorClick, "stxColorDarkChart");
			}else{
				if(stx.defaultColor=="#FFFFFF") CIQ.appendClassName(colorClick, "stxColorDarkChart");
			}

			CIQ.attachColorPicker(colorClick, div);
		}

		// Optional parameters for studies. This is driven by a UI template that must be created by the developer, and which
		// is referenced from the study description (studyLibrary entry).
		var parametersEL=div.querySelectorAll("#parameters")[0];
		if(parametersEL){
			CIQ.clearNode(parametersEL);
			if(sd.parameters && sd.parameters.template && sd.parameters.init){
				if(sd.parameters.condition && !sd.parameters.condition(stx)) return;
				var template=document.querySelectorAll("#" + sd.parameters.template)[0];
				if(template){
					template=template.cloneNode(true);
					template.style.display="block";
					parametersEL.appendChild(template);
					for(var f in sd.parameters.init){
						var pvalue=sd.parameters.init[f];
						if(override && override.parameters && typeof(override.parameters[f])!="undefined" && override.parameters[f]!==null)
							pvalue=override.parameters[f];
						var el=template.querySelectorAll("#" + f)[0];
						if(!el) continue;
						if(el.tagName=="INPUT"){
							if(el.type=="checkbox"){
								el.checked=(pvalue===true || pvalue=="true");
							}else{
								el.value=pvalue;
							}
						}else{
							if(pvalue=="auto"){
								pvalue="";
								if(stx.defaultColor=="#FFFFFF") CIQ.appendClassName(el, "stxColorDarkChart");
							}else{
								CIQ.unappendClassName(el, "stxColorDarkChart");
							}
							el.style.backgroundColor=pvalue;
							CIQ.attachColorPicker(el, div);
						}
					}
				}
			}
		}
	};


	/**
	 * Creates the color picker node. Uses colors specified in {@link CIQ.colorPickerColors}
	 * @private
	 * @memberOf CIQ
	 */
	CIQ.createColorPicker = function (div, fc) {
		var colors=CIQ.colorPickerColors;
		CIQ.clearNode(div);
		var ul=document.createElement("ul");
		div.appendChild(ul);
		function clkFn(c){ return function(){ fc(c); return false;};}
		for(var i=0;i<colors.length;i++){
			var c=colors[i];
			var li=document.createElement("li");
			var a=document.createElement("a");
			li.appendChild(a);
			a.href="#";
			a.title=c;
			a.style.background="#"+c;
			a.innerHTML=c;
			ul.appendChild(li);
			a.onclick=clkFn(c);
		}
	};

	// The most complicated function ever written
	//
	// colorClick = the div that the user clicks on to pull up the color picker. The color picker will set the
	//              background of this to the selected color
	//
	// cpHolder = A global object that is used to contain the color picker and handle closures of the containing dialog.
	//
	// cb = Callback function for when the color is picked fc(color)

	/**
	 * Attaches a color picker to a DOM object.
	 * @param  {object}   colorClick The DOM element that the user clicks on to pull up the color picker. The color picker will set the background color of this node to the selected color.
	 * @param  {object}   cpHolder   A global object that is necessary to contain the color picker and handle closures. Usually the parent of colorClick.
	 * @param  {Function} cb         A callback function to call when the color is picked of format fc(color) where color is the selected color
	 * @memberOf CIQ
	 */
	CIQ.attachColorPicker = function(colorClick, cpHolder, cb){
		var closure=function(colorClick, cpHolder, cb){
			return function(color){
				if(cpHolder.colorPickerDiv) cpHolder.colorPickerDiv.style.display="none";
				colorClick.style.backgroundColor="#"+color;
				if(cb) cb(color);
			};
		};
		colorClick.onclick=(function(fc, cpHolder){ return function(){
			if(!cpHolder.colorPickerDiv){
				cpHolder.colorPickerDiv=document.createElement("DIV");
				cpHolder.colorPickerDiv.className="ciqColorPicker";
				document.body.appendChild(cpHolder.colorPickerDiv);
			}
			CIQ.createColorPicker(cpHolder.colorPickerDiv, fc);
			cpHolder.colorPickerDiv.style.display="block";
			var xy=CIQ.getPos(this);
			var x=xy.x+this.clientWidth;
			if((x+cpHolder.colorPickerDiv.offsetWidth)>CIQ.pageWidth())
				x-=(x+cpHolder.colorPickerDiv.offsetWidth)-CIQ.pageWidth()+20;
			cpHolder.colorPickerDiv.style.left=x+"px";

			var y=(xy.y);
			if(y+cpHolder.colorPickerDiv.clientHeight>CIQ.pageHeight())
				y-=(y+cpHolder.colorPickerDiv.clientHeight)-CIQ.pageHeight();
			cpHolder.colorPickerDiv.style.top=y+"px";
		};})(closure(colorClick, cpHolder, cb), cpHolder);
	};

	/**
	 * Predefined colors for the color picker that have been tested across multiple devices.
	 * These color values may be changed if desired by assigning CIQ.colorPickerColors to a different array of colors.
	 * @memberOf CIQ
	 * @example
	 * CIQ.colorPickerColors = ["ffffff","ffd0cf","ffd9bb","fff56c","eaeba3","d3e8ae","adf3ec","ccdcfa","d9c3eb"];
	 */
	CIQ.colorPickerColors = [
	    "ffffff","ffd0cf","ffd9bb","fff56c","eaeba3","d3e8ae","adf3ec","ccdcfa","d9c3eb",
		"efefef","eb8b87","ffb679","ffe252","e2e485","c5e093","9de3df","b1c9f8","c5a6e1",
		"cccccc","e36460","ff9250","ffcd2b","dcdf67","b3d987","66cac4","97b8f7","b387d7",
		"9b9b9b","dd3e39","ff6a23","faaf3a","c9d641","8bc176","33b9b0","7da6f5","9f6ace",
		"656565","b82c0b","be501b","e99b54","97a030","699158","00a99d","5f7cb8","784f9a",
		"343434","892008","803512","ab611f","646c20","46603a","007e76","3e527a","503567",
		"000000","5c1506","401a08","714114","333610","222f1d","00544f","1f2a3c","281a33"
	];

	/**
	 * Extracts the user input data from a study dialog. Study Dialogs must follow a specific UI format (@see CIQ.Studies.studyDialog) in order
	 * for this function to operate correctly. Typically it will be called from the go() function (@see CIQ.Studies.go).
	 * @param  {object} div The DOM element that is the study dialog
	 * @param  {object} stx A chart object
	 * @return {object}     A pseudo-study descriptor is returned. It contains only the input, output, and parameters objects.
	 * @since 04-2015
	 * @memberOf CIQ.Studies
	 */
	CIQ.Studies.parseDialog=function(div, stx){
		var inputs={}; var outputs={};
		//var translatedStudy=div.study;
		//if(stx) translatedStudy=stx.translateIf(translatedStudy);
		var inputItems=div.querySelectorAll(".inputTemplate");
		var i,field;
		for(i=0;i<inputItems.length;i++){
			if(inputItems[i].style.display!="none"){
				field=inputItems[i].querySelectorAll(".stx-heading")[0].fieldName;
				var inputDOM=inputItems[i].querySelectorAll(".stx-data")[0].childNodes[0];
				var value=inputDOM.value;
				if(inputDOM.getAttribute("type")=="checkbox"){
					inputs[field]=inputDOM.checked;
				}else{
					inputs[field]=value;
				}
			}
		}

		var outputItems=div.querySelectorAll(".outputTemplate");
		for(i=0;i<outputItems.length;i++){
			if(outputItems[i].style.display!="none"){
				field=outputItems[i].querySelectorAll(".stx-heading")[0].fieldName;
				if(typeof field!=="undefined"){
					var color=outputItems[i].querySelectorAll(".stx-color")[0].style.backgroundColor;
					if(!color) color="auto";
					outputs[field]=color;
				}
			}
		}

		var parameters={};
		CIQ.Studies.getCustomParameters(div, parameters);
		parameters.replaceID=div.replaceID;

		return {
			inputs: inputs,
			outputs: outputs,
			parameters: parameters
		};
	};

	/**
	 * Converts a study dialog into an actual study. Study Dialogs must follow a specific UI format (@see CIQ.Studies.studyDialog) in order
	 * for this function to operate correctly. Typically it will be called when a user clicks the "submit" button on an HTML study dialog window.
	 * @param  {object} div The DOM element that is the study dialog
	 * @param  {object} stx A chart object
	 * @return {object}     The study descriptor is returned. This can be used in the future for deleting the study programatically.
	 * @memberOf CIQ.Studies
	 */
	CIQ.Studies.go=function(div, stx){
		var sd=CIQ.Studies.parseDialog(div, stx);
		sd=CIQ.Studies.addStudy(div.stx, div.study, sd.inputs, sd.outputs, sd.parameters);
		return sd;
	};

	/**
	 * This method parses out custom parameters from the study dialog. For this to work, the studyLibrary entry
	 * must contain a value "parameters". This object should then include a "template" which is the id of the html
	 * element that is appended to the studyDialog. Then another object "init" should contain all of the id's
	 * within that template which contain data. It is currently used to create "zones" in study panels.
	 * @param {object} div The study dialog window
	 * @param {object} parameters An object containing the parameters to set in the study dialog window. These parameters would typicaly come from the study descriptor (library entry).
	 * @memberOf CIQ.Studies
	 */
	CIQ.Studies.getCustomParameters=function(div, parameters){
		var sd=CIQ.Studies.studyLibrary[div.study];
		if(!sd) return;
		if(!sd.parameters) return;
		if(!sd.parameters.template) return;
		if(!sd.parameters.init) return;
		var template=div.querySelectorAll("#" + sd.parameters.template)[0];
		if(!template) return;
		for(var field in sd.parameters.init){
			var el=template.querySelectorAll("#" + field)[0];
			if(!el) continue;
			if(el.tagName=="INPUT"){
				if(el.type=="checkbox"){
					parameters[field]=el.checked;
				}else{
					parameters[field]=el.value;
				}
			}else{
				parameters[field]=el.style.backgroundColor;
			}
		}
	};

	//backwards compatibility
	{
		/**
		 * @deprecated use CIQ.Studies.displayHistogramWithSeries instead
		 */
		CIQ.Studies.displayKlinger=CIQ.Studies.displayHistogramWithSeries;
		/**
		 * @deprecated use CIQ.Studies.displayHistogramWithSeries instead
		 */
		CIQ.Studies.displayMACD=CIQ.Studies.displayHistogramWithSeries;
	}

	/**
	 * AboveCandle is a sample Marker placement handler that positions markers above the candles on the chart.
	 * This is equivalent to a "placementFunction" in the previous version of Markers.
	 * You can create your own marker placement objects by following the same pattern.
	 *
	 * @param  {Object} params Parameters inherited from {@link CIQ.Marker}
	 * @name CIQ.Marker.AboveCandle
	 * @constructor
	 * @example
	  	new CIQ.Marker.AboveCandle({
		    stx: stxx,
		    xPositioner: "date",
		    x: stxx.masterData[i].DT,
		    label: "events",
		    node: newNode
		});
	 */
	CIQ.Marker.AboveCandle=function(params){
		if(!this.className) this.className="CIQ.Marker.AboveCandle";
		CIQ.Marker.call(this, params);
	};

	CIQ.Marker.AboveCandle.ciqInheritsFrom(CIQ.Marker, false);

	/**
	 * Sample `placementFuncion` override used to draw markers above a particular candle, bar or line value regardless of `marker.params.y` and `marker.params.yPositioner` settings.
	 *
	 * @param  {Object} params Parameters including the list of markers and placement details
	 * @param {CIQ.ChartEngine} params.stx The chart object
	 * @param {Array} params.arr The array of markers to place
	 * @param {Object} params.panel The panel where the markers are to be placed
	 * @param {Number} params.firstTick The first tick displayed on the chart
	 * @param {Number} params.lastTick The last tick displayed on the chart
	 * @memberOf CIQ.Marker.AboveCandle
	 */
	CIQ.Marker.AboveCandle.placementFunction=function(params){
		var panel=params.panel;
		var yAxis=params.yAxis?params.yAxis:params.panel.yAxis;
		var chart=panel.chart;
		var stx=params.stx;
		var useHighs=CIQ.ChartEngine.chartShowsHighs(stx.layout.chartType);

		var placementMap ={};
		for(var i=0;i<params.arr.length;i++){
			var marker=params.arr[i];
			var node=marker.node;
			// Getting clientWidth and clientHeight is a very expensive operation
			// so we'll cache the results. Don't use this function if your markers change
			// shape or size dynamically!
			if(!marker.clientWidth) marker.clientWidth=node.clientWidth;
			if(!marker.clientHeight) marker.clientHeight=node.clientHeight;
			var quote=null;

			// X axis positioning logic

			if(marker.params.xPositioner=="bar"){
				if(marker.params.x<chart.xaxis.length){
					var xaxis=chart.xaxis[marker.params.x];
					if(xaxis) quote=xaxis.data;
				}
				node.style.left=Math.round(stx.pixelFromBar(marker.params.x, chart)-marker.clientWidth/2)+1+"px";
			}else{
				// This is a section of code to hide markers if they are off screen, and also to figure out
				// the position of markers "just in time"
				// the tick is conditionally pre-set by CIQ.ChartEngine.prototype.setMarkerTick depending on marker.params.xPositioner
				if(!marker.tick && marker.tick!==0){ // if tick is not defined then hide, probably in distant past
					if(marker.params.future && chart.scroll<chart.maxTicks){ // In future
						stx.futureTickIfDisplayed(marker); // Just in time check for tick
						if(!marker.tick && marker.tick!==0){
							node.style.left="-1000px";
							continue;
						}
					}else{
						node.style.left="-1000px";
						continue;
					}
				}
				if(marker.tick<chart.dataSet.length) quote=chart.dataSet[marker.tick];
				if(marker.tick<params.firstTick && marker.rightEdge<0) continue; // off screen, no need to reposition the marker
				marker.leftpx=Math.round(stx.pixelFromTick(marker.tick, chart)-chart.left-marker.clientWidth/2);
				marker.rightEdge=marker.leftpx+node.clientWidth;
				node.style.left=marker.leftpx+"px";
			}
			if(!quote) quote=chart.dataSet[chart.dataSet.length-1]; // Future ticks based off the value of the current quote

			if ( typeof placementMap[node.style.left]!="undefined")
				placementMap[node.style.left]+=1;
			else
				placementMap[node.style.left]=0;

			// Y axis positioning logic

			var height=marker.params.chartContainer?stx.height:panel.yAxis.bottom;

			var bottomAdjust=0;
			if ( placementMap[node.style.left]){
				bottomAdjust = (node.clientHeight+2)*placementMap[node.style.left];
			}

			var bottom;
			if(useHighs){
				bottom=Math.round(height-stx.pixelFromPriceTransform(quote.High, panel, yAxis)+bottomAdjust)+"px";
			}else{
				bottom=Math.round(height-stx.pixelFromPriceTransform(quote.Close, panel, yAxis)+bottomAdjust)+"px";
			}
			if(node.style.bottom!=bottom) node.style.bottom=bottom;
		}
	};

	return _exports;
});
