//-------------------------------------------------------------------------------------------
// Copyright 2012-2016 by ChartIQ, Inc.
// All rights reserved
//-------------------------------------------------------------------------------------------

(function (definition) {
	"use strict";

	if (typeof exports === "object" && typeof module === "object") {
		module.exports = definition(require('./chartiq') );
	} else if (typeof define === "function" && define.amd) {
		define(["chartiq" ], definition);
	} else if (typeof window !== "undefined" || typeof self !== "undefined") {
		var global = typeof window !== "undefined" ? window : self;
		definition(global,global);
	} else {
		throw new Error("Only CommonJS, RequireJS, and <script> tags supported for addOns.js.");
	}
})(function(_exports){
	var CIQ=_exports.CIQ;

	/**
	 * Use this constructor to initialize visualization styles of extended hours by the use of shading and delimitation lines.
	 * This visualization will only work if the `extended` and `marketSessions` parameters in the {@link CIQ.ChartEngine#layout} object are set, 
	 * data for the corresponding sessions is provided from your quote feed and the market definitions have the corresponding entries.
	 * See {@link CIQ.Market} for details on how to define extended (non-default) hours.
	 * 
	 * All possible market sessions needed to be shaded at any given time should be enabled at once with this method.
	 *
	 * It is **important to note** that this method simply highlights the data within a particular market session as set by the CSS colors, but does not exclude any timeframes. If the data is on the chart, the session will be highlighted if initialized.
	 * If you wish to exclude a particular session from the chart, this must be done at the quote feed level, and excluded form the masterData.
	 * As such, your data loading logic may also need to scan trough the `stx.layout.marketSessions` array in addition to the `extended` flag to determine which exact session the chart needs to display. 
	 * See examples section for more details.
	 * 
	 * - The styles for the shading of each session is determined by the corresponding CSS class in the form of "stx_market_session."+session_name (Example: `stx_market_session.pre`)
	 * - The divider line is determined by the CSS class "stx_market_session.divider".
	 * 
	 * Example <iframe width="800" height="500" scrolling="no" seamless="seamless" align="top" style="float:top" src="http://jsfiddle.net/chartiq/g2vvww67/embedded/result,js,html/" allowfullscreen="allowfullscreen" frameborder="1"></iframe>
	 * 
	 * @param {CIQ.ChartEngine} stx The chart object
	 * @param {array} sessions Names of the sessions to visualize. The names must match the session names declared in {@link CIQ.Market}.
	 * @constructor
	 * @name  CIQ.ExtendedHours
	 * @example
	 * // initialize the session names, wich must have a corresponding CSS entry.
		// call this only once to initialize the market sessions display manager
		new CIQ.ExtendedHours(stxx, ["post","pre"]);
		
		// Call something like this from your menu to enable or disable the sessions
		 //enable extended ours mode or set to false to disable.
		 stxx.layout.extended=true;
		 // enable the particular sessions you want to display or set to {} to display none
		 stxx.layout.marketSessions={pre:true,post:true};
		 //set the market to reflect your market preferences. This is only need if you are not using setMarketFactory and instead just using setMarket
		 stxx.setMarket(CIQ.Market.NYSE);
		// call new chart to now show the session you enabled.
		 stxx.newChart(stxx.chart.symbol, null, null, finishedLoadingNewChart(stxx.chart.symbol, stxx.chart.symbol));
	 * @example
	 * 	// CSS entries for a session divider and sessions named "pre" and "post"
		.stx_market_session.divider {
			background-color: rgba(0,255,0,0.8);
			width: 1px;
		}
		.stx_market_session.pre {
			background-color: rgba(255,255,0,0.1);
		}
		.stx_market_session.post {
			background-color: rgba(0,0,255,0.2);
		}
	 * @example
	 * 	// sample code for turning on and off sessions on the chart when using setMarketFactory 
	 
		// initialize the sessions you want to shade and make sure you have the corresponding CSS defined.
		new CIQ.ExtendedHours(stxx, ["post","pre"]);
					
		// call this function form your UI to enable or disable the sessions on the chart 
		// ( requires your feed to only send data for the enabled sessions )
		function toggleExtHours(session){
		
			// toggle the session on the layout.marketSessions array so you know what the user wants to see and what to load.
			stxx.layout.marketSessions[session]=!stxx.layout.marketSessions[session];
			
			// assume you are using check boxes on your UI to enable and disable the sessions. Set them here.
			var checkbox=$$$(".stxExtHours-"+session);
			if(stxx.layout.marketSessions[session]){
				CIQ.appendClassName(checkbox, "true");
			}else{
				CIQ.unappendClassName(checkbox, "true");
			}
			
			// if you have after hours sessions enabled, then set the extended flag on so your feed knows to get this data.
			stxx.layout.extended=stxx.layout.marketSessions.pre || stxx.layout.marketSessions.post;
			
			if(!stxx.displayInitialized) return;
			
			// now create a new chart with just the data the user wants to see (your feed should follow the extended and marketSessions settings)
			// the data will be highlighted as initialized.
			stxx.newChart(stxx.chart.symbol, null, null, finishedLoadingNewChart(stxx.chart.symbol, stxx.chart.symbol));
			stxx.changeOccurred("layout");
			stxx.doDisplayCrosshairs();
		}
	 * @since  06-2016-02
	 */
	CIQ.ExtendedHours=function(stx,sessions){
		this.stx=stx;
		var styles={};
		for(var sess=0;sess<sessions.length;sess++) {
			if(!styles.session) styles.session={};
			styles.session[sessions[sess]]=null;
		}
		stx.append("initializeDisplay", function(){
			if(!this.layout.extended) return;
			for(var sess in styles.session) 
				styles.session[sess]=this.canvasStyle("stx_market_session "+sess);
			styles.divider=this.canvasStyle("stx_market_session divider");
			if(styles.session){
				var m=this.chart.market;
				var ranges=[];
				var range={start:this.chart.left};
				for(var i=0;i<this.chart.dataSegment.length;i++){
					var ds=this.chart.dataSegment[i];
					if(!ds || !ds.DT) continue;
					var c=null;
					var s=styles.session[m.getSession(ds.DT, stx.dataZone)];
					if(s) c=s.backgroundColor;
					if(range.color && range.color!=c){
						ranges.push({start:range.start,end:range.end,color:range.color});
						range={};					
					}
					if(c){
						var cw=this.layout.candleWidth;
						if(ds.candleWidth) cw=ds.candleWidth;
						range.end=this.pixelFromBar(i,this.chart)+cw/2;
						if(!range.start && range.start!==0) range.start=range.end-cw;
						range.color=c;
					}else{
						range={};
					}
				}
				if(range.start || range.start===0) ranges.push({start:range.start,end:range.end,color:range.color});
				var noDashes=CIQ.isTransparent(styles.divider.backgroundColor);
				var dividerLineWidth=styles.divider.width.replace(/px/g, '');
				for(var panel in this.panels){
					if(this.panels[panel].shareChartXAxis===false) continue;
					this.startClip(panel);
					for(i=0;i<ranges.length;i++){
						this.chart.context.fillStyle=ranges[i].color;
						if(!noDashes && ranges[i].start>this.chart.left) this.plotLine(ranges[i].start, ranges[i].start, this.panels[panel].bottom, this.panels[panel].top, styles.divider.backgroundColor, "line", this.chart.context, this.panels[panel], {
							pattern: "dashed",
							lineWidth: dividerLineWidth
						});
						this.chart.context.fillRect(ranges[i].start,this.panels[panel].top,ranges[i].end-ranges[i].start,this.panels[panel].bottom-this.panels[panel].top);
						if(!noDashes && ranges[i].end<this.chart.right) this.plotLine(ranges[i].end, ranges[i].end, this.panels[panel].bottom, this.panels[panel].top, styles.divider.backgroundColor, "line", this.chart.context, this.panels[panel], {
							pattern: "dashed",
							lineWidth: dividerLineWidth
						});
					}
					this.endClip();
				}
			}
		});
	};
	
	/**
	 * Use this constructor to create a floating "tooltip" on the crosshairs, showing values of series, studies, etc at the point in time where pointer is located.
	 * 
	 * **Note 1**: this only works when crosshairs are on.<BR>
	 * **Note 2**: this requires jquery.
	 * 
	 * Color and layout can be managed via `stx-hu-tooltip` CSS style and related sub classes in stx-chart.css
	 *
	 * Tooltip automatically creates itself and exists in HTML inside the chart container in the following form:
	 * <stx-hu-tooltip>
	 * 		<stx-hu-tooltip-field>
	 * 			<stx-hu-tooltip-field-name></stx-hu-tooltip-field-name><stx-hu-tooltip-field-value></stx-hu-tooltip-field-value>
	 * 		</stx-hu-tooltip-field>
	 * 		...
	 * 		<stx-hu-tooltip-field>
	 * 			<stx-hu-tooltip-field-name></stx-hu-tooltip-field-name><stx-hu-tooltip-field-value></stx-hu-tooltip-field-value>
	 * 		</stx-hu-tooltip-field>
	 * </stx-hu-tooltip>
	 * 
	 * The stx-hu-tooltip-field blocks are inserted automatically in this order:
	 * DT, Open, High, Low, Close, Volume, series, studies
	 * You can alter this default order or create a custom label by manually creating a `stx-hu-tooltip` HTML element 
	 * and inserting an `stx-hu-tooltip-field` block in it for each field on the order you choose:
	 * 		Just add an attribute to the `stx-hu-tooltip-field` element of field="[fieldname]".
	 * 		You can also populate the `stx-hu-tooltip-field-name` element with an alternate label.
	 * 
	 * For the override to work, the `stx-hu-tooltip` element must be placed inside the chart container used when the engine was instantiated ('new CIQ.ChartEngine({container:$("#chartContainer")[0]});`)
	 * 
	 * @param {object} tooltipParams The constructor parameters
	 * @param {CIQ.ChartEngine} [tooltipParams.stx] The chart object
	 * @param {boolean} [tooltipParams.ohl] set to true to show OHL data (Close is always shown).
	 * @param {boolean} [tooltipParams.volume] set to true to show Volume
	 * @param {boolean} [tooltipParams.series] set to true to show value of series
	 * @param {boolean} [tooltipParams.studies] set to true to show value of studies
	 * @constructor
	 * @name  CIQ.Tooltip
	 * @since 09-2016-19
	 * @example
	 * // HTML to override default order and labels of fields.
	 * // This will force the `DT` field to be labeled `Date/Time` and be placed on the top, 
	 * // followed by the `Close` field and then the renaming fields as determined by the parameters
	 * // This must be placed inside the chart container used when the engine was instantiated ( `new CIQ.ChartEngine({container:$("#chartContainer")[0]});` )
	  	<stx-hu-tooltip>
			<stx-hu-tooltip-field field="DT">
				<stx-hu-tooltip-field-name>Date/Time:</stx-hu-tooltip-field-name>
				<stx-hu-tooltip-field-value></stx-hu-tooltip-field-value>
			</stx-hu-tooltip-field>
			<stx-hu-tooltip-field field="Close">
				<stx-hu-tooltip-field-name></stx-hu-tooltip-field-name>
				<stx-hu-tooltip-field-value></stx-hu-tooltip-field-value>
			</stx-hu-tooltip-field>
		</stx-hu-tooltip>
	 *@example
	 * // define a hover tool tip.
	 * new CIQ.Tooltip({stx:stxx, ohl:true, volume:true, series:true, studies:true});
	 */
	CIQ.Tooltip=function(tooltipParams){
		var stx=tooltipParams.stx;
		var showOhl=tooltipParams.ohl;
		var showVolume=tooltipParams.volume;
		var showSeries=tooltipParams.series;
		var showStudies=tooltipParams.studies;

		var node=$(stx.chart.container).find("stx-hu-tooltip")[0];
		if(!node){
			node=$("<stx-hu-tooltip></stx-hu-tooltip>").appendTo($(stx.chart.container))[0];
		}
		CIQ.Marker.Tooltip=function(params){
			if(!this.className) this.className="CIQ.Marker.Tooltip";
			params.label="tooltip";
			CIQ.Marker.call(this, params);
		};
		
		CIQ.Marker.Tooltip.ciqInheritsFrom(CIQ.Marker,false);
		
		CIQ.Marker.Tooltip.placementFunction=function(params){
			var offset=30;
			var stx=params.stx;
			for(var i=0;i<params.arr.length;i++){
				var marker=params.arr[i];
				var bar=stx.barFromPixel(stx.cx);
				
				if(	
					(stx.controls.crossX && stx.controls.crossX.style.display=="none") ||
					(stx.controls.crossY && stx.controls.crossY.style.display=="none") ||
					!(CIQ.ChartEngine.insideChart && 
						stx.layout.crosshair && 
						stx.displayCrosshairs && 
						!stx.overXAxis && 
						!stx.overYAxis && 
						!stx.openDialog && 
						!stx.activeDrawing && 
						!stx.grabbingScreen && 
						stx.chart.dataSegment[bar] != "undefined" &&
						stx.chart.dataSegment[bar] && 
						stx.chart.dataSegment[bar].DT)
				){
					marker.node.style.left="-1000px";
					marker.node.style.right="auto";
					marker.lastBarDT=0;
					return;
				}
				if(+stx.chart.dataSegment[bar].DT==+marker.lastBarDT && bar!=stx.chart.dataSegment.length-1) return;
				marker.lastBarDT=stx.chart.dataSegment[bar].DT;
				if(parseInt(getComputedStyle(marker.node).width,10)+offset<CIQ.ChartEngine.crosshairX){
					marker.node.style.left="auto";
					marker.node.style.right=Math.round(stx.container.clientWidth-stx.pixelFromBar(bar)+offset)+"px";
				}else{
					marker.node.style.left=Math.round(stx.pixelFromBar(bar)+offset)+"px";
					marker.node.style.right="auto";
				}
				marker.node.style.top=Math.round(CIQ.ChartEngine.crosshairY-stx.top-parseInt(getComputedStyle(marker.node).height,10)/2)+"px";
			}
			stx.doDisplayCrosshairs();
		};

		function renderFunction(){
			// the tooltip has not been initalized with this chart.
			if(!this.huTooltip) return; 
			
			// corosshairs are not on
			if(	
				(stx.controls.crossX && stx.controls.crossX.style.display=="none") ||
				(stx.controls.crossY && stx.controls.crossY.style.display=="none")
			) return;
			
			var bar=this.barFromPixel(this.cx);
			if(!this.chart.dataSegment[bar]) return;
			if(+this.chart.dataSegment[bar].DT==+stx.huTooltip.lastBarDT && bar!=this.chart.dataSegment.length-1) return;
			var node=$(this.huTooltip.node);
			node.find("[auto]").remove();
			node.find("stx-hu-tooltip-field-value").html();
			var fields=["DT"];
			if(showOhl) fields=fields.concat(["Open","High","Low"]);
			fields.push("Close");
			if(showVolume) fields.push("Volume");
			if(showSeries){
				for(var series in this.chart.series) {
					fields.push(this.chart.series[series].display);
				}
			}
			if(showStudies){
				for(var study in this.layout.studies) {
					for(var output in this.layout.studies[study].outputMap)
						fields=fields.concat([output,study+"_hist",study+"_hist1",study+"_hist2"]);
				}
			}
			var dupMap={};
			fields.forEach(function(name){
				if((this.chart.dataSegment[bar][name] || this.chart.dataSegment[bar][name]===0) && 
					(typeof this.chart.dataSegment[bar][name]!=="object" || name=="DT") &&
					!dupMap[name]){
					var fieldName=name.replace(/^(Result )(.*)/,"$2");
					var fieldValue="";
					dupMap[name]=true;
					if(this.chart.dataSegment[bar][name].constructor==Number){
						fieldValue=this.formatYAxisPrice(this.chart.dataSegment[bar][name], this.chart.panel);
					}else if(this.chart.dataSegment[bar][name].constructor==Date){
						if( name=="DT" && this.controls.floatDate && this.controls.floatDate.innerHTML ) {
							fieldValue= this.controls.floatDate.innerHTML;
						} else {
							fieldValue=CIQ.yyyymmdd(this.chart.dataSegment[bar][name]);
							if(!CIQ.ChartEngine.isDailyInterval(this.layout.interval)){
								fieldValue+=" "+this.chart.dataSegment[bar][name].toTimeString().substr(0,8);
							}
						}
					}else{
						fieldValue=this.chart.dataSegment[bar][name];				
					}
					var dedicatedField=node.find('stx-hu-tooltip-field[field="'+fieldName+'"]');
					if(dedicatedField.length){
						dedicatedField.find("stx-hu-tooltip-field-value").html(fieldValue);
						var fieldNameField=dedicatedField.find("stx-hu-tooltip-field-name");
						if(fieldNameField.html()==="") fieldNameField.html(fieldName+":");							
					}else{
						$("<stx-hu-tooltip-field auto></stx-hu-tooltip-field>")
							.append($("<stx-hu-tooltip-field-name>"+this.translateIf(fieldName)+":</stx-hu-tooltip-field-name>"))
							.append($("<stx-hu-tooltip-field-value>"+fieldValue+"</stx-hu-tooltip-field-value>"))
							.appendTo(node);
					}
				}
			},this);
			this.huTooltip.render();
		}
		
		CIQ.ChartEngine.prototype.append("undisplayCrosshairs",function(){
			if( this.huTooltip && this.huTooltip.node ) {
				var node=$(this.huTooltip.node);
				if( node && node[0]){
					node[0].style.left="-1000px";
					node[0].style.right="auto";
				}	
			}
		});
		CIQ.ChartEngine.prototype.append("headsUpHR", renderFunction);
		CIQ.ChartEngine.prototype.append("createDataSegment", renderFunction);
		stx.huTooltip=new CIQ.Marker.Tooltip({ stx:stx, xPositioner:"bar", chartContainer:true, node:node });
	};
	

	return _exports;
});
