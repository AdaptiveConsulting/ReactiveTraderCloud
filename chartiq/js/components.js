;(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['componentUI'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('./componentUI'));
	} else {
		factory(root);
	}
})(this, function(_exports) {
	var CIQ = _exports.CIQ;


	/**
	 * Dialog web component `<cq-dialog>`.
	 *
	 * Manages general dialog interaction such as display, hide, location, size, tap interaction, etc
	 *
	 * @namespace WebComponents.cq-dialog
	 * @example
<cq-dialog cq-timezone-dialog>
	<cq-timezone-dialog>
		<h4 class="title">Choose Timezone</h4>
		<cq-close></cq-close>

		<p>To set your timezone use the location button below, or scroll through the following list...</p>
		<p class="currentUserTimeZone"></p>
    <div class="detect">
    <div class="ciq-btn" stxtap="Layout.removeTimezone()">Use My Current Location</div>
    </div>
    <div class="timezoneDialogWrapper" style="max-height:360px; overflow: auto;">
	        <ul>
	          <li class="timezoneTemplate" style="display:none;cursor:pointer;"></li>
	        </ul>
        </div>
    <div class="instruct">(Scroll for more options)</div>
	</cq-timezone-dialog>
</cq-dialog>
	 */
	var Dialog = {
		prototype: Object.create(CIQ.UI.BaseComponent)
	};

	/**
	 * The attributes that are added to a cq-dialog when it is opened (and removed when closed).
	 * Contains "cq-active" by default.
	 * @memberof WebComponents.cq-dialog
	 * @type {Object}
	 */
	Dialog.prototype.activeAttributes=null;

	Dialog.prototype.createdCallback=function(){
		CIQ.UI.BaseComponent.createdCallback.apply(this);
		this.activeAttributes={};
	};

	Dialog.prototype.attachedCallback=function(){
		if(this.attached) return;
		this.isDialog=true;
		CIQ.UI.BaseComponent.attachedCallback.apply(this);
		var self=this;
		function handleTap(e){
			self.tap(e);
		}
		this.node.stxtap(handleTap);

		var uiManager=$("cq-ui-manager");
		uiManager.each(function(){
			this.registerForResize(self);
			self.uiManager=this;
		});
	};

	Dialog.prototype.detachedCallback=function(){
		var self=this;
		var uiManager=$("cq-ui-manager");
		uiManager.each(function(){
			this.unregisterForResize(self);
		});
	};

	/**
	 * Creates a new attribute to be activated when the dialog is open. Use
	 * this to style the dialog. This is automatically set by any component
	 * that is derived from DialogContentTag
	 * @param {string} attribute The attribute to add or remove
	 * @memberof WebComponents.cq-dialog
	 * @since  4.1.0
	 * @example
	 * <style> cq-dialog[cq-study-context]{ padding:0; } </style>
	 * <cq-dialog cq-study-context></cq-dialog>
	 */
	Dialog.prototype.addActiveAttribute=function(attribute){
		this.activeAttributes[attribute]=true;
	};

	Dialog.prototype.tap=function(e){
		var topMenu=this.uiManager.topMenu();
		if(topMenu===this){
			e.stopPropagation(); // prevent a tap inside the dialog from closing itself
			return;
		}
		if(!e.currentTarget.active){
			e.stopPropagation(); // If the dialog we tapped on is closed, then we must have closed it manually. Don't allow a body tap otherwise we'll close two dialogs!
		}
	};

	Dialog.prototype.resize=function(){
		if(this.params && this.params.x){
			this.stxContextMenu();
		}else{
			this.center();
		}
		var scrollers=$(this.node).find("cq-scroll");
		scrollers.each(function(){
			this.resize();
		});
	};

	Dialog.prototype.stxContextMenu=function(){
		var parent=this.node.parent();
		if(parent[0].tagName=="BODY") parent=$(window);
		var w=parent.guaranteedWidth();
		var h=parent.guaranteedHeight();
		var cw=this.node.outerWidth();
		var ch=this.node.outerHeight();
		var left=this.params.x;
		var top=this.params.y;
		if(left+cw>w) left=w-cw;
		if(top+ch>h) top=top-ch;
		if(top<0) top=0;
		this.node.css({"top":top+"px", "left": left + "px"});
	};

	Dialog.prototype.center=function(){
		var parent=this.node.parent();
		if(parent[0].tagName=="BODY") parent=$(window);
		var w=parent.guaranteedWidth();
		var h=parent.guaranteedHeight();
		var cw=this.node.outerWidth();
		var ch=this.node.outerHeight();
		var left=w/2-cw/2;
		var top=h/2-ch/2;
		if(left<0) left=0;
		if(h>ch*2 && top+(ch/2)>h/3){
			top=h/3-ch/2; // Position 1/3 down the screen on large screens
		}
		if(top<0) top=0;
		this.node.css({"top":top+"px", "left": left + "px"});
	};

	Dialog.prototype.open=function(params){
		this.uiManager.openMenu(this, params);
	};

	Dialog.prototype.close=function(){
		this.uiManager.closeMenu(this);
	};


	Dialog.prototype.hide=function(){
		if($(this).find(":invalid").length) return;
		// Call the "hide()" function for any immediate children. This will allow nested
		// components to clean themselves up when a dialog is removed from outside of their scope.
		this.node.children().each(function(){
			if(typeof this.hide=="function")
				this.hide();
		});
		this.active=false;
		if(this.uiManager.overlay) this.uiManager.overlay.removeAttrBetter("cq-active");
		//this.uiManager.overlay=null;
		for(var attribute in this.activeAttributes){
			this.node.removeAttrBetter(attribute);
		}
		this.activeAttributes={};

		// blur any input boxes that are inside the dialog we're closing, to get rid of soft keyboard
		$(this).find("input").each(function(){
			if(this==document.activeElement) this.blur();
		});
	};

	/**
	 * Show the dialog. Use X,Y *screen location* (pageX, pageY from an event) for where to display context menus. If the context menu cannot fit on the screen then it will be adjusted leftward and upward
	 * by enough pixels so that it shows.
	 * @param {object} [params] Parameters
	 * @param  {Boolean} [params.bypassOverlay=false] If true will not display the scrim overlay
	 * @param {Number} [params.x] X location of top left corner. Use for context menus, otherwise dialog will be centered.
	 * @param {Number} [params.y] Y location of top left corner. Use for context menus, otherwise dialog will be centered.
	 * @alias show
	 * @memberof WebComponents.cq-dialog
	 */
	Dialog.prototype.show=function(params){
		this.params=params;
		if(!params) params=this.params={};
		var self=this;
		if(!this.uiManager.overlay && !params.bypassOverlay){
			this.uiManager.overlay=$("<cq-dialog-overlay></cq-dialog-overlay>");
			var context = params.context || CIQ.UI.getMyContext(this);
			if(context) context.node.append(this.uiManager.overlay);
		}
		setTimeout(function(){ // to get the opacity transition effect
			if(self.uiManager.overlay && !params.bypassOverlay) self.uiManager.overlay.attrBetter("cq-active");
			self.activeAttributes["cq-active"]=true; // cq-active is what css uses to display the dialog
			for(var attribute in self.activeAttributes){
				self.node.attrBetter(attribute);
			}
			self.resize();
			self.active=true;
		});
	};

	CIQ.UI.Dialog=document.registerElement("cq-dialog", Dialog);

	



	/**
	 * View Dialog web component `<cq-view-dialog>`.
	 * 
	 * See {@link CIQ.UI.ViewsMenu} for more details on menu management for this component
	 * @namespace WebComponents.cq-view-dialog
	 * @example
		 <cq-dialog>
				 <cq-view-dialog>
					<h4>Save View</h4>
					<div stxtap="close()" class="ciq-icon ciq-close"></div>
					<div style="text-align:center;margin-top:10px;">
						<i>Enter name of view:</i>
						<p>
							<input spellcheck="false" autocapitalize="off" autocorrect="off" autocomplete="off" maxlength="40" placeholder="Name"><br>
						</p>
						<span class="ciq-btn" stxtap="save()">Save</span>
				</div>
			</cq-view-dialog>
		 </cq-dialog>
	 */
	var ViewDialog = {
		prototype: Object.create(CIQ.UI.DialogContentTag)
	};

	/**
	 * Saves the new view. This updates all cq-view menus on the screen, and persists the view in the nameValueStore.
	 * @alias save
	 * @memberof WebComponents.cq-view-dialog
	 */
	ViewDialog.prototype.save=function(){
		var viewName=this.node.find("input").val();
		if(!viewName) return;

		var self=this;
		var madeChange=false;
		var layout=this.context.stx.exportLayout();
		$("cq-views").each(function(){
			var obj=this.params.viewObj;
			var view;

			for(var i=0;i<obj.views.length;i++){
				view=obj.views[i];
				if(viewName==CIQ.first(view)) break;
			}
			if(i==obj.views.length){
				view={};
				view[viewName]={};
				obj.views.push(view);
			}
			view[viewName]=layout;
			delete view[viewName].candleWidth;
			this.renderMenu();
			//this.context.stx.updateListeners("layout");
			if(!madeChange){
				// We might have a cq-view menu on multiple charts on the screen. Only persist once.
				madeChange=true;
				this.params.nameValueStore.set("stx-views", obj.views);
			}
		});
		this.close();
	};

	CIQ.UI.ViewDialog=document.registerElement("cq-view-dialog", ViewDialog);

	



	/**
	 * Scroll web component `<cq-scroll>`.
	 *
	 * cq-scroll web component creates an scrollable container. This will resize
	 * itself when the screen is resized. If perfect-scrollbar
	 * is supported then it will be used to replace the native scrollbar
	 *
	 * Attributes:
	 * cq-no-claim - Do not apply any keystroke capturing.
	 * cq-no-maximize - Do not automatically maximize the height (but keep it showing on screen)
	 * cq-no-resize - Do not apply any sizing logic.
	 *
	 * Use this.dataPortion to dynamically inject items into the list
	 * @namespace WebComponents.cq-scroll
	 * @example
	 <cq-lookup-results>
		 <cq-lookup-filters cq-no-close>
			 <cq-filter class="true">ALL</cq-filter>
			 <cq-filter>STOCKS</cq-filter>
			 <cq-filter>FX</cq-filter>
			 <cq-filter>INDEXES</cq-filter>
			 <cq-filter>FUNDS</cq-filter>
			 <cq-filter>FUTURES</cq-filter>
		 </cq-lookup-filters>
		 <cq-scroll></cq-scroll>
	 * @since 6.1.0 added cq-no-claim attribute
	 */

	var Scroll = {
		prototype: Object.create(CIQ.UI.BaseComponent)
	};

	/**
	 * Scroll back to top
	 */
	Scroll.prototype.top=function(){
		this.scrollTop=0;
		if(this.node.perfectScrollbar) this.node.perfectScrollbar("update");
	};

	/**
	 * Scroll to the element.
	 * @param  {HtmlElement} item The element to scroll to. Must be a child.
	 * @alias scrollToElement
	 * @memberof WebComponents.cq-scroll
	 */
	Scroll.prototype.scrollToElement=function(item){
		var bottom=this.clientHeight, scrolled=this.scrollTop;
		var itemBottom=item.offsetTop+item.clientHeight;
		if(item.offsetTop>scrolled && itemBottom<bottom+scrolled) return;
		this.scrollTop=Math.max(itemBottom-bottom,0);
		if(this.node.perfectScrollbar) this.node.perfectScrollbar("update");
	};

	Scroll.prototype.resize=function(){
		var node=this.node;
		if(node.parents(".sharing").length) return;  /*share.js appends this class to the body.
												Do not attempt unnecessary resize of scroll
												for a chart about to become a shared image.
												Besides, jquery will choke on offset() below.*/
		if(typeof(node.attr("cq-no-resize"))!="undefined") return;
		if(typeof(node.attr("cq-no-maximize"))!="undefined") this.noMaximize=true;
		var position=node[0].getBoundingClientRect();
		var reduceMenuHeight=node.prop("reduceMenuHeight") || 45; // defaulted to 45 to take into account 15px of padding on menus and then an extra 5px for aesthetics
		var winHeight=$(window).height();
		if(!winHeight) return;
		var height=winHeight-position.top - reduceMenuHeight;
		var holders=node.parents(".stx-holder,.stx-subholder,.chartContainer");
		if(holders.length){
			holders.each(function(){
				var h=$(this);
				var holderBottom=h[0].getBoundingClientRect().top+h.height();
				height=Math.min(height, holderBottom - position.top - 5); // inside a holder we ignore reduceMenuHeight, but take off 5 pixels just for aesthetics
			});
		}

		// If there are subsequent siblings that have a fixed height then make room for them
		var nextAll=node.nextAll();
		for(var i=0;i<nextAll.length;i++){
			var sibling=$(nextAll[i]);
			if(!sibling.is(":visible")) continue; // skip hidden siblings
			height-=sibling.height();
		}
		if(!this.noMaximize) node.css({"height": height + "px"});
		node.css({"max-height": height + "px"});
		if(node.perfectScrollbar) node.perfectScrollbar("update");
	};

	Scroll.prototype.createdCallback=function(){
		CIQ.UI.BaseComponent.createdCallback.apply(this);
		this.node=$(this);
		this.node.css({"overflow-y":"auto"});
	};

	Scroll.prototype.attachedCallback=function(){
		if(this.attached) return;
		CIQ.UI.BaseComponent.attachedCallback.apply(this);
		this.uiManager=$("cq-ui-manager");
		if(this.uiManager.length>0) this.uiManager=this.uiManager[0];

		var node=this.node;
		if(node.perfectScrollbar) node.perfectScrollbar({suppressScrollX:true});
		if(typeof(node.attr("cq-no-claim"))=="undefined") this.addClaim(this);

		// prevent mousewheel event from propagating up to parents, such as when embedded in a chart
		this.addEventListener(CIQ.wheelEvent, function(e){
			e.stopPropagation();
		});

		var self=this;
		CIQ.addResizeListener(this, function(){
			self.resize();
		});
		this.resize();
		this.attached=true;
	};

	/**
	 * Scroll components can handle up and down enter keystrokes.
	 * They do not register for claims directly. Another section of code must
	 * establish the claim on their behalf or proxy the keystroke.
	 *
	 * Up and down arrows will iterate through cq-item tags. The attribute
	 * cq-focused will be added to the currently focused tag. This can then be
	 * queried later, such as when a user hits enter.
	 *
	 * space bar or enter will call the selectFC callback on the cq-item if it exists
	 * @param {undefined} hub Unused parameter
	 * @param {string} key Key that was stroked
	 * @param {object} e The event object
	 * @return {boolean}
	 */
	Scroll.prototype.keyStroke=function(hub, key, e){
		var node=this.node;

		if(!node.is(":trulyvisible")) return false;
		switch(key){
		case "ArrowUp":
		case "ArrowDown":
		case "Enter":
		case " ":
		case "Up":
		case "Down":
		case "Spacebar":
			break;
		default:
			return false;
		}
		var items=node.find("cq-item");
		if(!items.length) return;
		var focused=node.find("cq-item[cq-focused]");

		if(key==" " || key=="Spacebar" || key=="Enter"){
			if(focused.length && focused[0].selectFC){
				focused[0].selectFC.call(focused, e);
				return true;
			}
			return false;
		}
		if(!focused.length){
			$(items[0]).attr("cq-focused","true");
			this.scrollToElement(items[0]);
			return true;
		}
		items.removeAttr("cq-focused");

		// locate our location in the list of items
		for(var i=0;i<items.length;i++)
			if(items[i]===focused[0]) break;

		if(key=="ArrowUp" || key=="Up"){
			i--;
			if(i<0) i=0;
		}
		if(key=="ArrowDown" || key=="Down"){
			i++;
			if(i>=items.length) i=items.length-1;
		}
		$(items[i]).attr("cq-focused","true");
		this.scrollToElement(items[i]);
		return true;
	};

	/**
	 * Returns the focused element or null. An item is focused if it has
	 * attribute cq-focused.
	 * @return {HTMLElement} The element or null
	 * @alias focused
	 * @memberof WebComponents.cq-scroll
	 */
	Scroll.prototype.focused=function(){
		var focused=this.node.find("cq-item[cq-focused]");
		if(focused.length) return focused[0];
		return null;
	};

	CIQ.UI.Scroll=document.registerElement("cq-scroll", Scroll);

	



	/**
	 * Advertisement web component `<cq-advertisement>`.
	 *
	 * Displays an advertisement banner as a "marker" (inside the chart, use CSS to position absolutely against the chart panel).
	 * The advertisement should contain content that can be enabled by calling {@link CIQ.UI.Advertisement#show} based on your
	 * business logic.
	 *
	 * The advertisement will automatically adjust the height to accommodate the content (assuming overflow-y: auto)
	 *
	 * @namespace WebComponents.cq-advertisement
	 * @example
<cq-advertisement style="display: block; height: 106px;">
    <cq-close class="ciq-tight"></cq-close>
	<div class="sample ciq-show">
		<div cq-desktop="">
			<div><translate original="$1 Trades">$1 Trades</translate></div>
			<div><translate original="Use code ">Use code </translate><strong><translate original="Sample">Sample</translate></strong></div>
			<a target="_blank" href="https://yourURL?codeSample&desktop"><translate original="Click to learn more">Click to learn more</translate></a>
		</div>
		<div cq-phone="">
			<div><translate original="$1 Trades">$1 Trades</translate></div>
			<a target="_blank" href="https://yourURL?codeSample&mobile"><translate original="Click to learn more">Click to learn more</translate></a>
		</div>
	</div>
</cq-advertisement>
	 *
	 */
	var Advertisement = {
		prototype: Object.create(CIQ.UI.ModalTag)
	};

	Advertisement.prototype.attachedCallback=function(){
		if(this.attached) return;
		CIQ.UI.ModalTag.attachedCallback.apply(this);
		this.nameValueStore=new CIQ.NameValueStore();
		this.attached=true;
	};

	/**
	 * Sets the sleep time for this amount of time before re-displaying
	 * @param  {Number} units    Units
	 * @param  {string} unitType Unit type. Value values "minute","hour","day","week"
	 * @alias setSleepAmount
	 * @memberof WebComponents.cq-advertisement
	 */
	Advertisement.prototype.setSleepAmount=function(units, unitType){
		this.sleepAmount={
			units: units,
			unitType: unitType
		};
	};

	Advertisement.prototype.setNameValueStore=function(nameValueStore){
		this.nameValueStore=nameValueStore;
	};

	Advertisement.prototype.makeMarker=function(){
		if(this.markerExists) return;
		new CIQ.Marker({
			stx: this.context.stx,
			xPositioner: "none",
			label: "advertisement",
			permanent: true,
			node: this.node[0]
		});
		this.markerExists=true;
	};

	/**
	 * Show the advertisement. This should be a div inside of the web component.
	 * @param  {Selector} [selector]    A selector. If none specified then the first div will be selected.
	 * @param  {Boolean} [ignoreSleep=false] If true then ignore sleep
	 * @alias show
	 * @memberof WebComponents.cq-advertisement
	 */
	Advertisement.prototype.show=function(selector, ignoreSleep){
		if(this.selector){
			var priorContent=this.node.find(this.selector);
			priorContent.removeClass("ciq-show");
		}
		this.selector=selector;
		if(!this.selector){
			var div=this.node.find("div:first-of-type");
			this.selector="." +  div.attr("class");
		}
		this.ignoreSleep=ignoreSleep;
		var self=this;
		function doIt(){
			self.makeMarker();
			self.node.css({"display":"block"});
			var content=self.node.find(self.selector);
			content.addClass("ciq-show");

			// resize content
			self.node.css({height:"0px"});
			setTimeout(function(){
				self.node.css({height:self.node[0].scrollHeight+"px"});
			},0);

		}
		if(!ignoreSleep){
			this.nameValueStore.get("cq-advertisement", function(err, ls){
				if(err) return;
				if(!ls || typeof(ls)!="object") ls={};
				var ms=ls[self.selector];
				if(ms && ms>Date.now()) return; // still surpressed
				doIt();
			});
		}else{
			doIt();
		}
	};

	/**
	 * Hides the advertisement and surpresses it for 24 hours by storing it in local storage.
	 * If the selector itself changes however then the ad will reappear.
	 * @alias close
	 * @memberof WebComponents.cq-advertisement
	 */
	Advertisement.prototype.close=function(){
		this.node.css({"display":"none"});
		var self=this;
		this.nameValueStore.get("cq-advertisement", function(err, ls){
			if(err) return;
			var future=new Date();
			if(!self.sleepAmount) self.sleepAmount={units:1,unitType:"day"};
			var u=self.sleepAmount.units;
			var ut=self.sleepAmount.unitType;
			if(ut=="minute") future.setMinutes(future.getMinutes()+u);
			else if(ut=="hour") future.setHours(future.getHours()+u);
			else if(ut=="day") future.setDate(future.getDate()+u);
			else if(ut=="week") future.setDate(future.getDate()+(u*7));
			else if(ut=="month") future.setMonth(future.getMonth()+u);
			var ms=future.getTime();
			if(!ls || typeof(ls)!="object") ls={};
			ls[self.selector]=ms;
			self.nameValueStore.set("cq-advertisement", ls);
		});
	};

	/**
	 * Call this to force the advertisement to monitor the nameValueStore for updates. It will do this by
	 * polling. This is useful when running in multiple windows, do that if the advertisement is closed in one
	 * window then it will automatically close in the other windows.
	 * @param {Number} [ms=1000] Number of milliseconds to poll.
	 * @alias watchForRemoteClose
	 * @memberof WebComponents.cq-advertisement.prototype
	 */
	Advertisement.prototype.watchForRemoteClose=function(ms){
		if(!ms) ms=1000;
		var self=this;
		setInterval(function(){
			if(self.node.css("display")=="none") return; // already closed, do nothing
			self.nameValueStore.get("cq-advertisement", function(err,ls){
				if(err) return;
				if(!ls || typeof(ls)!="object") ls={};
				var ms=ls[self.selector];
				if(ms && ms>Date.now())
					self.close();
			});
		},ms);
	};

	CIQ.UI.Advertisement=document.registerElement("cq-advertisement", Advertisement);

	



	/**
	 * Attribution web component `<cq-attribution>`.
	 *
	 * This will put a node inside a panel to attribute the data.
	 * Both the main chart panel (for quotes) and a study panel can use an attribution.
	 *
	 * @namespace WebComponents.cq-attribution
	 * @since 2016-07-16
	 * @example
	 * <cq-attribution>
	 * 	<template>
	 * 		<cq-attrib-container>
	 * 			<cq-attrib-source></cq-attrib-source>
	 * 			<cq-attrib-quote-type></cq-attrib-quote-type>
	 * 		</cq-attrib-container>
	 * 	</template>
	 * </cq-attribution>
	 */
	var Attribution = {
		prototype: Object.create(CIQ.UI.ModalTag)
	};

	Attribution.prototype.insert=function(stx,panel){
		var attrib=CIQ.UI.makeFromTemplate(this.template);
		new CIQ.Marker({
			stx: stx,
			node: attrib[0],
			xPositioner: "none",
			yPositioner: "none",
			label: "attribution",
			panelName: panel
		});
		return attrib;
	};

	Attribution.prototype.attachedCallback=function(){
		if(this.attached) return;
		CIQ.UI.ModalTag.attachedCallback.apply(this);
		this.attached=true;
	};

	Attribution.prototype.setContext=function(context){
		this.template=this.node.find("template");
		var chartAttrib=this.insert(context.stx,"chart");
		var self=this;
		this.addInjection("append", "createDataSet", function(){
			var source, exchange;
			if(this.chart.attribution){
				source=self.messages.sources[this.chart.attribution.source];
				exchange=self.messages.exchanges[this.chart.attribution.exchange];
				if(!source) source="";
				if(!exchange) exchange="";
				if(source+exchange!=chartAttrib.attr("lastAttrib")){
					chartAttrib.find("cq-attrib-source").html(source);
					chartAttrib.find("cq-attrib-quote-type").html(exchange);
					CIQ.I18N.translateUI(null,chartAttrib[0]);
					chartAttrib.attr("lastAttrib",source+exchange);
				}
			}
			outer:
			for(var study in this.layout.studies){
				var type=this.layout.studies[study].type;
				if(self.messages.sources[type]){
					for(var i=0;i<this.markers.attribution.length;i++){
						if(this.markers.attribution[i].params.panelName==this.layout.studies[study].panel) continue outer;
					}
					if(!this.panels[study]) continue;
					source=self.messages.sources[type];
					exchange=self.messages.exchanges[type];
					if(!source) source="";
					if(!exchange) exchange="";
					var attrib=self.insert(this,study);
					attrib.find("cq-attrib-source").html(source);
					attrib.find("cq-attrib-quote-type").html(exchange);
					CIQ.I18N.translateUI(null,attrib[0]);
				}
			}
		});
	};

	/**
	 * Here is where the messages go.  This could be supplemented, overridden, etc. by the developer.
	 * The sources contain properties whose values which go into <cq-attrib-source>.
	 * The exchanges contain properties whose values which go into <cq-attrib-quote-type>.
	 *
	 * For quotes, the sources would match the quote source.  For a study, it would match the study type.
	 * If there is no matching property, the appropriate component will have no text.
	 * @alias messages
	 * @memberof WebComponents.cq-attribution
	 */
	Attribution.prototype.messages={
		"sources":{
			"simulator" : "Simulated data.",
			"demo": "Demo data.",
			"xignite": "<a target=\"_blank\" href=\"https://www.xignite.com\">Market Data</a> by Xignite.",
			"fis_mm": "<a target=\"_blank\" href=\"https://www.fisglobal.com/\">Market Data</a> by FIS MarketMap.",
			"Twiggs": "Formula courtesy <a target=\"_blank\" href=\"https://www.incrediblecharts.com/indicators/twiggs_money_flow.php\">IncredibleCharts</a>."
		},
		"exchanges":{
			"RANDOM": "Data is randomized.",
			"REAL-TIME": "Data is real-time.",
			"DELAYED": "Data delayed 15 min.",
			"BATS": "BATS BZX real-time.",
			"EOD": "End of day data."
		}
	};

	CIQ.UI.Attribution=document.registerElement("cq-attribution", Attribution);

	



	/**
	 * Chart Title web component `<cq-chart-title>`.
	 *
	 * Note, if the `cq-marker` is added to the element, and it is placed within the
	 * chartArea, the element will sit above the chart bars.
	 *
	 * `<cq-symbol></cq-symbol>` will display the raw symbol for the chart (`chart.symbol`).<br>
	 * `<cq-symbol-description></cq-symbol-description>` will display the `chart.symbolDisplay`. See {@link CIQ.ChartEngine.Chart#symbolDisplay} for details on how to set this value.
	 *
	 * Set attribute "cq-browser-tab" to true in order to get the stock symbol and latest price to update in the browser tab.
	 *
	 * Set member previousClose to the prior day's closing price in order to calculate and display change.
	 * If previousClose is not set, then iqPrevClose from the dataSet will be the default
	 *
	 * @namespace WebComponents.cq-chart-title
	 * @since 06-15-16
	 * @example
	 * <cq-chart-title>
	 * 	<cq-symbol></cq-symbol>
	 * 	<cq-chart-price>
	 * 		<cq-current-price></cq-current-price>
	 * 		<cq-change>
	 * 			<div class="ico"></div> <cq-todays-change></cq-todays-change> (<cq-todays-change-pct></cq-todays-change-pct>)
	 * 		</cq-change>
	 * 	</cq-chart-price>
	 * </cq-chart-title>
	 *
	 * @example
	 * //You can set a more descriptive name by using http://documentation.chartiq.com/CIQ.ChartEngine.Chart.html#symbolDisplay
	 * // and then enabling that on the tile.
	 *
	 * //In your HTML file look for:
	 * <cq-symbol></cq-symbol>
	 * //and replace it with :
	 * <cq-symbol-description></cq-symbol-description>
	 *
	 * //In your quote feed add the following line:
	 * params.stx.chart.symbolDisplay=response.fullName;
	 *
	 * //Like so:
	 * quotefeed.fetchInitialData=function (symbol, suggestedStartDate, suggestedEndDate, params, cb) {
	 *  var queryUrl = this.url; // using filter:true for after hours
	 *
	 *  CIQ.postAjax(queryUrl, null, function(status, response){
	 *   // process the HTTP response from the datafeed
	 *   if(status==200){ // if successful response from datafeed
	 *    params.stx.chart.symbolDisplay=response.fullName; //<<<<<<<<<<<<<<<================
	 *    var newQuotes = quotefeed.formatChartData(response);
	 *    cb({quotes:newQuotes, moreAvailable:true, attribution:{source:"simulator", exchange:"RANDOM"}}); // return the fetched data; init moreAvailable to enable pagination
	 *   } else { // else error response from datafeed
	 *    cb({error:(response?response:status)});	// specify error in callback
	 *   }
	 *  });
	 * };
	 * @since  4.0.0
	 * Browser tab now updates with stock symbol and latest price using cq-browser-tab attribute
	 */
	var ChartTitle = {
		prototype: Object.create(CIQ.UI.ModalTag)
	};

	ChartTitle.prototype.attachedCallback=function(){
		if(this.attached) return;
		CIQ.UI.ModalTag.attachedCallback.apply(this);
		this.attached=true;
	};

	ChartTitle.prototype.setContext=function(context){
		var self = this;
		CIQ.UI.observe({
			obj:self.context.stx.chart,
			member: "symbolObject",
			action:"callback",
			value:function(){
				if(self.context.stx.currentQuote()) self.previousClose = self.context.stx.currentQuote().iqPrevClose;
			}
		});
		this.initialize();
	};


	/**
	 * Begins the Title helper. This observes the chart and updates the title elements as necessary.
	 * @alias begin
	 * @memberof WebComponents.cq-chart-title
	 */
	ChartTitle.prototype.begin=function(){
		var self=this;
		this.addInjection("append", "createDataSet", function(){
			self.update();
		});
		this.update();
	};

	ChartTitle.prototype.initialize=function(params){
		this.params=params?params:{};
		if(typeof this.params.autoStart=="undefined") this.params.autoStart=true;
		this.marker=null;

		if(this.params.autoStart) this.begin();
	};

	/**
	 * Keep this value up to date in order to calculate change from yesterday's close
	 * @type {Float}
	 * @alias previousClose
	 * @memberof WebComponents.cq-chart-title
	 */
	ChartTitle.prototype.previousClose=null;

	/**
	 * Updates the values in the node
	 * @alias update
	 * @memberof WebComponents.cq-chart-title
	 */
	ChartTitle.prototype.update=function(){
		var stx=this.context.stx;

		var node=$(this);
		if(stx.chart.dataSet && stx.chart.dataSet.length) node.addClass("stx-show");
		else node.removeClass("stx-show");
		var symbolDiv=node.find("cq-symbol");
		var symbolDescriptionDiv=node.find("cq-symbol-description");
		var currentPriceDiv=node.find("cq-current-price");
		var todaysChangeDiv=node.find("cq-todays-change");
		var todaysChangePctDiv=node.find("cq-todays-change-pct");
		var chartPriceDiv=node.find("cq-chart-price");
		var changeDiv=node.find("cq-change");
		var doUpdateBrowserTab=this.node.truthyAttr("cq-browser-tab");
		var doUpdatePrice=chartPriceDiv.length;
		var symbol=stx.chart.symbol, symbolDisplay=stx.chart.symbolDisplay;
		var internationalizer=stx.internationalizer;
		var priceChanged=false;

		symbolDiv.textBetter(symbol);

		if(stx.isHistoricalModeSet){
			currentPriceDiv.textBetter("");
			changeDiv.css({"display":"none"});
			// only change the display so that you don't wreck the line spacing and parens
			return;
		}

		var todaysChange="", todaysChangePct=0, todaysChangeDisplay="", currentPrice="";
		var currentQuote=stx.currentQuote();
		currentPrice=currentQuote?currentQuote.Close:"";
		if(currentPrice && doUpdatePrice){
			var oldPrice=parseFloat(currentPriceDiv.text());
			if(currentPriceDiv.textBetter(stx.formatYAxisPrice(currentPrice, stx.chart.panel))){
				priceChanged=true;
				if(typeof(currentPriceDiv.attr("cq-animate"))!="undefined"){
					CIQ.UI.animatePrice(currentPriceDiv, currentPrice, oldPrice);
				}
			}
		}

		symbolDescriptionDiv.textBetter(symbolDisplay?symbolDisplay:symbol);

		if((doUpdatePrice || doUpdateBrowserTab) && symbol && priceChanged){
			// Default to iqPrevClose if the developer hasn't set this.previousClose
			var previousClose = this.previousClose?this.previousClose: (currentQuote ? currentQuote.iqPrevClose : null);

			if(currentQuote && previousClose){
				todaysChange=CIQ.fixPrice(currentQuote.Close-previousClose);
				todaysChangePct=todaysChange/previousClose*100;
				if(internationalizer){
					todaysChangeDisplay=internationalizer.percent2.format(todaysChangePct/100);
				}else{
					todaysChangeDisplay=todaysChangePct.toFixed(2) + "%";
				}
				changeDiv.css({"display":"block"});
			}else{
				changeDiv.css({"display":"none"});
			}
			var todaysChangeAbs=Math.abs(todaysChange);
			if(todaysChangeAbs){
				todaysChangeDiv.textBetter(stx.formatYAxisPrice(todaysChangeAbs, stx.chart.panel));
			}
			todaysChangePctDiv.textBetter(todaysChangeDisplay);
			if(todaysChangeDisplay!=="" && todaysChangePct>0){
				chartPriceDiv.removeClass("stx-down").addClass("stx-up");
			}else if(todaysChangeDisplay!=="" && todaysChangePct<0){
				chartPriceDiv.removeClass("stx-up").addClass("stx-down");
			}else{
				chartPriceDiv.removeClass("stx-down").removeClass("stx-up");
			}

			// These strange characters create some spacing so that the title appears
			// correctly in a browser tab
			this.title=symbol + " \u200b \u200b " + currentPrice + " \u200b \u200b \u200b ";
			if(todaysChangePct>0){
				this.title+="\u25b2 " + todaysChangeAbs;
			}else if(todaysChangePct<0){
				this.title+="\u25bc " + todaysChangeAbs;
			}
			if(doUpdateBrowserTab){
				document.title=this.title;
			}
		}
	};

	CIQ.UI.ChartTitle=document.registerElement("cq-chart-title", ChartTitle);

	



	/**
	 * clickable web component `<cq-clickable>`. When tapped/clicked this component can run a method on any
	 * other component. Set cq-selector attribute to a selector for the other component. Set cq-method
	 * to the method to run on that component. The parameter to the method will be an object that contains
	 * the context for this clickable (if available) and a reference to this button ("caller").
	 *
	 * @namespace WebComponents.cq-clickable
	 * @example
	 * <cq-clickable cq-selector="cq-sample-dialog" cq-method="open">Settings</span></cq-clickable>
	 * runs
	 * $("cq-sample-dialog")[0].open({context: this.context, caller: this});
	 * @since 3.0.9
	 */

	var Clickable = {
		prototype: Object.create(CIQ.UI.ContextTag)
	};

	Clickable.prototype.createdCallback=function(){
		CIQ.UI.ContextTag.createdCallback.apply(this);
	};

	Clickable.prototype.attachedCallback=function(){
		if(this.attached) return;
		CIQ.UI.ContextTag.attachedCallback.apply(this);
		this.attached=true;
		var self=this;
		
		$(this).stxtap(function() {
			self.runMethod();
		});
	};

	/**
	 * Runs the clickable
	 * @memberof WebComponents.cq-theme-dialog
	 */
	Clickable.prototype.runMethod=function() {
		var selector=this.node.attr("cq-selector");
		var method=this.node.attr("cq-method");

		var clickable=this;
		$(selector).each(function(){
			if(this[method]) this[method].call(this, {context:clickable.context, caller: clickable});
		});
	};

	CIQ.UI.Clickable=document.registerElement("cq-clickable", Clickable);

	



	var Close = {
		prototype: Object.create(CIQ.UI.BaseComponent)
	};
	/**
	 * Close web component `<cq-close>`.
	 *
	 * cq-close web component will close it's containing (parent or up) component
	 * by calling its close() method
	 * @namespace WebComponents.cq-close
	 * @example
	 * <cq-item>
	 * 		<cq-label></cq-label>
	 * 		<cq-close></cq-close>
	 * </cq-item>
	 *
	 */
	Close.prototype.attachedCallback=function(){
		if(this.attached) return;
		var self=this;
		function closure(){
			self.tap();
		}
		$(this).stxtap(closure);
		CIQ.UI.BaseComponent.attachedCallback.apply(this);
		this.attached=true;
	};
	/**
	 * @alias tap
	 * @memberof WebComponents.cq-close
   */
	Close.prototype.tap=function(){
		CIQ.UI.containerExecute(this, "close");
	};

	CIQ.UI.Close=document.registerElement("cq-close", Close);

	



	/**
	 * Symbol comparison component `<cq-comparison>`.
	 *
	 * Add attribute cq-marker in order to have the component insert itself as a marker on the chart
	 *
	 * @namespace WebComponents.cq-comparison
	 * @example
<cq-comparison cq-marker>
	<cq-menu class="cq-comparison-new">
		<cq-comparison-add-label>
			<cq-comparison-plus></cq-comparison-plus><span>Compare</span><span>...</span>
		</cq-comparison-add-label>
		<cq-comparison-add>
			<cq-comparison-lookup-frame>
				<cq-lookup cq-keystroke-claim>
					<cq-lookup-input cq-no-close>
						<input type="text" cq-focus spellcheck="off" autocomplete="off" autocorrect="off" autocapitalize="off" placeholder="Enter Symbol">
						<cq-lookup-icon></cq-lookup-icon>
					</cq-lookup-input>
					<cq-lookup-results>
						<cq-lookup-filters cq-no-close>
							<cq-filter class="true">ALL</cq-filter>
							<cq-filter>STOCKS</cq-filter>
							<cq-filter>FX</cq-filter>
							<cq-filter>INDEXES</cq-filter>
							<cq-filter>FUNDS</cq-filter>
							<cq-filter>FUTURES</cq-filter>
						</cq-lookup-filters>
						<cq-scroll></cq-scroll>
					</cq-lookup-results>
				</cq-lookup>
			</cq-comparison-lookup-frame>
			<cq-swatch cq-no-close></cq-swatch>
			<span><cq-accept-btn class="stx-btn">ADD</cq-accept-btn></span>
		</cq-comparison-add>
	</cq-menu>
	<cq-comparison-key>
		<template cq-comparison-item>
			<cq-comparison-item>
				<cq-comparison-swatch></cq-comparison-swatch>
				<cq-comparison-label>AAPL</cq-comparison-label>
				<!-- cq-comparison-price displays the current price with color animation -->
				<cq-comparison-price cq-animate></cq-comparison-price>
				<!-- cq-comparison-tick-price displays the price for the active crosshair item -->
				<!-- <cq-comparison-tick-price></cq-comparison-tick-price>	-->
				<cq-comparison-loader></cq-comparison-loader>
				<div class="stx-btn-ico ciq-close"></div>
			</cq-comparison-item>
		</template>
	</cq-comparison-key>
</cq-comparison>
	 */
	var Comparison = {
		prototype: Object.create(CIQ.UI.ModalTag)
	};


	Comparison.prototype.attachedCallback=function(){
		if(this.attached) return;
		CIQ.UI.ModalTag.attachedCallback.apply(this);
		this.attached=true;
		this.swatchColors=["#8ec648", "#00afed",  "#ee652e", "#912a8e", "#fff126",
		"#e9088c", "#ea1d2c", "#00a553", "#00a99c",  "#0056a4", "#f4932f", "#0073ba", "#66308f", "#323390", ];
		this.loading=[];
	};
	/**
	 * Handles removing a series from the comparison.
	 * @param {string} symbol Name of series as a string.
	 * @param {object}  series Object containing info on series.
	 * @alias removeSeries
	 * @memberof WebComponents.cq-comparison
	 */
	Comparison.prototype.removeSeries=function(symbol, series){
		//console.log(typeof symbol, symbol);
		//console.log(typeof series, series);
		this.context.stx.removeSeries(symbol);
	};

	/**
	 * Picks a color to display the new comparison as.
	 * Loops through preset colors and picks the next one on the list.
	 * If the all colors are taken then the last color will be repeated.
	 * @alias pickSwatchColor
	 * @memberof WebComponents.cq-comparison
	 */
	Comparison.prototype.pickSwatchColor=function(){
		var node=$(this);
		var stx=this.context.stx;
		var swatch=node.find("cq-swatch");
		if(!swatch.length) return;
		var currentColor=swatch[0].style.backgroundColor;

		var usedColors={};
		for(var s in stx.chart.series){
			var series=stx.chart.series[s];
			if(!series.parameters.isComparison) continue;
			usedColors[series.parameters.color]=true;
		}

		if(currentColor!=="" && !usedColors[currentColor]) return; // Currently picked color not in use then allow it
		for(var i=0;i<this.swatchColors.length;i++){ // find first unused color from available colors
			if(!usedColors[this.swatchColors[i]]){
				swatch[0].style.backgroundColor=this.swatchColors[i];
				return;
			}
		}
		//Uh oh, all colors take. Last color will keep getting used.
	};

	/**
	 * The legend gets re-rendered whenever we createDataSet() (wherein the series may have changed).
	 * We re-render the entire thing each time, but we use a virtual DOM to determine whether
	 * to actually change anything on the screen (so as to avoid unnecessary flickering)
	 * @alias renderLegend
	 * @memberof WebComponents.cq-comparison
	 */
	Comparison.prototype.renderLegend=function(){
		var node=$(this);
		var key=node.find("cq-comparison-key").cqvirtual();
		var stx=this.context.stx;
		var q=stx.currentQuote();
		for(var s in stx.chart.series){
			var series=stx.chart.series[s];
			if(!series.parameters.isComparison) continue;
			var frag=CIQ.UI.makeFromTemplate(this.template);
			var swatch=frag.find("cq-comparison-swatch");
			var label=frag.find("cq-comparison-label");
			var description=frag.find("cq-comparison-description");
			var price=frag.find("cq-comparison-price");
			var loader=frag.find("cq-comparison-loader");
			var btn=frag.find(".ciq-close");
			swatch.css({"background-color": series.parameters.color});
			label.text(stx.translateIf(series.display));
			description.text(stx.translateIf(series.description));
			frag.attr("cq-symbol", s);

			var symbol=series.parameters.symbol;
			if(price.length && q && symbol!==null){
				var qSymbol=q[symbol];
				if(typeof qSymbol==="object") qSymbol=q[symbol].Close;
				price.text(stx.padOutPrice(qSymbol));
			}

			if(this.loading[series.parameters.symbolObject.symbol]) loader.addClass("stx-show");
			else loader.removeClass("stx-show");
			if(series.parameters.error) frag.attr("cq-error", true);
			if(series.parameters.permanent) btn.hide();
			else{
				btn.stxtap(function(self, s, series){ return function(){
					self.nomore=true;
					if(!series.parameters.permanent) self.removeSeries(s, series);
					self.modalEnd(); // tricky, we miss mouseout events when we remove items from under ourselves
				};}(this, s, series));
			}
			key.append(frag);
		}
		key.cqrender();
		this.pickSwatchColor();
	};

	/**
	 * Loops thru `stxx.chart.series` to update the current price of all comparisons.
	 * @alias updatePrices
	 * @memberof WebComponents.cq-comparison
	 */
	Comparison.prototype.updatePrices=function(){
		var key; // lazy eval this to prevent jquery work when no comparisons exist
		var stx=this.context.stx;
		var historical=stx.isHistoricalModeSet;
		var q=stx.currentQuote();
		if(q) {
			for(var s in stx.chart.series){
				if(!key) key=this.node.find("cq-comparison-key");
				var price=key.find('cq-comparison-item[cq-symbol="' + s + '"] cq-comparison-price');
				if(price.length){
					var oldPrice=parseFloat(price.text());
					var symbol=stx.chart.series[s].parameters.symbol;
					var newPrice=q[symbol];
					if(newPrice && (newPrice.Close || newPrice.Close===0)) newPrice=newPrice.Close;
					if (!newPrice && newPrice!==0 && stx.chart.series[s].lastQuote)
						newPrice=stx.chart.series[s].lastQuote.Close;
					price.text(stx.padOutPrice(historical?"":newPrice));
					if(historical) return;
					if(typeof(price.attr("cq-animate"))!="undefined")
						CIQ.UI.animatePrice(price, newPrice, oldPrice);
				}
			}
		}
	};

	/**
	 * Adds an injection to the ChartEngine that tracks the price of Comparisons.
	 * @param {number} updatePrices
	 * @alias startPriceTracker
	 * @memberof WebComponents.cq-comparison
	 */
	Comparison.prototype.startPriceTracker=function(updatePrices){
		var self=this;
		this.addInjection("append", "createDataSet", function(){
			if(updatePrices) self.updatePrices();
			if(this.chart.dataSet && this.chart.dataSet.length) self.node.attrBetter("cq-show");
			else self.node.removeAttrBetter("cq-show");
		});
	};

	Comparison.prototype.position=function(){
		var stx=this.context.stx;
		var bar=stx.barFromPixel(stx.cx);
		this.tick=stx.tickFromPixel(stx.cx);
		var prices=stx.chart.xaxis[bar];
		var self=this;

		function printValues(){
			var key;
			self.timeout=null;
			for(var s in stx.chart.series){
				if(!key) key=self.node.find("cq-comparison-key");
				var price=key.find('cq-comparison-item[cq-symbol="' + s + '"] cq-comparison-tick-price');
				price.textBetter("");
				if(price.length && prices && prices.data){
					var symbol=stx.chart.series[s].parameters.symbol;
					price.textBetter(stx.padOutPrice(prices.data[symbol]));
					var pdSymbol=prices.data[symbol];
					if(pdSymbol!==null){
						if (typeof pdSymbol==="object")pdSymbol=pdSymbol.Close;
						price.textBetter(stx.padOutPrice(pdSymbol));
					}
				}
			}
		}
		if(this.tick!=this.prevTick){
			if(this.timeout) clearTimeout(this.timeout);
			var ms=0; // IE and FF struggle to keep up with the dynamic head's up.
			this.timeout=setTimeout(printValues, ms);
		}
		this.prevTick=this.tick; // We don't want to update the dom every pixel, just when we cross into a new candle
	};

	Comparison.prototype.startTickPriceTracker=function(){
		this.prevTick=null;
		this.addInjection("prepend","headsUpHR", function(self){ return function(){self.position();};}(this));
	};

	Comparison.prototype.setContext=function(context){
		var chart=this.context.stx.chart;
		this.node.attr("cq-show","true");
		// if attribute cq-marker then detach and put ourselves in the chart holder
		this.configureUI();
		var self=this;
		CIQ.UI.observe({
			obj: chart.series,
			action: "callback",
			value:function(){self.renderLegend();}
		});
		this.context.stx.append("modifySeries", function(){self.renderLegend();});
		var frag=CIQ.UI.makeFromTemplate(this.template);
		this.startPriceTracker(frag.find("cq-comparison-price").length);
		if(frag.find("cq-comparison-tick-price")){
			this.startTickPriceTracker();
		}
	};

	/**
	 * Fires whenever a new security is added as a comparison.
	 * Handles all the necessary events to update the chart with the new comparison.
	 * @param {object} context `CIQ.UI.Context` The context of the chart.
	 * @param {object} obj The object holding info on a security.
	 * @alias selectItem
	 * @memberof WebComponents.cq-comparison
	 */
	Comparison.prototype.selectItem=function(context, obj){
		var self=this;
		function cb(err, series){
			if(err){
				series.parameters.error=true;
			}
			self.loading[series.parameters.symbolObject.symbol]=false;
			self.renderLegend();
		}
		var swatch=this.node.find("cq-swatch");
		var color="auto", pattern=null, width=1;
		if(swatch[0]){
			var style=swatch[0].style;
			color=style.backgroundColor;
			//TODO: need a UI to grab pattern and width from, for now use the existing swatch
			pattern=style.borderTopStyle;
			width=style.width || 1;
		}
		var stx=context.stx;
		this.loading[obj.symbol]=true;
		var params={
			name: "_generic_series",
			symbolObject: obj,
			isComparison: true,
			color: color,
			pattern: pattern,
			width: width || 1,
			data: {useDefaultQuoteFeed: true},
			forceData:true
		};

		// don't allow symbol if same as main chart, comparison already exists, or just white space
		var exists=stx.getSeries({symbolObject: obj});
		for(var i=0;i<exists.length;i++)
			if(exists[i].parameters.isComparison) return;

		// don't allow symbol if same as main chart or just white space
		if (context.stx.chart.symbol.toLowerCase() !== obj.symbol.toLowerCase() &&
				obj.symbol.trim().length > 0) {
			stx.addSeries(obj.symbol, params, cb);
		}
	};

	/**
	 * Initializes all the children UI elements that make up `<cq-comparison>`.
	 * @alias configureUI
	 * @memberof WebComponents.cq-comparison
	 */
	Comparison.prototype.configureUI=function(){
		var node=this.node;
		var addNew=node.find("cq-accept-btn");
		this.template=node.find("*[cq-comparison-item]");
		var swatchColors=node.find("cq-swatch").attr("cq-colors");
		if(swatchColors) this.swatchColors=swatchColors.split(",");
		for(var i=0;i<this.swatchColors.length;i++){
			this.swatchColors[i]=CIQ.convertToNativeColor(this.swatchColors[i]);
		}
		var lookup=node.find("cq-lookup");
		if(lookup.length) lookup[0].setCallback(function(self){return function(){self.selectItem.apply(self, arguments);};}(this));
		addNew.stxtap(function(e){
			lookup[0].forceInput();
			e.stopPropagation();
		});
		var input=node.find("input");
		input.stxtap(function(){
			this.focus();
		});
	};

	CIQ.UI.Comparison=document.registerElement("cq-comparison", Comparison);

	



	/**
	 * fibonacci settings dialog web component `<cq-fib-settings-dialog>`.
	 * 
	 * @namespace WebComponents.cq-fib-settings-dialog
	 * @example
	  <cq-dialog>
	  	<cq-fib-settings-dialog>
	  		<h4 class="title">Settings</h4>
	  		<cq-scroll cq-no-maximize>
	  			<cq-fibonacci-settings>
	  				<template cq-fibonacci-setting>
	  					<cq-fibonacci-setting>
	  						<div class="ciq-heading"></div>
	  						<div class="stx-data"></div>
	  					</cq-fibonacci-setting>
	  				</template>
	  			</cq-fibonacci-settings>
	  		</cq-scroll>
	  		<div class="ciq-dialog-cntrls">
	  			<div class="ciq-btn" stxtap="close()">Done</div>
	  		</div>
	  	</cq-fib-settings-dialog>
	  </cq-dialog>
	 * @since 3.0.9
	 */

	var FibSettingsDialog = {
		prototype: Object.create(CIQ.UI.DialogContentTag)
	};

	/**
	 * Adds a custom fib level
	 * @memberOf WebComponents.cq-fib-settings-dialog
	 * @since 5.2.0
	 */
	
	FibSettingsDialog.prototype.add=function(){
		var level=$(this).find("[cq-custom-fibonacci-setting] input").val();
		if(!level) return;
		level=parseFloat(level)/100;
		if(isNaN(level)) return;
		var defaultFibs = this.context.stx.currentVectorParameters.fibonacci.fibs || [];
		var fib, newFib;
		for (var index = 0; index < defaultFibs.length; index++) {
			fib = defaultFibs[index];
			if(fib.level>level){
				newFib=CIQ.clone(fib);
				newFib.level=level;
				newFib.display=true;
				defaultFibs.splice(index,0,newFib);
				break;
			}
		}
		if(!newFib){
			if(defaultFibs.length) fib=CIQ.clone(defaultFibs[0]);
			else fib={color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}};
			newFib=CIQ.clone(fib);
			newFib.level=level;
			newFib.display=true;
			defaultFibs.push(newFib);				
		}
		this.open();
	};
	
	/**
	 * Sets up a handler to process changes to fields
	 * @param {HTMLElement} node    The input field
	 * @param {string} section The section that is being updated
	 * @param {string} name    The name of the field being updated
	 * @memberOf WebComponents.cq-fib-settings-dialog
	 * @private
	 */
	
	FibSettingsDialog.prototype.setChangeEvent=function(node, section, item){
		var self=this;
		function closure(){
			return function(){
				var vectorParameters = self.context.stx.currentVectorParameters;
				var vectorType = vectorParameters.vectorType;

				// fibonacci type
				if(vectorParameters.fibonacci && vectorType!="fibtimezone") {
					var defaultFibs = vectorParameters.fibonacci.fibs || [];
					if(this.type=="checkbox"){
						for (var index = 0; index < defaultFibs.length; index++) {
							var fib = defaultFibs[index];

							if(fib.level === item) {
								fib.display = this.checked ? true : false;
							}
						}
					}
				}
			};
		}
		node.change(closure());
	};

	/**
	 * Opens the cq-fib-settings-dialog
	 * @param  {Object} params Parameters
	 * @memberOf WebComponents.cq-fib-settings-dialog
	 */
	
	FibSettingsDialog.prototype.open=function(params){
		CIQ.UI.DialogContentTag.open.apply(this, arguments);
		var vectorParameters = this.context.stx.currentVectorParameters;
		var vectorType = vectorParameters.vectorType;
		var dialog=$(this);

		// fibonacci type
		var parameters;
		if(vectorParameters.fibonacci && vectorType!="fibtimezone") {
			dialog.find(".title").text("Fibonacci Settings");
			var defaultFibs = vectorParameters.fibonacci.fibs || [];
			parameters=dialog.find("cq-fibonacci-settings");
			parameters.emptyExceptTemplate();

			for (var index = 0; index < defaultFibs.length; index++) {
				var fib = defaultFibs[index];

				// no negative values for fibonacci arc
				if(vectorType === 'fibarc' && fib.level < 0) continue;

				var newParam=CIQ.UI.makeFromTemplate(this.node.find("template"), parameters);
				var convertPercent = fib.level * 100;
				newParam.find(".ciq-heading").text(convertPercent.toFixed(1) + '%');
				var paramInput = newParam.find("input");

				if(fib.display) {
					paramInput.prop("checked", true);
				}

				this.setChangeEvent(paramInput, "fib", fib.level);
				newParam.find(".stx-data").append(paramInput);
			}
		} 
		// settings dialog default
		else {
			dialog.find(".title").text("Settings");

			// clear the existing web components
			parameters=dialog.find("cq-fibonacci-settings");
			parameters.emptyExceptTemplate();
		}
		$(this).find("[cq-custom-fibonacci-setting] input").val("");
	};

	CIQ.UI.FibSettingsDialog=document.registerElement("cq-fib-settings-dialog", FibSettingsDialog);

	



	/**
	 * Language Dialog web component `<cq-language-dialog>`. This creates a dialog that the user can use to change the language.
	 *
	 * The actual language choices are obtained from {@link CIQ.I18N.languages}. Choosing a different language causes the entire
	 * UI to be translated through use of the {@link CIQ.I18N.setLanguage} method.
	 *
	 * @namespace WebComponents.cq-language-dialog
	 * @since
	 * <br>&bull; 4.0.0 New component added added.
	 * <br>&bull; 4.1.0 now it calls {@link CIQ.I18N.localize} instead of {@link CIQ.I18N.setLocale}
	 * @example
	 <cq-dialog>
	 	<cq-language-dialog>
	 	</cq-language-dialog>
	 </cq-dialog>
	 */
	var LanguageDialog = {
		prototype: Object.create(CIQ.UI.DialogContentTag)
	};

	/**
	 * Opens the nearest {@link WebComponents.cq-dialog} to display your dialog.
	 * @alias open
	 * @memberof WebComponents.cq-share-dialog
	 * @since 4.0.0
	 */
	LanguageDialog.prototype.open=function(params){
		CIQ.UI.DialogContentTag.open.apply(this, arguments);
		var cqLanguages=this.node.find("cq-languages");
		cqLanguages.emptyExceptTemplate();
		var template=this.node.find("template");
		var languages=CIQ.I18N.languages;
		if(!languages) return;
		function switchToLanguage(langCode){
			return function(){
				CIQ.UI.contextsForEach(function(){
					var stx=this.stx;
					stx.preferences.language=langCode;
					stx.changeOccurred("preferences");
					CIQ.I18N.localize(stx, langCode);
					stx.draw();
				});
			};
		}
		for(var langCode in languages){
			var node=CIQ.UI.makeFromTemplate(template, cqLanguages);
			node.find("cq-language-name").text(languages[langCode]);
			node.find("cq-flag").attr("cq-lang", langCode);
			node.stxtap(switchToLanguage(langCode));
		}
	};

	/**
	 * Closes dialog box
	 * @alias close
	 * @memberof WebComponents.cq-share-dialog
	 * @since 4.0.0
	 */
	LanguageDialog.prototype.close=function(){
		$("cq-language-dialog").closest("cq-dialog,cq-menu").each(function(){
			this.close();
		});
	};

	CIQ.UI.LanguageDialog=document.registerElement("cq-language-dialog", LanguageDialog);

  


	/**
	 * Loader web component `<cq-loader>`.
	 *
	 * CSS loading icon.
	 * @namespace WebComponents.cq-loader
	 * @example
	 <cq-loader><cq-loader>
	 */
	var Loader = {
		prototype: Object.create(CIQ.UI.ContextTag)
	};

	Loader.prototype.setContext=function(context){
		this.context.setLoader(this);
	};
	/**
	 * Shows the loading icon.
	 * @alias show
	 * @memberof WebComponents.cq-loader
	 */
	Loader.prototype.show=function(){
		$(this).addClass("stx-show");
	};

	/**
	 * Hides the loading icon.
	 * @alias hide
	 * @memberof WebComponents.cq-loader
	 */
	Loader.prototype.hide=function(){
		$(this).removeClass("stx-show");
	};

	CIQ.UI.Loader=document.registerElement("cq-loader", Loader);

	



	/**
	 * Lookup component `<cq-lookup>`.
	 *
	 * Note, a {@link CIQ.ChartEngine.Driver.Lookup} must be provided.
	 * If none is provided then the default will be used which displays no results.
	 * 
	 * Use [CIQ.UI.Context.setLookupDriver](CIQ.UI.Context.html#setLookupDriver) to link the dirver to the [cq-lookup web component]{@link WebComponents.cq-lookup}
	 *
	 * Set <cq-lookup cq-uppercase> to force free form text to be converted to uppercase
	 * 
	 * To turn off the result window modify CSS  to `.stxMenuActive cq-lookup cq-menu { opacity: 0 }`
	 * 
	 * See `function startUI()` in sample-template-advanced.html for complete sample implementation.
	 *
	 * @namespace WebComponents.cq-lookup
	 * @example
<cq-lookup cq-keystroke-claim cq-keystroke-default>
	<cq-lookup-input cq-no-close>
		<input type="text" spellcheck="off" autocomplete="off" autocorrect="off" autocapitalize="off" name="symbol" placeholder="Enter Symbol">
		<cq-lookup-icon></cq-lookup-icon>
	</cq-lookup-input>
	<cq-lookup-results>
		<cq-lookup-filters cq-no-close>
			<cq-filter class="true">ALL</cq-filter>
			<cq-filter>STOCKS</cq-filter>
			<cq-filter>FX</cq-filter>
			<cq-filter>INDEXES</cq-filter>
			<cq-filter>FUNDS</cq-filter>
			<cq-filter>FUTURES</cq-filter>
		</cq-lookup-filters>
		<cq-scroll></cq-scroll>
	</cq-lookup-results>
</cq-lookup>
	 *
	 * @since  4.0.0 Added optional cq-uppercase attribute
	 */
	var Lookup = {
		prototype: Object.create(CIQ.UI.ContextTag)
	};

	Lookup.prototype.attachedCallback=function(){
		if(this.attached) return;
		this.usingEmptyDriver=false;
		CIQ.UI.ContextTag.attachedCallback.apply(this);
		this.attached=true;
		this.currentFilter=null;
		this.params={};
	};

	Lookup.prototype.setContext=function(context){
		this.initialize();
	};

	Lookup.prototype.attachDriver=function(driver){
		this.driver=driver;
	};

	/**
	 * Set a callback method for when the user selects a symbol
	 * @param {Function} cb Callback method
	 * @alias setCallback
	 * @memberof WebComponents.cq-lookup
	 */
	Lookup.prototype.setCallback=function(cb){
		this.params.cb=cb;
	};

	/**
	 * Set a {@link CIQ.ChartEngine.Driver.Lookup}. If none is set then CIQ.UI.Context.lookupDriver will be used.
	 * If none available then the input box will still be active but not present a drop down.
	 * @param {CIQ.ChartEngine.Driver.Lookup} driver The driver
	 * @alias setDriver
	 * @memberof WebComponents.cq-lookup
	 */
	Lookup.prototype.setDriver=function(driver){
		this.params.driver=driver;
	};

	Lookup.prototype.initialize=function(){
		var node=$(this);
		this.resultList=node.find("cq-scroll");

		this.input=node.find("input");
		if(!this.input.length){
			this.input=node.append($("<input type='hidden'>"));
			this.input[0].value="";
		}
		var self=this;
		this.input.on("paste", function(e){
			var input=e.target;
			setTimeout(function(){self.acceptText(input.value, self.currentFilter);},0);
		});
		var filters=node.find("cq-lookup-filters");
		if(filters){
			filters.find("cq-filter").stxtap(function() {
				filters.find("cq-filter").removeClass('true');
				var t=$(this);
				t.addClass('true');
				var translate=t.find("translate");
				if(translate.length){ // if the filter text has been translated then it will be in a <translate> tag
					self.currentFilter=translate.attr("original");
				}else{
					self.currentFilter=this.innerHTML;
				}
				self.acceptText(self.input[0].value, self.currentFilter);
			});
		}

		// default key handler
		/*new CIQ.UI.Keystroke(this.input, function(obj){
			self.keyStroke(null, obj.key, obj.e, obj.keystroke);
		});*/

		if(typeof(node.attr("cq-keystroke-claim"))!="undefined"){
			// add keyboard claim for entire body
			this.addClaim(this);
		}
	};

	/**
	 * Accepts a new symbol or symbolObject
	 * @param  {Object} data The symbol object (in a form accepted by {@link CIQ.ChartEngine#newChart})
	 * @param  {Object} params Settings to control callback action
	 * @alias selectItem
	 * @memberof WebComponents.cq-lookup
	 */
	Lookup.prototype.selectItem=function(data, params){
		if(this.params.cb){
			this.params.cb(this.context, data, params);
		}
	};

	Lookup.prototype.open=function(){
		this.node.closest("cq-dialog,cq-menu").each(function(){
			this.open();
		});
	};

	Lookup.prototype.close=function(){
		this.node.closest("cq-dialog,cq-menu").each(function(){
			this.close();
		});
	};

	Lookup.prototype.isActive=function(){
		return this.input[0].value!=="";
	};

	Lookup.prototype.acceptText=function(value, filter){
		var self=this;
		if(!this.params.driver){
			if(this.context.lookupDriver){
				this.setDriver(this.context.lookupDriver);
			}else{
				this.setDriver(new CIQ.ChartEngine.Driver.Lookup());
				this.usingEmptyDriver=true;
			}
		}
		function closure(results){
			self.results(results);
		}
		/**
		* With the decoupling of the uiHelper to the Lookup.Driver you must be sure to include both an argument for maxResults and the closure to handle the results.
		* maxResults must either be a number or a string to result in default value of 100.
		* @alias acceptText
		* @memberof WebComponents.cq-lookup
		* @since 3.0.0
		*/
		this.params.driver.acceptText(value, filter, null, closure);
	};

	Lookup.prototype.forceInput=function(){
		var input=this.input[0];
		this.selectItem({symbol:input.value});
		CIQ.blur(this.input);
		this.close();
		input.value="";
	};

	// Note that this captures keystrokes on the body. If the input box is focused then we need to allow the input box itself
	// to handle the strokes but we still want to capture them in order to display the lookup results. We first check
	// activeElement to see if the input is focused. If so then we bypass logic that manipulates the input.value. In order make
	// sure that the lookup menu is responding to an up-to-date input.value therefore we have to put all of those pieces of code
	// in setTimeout(0)
	//
	// Note that when comparisons are enabled, there are two Lookup components on the screen. Each keypress will therefore pass
	// through this function twice, once for each Lookup component. Only the active component will process the keystroke.
	Lookup.prototype.keyStroke=function(hub, key, e, keystroke){
		if(keystroke.ctrl || key == "Meta" || key == "Win") return false;
		var domChain=$(this).parents().addBack();
		var input=this.input[0];
		var result=false;
		var focused=(document.activeElement===input); // If focused then we need to allow the input box to get most keystrokes
		if(!focused && document.activeElement &&
				(document.activeElement.tagName=="INPUT" || document.activeElement.tagName=="TEXTAREA")) return false; // some other input has focus

		var iAmActive=false, iAmDisplayed=false;
		if(domChain.hasClass("stxMenuActive")){
			iAmDisplayed=true; // if my menu chain is active then I'm alive
		}
		if(focused || iAmDisplayed) iAmActive=true; // If my input is focused or I'm displayed, then I'm alive
		if(!iAmActive){ // Otherwise, I may still be alive under certain conditions
			if(typeof(this.node.attr("cq-keystroke-default"))=="undefined") return; // I'm always alive if I have default body keystrokes
			if(!iAmDisplayed && this.uiManager.topMenu()) return; // unless there's another menu active and it isn't me
		}
		if((key===" " || key==="Spacebar") && input.value===""){
			return false;
		}
		var self=this;
		if(keystroke.key && keystroke.key.length==1 && e.which>=32 && e.which<=222){
			if(!focused) input.value=input.value+keystroke.key; // Changes the <input> value when keystrokes are registered against the body.
			self.acceptText(input.value, self.currentFilter);
			result=true;
		}
		if(key=="Delete" || key=="Backspace" || key=="Del"){
			if(this.context.stx.anyHighlighted) return false;
			if(input.value.length){
				//ctrl-a or highlight all text + delete implies remove all text
				if(window.getSelection().toString()){
					input.value = "";
				} else {
					if(!focused) input.value=input.value.substring(0,input.value.length-1);
					if(input.value.length){
						self.acceptText(input.value, self.currentFilter);
					}
				}

				result=true; // only capture delete key if there was something to delete
			}
			if(key=="Backspace") result=true; // always capture backspace because otherwise chrome will navigate back
		}
		if((key==="Escape" || key==="Esc") && iAmDisplayed){
			input.value="";
			this.close();
			CIQ.blur(input);
			result=true;
		}
		if(key==="Enter" && input.value!==""){
			if(this.isActive()){
				var scrollable=this.node.find("cq-scroll");
				focused=scrollable.length && scrollable[0].focused(); // Using cursor keys to maneuver down lookup results
				if(focused && focused.selectFC){
					focused.selectFC.apply(focused, {});
				}else{
					var val=input.value;
					var toUpperCase=this.node.truthyAttr("cq-uppercase");
					if(toUpperCase) val=val.toUpperCase();
					this.selectItem({symbol:val});
				}
				CIQ.blur(this.input);
				this.close();
				input.value="";
				result=true;
			}
		}
		if(result){
			// If we're focused, then keep the lookup open unless we hit escape.
			// Otherwise, if there is no length close it (user hit "escape", "enter", or "backspace/delete" while unfocused)
			if(this.usingEmptyDriver || (!input.value.length && (key=="Escape" || key=="Esc" || key=="Enter" || !focused))){
				this.close();
			}else{
				this.open();
			}
			if(focused) return {allowDefault:true};
			return true;
		}
	};

	/**
	 * Processes an array of results returned by the {@link CIQ.ChartEngine.Driver.Lookup} and displays them.
	 * 
	 * Each element in the array will be of the following format:
	 * {
	 * 		display:["symbol-id","Symbol Description","exchange"],
	 * 		data:{
	 * 			symbol:"symbol-id",
	 * 			name:"Symbol Description",
	 * 			exchDis:"exchange"
	 * 		}
	 * }
	 *
	 * The lookup widget by default displays three columns as represented by the array. 
	 * The data object can be an format required by your QuoteFeed or it can be a simple 
	 * string if you just need to support a stock symbol.
	 * @param  {Array} arr The array of results.
	 * @alias results
	 * @memberof WebComponents.cq-lookup
	 */
	Lookup.prototype.results=function(arr){
		function closure(self, data){
			return function(e){
				CIQ.blur(self.input);
				//self.close();
				self.selectItem(data);
				self.input[0].value="";
			};
		}

		this.resultList.empty();
		for(var i=0;i<arr.length;i++){
			var item=arr[i];
			var nodeText="<cq-item>";
			for(var j=0;j<item.display.length;j++){
				nodeText+="<SPAN>" + item.display[j] + "</SPAN>";
			}
			nodeText+="</cq-item>";
			var node=$(nodeText);
			this.resultList.append(node);
			node[0].selectFC=closure(this, item.data);
			node.stxtap(node[0].selectFC);
		}
		var scrollable=this.node.find("cq-scroll");
		if(scrollable.length) scrollable[0].top();
	};

	CIQ.UI.SymbolLookup=document.registerElement("cq-lookup", Lookup);

	



	/**
	 * Undo web component `<cq-undo>`.
	 *
	 * @namespace WebComponents.cq-undo
	 * @example
	 <cq-undo-section>
		 <cq-undo class="ciq-btn">Undo</cq-undo>
		 <cq-redo class="ciq-btn">Redo</cq-redo>
	 </cq-undo-section>
	 */

	var Undo = {
		prototype: Object.create(CIQ.UI.ContextTag)
	};

	Undo.prototype.createdCallback=function(){
		CIQ.UI.ContextTag.createdCallback.apply(this);
		this.redoButton=null;
		this.undostack=[];
		this.redostack=[];
		this.contexts=[];
	};

	Undo.prototype.attachedCallback=function(){
		if(this.attached) return;
		CIQ.UI.ContextTag.attachedCallback.apply(this);
		this.attached=true;
		var self=this;
		$(this).stxtap(function(){
			self.undo();
		});
	};

	Undo.prototype.setContext=function(context){
		this.manageContext(this.context);

		var self=this;
		this.addInjection("append", "initializeChart", function(){
			self.undostack=[];
			self.redostack=[];
			self.clear();
		});
	};


	Undo.prototype.handleEvent=function(context, type, data){
		this.undostack.push({context: context, drawings:data.before});
		this.redostack=[];
		this.setButtonStyle();
	};

	Undo.prototype.manageContext=function(context){
		this.addClaim(this);
		var self=this;
		context.stx.addEventListener("undoStamp", function(data){
			self.handleEvent(context, "undoStamp", data);
		});
		this.contexts.push(context);
	};

	Undo.prototype.keyStroke=function(hub, key, e, keystroke){
		if(key=="z" && (keystroke.ctrl || keystroke.cmd)){ // ctrl-z
			if(keystroke.shift){
				this.redo();
			}else{
				this.undo();
			}
			return true;
		}
		if(key=="y" && (keystroke.ctrl || keystroke.cmd)){ // ctrl-y
			this.redo();
			return true;
		}
	};
	/**
	 * Reverts last drawing made.
	 * @alias undo
	 * @memberof WebComponents.cq-undo
	 */
	Undo.prototype.undo=function(){
		// If a drawing tool is in action, then pressing undo will kill the current tool
		var foundOne=false;
		for(var i=0;i<this.contexts.length;i++){
			if(this.contexts[i].stx.activeDrawing){
				this.contexts[i].stx.undo();
				foundOne=true;
			}
		}
		if(foundOne) return;

		// otherwise proceed to popping off the stack
		var state=this.undostack.pop();
		if(state){
			var context=state.context;
			this.redostack.push({context:context, drawings: CIQ.shallowClone(context.stx.drawingObjects)});
			var drawings=state.drawings;
			context.stx.drawingObjects=CIQ.shallowClone(drawings);
			context.stx.changeOccurred("vector");
			context.stx.draw();
		}
		this.setButtonStyle();
	};

	/**
	 * Reverts latest undone drawing.
	 * @alias redo
	 * @memberof WebComponents.cq-undo
	 */
	Undo.prototype.redo=function(){
		var state=this.redostack.pop();
		if(state){
			var context=state.context;
			this.undostack.push({context:context, drawings: CIQ.shallowClone(context.stx.drawingObjects)});
			var drawings=state.drawings;
			context.stx.drawingObjects=CIQ.shallowClone(drawings);
			context.stx.changeOccurred("vector");
			context.stx.draw();
		}
		this.setButtonStyle();
	};

	/**
	 * Clears the stack of all redo or undo operations for the context
	 * @param  {CIQ.UI.Context} context The context to clear
	 * @alias clear
	 * @memberof WebComponents.cq-undo
	 */
	Undo.prototype.clear=function(context){
		this.setButtonStyle();
	};

	/**
	 * @private
	 */
	Undo.prototype.setButtonStyle=function(){
		if(this.undostack.length){
			$(this).attr("cq-active","true");
		}else{
			$(this).removeAttr("cq-active");
		}
		if(this.redoButton){
			if(this.redostack.length){
				$(this.redoButton).attr("cq-active","true");
			}else{
				$(this.redoButton).removeAttr("cq-active");
			}
		}
	};

	CIQ.UI.Undo=document.registerElement("cq-undo", Undo);

	



	/**
	 * Redo web component `<cq-redo>`.
	 *
	 * Pairs with {@link WebComponents.cq-undo} to redo changes to a drawing.
	 * @namespace WebComponents.cq-redo
	 * @example
	 <cq-undo-section>
		 <cq-undo class="ciq-btn">Undo</cq-undo>
		 <cq-redo class="ciq-btn">Redo</cq-redo>
	 </cq-undo-section>
	 */

	var Redo = {
		prototype: Object.create(CIQ.UI.ContextTag)
	};

	Redo.prototype.attachedCallback=function(){
		if(this.attached) return;
		CIQ.UI.ContextTag.attachedCallback.apply(this);
		this.attached=true;
	};
	/**
	 * Finds {@link WebComponents.cq-undo} and pairs with it to find the last undo and reverse it.
	 * @alias pairUp
	 * @memberof WebComponents.cq-redo
	 * @example
	$("cq-redo")[0].pairUp($("cq-undo"));
	 */
	Redo.prototype.pairUp=function(undo){
		this.undo=$(undo)[0];
		this.undo.redoButton=this;
		var self=this;
		$(this).stxtap(function(){
			self.undo.redo();
		});
	};

	CIQ.UI.Redo=document.registerElement("cq-redo", Redo);

	



	/**
	 * Show Range web component `<cq-show-range>`.
	 *
	 * @namespace WebComponents.cq-show-range
	 * @example
	 	 <cq-show-range>
 			<div stxtap="set(1,'today');">1d</div>
 			<div stxtap="set(5,'day',30,2,'minute');">5d</div>
 			<div stxtap="set(1,'month',30,8,'minute');">1m</div>
 			<div class="hide-sm" stxtap="set(3,'month');">3m</div>
 			<div class="hide-sm" stxtap="set(6,'month');">6m</div>
 			<div class="hide-sm" stxtap="set(1,'YTD');">YTD</div>
 			<div stxtap="set(1,'year');">1y</div>
 			<div class="hide-sm" stxtap="set(5,'year',1,1,'week');">5y</div>
 			<div class="hide-sm" stxtap="set(1,'all',1,1,'month');">All</div>
 	   </cq-show-range>
	 */
	var ShowRange = {
		prototype: Object.create(CIQ.UI.ContextTag)
	};

	/**
	 * Proxies UI requests for span changes to the kernel
	 * @param {Object} activator Activation information
	 * @param {Number} multiplier   The period that will be passed to {@link CIQ.ChartEngine#setSpan}
	 * @param {Number} base The interval that will be passed to {@link CIQ.ChartEngine#setSpan}
	 * @param {Number} [interval] Chart interval to use (leave empty for autodetect)
	 * @param {Number} [period] Chart period to use (leave empty for autodetect)
	 * @param {Number} [timeUnit] Chart timeUnit to use (leave empty for autodetect)
	 * @alias set
	 * @memberof WebComponents.cq-show-range
	 * @since 5.1.1 timeUnit added
	 */
	ShowRange.prototype.set=function(activator, multiplier, base, interval, period, timeUnit){
		var self=this;
		if(self.context.loader) self.context.loader.show();
		var params={
			multiplier:multiplier,
			base:base
		};
		if(interval){
			params.periodicity={
				interval: interval,
				period: period?period:1,
				timeUnit: timeUnit
			};
		}
		self.context.stx.setSpan(params, function(){
			if(self.context.loader) self.context.loader.hide();
		});
	};

	CIQ.UI.ShowRange=document.registerElement("cq-show-range", ShowRange);

	



	/**
	 * Side Panel web component `<cq-side-panel>`.
	 *
	 * @namespace WebComponents.cq-side-panel
	 * @example
	 	 <cq-side-panel><cq-side-panel>
	 */
	var SidePanel = {
		prototype: Object.create(CIQ.UI.ContextTag)
	};

	SidePanel.prototype.createdCallback=function(){
		CIQ.UI.ContextTag.createdCallback.apply(this,arguments);
		this.callbacks=[];
		window.addEventListener("resize", function(self){
			var cb=self.resizeMyself.bind(self);
			return function(){
				setTimeout(cb,0);
			};
		}(this));
	};

	SidePanel.prototype.registerCallback=function(fc){
		this.callbacks.push(fc);
	};

	/**
	 * Opens a side panel to show more options in mobile.
	 * @param  {Object} params Parameters
	 * @param {string} params.selector The selector for which child to enable
	 * @param {string} [params.className] The class name to add to turn on the panel
	 * @param {string} [params.attribute] The attribute to add to turn on the panel
	 * @alias open
	 * @memberof WebComponents.cq-side-panel
	 */
	SidePanel.prototype.open=function(params){
		this.close();
		var children=this.node.find(params.selector);
		if(params.className){
			children.addClass(params.className);
			children.each(function(){
				this.sidePanelActiveClass=params.className; // store the class name used to turn it on
			});
		}else{
			children.attr(params.attribute, "true");
			children.each(function(){
				this.sidePanelActiveAttribute=params.attribute; // store the attribute name used to turn it on
			});
		}
		this.node.attr("cq-active","true");
		var self=this;
		setTimeout(function(){
			self.resizeMyself();
		},0);
	};

	SidePanel.prototype.close=function(){
		this.node.removeAttr("cq-active");
		var children=this.node.children();
		children.each(function(){
			if(this.sidePanelActiveClass)
				$(this).removeClass(this.sidePanelActiveClass); // turn off a child by removing the class name added to it
			else
				$(this).removeAttr(this.sidePanelActiveAttribute); // turn off a child by removing the attribute name added to it
		});
		var self=this;
		setTimeout(function(){
			self.resizeMyself();
		},0);
	};

	/**
	 * Use this method to get the width instead of querying the node directly because the side panel may be animated.
	 * @return {number} The width
	 */
	SidePanel.prototype.nonAnimatedWidth=function(){
		var width=0;
		this.node.children().width(function(i,w){width+=w;}); // accumulate width of all children
		return width;
	};

	SidePanel.prototype.resizeMyself=function(){
		var width=0;
		this.node.children().width(function(i,w){width+=w;}); // accumulate width of all children
		this.node.css({"width": width + "px"}); // expand the side panel
		for(var i=0;i<this.callbacks.length;i++) // let any callbacks know that we've been resized
			this.callbacks[i].call(this, width);
	};

	/**
	 * A side panel contains children that should be enabled by calling open({selector:selector}).
	 */
	CIQ.UI.SidePanel=document.registerElement("cq-side-panel", SidePanel);

	



	/**
	 * Study Context Dialog web component `<cq-study-context>`.
	 *
	 *
	 * @namespace WebComponents.cq-study-context
	 * @since  4.1.0 cq-study-context is now required (cq-dialog[cq-study-context] no longer works)
	 */
	var StudyContext = {
		prototype: Object.create(CIQ.UI.DialogContentTag)
	};

	CIQ.UI.StudyContext=document.registerElement("cq-study-context", StudyContext);

  



	/**
	 * Swatch web component `<cq-swatch>`.
	 *
	 * An interactive color swatch. Relies on the existence of a {@link CIQ.UI.ColorPicker} component.
	 * When a color is selected, setColor(color) will get called for any parent component with that method
	 * @namespace WebComponents.cq-swatch
	 * @example
		 <cq-section>
			 <cq-placeholder>Candle Color
				 <cq-theme-piece cq-piece="cu"><cq-swatch cq-overrides="Hollow"></cq-swatch></cq-theme-piece>
				 <cq-theme-piece cq-piece="cd"><cq-swatch cq-overrides="Hollow"></cq-swatch></cq-theme-piece>
			 </cq-placeholder>
			 <cq-placeholder>Candle Wick
				 <cq-theme-piece cq-piece="wu"><cq-swatch></cq-swatch></cq-theme-piece>
				 <cq-theme-piece cq-piece="wd"><cq-swatch></cq-swatch></cq-theme-piece>
			 </cq-placeholder>
			 <cq-placeholder>Candle Border
				 <cq-theme-piece cq-piece="bu"><cq-swatch cq-overrides="No Border"></cq-swatch></cq-theme-piece>
				 <cq-theme-piece cq-piece="bd"><cq-swatch cq-overrides="No Border"></cq-swatch></cq-theme-piece>
			 </cq-placeholder>
			 <cq-separator></cq-separator>
			 <cq-placeholder>Line/Bar Chart
				 <cq-theme-piece cq-piece="lc"><cq-swatch></cq-swatch></cq-theme-piece>
			 </cq-placeholder>
			 <cq-separator></cq-separator>
			 <cq-placeholder>Mountain Color
				 <cq-theme-piece cq-piece="mc"><cq-swatch></cq-swatch></cq-theme-piece>
			 </cq-placeholder>
		 </cq-section>
	 */
	var Swatch = {
		prototype: Object.create(HTMLElement.prototype)
	};

	/**
	 * Optionally set the default color for the swatch.
	 * @type {string}
	 * @memberof WebComponents.cq-swatch
	 */
	Swatch.prototype.defaultColor=null;

	Swatch.prototype.attachedCallback=function(){
		if(this.attached) return;
		this.node=$(this);
		this.node.stxtap(function(self){return function(e){
			self.launchColorPicker();
			e.stopPropagation();
		};}(this));
		this.attached=true;
	};

	/**
	 * Attempts to identify the default color for the associated chart. It does so by traversing
	 * up the parent stack and looking for any component that has a context. Or you can set
	 * the default color manually by setting member variable defaultColor;
	 * @memberof WebComponents.cq-swatch
	 */
	Swatch.prototype.getDefaultColor=function(){
		if(this.defaultColor) return this.defaultColor;
		var context=CIQ.UI.getMyContext(this);
		if(context) return context.stx.defaultColor; // some parent with a context
		return "trasparent";
	};

	/**
	 * @alias setColor
	 * @memberof WebComponents.cq-swatch
	 */
	Swatch.prototype.setColor=function(color, percolate){
		var node=$(this);
		var bgColor=CIQ.getBackgroundColor(this.parentNode);
		var hslb=CIQ.hsl(bgColor);
		if(!color) color="transparent";
		var fillColor=color;
		if(color=="auto"){
			fillColor=this.getDefaultColor();
		}
		var hslf=CIQ.hsl(fillColor);
		if((Math.abs(hslb[2] - hslf[2])<0.2) || CIQ.isTransparent(color)){
			var border=CIQ.chooseForegroundColor(bgColor);
			node.css({"border": "solid " + border + " 1px"});
		}else{
			node.css({"border": ""});
		}

		node.css({"background-color": fillColor});
		if(percolate!==false) CIQ.UI.containerExecute(this, "setColor", color);
	};

	/**
	 * @alias launchColorPicker
	 * @memberof WebComponents.cq-swatch
	 */
	Swatch.prototype.launchColorPicker=function(){
		var node=$(this);

		var colorPickers=$("cq-color-picker");
		var colorPicker=colorPickers[0];
		colorPicker.callback=function(self){return function(color){
			self.setColor(color, null);
		};}(this);
		var overrides=this.node.attr("cq-overrides");
		if(overrides) overrides=overrides.split(",");
		colorPicker.display({node:node, overrides:overrides});
		this.colorPicker=colorPicker;
	};

	CIQ.UI.Swatch=document.registerElement("cq-swatch", Swatch);

	



	/**
	 * Theme Dialog web component `<cq-theme-dialog>`.
	 *
	 * Manages themes in for chart layout.
	 * @namespace WebComponents.cq-theme-dialog
	 * @example
		 <cq-dialog>
			<cq-theme-dialog>
				<h4 class="title">Create Custom Theme</h4>
				<cq-close></cq-close>
				<cq-scroll cq-no-maximize>
					<cq-section>
					...
					</cq-scroll>
				</cq-theme-dialog>
			</cq-dialog>
	 */
	var ThemeDialog = {
		prototype: Object.create(CIQ.UI.DialogContentTag)
	};

	/**
	 * Applies changes to all charts on the screen
	 * @memberof WebComponents.cq-theme-dialog
	 * @private
	 */
	ThemeDialog.prototype.applyChanges=function(){
		var stx=this.context.stx;
		this.helper.update(stx);
		stx.changeOccurred("theme");
	};

	/**
	 * @alias setValue
	 * @memberof WebComponents.cq-theme-dialog
	 */
	ThemeDialog.prototype.setValue=function(obj, field, value){
		obj[field]=value;
		this.applyChanges();
	};

	/**
	 * @alias close
	 * @memberof WebComponents.cq-theme-dialog
	 */
	ThemeDialog.prototype.close=function(){
		this.helper.settings=this.revert;
		this.applyChanges();
		//CIQ.UI.containerExecute(this, "close");
		CIQ.UI.DialogContentTag.close.apply(this);
	};

	/**
	 * @alias save
	 * @memberof WebComponents.cq-theme-dialog
	 */
	ThemeDialog.prototype.save=function(){
		var themeName=this.node.find("cq-action input").val();
		var theme={
			settings:CIQ.clone(this.helper.settings),
			name: themeName,
			builtIn:null
		};
		CIQ.UI.contextsForEach(function(){
			this.stx.updateListeners("theme");
		});
		var self=this;
		$("cq-themes").each(function(){
			theme.builtIn=this.currentLoadedBuiltIn;
			this.addCustom(theme, self.initiatingMenu);
		});
		CIQ.UI.DialogContentTag.close.apply(this);
	};

	/**
	 * @alias configure
	 * @memberof WebComponents.cq-theme-dialog
	 */
	ThemeDialog.prototype.open=function(params){
		CIQ.UI.DialogContentTag.open.apply(this, arguments);
		var themeName=params.themeName;

		this.initiatingMenu=params.initiatingMenu;
		this.context=params.context;
		this.helper=new CIQ.ThemeHelper({stx: this.context.stx});
		this.revert=CIQ.clone(this.helper.settings);

		var self=this;
		function configurePiece(name, obj, field, type){
			var cu=self.node.find('cq-theme-piece[cq-piece="' + name + '"]');

			cu[0].piece={obj:obj, field:field};
			if(type=="color"){
				cu.find("cq-swatch")[0].setColor(obj[field], false);
			}
		}
		var settings=this.helper.settings;
		configurePiece("cu", settings.chartTypes["Candle/Bar"].up, "color", "color");
		configurePiece("cd", settings.chartTypes["Candle/Bar"].down, "color", "color");
		configurePiece("wu", settings.chartTypes["Candle/Bar"].up, "wick", "color");
		configurePiece("wd", settings.chartTypes["Candle/Bar"].down, "wick", "color");
		configurePiece("bu", settings.chartTypes["Candle/Bar"].up, "border", "color");
		configurePiece("bd", settings.chartTypes["Candle/Bar"].down, "border", "color");
		configurePiece("lc", settings.chartTypes.Line, "color", "color");
		configurePiece("mc", settings.chartTypes.Mountain, "color", "color");
		configurePiece("bg", settings.chart.Background, "color", "color");
		configurePiece("gl", settings.chart["Grid Lines"], "color", "color");
		configurePiece("dd", settings.chart["Grid Dividers"], "color", "color");
		configurePiece("at", settings.chart["Axis Text"], "color", "color");

		if(!themeName) themeName="My Theme";
		this.node.find("cq-action input").val(themeName);
	};

	CIQ.UI.ThemeDialog=document.registerElement("cq-theme-dialog", ThemeDialog);

	



	/**
	 * Theme Piece web component `<cq-theme-piece>`.
	 *
	 * Manages themes in for chart layout.
	 * @namespace WebComponents.cq-theme-piece
	 * @example
		 <cq-section>
			 <cq-placeholder>Background
				 <cq-theme-piece cq-piece="bg"><cq-swatch></cq-swatch></cq-theme-piece>
			 </cq-placeholder>
			 <cq-placeholder>Grid Lines
				 <cq-theme-piece cq-piece="gl"><cq-swatch></cq-swatch></cq-theme-piece>
			 </cq-placeholder>
			 <cq-placeholder>Date Dividers
				 <cq-theme-piece cq-piece="dd"><cq-swatch></cq-swatch></cq-theme-piece>
			 </cq-placeholder>
			 <cq-placeholder>Axis Text
				 <cq-theme-piece cq-piece="at"><cq-swatch></cq-swatch></cq-theme-piece>
			 </cq-placeholder>
		 </cq-section>
	 */
	var ThemePiece = {
		prototype: Object.create(CIQ.UI.BaseComponent)
	};

	/**
	 * @alias setColor
	 * @memberof WebComponents.cq-theme-piece
	 */
	ThemePiece.prototype.setColor=function(color){
		if(color=="Hollow" || color=="No Border"){
			color="transparent";
			this.node.find("cq-swatch")[0].setColor("transparent", false);
		}
		CIQ.UI.containerExecute(this, "setValue", this.piece.obj, this.piece.field, color);
	};

	/**
	 * @alias setBoolean
	 * @memberof WebComponents.cq-theme-piece
	 */
	ThemePiece.prototype.setBoolean=function(result){
		CIQ.UI.containerExecute(this, "setValue", this.piece.obj, this.piece.field, result);
	};

	CIQ.UI.ThemePiece=document.registerElement("cq-theme-piece", ThemePiece);

	



	/**
	 * Themes web component `<cq-themes>`.
	 *
	 * This web component has two functions. The first is displaying available themes in a menu.
	 * The second is providing a theme dialog for entering a new theme.
	 *
	 * Built in themes are merely the names of classes that will be added to the top element of the UIContext when
	 * selected.
	 *
	 * @namespace WebComponents.cq-themes
	 * @example
<cq-themes>
	<cq-themes-builtin cq-no-close>
		<template>
			<cq-item></cq-item>
		</template>
	</cq-themes-builtin>
	<cq-themes-custom cq-no-close>
		<template>
			<cq-theme-custom>
				<cq-item>
					<cq-label></cq-label>
					<cq-close></cq-close>
				</cq-item>
			</cq-theme-custom>
		</template>
	</cq-themes-custom>
	<cq-separator cq-partial></cq-separator>
	<cq-item stxtap="newTheme()"><cq-plus></cq-plus> New Theme </cq-item>
</cq-themes>
	 */
	var Themes = {
		prototype: Object.create(CIQ.UI.ContextTag)
	};

	Themes.prototype.attachedCallback=function(){
		if(this.attached) return;
		CIQ.UI.ContextTag.attachedCallback.apply(this);
		this.attached=true;
		this.builtInMenu=$(this).find("cq-themes-builtin");
		this.builtInTemplate=this.builtInMenu.find("template");
		this.customMenu=$(this).find("cq-themes-custom");
		this.customTemplate=this.customMenu.find("template");
	};

	/**
	 * Initalize the web componenet
	 * @param {Object} params Parameters
	 * @param {Object} [params.builtInThemes] Object map of built in theme names, display names
	 * @param {Object} [params.defaultTheme] The default built in theme to use
	 * @param {Object} [params.nameValueStore] A {@link CIQ.NameValueStore} object for fetching and saving theme state
	 * @param {string} [params.id] id which can be used to disambiguate when multiple charts are on the screen
	 * @memberof WebComponents.cq-themes
	 * @example
	var UIStorage=new CIQ.NameValueStore();

	var UIThemes=$("cq-themes");
	UIThemes[0].initialize({
		builtInThemes: {"ciq-day":"Day","ciq-night":"Night"},
		defaultTheme: "ciq-night",
		nameValueStore: UIStorage
	});
	 */
	Themes.prototype.initialize=function(params){
		this.params={};
		if(params) this.params=params;
		if(!this.params.customThemes) this.params.customThemes={};
		if(!this.params.builtInThemes) this.params.builtInThemes={};
		if(!this.params.nameValueStore) this.params.nameValueStore=new CIQ.NameValueStore();
		if(params.id) this.id="themes_"+params.id;

		var self=this;

		if(this.params.nameValueStore){
			// Retrieve any custom themes the user has created
			this.params.nameValueStore.get("CIQ.Themes.prototype.custom", function(err, result){
				if(!err && result){
					self.params.customThemes=result;
				}
				// Set the current theme to the last one selected by user
				self.params.nameValueStore.get(self.id + "CIQ.Themes.prototype.current", function(err, result){
					if(!err && result && result.theme){
						self.loadTheme(result.theme);
					}else{
						self.loadTheme(self.params.defaultTheme);
					}
					self.configureMenu();
				});
			});
		}else{
			this.loadTheme(self.params.defaultTheme);
		}
	};

	Themes.prototype.configureMenu=function(){
		function loadBuiltIn(self, className){
			return function(e){
				self.loadBuiltIn(className);
				if(self.params.callback){
					self.params.callback({theme:self.currentTheme});
				}
				self.persist("current");
			};
		}
		function loadCustom(self, themeName){
			return function(e){
				self.loadCustom(themeName);
				if(self.params.callback){
					self.params.callback({theme:self.currentTheme});
				}
				self.persist("current");
			};
		}
		this.builtInMenu.emptyExceptTemplate();
		this.customMenu.emptyExceptTemplate();
		var display,newMenuItem;
		var builtInThemes=this.params.builtInThemes;
		for(var className in builtInThemes){
			display=builtInThemes[className];
			newMenuItem=CIQ.UI.makeFromTemplate(this.builtInTemplate);
			newMenuItem.text(display);
			this.makeTap(newMenuItem[0],loadBuiltIn(this, className));
			this.builtInMenu.append(newMenuItem);
		}
		CIQ.I18N.translateUI(null,this.builtInMenu[0]);

		var customThemes=this.params.customThemes;
		for(var themeName in customThemes){
			display=themeName;
			newMenuItem=CIQ.UI.makeFromTemplate(this.customTemplate);
			newMenuItem.find("cq-label").text(display);
			this.makeTap(newMenuItem.find("cq-item")[0],loadCustom(this, themeName));
			newMenuItem[0].close=(function(self, themeName){ return function(){ self.removeTheme(themeName);}; })(this, themeName);
			this.customMenu.append(newMenuItem);
		}
	};

	Themes.prototype.removeTheme=function(themeName){
		var saved=false;
		$("cq-themes").each(function(){
			delete this.params.customThemes[themeName];
			this.configureMenu();
			if(!saved){
				this.persist();
				saved=true;
			}
		});
	};

	Themes.prototype.persist=function(which){
		if(!this.params.nameValueStore) return;
		if(!which || which=="current") this.params.nameValueStore.set(this.id + "CIQ.Themes.prototype.current", {theme:this.currentTheme});
		if(!which || which=="custom") this.params.nameValueStore.set("CIQ.Themes.prototype.custom", this.params.customThemes);
	};

	/**
	 * Adds a custom theme
	 * @memberof WebComponents.cq-themes
	 * @param {object} theme The theme descriptor
	 * @param {Themes} initiatingMenu The menu which initially called ThemeDialog. This is used in order to save the new theme as the current theme.
	 */
	Themes.prototype.addCustom=function(theme, initiatingMenu){
		this.params.customThemes[theme.name]=theme;
		if(initiatingMenu===this) this.currentTheme=theme.name;
		this.configureMenu();
		this.persist();
	};

	/**
	 * @private
	 * @param {object} theme
	 * @memberOf WebComponents.cq-themes
	 */
	Themes.prototype.reinitializeChart=function(theme){
		var stx=this.context.stx;
		stx.styles={};
		stx.chart.container.style.backgroundColor="";
		if(theme){
			var helper=new CIQ.ThemeHelper({stx:stx});
			helper.settings=theme.settings;
			helper.update();
		}
		stx.updateListeners("theme");
		stx.changeOccurred("theme");
		if(stx.displayInitialized){
			stx.headsUpHR();
			stx.clearPixelCache();
			stx.updateListeners("theme");
			stx.draw();
		}
	};

	Themes.prototype.loadTheme=function(themeName){
		if(this.params.customThemes[themeName])
			this.loadCustom(themeName);
		else if(this.params.builtInThemes[themeName])
			this.loadBuiltIn(themeName);
		else
			this.loadBuiltIn(this.params.defaultTheme);
	};


	Themes.prototype.loadBuiltIn=function(className){
		if(this.currentLoadedBuiltIn){
			$(this.context.topNode).removeClass(this.currentLoadedBuiltIn);
		}
		$(this.context.topNode).addClass(className);
		this.currentLoadedBuiltIn=this.currentTheme=className;
		this.reinitializeChart();
	};


	Themes.prototype.loadCustom=function(themeName){
		if(this.currentLoadedBuiltIn){
			$(this.context.topNode).removeClass(this.currentLoadedBuiltIn);
		}
		var theme=this.params.customThemes[themeName];
		if(theme.builtIn) $(this.context.topNode).addClass(theme.builtIn);
		this.currentLoadedBuiltIn=theme.builtIn;
		this.currentTheme=theme.name;
		this.reinitializeChart(theme);
	};

	Themes.prototype.newTheme=function(){
		var self=this;
		$("cq-theme-dialog").each(function(){
			this.open({context: self.context, initiatingMenu: self});
		});
	};

	CIQ.UI.Themes=document.registerElement("cq-themes", Themes);

	



	/**
	 * Timezone Dialog web component `<cq-timezone-dialog>`.
	 * @namespace WebComponents.cq-timezone-dialog
	 */
	var TimezoneDialog = {
		prototype: Object.create(CIQ.UI.DialogContentTag)
	};

	/**
	 * @memberof WebComponents.cq-timezone-dialog
	 */
	TimezoneDialog.prototype.removeTimezone=function(){
		CIQ.ChartEngine.defaultDisplayTimeZone=null;
		var stx=this.context.stx;
		stx.displayZone=null;
		stx.setTimeZone();

		if(stx.displayInitialized) stx.draw();

		CIQ.UI.DialogContentTag.close.apply(this);
	};

	/**
	 * @memberof WebComponents.cq-theme-dialog
	 */
	TimezoneDialog.prototype.open=function(params){
		CIQ.UI.DialogContentTag.open.apply(this, arguments);
		var node=this.node;
		var self=this;

		this.context=params.context;
		var stx=this.context.stx;

		var ul=node.find("ul");
		var button = node.find(".ciq-btn");
		if(!this.template){
			this.template=ul.find("li.timezoneTemplate")[0].cloneNode(true);
		}

		ul.empty();
		for(var key in CIQ.timeZoneMap){
			var zone=key;
			var display=stx.translateIf(zone);
			var li=this.template.cloneNode(true);
			li.style.display="block";
			li.innerHTML=display;
			CIQ.safeClickTouch(li,setTimezone(zone));
			ul.append(li);
		}
		var currentUserTimeZone=node.find(".currentUserTimeZone");
		if( stx.displayZone ) {
			var fullZone = stx.displayZone;
			for(var tz in CIQ.timeZoneMap){
				if( CIQ.timeZoneMap[tz] === stx.displayZone ) fullZone = tz;
			}
			currentUserTimeZone.text(stx.translateIf('Current TimeZone is') + ' ' + stx.translateIf(fullZone));
			button.show();
		} else {
			currentUserTimeZone.text(stx.translateIf('Your timezone is your current location'));
			button.hide();
		}

		function setTimezone(zone){
			return function(e){
				CIQ.UI.DialogContentTag.close.apply(self);
				var translatedZone=CIQ.timeZoneMap[zone];
				CIQ.ChartEngine.defaultDisplayTimeZone=translatedZone;
				stx.setTimeZone(stx.dataZone, translatedZone);
				if(stx.chart.symbol) stx.draw();
			};
		}
	};

	CIQ.UI.TimezoneDialog=document.registerElement("cq-timezone-dialog", TimezoneDialog);

	



	/**
	 * Toggle web component `<cq-toggle>`.
	 *
	 * UI Helper that binds a toggle to an object member, or callbacks when toggled
	 * cq-member Object member to observe. If not provided then callbacks will be used exclusively.
	 * cq-action default="class" Action to take
	 * cq-value default="active" Value for action (i.e. class name)
	 * cq-toggles A comma separated list of valid values which will be toggled through with each click. List may include "null".
	 *
	 * use registerCallback to receive a callback every time the toggle changes. When a callback is registered, any automatic
	 * class changes are bypassed
	 *
	 * @namespace WebComponents.cq-toggle
	 * @example
	 * $("cq-toggle").registerCallback(function(value){
	 *    console.log("current value is " + value);
	 *    if(value!=false) this.node.addClass("active");
	 * })
	 */
	var Toggle = {
		prototype: Object.create(CIQ.UI.ContextTag)
	};

	Toggle.prototype.setContext=function(context){
		this.currentValue=false;
		this.params.obj=this.context.stx.layout;
		var member=this.node.attr("cq-member");
		if(member) this.params.member=member;
		var action=this.node.attr("cq-action");
		if(action) this.params.action=action;
		var value=this.node.attr("cq-value");
		if(value) this.params.value=value;
		var toggles=this.node.attr("cq-toggles");
		if(toggles) this.params.toggles=toggles.split(",");
		for(var i=0;i<this.params.toggles.length;i++){
			if(this.params.toggles[i]=="null") this.params.toggles[i]=null;
		}
		this.begin();
	};

	Toggle.prototype.attachedCallback=function(){
		if(this.attached) return;
		this.params={
			member: null,
			obj: null,
			action: "class",
			value: "active",
			toggles: [],
			callbacks: []
		};
		CIQ.UI.ContextTag.attachedCallback.apply(this);
		this.attached=true;
	};

	Toggle.prototype.registerCallback=function(fc, immediate){
		if(immediate!==false) immediate=true;
		this.params.callbacks.push(fc);
		if(immediate) fc.call(this, this.currentValue);
	};

	/**
	 * @param params
	 * @memberof WebComponents.cq-toggle
	 */
	Toggle.prototype.updateFromBinding=function(params){
		this.currentValue=params.obj[params.member];
		if(!this.params.callbacks.length){
			if(this.params.action=="class"){
				if(this.currentValue){
					this.node.addClass(this.params.value);
				}else{
					this.node.removeClass(this.params.value);
				}
			}
		}else{
			for(var i=0;i<this.params.callbacks.length;i++){
				this.params.callbacks[i].call(this, this.currentValue);
			}
		}

		if( params.member == "crosshair" && this.currentValue === false ) this.context.stx.doDisplayCrosshairs();
	};

	/**
	 * @param value
	 * @memberof WebComponents.cq-toggle
	 */
	Toggle.prototype.set=function(value){
		if(this.params.member){
			this.params.obj[this.params.member]=value;
		}else{
			this.currentValue=value;
			for(var i=0;i<this.params.callbacks.length;i++){
				this.params.callbacks[i].call(this, this.currentValue);
			}
		}
	};

	/**
	 * @memberof WebComponents.cq-toggle
	 */
	Toggle.prototype.begin=function(){
		var self=this;
		var stx=this.context.stx;
		if(this.params.member){
			CIQ.UI.observe({
				selector: this.node,
				obj: this.params.obj,
				member: this.params.member,
				action: "callback",
				value: function(params){
					self.updateFromBinding(params);
				}
			});
		}
		this.node.stxtap(function(){
			var toggles=self.params.toggles;
			var obj=self.params.obj;
			if(toggles.length>1){ // Cycle through each field in the array with each tap
				for(var i=0;i<toggles.length;i++){
					var toggle=toggles[i];
					if(self.currentValue==toggle){
						if(i<toggles.length-1)
							self.set(toggles[i+1]);
						else
							self.set(toggles[0]);
						break;
					}
				}
				if(i==toggles.length){ // default to first item in toggle
					self.set(toggles[0]);
				}
			}else{
				if(self.currentValue){
					self.set(false);
				}else{
					self.set(true);
				}
			}
			stx.draw();
			if(obj===stx.layout) stx.changeOccurred("layout");
		});
	};

	CIQ.UI.Toggle=document.registerElement("cq-toggle", Toggle);

	



	/**
	  * Drawing toolbar web component used to activate and manage available drawings.
	 * 
	 * Emits a "change" event when changed
	 * 
	 * @namespace WebComponents.cq-toolbar
	 * @example
		<cq-toolbar>
			<cq-menu class="ciq-select">
				<span cq-current-tool>Select Tool</span>
				<cq-menu-dropdown>
					<cq-item stxtap="noTool()">None</cq-item>
					<cq-item stxtap="clearDrawings()">Clear Drawings</cq-item>
					<cq-item stxtap="restoreDefaultConfig(true)">Restore Default Parameters</cq-item>
					<cq-item stxtap="tool('measure')">Measure</cq-item>
					<cq-separator></cq-separator>
					<cq-item stxtap="tool('annotation')">Annotation</cq-item>
					<cq-item stxtap="tool('average')">Average Line</cq-item>
					<cq-item stxtap="tool('callout')">Callout</cq-item>
					<cq-item stxtap="tool('channel')">Channel</cq-item>
					<cq-item stxtap="tool('continuous')">Continuous</cq-item>
					<cq-item stxtap="tool('crossline')">Crossline</cq-item>
					<cq-item stxtap="tool('freeform')">Doodle</cq-item>
					<cq-item stxtap="tool('ellipse')">Ellipse</cq-item>
					<cq-item stxtap="tool('retracement')">Fib Retracement</cq-item>
					<cq-item stxtap="tool('fibprojection')">Fib Projection</cq-item>
					<cq-item stxtap="tool('fibarc')">Fib Arc</cq-item>
					<cq-item stxtap="tool('fibfan')">Fib Fan</cq-item>
					<cq-item stxtap="tool('fibtimezone')">Fib Time Zone</cq-item>
					<cq-item stxtap="tool('gannfan')">Gann Fan</cq-item>
					<cq-item stxtap="tool('gartley')">Gartley</cq-item>
					<cq-item stxtap="tool('horizontal')">Horizontal</cq-item>
					<cq-item stxtap="tool('line')">Line</cq-item>
					<cq-item stxtap="tool('pitchfork')">Pitchfork</cq-item>
					<cq-item stxtap="tool('quadrant')">Quadrant Lines</cq-item>
					<cq-item stxtap="tool('ray')">Ray</cq-item>
					<cq-item stxtap="tool('rectangle')">Rectangle</cq-item>
					<cq-item stxtap="tool('regression')">Regression Line</cq-item>
					<cq-item stxtap="tool('segment')">Segment</cq-item>
					<cq-item stxtap="tool('arrow')">Shape - Arrow</cq-item>
					<cq-item stxtap="tool('check')">Shape - Check</cq-item>
					<cq-item stxtap="tool('xcross')">Shape - Cross</cq-item>
					<cq-item stxtap="tool('focusarrow')">Shape - Focus</cq-item>
					<cq-item stxtap="tool('heart')">Shape - Heart</cq-item>
					<cq-item stxtap="tool('star')">Shape - Star</cq-item>
					<cq-item stxtap="tool('speedarc')">Speed Resistance Arc</cq-item>
					<cq-item stxtap="tool('speedline')">Speed Resistance Line</cq-item>
					<cq-item stxtap="tool('timecycle')">Time Cycle</cq-item>
					<cq-item stxtap="tool('tirone')">Tirone Levels</cq-item>
					<cq-item stxtap="tool('trendline')">Trend Line</cq-item>
					<cq-item stxtap="tool('vertical')">Vertical</cq-item>
				</cq-menu-dropdown>
			</cq-menu>
			<cq-toolbar-settings>
				<cq-fill-color cq-section class="ciq-color" stxbind="getFillColor()" stxtap="pickFillColor()">
					<span></span>
				</cq-fill-color>
				<div>
					<cq-line-color cq-section cq-overrides="auto" class="ciq-color" stxbind="getLineColor()" stxtap="pickLineColor()"><span></span></cq-line-color>
					<cq-line-style cq-section>
						<cq-menu class="ciq-select">
							<span cq-line-style class="ciq-line ciq-selected"></span>
							<cq-menu-dropdown class="ciq-line-style-menu">
								<cq-item stxtap="setLine(1,'solid')"><span class="ciq-line-style-option ciq-solid-1"></span></cq-item>
								<cq-item stxtap="setLine(3,'solid')"><span class="ciq-line-style-option ciq-solid-3"></span></cq-item>
								<cq-item stxtap="setLine(5,'solid')"><span class="ciq-line-style-option ciq-solid-5"></span></cq-item>
								<cq-item stxtap="setLine(1,'dotted')"><span class="ciq-line-style-option ciq-dotted-1"></span></cq-item>
								<cq-item stxtap="setLine(3,'dotted')"><span class="ciq-line-style-option ciq-dotted-3"></span></cq-item>
								<cq-item stxtap="setLine(5,'dotted')"><span class="ciq-line-style-option ciq-dotted-5"></span></cq-item>
								<cq-item stxtap="setLine(1,'dashed')"><span class="ciq-line-style-option ciq-dashed-1"></span></cq-item>
								<cq-item stxtap="setLine(3,'dashed')"><span class="ciq-line-style-option ciq-dashed-3"></span></cq-item>
								<cq-item stxtap="setLine(5,'dashed')"><span class="ciq-line-style-option ciq-dashed-5"></span></cq-item>
								<cq-item stxtap="setLine(0,'none')" class="ciq-none">None</cq-item>
							</cq-menu-dropdown>
						</cq-menu>
					</cq-line-style>
				</div>
				<cq-axis-label cq-section>
					<div class="ciq-heading">Axis Label:</div>
					<span stxtap="toggleAxisLabel()" class="ciq-checkbox ciq-active"><span></span></span>
				</cq-axis-label>
				<cq-annotation cq-section>
					<cq-annotation-italic stxtap="toggleFontStyle('italic')" class="ciq-btn" style="font-style:italic;">I</cq-annotation-italic>
					<cq-annotation-bold stxtap="toggleFontStyle('bold')" class="ciq-btn" style="font-weight:bold;">B</cq-annotation-bold>
					<cq-menu class="ciq-select">
						<span cq-font-size>12px</span>
						<cq-menu-dropdown class="ciq-font-size">
							<cq-item stxtap="setFontSize('8px')">8</cq-item>
							<cq-item stxtap="setFontSize('10px')">10</cq-item>
							<cq-item stxtap="setFontSize('12px')">12</cq-item>
							<cq-item stxtap="setFontSize('13px')">13</cq-item>
							<cq-item stxtap="setFontSize('14px')">14</cq-item>
							<cq-item stxtap="setFontSize('16px')">16</cq-item>
							<cq-item stxtap="setFontSize('20px')">20</cq-item>
							<cq-item stxtap="setFontSize('28px')">28</cq-item>
							<cq-item stxtap="setFontSize('36px')">36</cq-item>
							<cq-item stxtap="setFontSize('48px')">48</cq-item>
							<cq-item stxtap="setFontSize('64px')">64</cq-item>
						</cq-menu-dropdown>
					</cq-menu>
					<cq-menu class="ciq-select">
						<span cq-font-family>Default</span>
						<cq-menu-dropdown class="ciq-font-family">
							<cq-item stxtap="setFontFamily('Default')">Default</cq-item>
							<cq-item stxtap="setFontFamily('Helvetica')">Helvetica</cq-item>
							<cq-item stxtap="setFontFamily('Courier')">Courier</cq-item>
							<cq-item stxtap="setFontFamily('Garamond')">Garamond</cq-item>
							<cq-item stxtap="setFontFamily('Palatino')">Palatino</cq-item>
							<cq-item stxtap="setFontFamily('Times New Roman')">Times New Roman</cq-item>
						</cq-menu-dropdown>
					</cq-menu>
				</cq-annotation>
				<cq-clickable cq-fib-settings cq-selector="cq-fib-settings-dialog" cq-method="open" cq-section><span class="ciq-btn">Settings</span></cq-clickable>
				<div cq-toolbar-action="save" stxtap="saveConfig()" cq-section><div cq-toolbar-dirty></div><cq-tooltip>Save Config</cq-tooltip></div>
				<div cq-toolbar-action="restore" stxtap="restoreDefaultConfig()" cq-section><cq-tooltip>Restore Config</cq-tooltip></div>
			</cq-toolbar-settings>
			<cq-measure><span class="mMeasure"></span></cq-measure>
			<cq-undo-section>
				<cq-undo class="ciq-btn">Undo</cq-undo>
				<cq-redo class="ciq-btn">Redo</cq-redo>
			</cq-undo-section>
		</cq-toolbar>
	 */
	var DrawingToolbar = {
		prototype: Object.create(CIQ.UI.ContextTag)
	};

	DrawingToolbar.prototype.attachedCallback=function(){
		if(this.attached) return;
		CIQ.UI.ContextTag.attachedCallback.apply(this);
		this.node=$(this);
		this.params={
			toolSelection:this.node.find("*[cq-current-tool]"),
			lineSelection:this.node.find("*[cq-line-style]"),
			fontSizeSelection:this.node.find("*[cq-font-size]"),
			fontFamilySelection:this.node.find("*[cq-font-family]"),
			fontStyleToggle:this.node.find("cq-annotation-italic"),
			fontWeightToggle:this.node.find("cq-annotation-bold"),
			axisLabelToggle:this.node.find("cq-axis-label .ciq-checkbox"),
			fillColor:this.node.find("cq-fill-color").not("cq-cvp-controller"),
			lineColor:this.node.find("cq-line-color").not("cq-cvp-controller"),
			cvpControllers:this.node.find("cq-cvp-controller")
		};
		this.params.cvpControllers.prop("toolbar",this);
		this.noToolSelectedText="";
		this.attached=true;
	};

	DrawingToolbar.prototype.defaultElements=function(drawingParameters){
		var arr=[];
		for(var param in drawingParameters){
			if(param=="color") arr.push("cq-line-color");
			else if(param=="fillColor") arr.push("cq-fill-color");
			else if(param=="pattern" || param=="lineWidth") arr.push("cq-line-style");
			else if(param=="axisLabel") arr.push("cq-axis-label");
			else if(param=="font") arr.push("cq-annotation");
			else if(param=="parameters") arr.push("cq-clickable");
		}

		return arr;
	};

	DrawingToolbar.prototype.setContext=function(context){
		this.noToolSelectedText=$(this.params.toolSelection).text();
		this.sync();
	};


	/**
	 * Synchronizes the drawing toolbar with stx.currentVectorParameters. Poor man's data binding.
	 * @param {Object} [cvp=stx.currentVectorParameters] A new drawing object, otherwise defaults to the current one
	 * @memberof WebComponents.cq-toolbar
	 */
	DrawingToolbar.prototype.sync=function(cvp){
		var stx=this.context.stx;
		if(!cvp) cvp=stx.currentVectorParameters;
		else stx.currentVectorParameters=cvp;

		this.setLine(null, cvp.lineWidth, cvp.pattern);

		var style=stx.canvasStyle("stx_annotation");	

		var initialSize=(cvp.annotation.font.size || style.fontSize);
		this.setFontSize(null, initialSize);

		var initialFamily=(cvp.annotation.font.family || style.fontFamily);
		this.setFontFamily(null, initialFamily);

		var initialFontStyle=(cvp.annotation.font.style || style.fontStyle);
		$(this.params.fontStyleToggle)[initialFontStyle==='italic'?'addClass':'removeClass']('ciq-active');

		var initialWeight=(cvp.annotation.font.weight || style.fontWeight);
		$(this.params.fontWeightToggle)[(initialWeight==='bold' || initialWeight >= 700) ? 'addClass' : 'removeClass']('ciq-active');

		$(this.params.axisLabelToggle)[cvp.axisLabel?'addClass':'removeClass']('ciq-active');

		this.getFillColor({node:$(this.params.fillColor)});
		this.getLineColor({node:$(this.params.lineColor)});
		
		this.getControllerSettings($(this.params.cvpControllers));

		this.node.find("*[cq-toolbar-dirty]").removeClass("ciq-active");
	};

	DrawingToolbar.prototype.emit=function(){
		// This is old style to support IE11
		var event = document.createEvent('Event');
		event.initEvent('change', true, true);
		this.node.find("*[cq-toolbar-dirty]").addClass("ciq-active");
		this.dispatchEvent(event);
	};

	DrawingToolbar.prototype.noTool=function(){
		var stx=this.context.stx;
		stx.changeVectorType(null);
		if(stx.layout.crosshair){
			stx.layout.crosshair=false;
			stx.changeOccurred("layout");
			stx.doDisplayCrosshairs();
		}
		if(stx.preferences.magnet){
			this.toggleMagnet(this);
		}
		$(this.params.toolSelection).text(this.noToolSelectedText);
		this.node.find("*[cq-section]").removeClass("ciq-active");
		this.emit();
	};

	DrawingToolbar.prototype.crosshairs=function(activator){
		var stx=this.context.stx;
		$(this.params.toolSelection).html($(activator.node).html());
		stx.changeVectorType(null);
		stx.layout.crosshair=true;
		stx.doDisplayCrosshairs();
		stx.findHighlights(false, true);
		stx.changeOccurred("layout");
		stx.draw();
		stx.updateChartAccessories();
		this.node.find("*[cq-section]").removeClass("ciq-active");
		this.emit();
	};

	DrawingToolbar.prototype.toggleMagnet=function(activator){
		var toggle=$(activator.node);//.find("cq-toggle");
		var stx=this.context.stx;
		if(stx.preferences.magnet){
			toggle.removeClass("active");
			stx.preferences.magnet=false;
		}else{
			toggle.addClass("active");
			stx.preferences.magnet=true;
		}
		CIQ.clearCanvas(stx.chart.tempCanvas, stx);
	};

	DrawingToolbar.prototype.clearDrawings=function(){
		this.context.stx.clearDrawings(null,false);
	};

	DrawingToolbar.prototype.restoreDefaultConfig=function(activator, all){
		var stx=this.context.stx;
		CIQ.Drawing.restoreDefaultConfig(stx,stx.currentVectorParameters.vectorType,all);
		this.node.find("*[cq-toolbar-action='restore']").removeClass("ciq-active");
		this.sync();
	};

	DrawingToolbar.prototype.saveConfig=function(){
		var stx=this.context.stx;
		CIQ.Drawing.saveConfig(stx,stx.currentVectorParameters.vectorType);
		this.node.find("*[cq-toolbar-action='restore']").addClass("ciq-active");
		this.sync();
	};

	DrawingToolbar.prototype.tool=function(activator, toolName){
		var stx=this.context.stx;
		stx.clearMeasure();
		stx.changeVectorType(toolName);
		$(this.params.toolSelection).html($(activator.node).html());

		this.node.find("*[cq-section]").removeClass("ciq-active");
		var drawingParameters=CIQ.Drawing.getDrawingParameters(stx, toolName);
		if(drawingParameters){
			this.node.find("*[cq-toolbar-action='save']").addClass("ciq-active");
			drawingPrefs=stx.preferences.drawings;
			if(drawingPrefs && drawingPrefs[toolName]) this.node.find("*[cq-toolbar-action='restore']").addClass("ciq-active");
			// fibtimezone has no values to display in the settings dialog
			if(toolName === 'fibtimezone') {
				delete drawingParameters.parameters;
			}

			var none=$(this.params.lineSelection).parent().find(".ciq-none");
			none.hide();
			var elements=this.defaultElements(drawingParameters);
			for(var i=0;i<elements.length;i++){
				$(this.node).find(elements[i]).addClass("ciq-active");
				if(elements[i]=="cq-fill-color") none.show();
			}
			elements = CIQ.Drawing[toolName].prototype.$controls;
			for (i = 0; elements && i < elements.length; i++) {
				$(this.node).find(elements[i]).addClass('ciq-active');
			}
		}
		this.sync();
	};

	DrawingToolbar.prototype.setLine=function(activator, width, pattern){
		var stx=this.context.stx;

		stx.currentVectorParameters.lineWidth=width;
		stx.currentVectorParameters.pattern=pattern;
		this.setFibs(width, pattern);
		if(this.currentLineSelectedClass) $(this.params.lineSelection).removeClass(this.currentLineSelectedClass);
		this.currentLineSelectedClass="ciq-"+pattern+"-"+parseInt(width,10);
		if(pattern=="none"){
			this.currentLineSelectedClass=null;
		}else{
			$(this.params.lineSelection).addClass(this.currentLineSelectedClass);
		}
		this.emit();
	};

	DrawingToolbar.prototype.setFibs=function(width, pattern){
		var fib=this.context.stx.currentVectorParameters.fibonacci;
		if(fib){
			for(var i=0;i<fib.fibs.length;i++){
				fib.fibs[i].parameters.lineWidth=width;
				fib.fibs[i].parameters.pattern=pattern;
			}
			fib.timezone.parameters.lineWidth=width;
			fib.timezone.parameters.pattern=pattern;
		}
	};

	DrawingToolbar.prototype.setFontSize=function(activator, fontSize){
		var stx=this.context.stx;

		stx.currentVectorParameters.annotation.font.size=fontSize;
		$(this.params.fontSizeSelection).text(fontSize);
		this.emit();
	};

	DrawingToolbar.prototype.setFontFamily=function(activator, fontFamily){
		var stx=this.context.stx;

		if(fontFamily=="Default"){
			stx.currentVectorParameters.annotation.font.family=null;
		}else{
			stx.currentVectorParameters.annotation.font.family=fontFamily;
		}
		$(this.params.fontFamilySelection).text(fontFamily);
		this.emit();
	};

	DrawingToolbar.prototype.toggleFontStyle=function(activator, fontStyle){
		var stx=this.context.stx;

		if(fontStyle=="italic"){
			if(stx.currentVectorParameters.annotation.font.style=="italic"){
				stx.currentVectorParameters.annotation.font.style=null;
				$(activator.node).removeClass("ciq-active");
			}else{
				stx.currentVectorParameters.annotation.font.style="italic";
				$(activator.node).addClass("ciq-active");
			}
		}else if(fontStyle=="bold"){
			if(stx.currentVectorParameters.annotation.font.weight=="bold"){
				stx.currentVectorParameters.annotation.font.weight=null;
				$(activator.node).removeClass("ciq-active");
			}else{
				stx.currentVectorParameters.annotation.font.weight="bold";
				$(activator.node).addClass("ciq-active");
			}
		}
		this.emit();
	};

	DrawingToolbar.prototype.toggleAxisLabel=function(activator){
		var stx=this.context.stx;

		if(stx.currentVectorParameters.axisLabel===true){
			stx.currentVectorParameters.axisLabel=false;
			$(activator.node).removeClass("ciq-active");
		}else{
			stx.currentVectorParameters.axisLabel=true;
			$(activator.node).addClass("ciq-active");
		}
		this.emit();
	};

	DrawingToolbar.prototype.getFillColor=function(activator){
		var node=activator.node;
		var color=this.context.stx.currentVectorParameters.fillColor;
		if(color=="transparent" || color=="auto") color="";
		$(node).css({"background-color": color});
	};

	DrawingToolbar.prototype.pickFillColor=function(activator){
		var node=activator.node;
		var colorPickers=$("cq-color-picker");
		if(!colorPickers.length){
			console.log("DrawingToolbar.prototype.pickFillColor: no ColorPicker available");
			return;
		}
		var colorPicker=colorPickers[0];
		var self=this;
		colorPicker.callback=function(color){
			self.context.stx.currentVectorParameters.fillColor=color;
			self.getFillColor({node:node});
			self.emit();
		};
		colorPicker.display({node:node});
	};

	DrawingToolbar.prototype.getLineColor=function(activator){
		var node=activator.node;
		var color=this.context.stx.currentVectorParameters.currentColor;
		if(color=="transparent" || color=="auto") color="";
		$(node).css({"background-color": color});
	};

	DrawingToolbar.prototype.pickLineColor=function(activator){
		var node=activator.node;
		var colorPickers=$("cq-color-picker");
		if(!colorPickers.length){
			console.log("DrawingToolbar.prototype.pickLineColor: no ColorPicker available");
			return;
		}
		var colorPicker=colorPickers[0];
		var self=this;
		colorPicker.callback=function(color){
			self.context.stx.currentVectorParameters.currentColor=color;
			self.getLineColor({node:node});
			self.emit();
		};
		var overrides=$(node).attr("cq-overrides");
		if(overrides) overrides=overrides.split(",");
		colorPicker.display({node:node, overrides:overrides});
	};

	DrawingToolbar.prototype.getControllerSettings=function(controls){
		var cvp=this.context.stx.currentVectorParameters;
		for(var i=0; i<controls.length; i++){
			var node=$(controls[i]), header=node.attr("cq-cvp-header");
			if(cvp["active"+header]){
				node.find(".ciq-checkbox").addClass("ciq-active");
			}else{
				node.find(".ciq-checkbox").removeClass("ciq-active");
			}
			var color=cvp["color"+header];
			if(!color || color=="transparent" || color=="auto") color="";
			node.find("cq-line-color").css({"background-color": color});

			if(cvp["lineWidth"+header] && cvp["pattern"+header]){
				var newClassName="ciq-"+cvp["pattern"+header]+"-"+cvp["lineWidth"+header];
				node.find("[cq-cvp-line-style]").attr("class","ciq-line ciq-selected "+newClassName);
			}else{
				node[0].setContext();
			}
		}
	};


	CIQ.UI.DrawingToolbar=document.registerElement("cq-toolbar", DrawingToolbar);

	



	/**
	 * Simple WebComponent that allows data binding to arbitrary properties of currentVectorParameters.
	 * Ideal for use as a drawing toolbar extension.
	 *
	 * @example
	 * <cq-cvp-controller cq-section cq-cvp-scope="1">
	 * 	<div cq-section>
	 * 		<div class="ciq-heading">Dev 1</div>
	 * 		<span stxtap="toggleActive()" class="ciq-checkbox">
	 * 			<span></span>
	 * 		</span>
	 * 	</div>
	 * 	<cq-line-color cq-section class="ciq-color" stxbind="getColor()" stxtap="pickColor()">
	 * 		<span></span>
	 * 	</cq-line-color>
	 * 	<cq-line-style cq-section>
	 * 		<cq-menu class="ciq-select">
	 * 			<span cq-cvp-line-style class="ciq-line ciq-selected"></span>
	 * 			<cq-menu-dropdown class="ciq-line-style-menu">
	 * 				<cq-item stxtap="setStyle(1, 'solid')"><span class="ciq-line-style-option ciq-solid-1"></span></cq-item>
	 * 				<cq-item stxtap="setStyle(3, 'solid')"><span class="ciq-line-style-option ciq-solid-3"></span></cq-item>
	 * 				<cq-item stxtap="setStyle(5, 'solid')"><span class="ciq-line-style-option ciq-solid-5"></span></cq-item>
	 * 				<cq-item stxtap="setStyle(1, 'dotted')"><span class="ciq-line-style-option ciq-dotted-1"></span></cq-item>
	 * 				<cq-item stxtap="setStyle(3, 'dotted')"><span class="ciq-line-style-option ciq-dotted-3"></span></cq-item>
	 * 				<cq-item stxtap="setStyle(5, 'dotted')"><span class="ciq-line-style-option ciq-dotted-5"></span></cq-item>
	 * 				<cq-item stxtap="setStyle(1, 'dashed')"><span class="ciq-line-style-option ciq-dashed-1"></span></cq-item>
	 * 				<cq-item stxtap="setStyle(3, 'dashed')"><span class="ciq-line-style-option ciq-dashed-3"></span></cq-item>
	 * 				<cq-item stxtap="setStyle(5, 'dashed')"><span class="ciq-line-style-option ciq-dashed-5"></span></cq-item>
	 * 			</cq-menu-dropdown>
	 * 		</cq-menu>
	 * 	</cq-line-style>
	 * </cq-cvp-controller>
	 */
	var CVPController = {
		prototype: Object.create(CIQ.UI.ContextTag)
	};
	var createPropertyOfCVP = function(key) {
		return {
			configurable: true,
			enumerable: false,
			get: function() {
				return this.context.stx.currentVectorParameters[key + this._scope];
			},
			set: function(value) {
				this.context.stx.currentVectorParameters[key + this._scope] = value;
			}
		};
	};

	Object.defineProperties(CVPController.prototype, {
		active: createPropertyOfCVP('active'),
		color: createPropertyOfCVP('color'),
		lineWidth: createPropertyOfCVP('lineWidth'),
		pattern: createPropertyOfCVP('pattern')
	});

	CVPController.prototype.createdCallback = function() {
		CIQ.UI.ContextTag.createdCallback.call(this);

		Object.defineProperty(this, '_scope', {
			configurable: true,
			enumerable: false,
			value: this.getAttribute('cq-cvp-header') || '',
			writable: false
		});
	};

	CVPController.prototype.attachedCallback = function() {
		if (this.attached) return;
		var tmpl = document.querySelector('template[cq-cvp-controller]');
		if (this.children.length === 0 && tmpl) {
			var nodes = document.importNode(tmpl.content, true);
			var heading = nodes.querySelector('.ciq-heading');
			if (heading) {
				heading.innerHTML = this._scope;
			}
			this.appendChild(nodes);
		}
		CIQ.UI.ContextTag.attachedCallback.call(this);
		this.attached = true;
	};

	CVPController.prototype.setContext = function(context) {
		this.setStyle(null, 1, 'dotted');
	};

	CVPController.prototype.emit = function(eventName, value) {
		if(this.toolbar) {
			this.toolbar.emit(eventName, value);
		}else if (typeof CustomEvent === 'function') {
			this.dispatchEvent(new CustomEvent(eventName, {detail: value}));
		}else{
			// IE11 typeof above returned 'object' instead of 'function'
			var event = document.createEvent('CustomEvent');
			event.initCustomEvent(eventName, true, true, value);
			this.dispatchEvent(event);
		}
	};

	CVPController.prototype.toggleActive = function(activator) {
		var node = $(activator.node);
		var className = 'ciq-active';

		if (this.active) {
			this.active = false;
			node.removeClass(className);
		} else {
			this.active = true;
			node.addClass(className);
		}

		this.emit('change', {
			active: this.active
		});
	};

	CVPController.prototype.setStyle = function(activator, width, pattern) {
		this.lineWidth = parseInt(width, 10);
		this.pattern = pattern;

		var selection = $(this).find('*[cq-cvp-line-style]');

		if (this.lineStyleClassName) {
			selection.removeClass(this.lineStyleClassName);
		}

		if (pattern && pattern !== 'none') {
			this.lineStyleClassName = 'ciq-' + pattern + '-' + this.lineWidth;
			selection.addClass(this.lineStyleClassName);
		} else {
			this.lineStyleClassName = null;
		}

		this.emit('change', {
			lineWidth: width,
			pattern: pattern
		});
	};

	CVPController.prototype.getColor = function(activator) {
		var node = activator.node || $(this).find('cq-line-color');
		var color = this.color;

		if (color == 'transparent' || color == 'auto') {
			color = '';
		}

		$(node).css({
			'background-color': color
		});
	};

	CVPController.prototype.pickColor = function(activator) {
		var colorPicker = $('cq-color-picker')[0];
		var cvpController = this;

		if (!colorPicker) return console.error('CVPController.prototype.pickColor: no <cq-color-picker> available');

		colorPicker.callback = function(color) {
			cvpController.color = color;
			cvpController.getColor(activator);
			cvpController.emit('change', {
				color: color
			});
		};
		colorPicker.display(activator);
	};

	CIQ.UI.CVPController = document.registerElement('cq-cvp-controller', CVPController);

	



	/**
	 * Views web component `<cq-views>`.
	 *
	 * This web component has two functions. The first is displaying available views in a menu.
	 * The second is providing a views dialog for entering a new view.
	 *
	 * @namespace WebComponents.cq-views
	 * @example
			<cq-menu class="ciq-menu ciq-views collapse">
				<span>Views</span>
				<cq-menu-dropdown>
					<cq-views>
						<cq-heading>Saved Views</cq-heading>
						<cq-views-content>
							<template cq-view>
								<cq-item>
									<cq-label></cq-label>
									<div class="ciq-icon ciq-close"></div>
								</cq-item>
							</template>
						</cq-views-content>
						<cq-separator cq-partial></cq-separator>
						<cq-view-save>
							<cq-item><cq-plus></cq-plus>Save View</cq-item>
						</cq-view-save>
					</cq-views>
				</cq-menu-dropdown>
			</cq-menu>
	 */
	var Views = {
		prototype: Object.create(CIQ.UI.ContextTag)
	};

	Views.prototype.attachedCallback=function(){
		if(this.attached) return;
		CIQ.UI.ContextTag.attachedCallback.apply(this);
		this.attached=true;
	};

	/**
	 * Initialize a views menu
	 *
	 * @param {Object} [params] Parameters to control behavior of the menu
	 * @param {Object} [params.viewObj={views:[]}] Specify the object which contains the "views" objects.  If omitted, will create one.
	 * @param {CIQ.NameValueStore} [params.nameValueStore=CIQ.NameValueStore] Specify the storage class.  If omitted, will use  {@link CIQ.NameValueStore}. See example for storage class function signatures and CB requirements.
	 * @param {Object} [params.renderCB=null] callback executed on menu after rendering.  Takes the menu as argument.
	 * @param {Object} [params.cb] Get a callback when the nameValueStore has retrieved the data.
	 * @memberof WebComponents.cq-views
	 * @example
	 * 	//
		// To have the views web component menus use a different storage function, 
		// just add it to the 'parameters.nameValueStore' like so:
		
		$("cq-views").each(function(){
			this.initialize({nameValueStore: new MyNameValueStore()});
		});
		
		//And make sure you create your own MyNameValueStore functions in the following format:
		
		 MyNameValueStore=function(){
		 };
		
		 MyNameValueStore.prototype.set=function(field, value, cb){
		   // Add code here to send the view object ('value') to your repository and store under a key of 'field'
		  if(cb) cb(errorCode);
		 };

		 MyNameValueStore.prototype.get=function(field, cb){
		  // Add code here to get the views object for key 'field' from your repository and rerun it in the callback.
		  if(cb) cb(errorCode, yourViewObject);
		 };
				
		 MyNameValueStore.prototype.remove=function(field, cb){
		  // Add code here to remove the view object under the key 'field' from your repository
		  if(cb) cb(errorCode);
		 };
	 * 
	 * @since 3.0.7 params.cb added to signature.
	 * @since TBC ViewMenu helper has been deprecated. Please call $("cq-views")[0].initialize() now.
	 * 
	 */
	Views.prototype.initialize=function(params){
		this.params=params?params:{};
		if(!this.params.viewObj) this.params.viewObj={views:[]};
		if(!this.params.nameValueStore) this.params.nameValueStore=new CIQ.NameValueStore();
		if(!this.params.template) this.params.template="template[cq-view]";
		this.params.template=this.node.find(this.params.template);
		this.params.template.detach();
		var self=this;
		this.params.nameValueStore.get("stx-views", function(err,obj){
			if(!err && obj) self.params.viewObj.views=obj;
			if(self.params.cb) self.params.cb.call(self);
			self.renderMenu();
		});
	};


	/**
	 * Creates the menu. You have the option of coding a hardcoded HTML menu and just using
	 * CIQ.UI.ViewsMenu for processing stxtap attributes, or you can call renderMenu() to automatically
	 * generate the menu.
	 * @memberof WebComponents.cq-views
	 */
	Views.prototype.renderMenu=function(){
		var menu=$(this.node);
		var self=this;
		var stx=self.context.stx;

		function remove(i){
			return function(e){
				e.stopPropagation();
				var saved=false;
				$("cq-views").each(function(){
					this.params.viewObj.views.splice(i,1);
					if(!saved){
						this.params.nameValueStore.set("stx-views",self.params.viewObj.views);
						saved=true;
					}
					this.renderMenu();
				});
			};
		}

		function enable(i){
			return function(e){
				e.stopPropagation();
				self.uiManager.closeMenu();
				if(self.context.loader) self.context.loader.show();
				var layout=CIQ.first(self.params.viewObj.views[i]);
				function importLayout(){
					var finishImportLayout = function(){
						stx.changeOccurred("layout");
						if(self.context.loader) self.context.loader.hide();
					};
					stx.importLayout(self.params.viewObj.views[i][layout], {managePeriodicity: true,preserveTicksAndCandleWidth: true,cb:finishImportLayout});
				}
				setTimeout(importLayout,10);
			};
		}

		menu.find("cq-views-content cq-item").remove();
		for(var v=0;v<this.params.viewObj.views.length;v++){
			var view=CIQ.first(self.params.viewObj.views[v]);
			if(view=="recent") continue;
			var item=CIQ.UI.makeFromTemplate(this.params.template);
			var label=item.find("cq-label");
			var removeView=item.find("div");

			if(label.length) {
				label.addClass("view-name-"+view);
				label.prepend(view);  //don't use text(); it wipes out anything else embedded in the item
			}
			if(removeView.length) removeView.stxtap(remove(v));
			this.makeTap(item[0],enable(v));
			menu.find("cq-views-content").append(item);
		}

		var addNew=menu.find("cq-view-save");
		if(addNew){
			var context=this.context;
			this.makeTap(addNew.find("cq-item")[0],function(e){
				$("cq-view-dialog").each(function(){
					$(this).find("input").val("");
					this.open({context:context});
				});
			});
		}
		if(this.params.renderCB) this.params.renderCB(menu);
	};

	CIQ.UI.Views=document.registerElement("cq-views", Views);

	



	/**
	 * Studies List web component `<cq-studies>`.
	 *
	 * This web component lists all available studies from the study library CIQ.Studies.studyLibrary.	
	 *
	 * @namespace WebComponents.cq-studies
	 * @since 5.2.0
	 * @example
			<cq-menu class="ciq-menu ciq-studies collapse">
				<span>Studies</span>
				<cq-menu-dropdown cq-no-scroll>
					<cq-study-legend cq-no-close>
						<cq-section-dynamic>
							<cq-heading>Current Studies</cq-heading>
							<cq-study-legend-content>
								<template>
									<cq-item>
										<cq-label class="click-to-edit"></cq-label>
										<div class="ciq-icon ciq-close"></div>
									</cq-item>
								</template>
							</cq-study-legend-content>
							<cq-placeholder>
								<div stxtap="Layout.clearStudies()" class="ciq-btn sm">Clear All</div>
							</cq-placeholder>
						</cq-section-dynamic>
					</cq-study-legend>
					<cq-scroll>
						<cq-studies>
							<cq-studies-content>
								<template>
									<cq-item>
										<cq-label></cq-label>
									</cq-item>
								</template>
							</cq-studies-content>
						</cq-studies>
					</cq-scroll>
				</cq-menu-dropdown>
			</cq-menu>
	 */
	var Studies = {};

	Studies.prototype = Object.create(CIQ.UI.ContextTag);

	Studies.prototype.attachedCallback=function(){
		if(this.attached) return;
		CIQ.UI.ContextTag.attachedCallback.apply(this);
		this.attached=true;
	};

	/**
	 * Initialize the Studies list.
	 *
	 * @param {Object} [params] Parameters to control behavior of the menu
	 * @param {Object} [params.excludedStudies] A map of study names that should not be put in the menu.
	 * @param {Boolean} [params.alwaysDisplayDialog=false] If set to true then, the study will automatically be added to the chart, but a dialog will also always be displayed to allow the end user to pick their study parameters. Otherwise the study will be created automatically with defaults. Can optionally be an object containing a map of which studys to always display the dialog for.
	 * @param {Boolean} [params.dialogBeforeAddingStudy=false] If set to true then a dialog will be displayed before the study is added to the chart. This can optionally be a map of which studies require a dialog before adding.
	 * @memberof WebComponents.cq-studies
	 * @since 5.2.0 CIQ.UI.StudyMenu helper has been deprecated. Please call $("cq-studies")[0].initialize() now.
	 * @example
	var params={
		excludedStudies: {
			"Directional": true,
			"Gopala":true,
			"vchart":true
		},
		alwaysDisplayDialog: {"ma":true}, 		// this is how to always show a dialog before adding the study
		dialogBeforeAddingStudy: {"rsi": true} 	// this is how to always show a dialog before adding the study
	};
	$("cq-studies").each(function(){
		this.initialize(params);
	});
	 */
	Studies.prototype.initialize=function(params){
		this.params=params||{};
		this.alwaysDisplayDialog=this.params.alwaysDisplayDialog||false;
		this.excludedStudies=this.params.excludedStudies||[];
		if(!this.params.template) this.params.template="template";
		this.params.template=this.node.find(this.params.template);
		this.params.template.detach();
		this.renderMenu();

		var self = this;

		CIQ.UI.observe({
			obj:CIQ.Studies.studyLibrary,
			action:"callback",
			value:function(){self.renderMenu();}
		});
	};


	/**
	 * Creates the menu. You have the option of coding a hardcoded HTML menu and just using
	 * CIQ.UI.Studies for processing stxtap attributes, or you can call renderMenu() to automatically
	 * generate the menu.
	 * @memberof WebComponents.cq-studies
	 */
	Studies.prototype.renderMenu=function(){

		var stx=this.context.stx;
		var alphabetized=[];
		var sd;

		for(var field in CIQ.Studies.studyLibrary){
			sd=CIQ.Studies.studyLibrary[field];
			if(!sd || this.excludedStudies[field] || this.excludedStudies[sd.name] || sd.siqList !== undefined) continue; // siqList = ScriptIQ entry
			if(!sd.name) sd.name=field; // Make sure there's always a name
			alphabetized.push(field);
		}
		alphabetized.sort(function(lhs, rhs){
			var lsd=CIQ.Studies.studyLibrary[lhs];
			var rsd=CIQ.Studies.studyLibrary[rhs];
			if(lsd.name<rsd.name) return -1;
			if(lsd.name>rsd.name) return 1;
			return 0;
		});
		var menu=$(this.node);
		var self=this;
		var tapFn=function(studyName, context){
			return function(e){
				pickStudy(e.target, studyName);
				menu.resize();
			};
		};

		var contentNode = menu.find("cq-studies-content");
		while (contentNode.length > 0 && contentNode[0].firstChild) {
			contentNode[0].removeChild(contentNode[0].firstChild);
		}

		for(var i=0;i<alphabetized.length;i++){
			var menuItem=CIQ.UI.makeFromTemplate(this.params.template);
			sd=CIQ.Studies.studyLibrary[alphabetized[i]];
			menuItem.append(CIQ.translatableTextNode(stx,sd.name));
			this.makeTap(menuItem[0], tapFn(alphabetized[i], this.context));
			menu.find("cq-studies-content").append(menuItem);
		}

		function studyDialog(params) {
			params.context=self.context;
			$("cq-study-dialog").each(function(){
				this.open(params);
			});
		}

		function pickStudy(node, studyName) {
			var stx=self.context.stx;

			function handleSpecialCase(flag, params){
				if(flag===true){
					studyDialog(params);
					return true;
				}else if(typeof flag==="object"){
					for(var i in flag){
						if(i==studyName && flag[i]){
							studyDialog(params);
							return true;
						}
					}
				}
			}

			if(handleSpecialCase(self.params.dialogBeforeAddingStudy, {stx: stx, name: studyName})) return;
			var sd=CIQ.Studies.addStudy(stx, studyName);
			handleSpecialCase(self.alwaysDisplayDialog, {sd: sd, stx: stx});
		}
	};

	CIQ.UI.StudyMenu=function() {
		throw new Error("The CIQ.UI.StudyMenu helper function has been replaced by a <cq-studies> webcomponent.");
	};

	CIQ.UI.StudiesComponent=document.registerElement("cq-studies", Studies);

	



	/**
	 * Menu web component `<cq-menu>`.
	 *
	 * Node that is contextually aware of its surroundings. Handles opening and closing {@link WebComponents.cq-menu-dropdown}.
	 * @namespace WebComponents.cq-menu
	 * @example
	 <cq-menu class="ciq-menu stx-markers collapse">
	 	<span>Events</span>
	 	<cq-menu-dropdown>
	 		<cq-item class="square">Simple Square <span class="ciq-radio"><span></span></span>
	 		</cq-item>
	 		<cq-item class="circle">Simple Circle <span class="ciq-radio"><span></span></span>
	 		</cq-item>
	 		<cq-item class="callouts">Callouts <span class="ciq-radio"><span></span></span>
	 		</cq-item>
	 		<cq-item class="abstract">Abstract <span class="ciq-radio"><span></span></span>
	 		</cq-item>
	 		<cq-item class="none">None <span class="ciq-radio ciq-active"><span></span></span>
	 		</cq-item>
	 	</cq-menu-dropdown>
	 </cq-menu>
	 */

	var Menu = {
		prototype: Object.create(HTMLElement.prototype)
	};

	Menu.prototype.createdCallback=function(){
		this.node=$(this);
		this.activeClassName="stxMenuActive";
		this.active=false;
	};

	Menu.prototype.attachedCallback=function(){
		if(this.attached) return;
		this.uiManager=$("cq-ui-manager");
		if(this.uiManager.length>0) this.uiManager=this.uiManager[0];

		this.attached=true;
		
		if(this.node.attr("readonly")) return;
		var self=this;
		function handleTap(e){
			self.tap(e);
		}
		function handleCaptureTap(e){
			self.captureTap(e);
		}
		var thisNode=this.node[0];
		this.node.stxtap(handleTap);
		thisNode.addEventListener("stxtap", handleCaptureTap, true);
	};

	Menu.prototype.open=function(params){
		var stack=this.uiManager.activeMenuStack;
		for(var i=0;i<stack.length;i++){
			if(stack[i]===this) return;
		}
		this.uiManager.openMenu(this, params);
	};

	Menu.prototype.close=function(){
		this.uiManager.closeMenu(this);
	};

	Menu.prototype.lift=function(){
		var lifts=this.lifts=this.uiManager.findLifts(this);
		for(var i=0;i<lifts.length;i++){
			this.uiManager.lift(lifts[i]);
		}
	};

	Menu.prototype.unlift=function(){
		var lifts=this.lifts;
		if(!lifts) return;
		for(var i=0;i<lifts.length;i++){
			this.uiManager.restoreLift(lifts[i]);
		}
		this.lifts=null;
	};

	Menu.prototype.show=function(params){
		if(this.active) return;
		this.active=true;
		this.node.addClass(this.activeClassName);
		this.lift();
		// For good measure, call resize on any nested scrollables to give them
		// a chance to change their height and scrollbars
		var scrolls=this.node.find("cq-scroll");
		scrolls.each(function(){
			this.resize();
		});
	};

	Menu.prototype.hide=function(){
		if(!this.active) return;
		this.unlift();
		this.node.removeClass(this.activeClassName);
		this.active=false;
		// blur any input boxes that are inside the menu we're closing, to get rid of soft keyboard
		$(this).find("input").each(function(){
			if(this==document.activeElement) this.blur();
		});
	};

	/**
	 * Captures a tap event *before* it descends down to what it is clicked on. The key thing this does is determine
	 * whether the thing clicked on was inside of a "cq-no-close" section. We do this on the way down, because the act
	 * of clicking on something may release it from the dom, making it impossible to figure out on propagation.
	 * @param {object} e Element
	 * @private
	 */
	Menu.prototype.captureTap=function(e){
		var target=$(e.target);
		var domChain=target.parents().addBack();
		// Determine if the tapped element, or any of its parents have a cq-no-close attribute
		this.noClose=domChain.filter(function(){
			var attr=$(this).attr("cq-no-close");
			return typeof attr !== typeof undefined && attr !== false;
		}).length;

		// Determine if the tapped element was inside of something untappable, like a cq-heading or cq-separator
		if(!this.noClose){
			this.noClose=domChain.filter(function(){
				return $(this).is("cq-separator,cq-heading");
			}).length;
		}
	};

	Menu.prototype.tap=function(e){
		var uiManager=this.uiManager;
		if(this.active){ // tapping on the menu if it is open will close it
			// todo, don't close if active children (cascading). Note, cascading already works for dialogs.
			e.stopPropagation();
			if(!this.noClose) uiManager.closeMenu(this);
		}else if(!this.active){ // if we've clicked on the label for the menu, then open the menu			
			e.stopPropagation();

			// If the tap came from within this menu's cq-menu-dropdown then this is probably an accidental
			// "re-open", which occurs when a click on a menu item causes an action that closes the menu, tricking
			// it into thinking it should re-open
			var target=$(e.target);
			var insideDropdown=target.parents("cq-menu-dropdown");
			if(insideDropdown.length) return;
			
			var child=false;
			var parents=this.node.parents("cq-menu,cq-dialog");
			for(var i=0;i<parents.length;i++){
				if(parents[i].active) child=true;
			}
			if(!child) uiManager.closeMenu(); // close all menus unless we're the child of an active menu (cascading)

			this.open();
		}
	};

	CIQ.UI.Menu=document.registerElement("cq-menu", Menu);

	



	/**
	 * Menu DropDown web component `<cq-menu-dropdown>`.
	 *
	 * Menu DropDown handles holding the items that go inside a custom menu component.
	 * @namespace WebComponents.cq-menu-dropdown
	 * @example
	 <cq-menu class="ciq-menu ciq-studies collapse">
		 <span>Studies</span>
		 <cq-menu-dropdown cq-no-scroll>
			 <cq-study-legend cq-no-close>
				 <cq-section-dynamic>
					 <cq-heading>Current Studies</cq-heading>
					 <cq-study-legend-content>
						 <template>
							 <cq-item>
								 <cq-label class="click-to-edit"></cq-label>
								 <div class="ciq-icon ciq-close"></div>
							 </cq-item>
						 </template>
					 </cq-study-legend-content>
					 <cq-placeholder>
						 <div stxtap="Layout.clearStudies()" class="ciq-btn sm">Clear All</div>
					 </cq-placeholder>
				 </cq-section-dynamic>
			 </cq-study-legend>
			 <cq-scroll>
				 <cq-studies>
				 	 <cq-studies-content>
						<template>
							<cq-item>
								<cq-label></cq-label>
							</cq-item>
						</template>
					 </cq-studies-content>
				 </cq-studies>
			 </cq-scroll>
		 </cq-menu-dropdown>
	 */

	var MenuDropDown = {
		prototype: Object.create(CIQ.UI.BaseComponent)
	};

	// Whoa, double inheritance! Yes, we need this web component to inherit from both
	// CIQ.UI.Scroll as well as CIQ.UI.BaseComponent.
	CIQ.UI.addInheritance(MenuDropDown, CIQ.UI.Scroll);

	MenuDropDown.prototype.createdCallback=function(){
		if (this.ownerDocument !== document) return;  //https://bugs.chromium.org/p/chromium/issues/detail?id=430578
		var node=$(this);
		CIQ.UI.BaseComponent.createdCallback.call(this);
		if(typeof(node.attr("cq-no-scroll"))=="undefined")
			CIQ.UI.Scroll.prototype.createdCallback.call(this);
	};

	MenuDropDown.prototype.attachedCallback=function(){
		if(this.attached) return;
		var node=$(this);
		this.noMaximize=true;
		CIQ.UI.BaseComponent.attachedCallback.call(this);
		this.attached=false; // double inheritance!
		if(typeof(node.attr("cq-no-scroll"))=="undefined")
			CIQ.UI.Scroll.prototype.attachedCallback.call(this);
		this.attached=true;
	};



	CIQ.UI.MenuDropDown=document.registerElement("cq-menu-dropdown", MenuDropDown);

	



	/**
	 * Share Button web component `<cq-share-button>`.
	 *
	 * @namespace WebComponents.cq-share-button
	 * @example
	 <cq-share-button>
		 <div stxtap="tap();">Share</div>
	 </cq-share-button>
	 */
	var ShareButton = {
		prototype: Object.create(CIQ.UI.ContextTag)
	};

	/**
	 * Opens a customizable dialog that can share a chart.
	 * @alias tap
	 * @memberof WebComponents.cq-share-button
	 */
	ShareButton.prototype.tap=function(e){
		var context=this.context;
		$("cq-share-dialog").each(function(){
			this.open({context: context});
		});
	};



	CIQ.UI.ShareButton=document.registerElement("cq-share-button", ShareButton);

	



	/**
	 * Share Dialog web component `<cq-share-dialog>`.
	 *
	 * @namespace WebComponents.cq-share-dialog
	 * @example
	 <cq-dialog>
	 	<cq-share-dialog>
	 		<div>
	 			<h4 class="title">Share Your Chart</h4>
	 			<cq-separator></cq-separator>
	 			<p>Press this button to generate a shareable image:</p>
	 				<div class="ciq-btn" stxtap="share()">
	 						Create Image
	 				</div>

	 			<div class="share-link-div"></div>

	 			<cq-separator></cq-separator>
	 			<div class="ciq-dialog-cntrls">
	 				<div stxtap="close()" class="ciq-btn">Done</div>
	 			</div>

	 		</div>
	 	</cq-share-dialog>
	 </cq-dialog>
	 */
	var ShareDialog = {
		prototype: Object.create(CIQ.UI.DialogContentTag)
	};

	ShareDialog.prototype.setState=function(state){
		this.node.find("cq-share-create").css({"display":"none"});
		this.node.find("cq-share-generating").css({"display":"none"});
		this.node.find("cq-share-uploading").css({"display":"none"});
		this.node.find("cq-share-" + state).css({"display":"inline-block"});
	};

	ShareDialog.prototype.close=function(){
		// Clear out the link and then close
		$("cq-share-dialog .share-link-div").html("");
		CIQ.UI.DialogContentTag.close.apply(this);
	};

	/**
	 * Shares a chart with default parameters
	 * @alias share
	 * @memberof WebComponents.cq-share-dialog
	 */
	ShareDialog.prototype.share=function(){
		var stx=this.context.stx;
		var self=this;
		this.setState("generating");
		$("cq-share-dialog .share-link-div").html("");
		// "hide" is a selector list, of DOM elements to be hidden while an image of the chart is created.  "cq-comparison-add-label" and ".chartSize" are hidden by default.
		CIQ.UI.bypassBindings=true;
		CIQ.Share.createImage(stx, {hide:[".stx_chart_controls"]}, function(data){
			CIQ.UI.bypassBindings=false;
			var id=CIQ.uniqueID();
			var host="https://share.chartiq.com";
			var startOffset=stx.getStartDateOffset();
			var metaData={
				"layout":stx.exportLayout(),
				"drawings":stx.exportDrawings(),
				"xOffset":startOffset,
				"startDate":stx.chart.dataSegment[startOffset].Date,
				"endDate":stx.chart.dataSegment[stx.chart.dataSegment.length-1].Date,
				"id":id,
				"symbol":stx.chart.symbol
			};
			var url= host + "/upload/" + id;
			var payload={"id":id,"image":data,"config":metaData};

			self.setState("uploading");
			CIQ.Share.uploadImage(data, url, payload, function(err, response){
				self.setState("create");
				if(err!==null){
					CIQ.alert("error: "+err);
				}
				else {
					$("cq-share-dialog .share-link-div").html(host+response);
				}
			});
		});
	};

	CIQ.UI.ShareDialog=document.registerElement("cq-share-dialog", ShareDialog);

  



	/**
	 * Aggregation Dialog web component `<cq-aggregation-dialog>`.
	 *
	 * @namespace WebComponents.cq-aggregation-dialog
	 */
	var AggregationDialog = {
		prototype: Object.create(CIQ.UI.DialogContentTag)
	};

	/**
	 * Opens the nearest {@link WebComponents.cq-dialog} to display your dialog.
	 * @alias open
	 * @memberof WebComponents.cq-aggregation-dialog
	 */
	AggregationDialog.prototype.open=function(params){
		CIQ.UI.DialogContentTag.open.apply(this, arguments);
		var stx=this.context.stx;
		var aggregationType=params.aggregationType;
		var map={
			kagi:{
				title:"Set Reversal Percentage"
			},
			renko:{
				title:"Set Range"
			},
			linebreak:{
				title:"Set Price Lines"
			},
			rangebars:{
				title:"Set Range"
			},
			pandf:{
				title:"Set Point & Figure Parameters"
			}
		};
		if(stx.layout.aggregationType!=aggregationType)
			stx.setAggregationType(aggregationType);

		var entry=map[aggregationType];
		var node=this.node;
		node.find(".title").text(stx.translateIf(entry.title));

		for(var type in map){
			node.find(".ciq" + type).css(aggregationType===type?{display:""}:{display:"none"});
		}
		node.find(".ciq" + aggregationType + " input").each(function(){
			var name=this.name;
			if(name=="box" || name=="reversal") name="pandf."+name;
			var tuple=CIQ.deriveFromObjectChain(stx.layout, name);
			if(tuple && !tuple.obj[tuple.member] && stx.chart.defaultChartStyleConfig[this.name])
				$(this).val(stx.chart.defaultChartStyleConfig[this.name]);
		});

	};

	CIQ.UI.AggregationDialog=document.registerElement("cq-aggregation-dialog", AggregationDialog);

  



	/**
	 * Color Picker web component `<cq-color-picker>`.
	 *
	 * cq-colors attribute can contain a csv list of CSS colors to use
	 * or this.params.colorMap can be set to a two dimensional array of colors
	 * @namespace WebComponents.cq-color-picker
	 * @example
		 <cq-color-picker>
			 <cq-colors></cq-colors>
			 <cq-overrides>
				 <template>
					 <div class="ciq-btn"></div>
				 </template>
			 </cq-overrides>
		 </cq-color-picker>
	 */
	var ColorPicker = {
		prototype: Object.create(CIQ.UI.Dialog.prototype)
	};

	ColorPicker.prototype.createdCallback=function(){
		CIQ.UI.Dialog.prototype.createdCallback.apply(this);
		this.params={
			colorMap:[
				["#ffffff", "#e1e1e1", "#cccccc", "#b7b7b7", "#a0a0a5", "#898989", "#707070", "#626262", "#555555", "#464646", "#363636", "#262626", "#1d1d1d", "#000000"],
				["#f4977c", "#f7ac84", "#fbc58d", "#fff69e", "#c4de9e", "#85c99e", "#7fcdc7", "#75d0f4", "#81a8d7", "#8594c8", "#8983bc", "#a187bd", "#bb8dbe", "#f29bc1"],
				["#ef6c53", "#f38d5b", "#f8ae63", "#fff371", "#acd277", "#43b77a", "#2ebbb3", "#00bff0", "#4a8dc8", "#5875b7", "#625da6", "#8561a7", "#a665a7", "#ee6fa9"],
				["#ea1d2c", "#ee652e", "#f4932f", "#fff126", "#8ec648", "#00a553", "#00a99c", "#00afed", "#0073ba", "#0056a4", "#323390", "#66308f", "#912a8e", "#e9088c"],
				["#9b0b16", "#9e4117", "#a16118", "#c6b920", "#5a852d", "#007238", "#00746a", "#0077a1", "#004c7f", "#003570", "#1d1762", "#441261", "#62095f", "#9c005d"],
				["#770001", "#792e03", "#7b4906", "#817a0b", "#41661e", "#005827", "#005951", "#003b5c", "#001d40", "#000e35", "#04002c", "#19002b", "#2c002a", "#580028"],
			]
		};
	};

	ColorPicker.prototype.attachedCallback=function(){
		if(this.attached) return;
		CIQ.UI.Dialog.prototype.attachedCallback.apply(this);

		var node=$(this);
		var colors=node.attr("cq-colors");
		if(colors){
			// Convert a csv list of colors to a two dimensional array
			colors=colors.split(",");
			var cols=Math.ceil(Math.sqrt(colors.length));
			this.params.colorMap=[];
			console.log("this.params.colorMap=[]");
			console.log(typeof this.params.colorMap);
			var col=0;
			var row=[];
			for(var i=0;i<colors.length;i++){
				if(col>=cols){
					col=0;
					this.params.colorMap.push(row);
					row=[];
				}
				row.push(colors[i]);
				col++;
			}
			this.params.colorMap.push(row);
		}
		this.cqOverrides=node.find("cq-overrides");
		this.template=this.cqOverrides.find("template");
		this.initialize();
		this.attached=true;
	};

	/**
	 * @param {object} colorMap Object that holds an array of various color arrays.
	 * @alias setColors
	 * @memberof WebComponents.cq-color-picker
	 */
	ColorPicker.prototype.setColors=function(colorMap){
		this.params.colorMap=colorMap;
		this.initialize();
	};

	ColorPicker.prototype.initialize=function(){
		var self=this;
		this.picker=$(this);
		this.colors=this.picker.find("cq-colors");
		if(!this.colors.length) this.colors=this.picker;
		this.colors.empty();// allow re-initialize, with new colors for instance

		function closure(self, color){
			return function(){
				self.pickColor(color);
			};
		}
		for(var a=0;a<this.params.colorMap.length;a++){
			var lineOfColors=this.params.colorMap[a];
			var ul=$("<UL></UL>").appendTo(this.colors);
			for(var b=0;b<lineOfColors.length;b++){
				var li=$("<LI></LI>").appendTo(ul);
				var span=$("<SPAN></SPAN>").appendTo(li);
				span.css({"background-color": lineOfColors[b]});
				span.stxtap(closure(self, lineOfColors[b]));
			}
		}
	};

	/**
	 * @param color
	 * @alias pickColor
	 * @memberof WebComponents.cq-color-picker
	 */
	ColorPicker.prototype.pickColor=function(color){
		if(this.callback) this.callback(color);
		this.close();
	};

	ColorPicker.prototype.resize=function(){
		// do nothing for resize, overrides Dialog default which centers
	};

	/**
	 * Displays the color picker in proximity to the node passed in
	 * @param  {object} activator The object representing what caused picker to display
	 * @param  {HTMLElement} [activator.node] The node near where to display the color picker
	 * @param {Array} [activator.overrides] Array of overrides. For each of these, a button will be created that if pressed
	 * will pass that override back instead of the color
	 * @alias display
	 * @memberof WebComponents.cq-color-picker
	 */
	ColorPicker.prototype.display=function(activator){
		var node=$(activator.node);

		// Algorithm to place the color picker to the right of whichever node was just pressed
		var positionOfNode=node[0].getBoundingClientRect();
		this.picker.css({"top":"0px","left":"0px"});
		var positionOfColorPicker=this.parentNode.getBoundingClientRect();
		var x=positionOfNode.left-positionOfColorPicker.left + node.width() + 10;
		var y=positionOfNode.top-positionOfColorPicker.top + 5;

		// ensure color picker doesn't go off right edge of screen
		var docWidth=$( document ).width();
		var w=this.picker.width();
		if(x+w>docWidth) x=docWidth-w-20; // 20 for a little whitespace and padding

		// or bottom of screen
		var docHeight=$( document ).height();
		var h=this.picker.height();
		if(y+h>docHeight) y=docHeight-h-20; // 20 for a little whitespace and padding

		this.picker.css({"left": x+"px","top": y+"px"});
		this.cqOverrides.emptyExceptTemplate();

		if(activator.overrides && this.template.length){
			for(var i=0;i<activator.overrides.length;i++){
				var override=activator.overrides[i];
				var n=CIQ.UI.makeFromTemplate(this.template, true);
				n.text(override);
				n.stxtap((function(self,override){return function(){self.pickColor(override);};})(this, override));
			}
		}

		if(!this.picker.hasClass("stxMenuActive")){
			this.picker[0].open({context:CIQ.UI.getMyContext(this)}); // Manually activate the color picker
		}else{
			if(this.context.e) this.context.e.stopPropagation(); // Otherwise the color picker is closed when you swap back and forth between fill and line swatches on the toolbar
		}
	};

	CIQ.UI.ColorPicker=document.registerElement("cq-color-picker", ColorPicker);

	



	/**
	 * Study Dialogs web component `<cq-study-dialog>`.
	 *
	 * Creates and manages Study Dialogs based on the corresponding study library entry
	 * (title, inputs, outputs, parameters, etc).
	 *
	 * Optional Attributes:
	 * - `cq-study-axis`  : Displays UI to enable changing the axis position and color.
	 * - `cq-study-panel` : Displays UI to enable changing the study panel and underlay/overlay flag.
	 *
	 * @namespace WebComponents.cq-study-dialog
	 * @example
	 	<caption>
		Here is an example of how to create a study dialog.
		We set the `cq-study-axis` and `cq-study-panel` attributes to enable form fields used to control axis position, color, study panel, and underlay/overlay.
		</caption>
<cq-dialog>
	<cq-study-dialog cq-study-axis cq-study-panel>
		<h4 class="title">Study</h4>
		<cq-scroll cq-no-maximize>
			<cq-study-inputs>
				<template cq-study-input>
					<cq-study-input>
						<div class="ciq-heading"></div>
						<div class="stx-data">
							<template cq-menu>
								<cq-menu class="ciq-select">
									<cq-selected></cq-selected>
									<cq-menu-dropdown cq-lift></cq-menu-dropdown>
								</cq-menu>
							</template>
						</div>
					</cq-study-input>
				</template>
			</cq-study-inputs>
			<hr>
			<cq-study-outputs>
				<template cq-study-output>
					<cq-study-output>
						<div class="ciq-heading"></div>
						<cq-swatch cq-overrides="auto"></cq-swatch>
					</cq-study-output>
				</template>
			</cq-study-outputs>
			<hr>
			<cq-study-parameters>
				<template cq-study-parameters>
					<cq-study-parameter>
						<div class="ciq-heading"></div>
						<div class="stx-data"><cq-swatch cq-overrides="auto"></cq-swatch>
							<template cq-menu>
								<cq-menu class="ciq-select">
									<cq-selected></cq-selected>
									<cq-menu-dropdown cq-lift></cq-menu-dropdown>
								</cq-menu>
							</template>
						</div>
					</cq-study-parameter>
				</template>
			</cq-study-parameters>
		</cq-scroll>
		<div class="ciq-dialog-cntrls">
			<div class="ciq-btn" stxtap="close()">Done</div>
		</div>
	</cq-study-dialog>
</cq-dialog>
	 * @since 5.2.0 Optional Attributes `cq-study-axis` and `cq-study-panel` are now available. 
	 */

	var StudyDialog = {
		prototype: Object.create(CIQ.UI.DialogContentTag)
	};

	StudyDialog.prototype.setContext=function(context){
		CIQ.UI.DialogContentTag.setContext.call(this, context);
		context.advertiseAs(this, 'StudyDialog');
	};

	StudyDialog.prototype.attachedCallback=function(){
		if(this.attached) return;
		CIQ.UI.DialogContentTag.attachedCallback.apply(this);
		var dialog=$(this);
		this.inputTemplate=dialog.find("template[cq-study-input]");
		this.outputTemplate=dialog.find("template[cq-study-output]");
		this.parameterTemplate=dialog.find("template[cq-study-parameters]");
		this.attached=true;
		this.queuedUpdates={};
	};

	StudyDialog.prototype.hide=function(){
		if(!CIQ.isEmpty(this.queuedUpdates)){
			this.helper.updateStudy(this.queuedUpdates);
			this.queuedUpdates={};
		}
		this.node.find("cq-menu").each(function(){
			if(this.unlift) this.unlift();
		});
		this.node.find("cq-swatch").each(function(){
			if(this.colorPicker) this.colorPicker.close();
		});
	};

	/**
	 * Sets up a handler to process changes to input fields
	 * @param {HTMLElement} node    The input field
	 * @param {string} section The section that is being updated, "inputs","outputs","parameters"
	 * @param {string} name    The name of the field being updated
	 * @memberof! WebComponents.cq-study-dialog
	 * @private
	 */
	StudyDialog.prototype.setChangeEvent=function(node, section, name){
		var self=this;
		function closure(){
			return function(){
				var updates={};
				updates[section]={};
				updates[section][name]=this.value;
				if(this.type=="checkbox" || this.type=="radio"){
					updates[section][name]=this.checked;
				}
				self.updateStudy(updates);
			};
		}
		node.change(closure());
	};

	StudyDialog.prototype.updateStudy=function(updates){
		if($(this).find(":invalid").length) return;
		if(this.helper.libraryEntry.deferUpdate){
			CIQ.extend(this.queuedUpdates, {inputs:updates.inputs});
			this.helper.updateStudy({outputs:updates.outputs, parameters:updates.parameters});
		}else{
			this.helper.updateStudy(updates);
		}
	};

	/**
	 * Accepts new menu (select box) selections
	 * @param {object} activator
	 * @param {string} section within the dialog ("inputs", "outputs", "parameters")
	 * @memberof! WebComponents.cq-study-dialog
	 * @since 5.2.0 added section argument
	 */
	StudyDialog.prototype.setSelectOption=function(activator, section){
		var node = $(activator.node);
		var name = node.attr('name');
		var value = node.attr('value');
		var newInput=$(node[0].cqMenuWrapper);
		var inputValue=newInput.find("cq-selected");
		inputValue.text(this.helper.stx.translateIf(value));
		newInput[0].fieldValue=value;
		if(!section) section="inputs";
		var updates={};
		updates[section]={};
		updates[section][name]=value;
		this.updateStudy(updates);
	};
	
	/**
	 * Adds fields to the study parameters, applicable to all studies, based on component attribute settings
	 * @param {object} sd  Study descriptor
	 * @memberof! WebComponents.cq-study-dialog
	 * @since 5.2.0
	 */
	StudyDialog.prototype.setGenericParameters=function(sd){
		sd.parameters.yaxisDisplay=sd.parameters.yaxisDisplayValue;
		if(this.hasAttribute("cq-study-panel")) {
			if(!sd.parameters) sd.parameters={};
			sd.parameters.panelName="panel";
			sd.parameters.underlayEnabled=false;
		}
		if(this.hasAttribute("cq-study-axis")) {
			if(!sd.parameters) sd.parameters={};
			sd.parameters.yaxisDisplay=["right","left","none","shared"];
		}
	};

	StudyDialog.prototype.open=function(params){
		CIQ.UI.DialogContentTag.open.apply(this, arguments);

		if(params && params.sd) this.setGenericParameters(params.sd);
		// Generate a "helper" which tells us how to create a dialog
		this.helper=new CIQ.Studies.DialogHelper(params);
		var dialog=$(this);

		dialog.find(".title").text(this.helper.title);

		var self=this;
		function makeMenu(name, currentValue, fields, section){
			var menu=CIQ.UI.makeFromTemplate(self.menuTemplate);
			var cqMenu=menu.find("cq-menu-dropdown"); // scrollable in menu.
			for(var field in fields){
				var item=$("<cq-item></cq-item>");
				item.text(fields[field]);
				item.attr("stxtap","StudyDialog.setSelectOption('"+section+"')"); // must call StudyDialog because the item is "lifted" and so doesn't know it's parent
				cqMenu.append(item);
				item[0].cqMenuWrapper=cqMenu.parents("cq-menu")[0];
				item.attr("name", name);
				item.attr("value", field);
				item[0].context=self.context;
			}
			var inputValue=menu.find("cq-selected");
			inputValue.text(self.helper.stx.translateIf(currentValue));
			return menu;
		}

		// Create form elements for all of the inputs
		var attributes;
		var inputs=dialog.find("cq-study-inputs");
		var i;
		inputs.empty();
		for (i = 0; i < this.helper.inputs.length; i++) {
			var input=this.helper.inputs[i];
			var newInput=CIQ.UI.makeFromTemplate(this.inputTemplate, inputs);
			this.menuTemplate=newInput.find("template[cq-menu]");
			newInput.find(".ciq-heading").text(input.heading);
			newInput[0].fieldName=input.name;
			var formField=null;

			var iAttr;
			attributes=this.helper.attributes[input.name];
			if(input.type=="number"){
				formField=$("<input>");
				formField.attr("type", "number");
				formField.val(input.value);
				this.setChangeEvent(formField, "inputs", input.name);
				for(iAttr in attributes) {
					var iAttrVal=attributes[iAttr];
					// poor IE/Edge can't perform decimal step validation properly, so we need to change step to any and give up the neat step effect
					if((CIQ.isIE || CIQ.isEdge) && iAttr=="step" && Math.floor(iAttrVal)!=iAttrVal) iAttrVal="any";
					formField.attr(iAttr,iAttrVal);
				}
			}else if(input.type=="text"){
				formField=$("<input>");
				formField.attr("type", "text");
				formField.val(input.value);
				this.setChangeEvent(formField, "inputs", input.name);
				for(iAttr in attributes) formField.attr(iAttr,attributes[iAttr]);
			}else if(input.type=="select"){
				formField=makeMenu(input.name, input.value, input.options, "inputs");
				if(attributes && attributes.readonly) formField.attr("readonly",attributes.readonly);
			}else if(input.type=="checkbox"){
				formField=$("<input>");
				formField.attr("type","checkbox");
				if(input.value) formField.prop("checked", true);
				this.setChangeEvent(formField, "inputs", input.name);
				for(iAttr in attributes) formField.attr(iAttr,attributes[iAttr]);
			}
			if(attributes && attributes.hidden) newInput.hide();
			if(formField) newInput.find(".stx-data").append(formField);
		}
		var swatch;
		var outputs=dialog.find("cq-study-outputs");
		outputs.empty();
		for (i = 0; i < this.helper.outputs.length; i++) {
			var output=this.helper.outputs[i];
			var newOutput=CIQ.UI.makeFromTemplate(this.outputTemplate, outputs);
			newOutput[0].initialize({studyDialog:this, output:output.name, params: params});
			newOutput.find(".ciq-heading").text(output.heading);
			newOutput.find(".ciq-heading")[0].fieldName=output.name;

			swatch=newOutput.find("cq-swatch");
			var color = output.color;
			if(typeof color === 'object') {
				color = color.color;
			}
			swatch[0].setColor(color, false); // don't percolate
		}

		var parameters=dialog.find("cq-study-parameters");
		parameters.empty();
		for (i = 0; i < this.helper.parameters.length; i++) {
			var parameter=this.helper.parameters[i];
			var newParam=CIQ.UI.makeFromTemplate(this.parameterTemplate, parameters);
			this.menuTemplate=newParam.find("template[cq-menu]");
			if(!this.menuTemplate.length && parameter.options) {
				newParam.remove();
				continue;
			}
			newParam.find(".ciq-heading").text(parameter.heading);
			swatch=newParam.find("cq-swatch");
			var paramInput=$("<input>");
			var pAttr;
			attributes={};
			if(parameter.defaultValue.constructor==Boolean){
				paramInput.attr("type", "checkbox");
				if(parameter.value) paramInput.prop("checked", true);
				this.setChangeEvent(paramInput, "parameters", parameter.name+"Enabled");
				swatch.remove();

				attributes=this.helper.attributes[parameter.name+"Enabled"];
				for(pAttr in attributes) paramInput.attr(pAttr,attributes[pAttr]);
			}else if(parameter.defaultValue.constructor==String){
				var paramName=parameter.name;
				if(parameter.defaultColor){
					newParam[0].initialize({studyDialog:this, parameter:parameter.name+"Color", params: params});
					swatch[0].setColor(parameter.color, false); // don't percolate
					paramName=paramName+"Value";
				}else{
					swatch.remove();
				}
				if(parameter.options){
					paramInput=makeMenu(paramName, parameter.value, parameter.options, "parameters");
				}else{
					paramInput.val(parameter.value);
				}
				attributes=this.helper.attributes[paramName];
				for(pAttr in attributes) paramInput.attr(pAttr,attributes[pAttr]);
			}else if(parameter.defaultValue.constructor==Number){
				paramInput.attr("type", "number");
				paramInput.val(parameter.value);
				this.setChangeEvent(paramInput, "parameters", parameter.name+"Value");
				newParam[0].initialize({studyDialog:this, parameter:parameter.name+"Color", params: params});
				swatch[0].setColor(parameter.color, false); // don't percolate

				attributes=this.helper.attributes[parameter.name+"Value"];
				for(pAttr in attributes) {
					var pAttrVal=attributes[pAttr];
					// poor IE/Edge can't perform decimal step validation properly, so we need to change step to any and give up the neat step effect
					if((CIQ.isIE || CIQ.isEdge) && pAttr=="step" && Math.floor(pAttrVal)!=pAttrVal) pAttrVal="any";
					paramInput.attr(pAttr,pAttrVal);
				}
			}else continue;

			if(attributes && attributes.hidden) newParam.hide();
			newParam.find(".stx-data").append(paramInput);
		}
	};

	CIQ.UI.StudyDialog=document.registerElement("cq-study-dialog", StudyDialog);

	



	/**
	 * Study input web component `<cq-study-input>`.
	 *
	 * See example in {@link CIQ.WebComponents.cq-study-dialog}.
	 * @namespace WebComponents.cq-study-input
	 */
	var StudyInput = {
		prototype: Object.create(CIQ.UI.BaseComponent)
	};

	CIQ.UI.StudyInput = document.registerElement("cq-study-input", StudyInput);

	



	/**
	 * Study legend web component `<cq-study-legend>`.
	 *
	 * Click on the "X" to remove the study.
	 * Click on the cog to edit the study.
	 * Optionally only show studies needing custom Removal. cq-custom-removal-only
	 * Optionally only show overlays. cq-overlays-only
	 * Optionally only show studies in this panel. cq-panel-only
	 *
	 * @namespace WebComponents.cq-study-legend
	 * @example
	    <caption>
		Here is an example of how to create a study legend on the chart.
		We use the `cq-marker` attribute to ensure that it floats inside the chart.
		We set the optional `cq-panel-only` attribute so that only studies from
		this panel are displayed.
		</caption>
<cq-study-legend cq-marker-label="Studies" cq-overlays-only cq-marker cq-hovershow>
	<template>
		<cq-item>
			<cq-label></cq-label>
			<span class="ciq-edit"></span>
			<div class="ciq-icon ciq-close"></div>
		</cq-item>
	</template>
</cq-study-legend>
	 * @example
	    <caption>
		Here is an example of how to create a study legend inside a drop down menu.
		We use the `cq-no-close` attribute so that drop down is not closed when the user removes a study from the list.
		</caption>
<cq-menu class="ciq-menu ciq-studies collapse">
	<span>Studies</span>
	<cq-menu-dropdown cq-no-scroll>
		<cq-study-legend cq-no-close>
			<cq-section-dynamic>
				<cq-heading>Current Studies</cq-heading>
				<cq-study-legend-content>
					<template>
						<cq-item>
							<cq-label class="click-to-edit"></cq-label>
							<div class="ciq-icon ciq-close"></div>
						</cq-item>
					</template>
				</cq-study-legend-content>
				<cq-placeholder>
					<div stxtap="Layout.clearStudies()" class="ciq-btn sm">Clear All</div>
				</cq-placeholder>
			</cq-section-dynamic>
		</cq-study-legend>
		<cq-scroll>
			<cq-studies>
				<cq-studies-content>
					<template>
						<cq-item>
							<cq-label></cq-label>
						</cq-item>
					</template>
				</cq-studies-content>
			</cq-studies>
		</cq-scroll>

	</cq-menu-dropdown>
</cq-menu>
	 *
	 */
	var StudyLegend = {
		prototype: Object.create(CIQ.UI.ModalTag)
	};

	StudyLegend.prototype.setContext=function(context){
		this.previousStudies={};
	};

	/**
	 * Begins running the StudyLegend.
	 * @memberof! WebComponents.cq-study-legend
	 * @private
	 */
	StudyLegend.prototype.begin=function(){
		var self=this;
		self.template=self.node.find("template");
		function render(){
			self.showHide();
			self.renderLegend();
		}
		this.context.stx.addEventListener("layout",render);
		render();
	};

	StudyLegend.prototype.showHide=function(){
		for(var s in this.context.stx.layout.studies){
			if(!this.context.stx.layout.studies[s].customLegend){
				this.node.css({"display":""});
				return;
			}
		}
		this.node.css({"display":"none"});
	};

	/**
	 * Renders the legend based on the current studies in the CIQ.ChartEngine object.
	 * @memberof! WebComponents.cq-study-legend
	 */
	StudyLegend.prototype.renderLegend=function(){
		var stx=this.context.stx;
		if(!stx.layout.studies) return;

		this.previousStudies=CIQ.shallowClone(stx.layout.studies);

		$(this.template).parent().emptyExceptTemplate();

		function closeStudy(self, sd){
			return function(e){
				// Need to run this in the nextTick because the study legend can be removed by this click
				// causing the underlying chart to receive the mousedown (on IE win7)
				setTimeout(function(){
					if(!sd.permanent) CIQ.Studies.removeStudy(self.context.stx,sd);
					if(self.node[0].hasAttribute("cq-marker")) self.context.stx.modalEnd();
					self.renderLegend();
				},0);
			};
		}
		function editStudy(self, studyId){
			return function(e){
				var sd=stx.layout.studies[studyId];
				if(sd.permanent || !sd.editFunction) return;
				e.stopPropagation();
				self.uiManager.closeMenu();
				var studyEdit=self.context.getAdvertised("StudyEdit");
				var params={stx:stx,sd:sd,inputs:sd.inputs,outputs:sd.outputs, parameters:sd.parameters};
				studyEdit.editPanel(params);
			};
		}
		var overlaysOnly=typeof(this.node.attr("cq-overlays-only"))!="undefined";
		var panelOnly=typeof(this.node.attr("cq-panel-only"))!="undefined";
		var customRemovalOnly=typeof(this.node.attr("cq-custom-removal-only"))!="undefined";
		var holder=this.node.parents(".stx-holder");
		var panelName=null;
		var markerLabel=this.node.attr('cq-marker-label');
		if(holder.length){
			panelName=holder.attr("cq-panel-name");
		}

		for(var id in stx.layout.studies){
			var sd=stx.layout.studies[id];
			if(sd.customLegend) continue;
			if(customRemovalOnly && !sd.study.customRemoval) continue;
			if(panelOnly && sd.panel!=panelName) continue;
			if(overlaysOnly && !sd.overlay && !sd.underlay) continue;
			var newChild=CIQ.UI.makeFromTemplate(this.template, true);
			newChild.find("cq-label").html(sd.inputs.display);
			var close=newChild.find(".ciq-close");
			if(sd.permanent){
				close.hide();
			}else{
				close.stxtap(closeStudy(this, sd));
			}
			var edit=newChild.find(".ciq-edit");
			if(!edit.length) edit=newChild.find("cq-label");
			edit.stxtap(editStudy(this, id));
		}
		//Only want to render the marker label if at least one study has been
		//rendered in the legend. If no studies are rendered, only the template tag
		//will be in there.
		if(typeof(markerLabel)!="undefined" && this.node[0].childElementCount>1){
			this.node.prepend("<cq-marker-label>"+markerLabel+"</cq-marker-label>");
		}
		CIQ.I18N.translateUI(null,this.node[0]);
		//this.context.resize();
		this.showHide();
	};

	CIQ.UI.StudyLegend = document.registerElement("cq-study-legend", StudyLegend);

	




	/**
	 * Study output web component `<cq-study-output>`.
	 *
	 * Set the color of study outputs in the {@link CIQ.WebComponents.cq-study-dialog}.
	 *
	 * See example in {@link CIQ.WebComponents.cq-study-dialog}.
	 * @namespace WebComponents.cq-study-output
	 */
	var StudyOutput = {
		prototype: Object.create(CIQ.UI.BaseComponent)
	};

	StudyOutput.prototype.initialize = function(params) {
		this.params = params;
	};

	StudyOutput.prototype.setColor = function(color) {
		if (!this.params) return;
		var updates = {
			outputs: {}
		};
		updates.outputs[this.params.output] = {};
		updates.outputs[this.params.output].color = color;
		this.params.studyDialog.updateStudy(updates);
	};

	CIQ.UI.StudyOutput = document.registerElement("cq-study-output", StudyOutput);

	



	/**
	 * Study parameters web component `<cq-study-parameter>`.
	 * 
	 * See example in {@link CIQ.WebComponents.cq-study-dialog}.
	 @namespace WebComponents.cq-study-parameter
	 */
	var StudyParameter = {
		prototype: Object.create(CIQ.UI.ContextTag)
	};

	StudyParameter.prototype.initialize=function(params){
		this.params=params;
	};

	StudyParameter.prototype.setColor=function(color){
		if(!this.params) return;
		var updates={parameters:{}};
		updates.parameters[this.params.parameter]=color;
		this.params.studyDialog.updateStudy(updates);
	};

	CIQ.UI.StudyParameter = document.registerElement("cq-study-parameter", StudyParameter);

	

	return _exports;
});
