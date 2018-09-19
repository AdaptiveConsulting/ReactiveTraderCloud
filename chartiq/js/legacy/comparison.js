(function (definition) {
	"use strict";

	if (typeof exports === "object" && typeof module === "object") {
		module.exports = definition( require("../chartiq") );
	} else if (typeof define === "function" && define.amd) {
		define(["chartiq"], definition);
	} else if (typeof window !== "undefined" || typeof self !== "undefined") {
		var global = typeof window !== "undefined" ? window : self;
		definition(global);
	} else {
		throw new Error("Only CommonJS, RequireJS, and <script> tags supported for comparison.js.");
	}
})(function(_exports){
	//console.log("comparison.js",_exports);
	var CIQ=_exports.CIQ;

	/**
	 * ** This function is maintained for legacy implementations only (not using web components). New implementations should use functionality included in the web components (stxUI.js) **<br>
	 * Default color selection for Comparison UI. This array will be traversed as the user adds comparison charts and then loop back at the end.
	 * @type {Array}
	 * @memberOf CIQ.Comparison
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Comparison.colorOrder=["#b387d7","#ff9250","#e36460","#dcdf67","#b3d987","#ffcd2b","#66cac4","#97b8f7"];

	/**
	 * ** This function is maintained for legacy implementations only (not using web components). New implementations should use functionality included in the web components (stxUI.js) **<br>
	 * The current location in the CIQ.Comparison.colorOrder array.
	 * @type {Number}
	 * @memberOf CIQ.Comparison
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Comparison.colorPointer=0;

	/**
	 * ** This function is maintained for legacy implementations only (not using web components). New implementations should use functionality included in the web components (stxUI.js) **<br>
	 * Comparisons can either be "compare", "overlay" or "absolute".
	 *
	 * The UI defaults to "compare" which produces a y-axis with relative percentage
	 * changes.
	 *
	 * "overlay" overlays the series so that the axis is not shared.
	 *
	 * "absolute" renders each series on the exact y-axis values (This is **not** recommended for series that do not share a similar y-axis price range).
	 *
	 * @since 03/17/2015 "absolute" puts all series on the same axis (developers should ensure that series are around the same price range)
	 * @type {string}
	 * @memberOf CIQ.Comparison
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Comparison.type="compare";

	/**
	 * ** This function is maintained for legacy implementations only (not using web components). New implementations should use functionality included in the web components (stxUI.js) **<br>
	 * Attaches a color picker to the comparison UI
	 * @memberOf CIQ.Comparison
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Comparison.attachColorPicker=function(){
		var swatch=$$$("#menuWrapperCompare .stx-color");
		var style=getComputedStyle(swatch);
		if(style) CIQ.Comparison.colorSelection=style.backgroundColor;
		CIQ.MenuManager.attachColorPicker(swatch, $$$("#menuWrapperCompare #menuCompare"), function(color){
			CIQ.Comparison.colorSelection="#" + color;
		}, true);
	};

	/**
	 * ** This function is maintained for legacy implementations only (not using web components). New implementations should use functionality included in the web components (stxUI.js) **<br>
	 * Backwards compatibility
	 * Iterates through the charts masterData and adds a data member for the comparison. The data member will be the string
	 * defined by "symbol". Dates must be exact matches (minutes, hours, seconds, milliseconds) in order to show up in the comparison.
	 * @param  {object} stx        A chart object
	 * @param  {string} symbol     The data member to add for comparison
	 * @param  {array} comparison Comparison data (which should align or closely align with the chart data by date)
	 * @memberOf CIQ.Comparison
	 * @version ChartIQ Advanced Package
	 * @deprecated use {@link CIQ#addMemberToMasterdata } instead
	 */
	CIQ.Comparison.processComparison=function(stx, symbol, comparison){
		// Match up the comparison and store the data point
		CIQ.addMemberToMasterdata(stx, symbol, comparison);
	};

	/**
	 * ** This function is maintained for legacy implementations only (not using web components). New implementations should use functionality included in the web components (stxUI.js) **<br>
	 * Adds a new comparison symbol. This method is driven from the UI but can also be called programatically if the comparison UI is at least
	 * available in the page.
	 * Otherwise, if you are not using the sample GUI, you can override this method to exclude references to the UI.
	 * If available, it will use the CIQ.QuoteFeed infrastructure to fetch data. You can override the comparison data source in {@link CIQ.Comparison.fetch}
	 * @param {object} stx           The chart object
	 * @param {string/object} compareSymbol The symbol to compare. A symbol string or an object representing the symbol can be used. If using an object, you can send anything you want in it, but you must always include at least a 'symbol' element. This object will be passed on to {@link CIQ.Comparison.fetch} as `parameters.symbolObject`.  And if using the [fetch()]{@link CIQ.QuoteFeed#fetch} method for data loading, it will be present in the parameters list there as well.
	 * @param {function} cb Callback function
	 * @param {string} display The text to display on the legend.
	 * @param {object} [parameters] Optional parameters to describe the series. See {@link CIQ.ChartEngine#addSeries} for full list
	 * @memberOf CIQ.Comparison
	 * @version ChartIQ Advanced Package
	 * @example
	 * CIQ.Comparison.add(stxx, 'GE',null,'General Motors');
	 * @since
	 * <br> 07/01/2015 added parameters argument.
	 * <br> 2015-11-1 compareSymbol can now be a string or an object.
	 */
	CIQ.Comparison.add=function(stx, compareSymbol, cb, displaySymbol, parameters){

		if(!compareSymbol) compareSymbol=$$$("#compareSymbol").value.toUpperCase();
		if(!compareSymbol) {
			if(cb) cb();
			return;
		}

		if(!parameters) parameters={};

		if(typeof compareSymbol == 'object') {
			parameters.symbolObject=compareSymbol;
			compareSymbol = compareSymbol.symbol;
      	}

		if(compareSymbol==stx.chart.symbol && !parameters.force) {
			if(cb) cb();
			return;
		}
		if(!displaySymbol) displaySymbol=compareSymbol;
		$$$("#compareSymbol").blur();


		function processResponse(symbol){
			return function(err){
				if(err) {
					delete stx.chart.series[symbol];  // clean up the series list so we don't continue to fetch this symbol
					if(cb) cb();
					return;
				}
	            $$$("#compareSymbol").value="";
	        	$$$("#compareNone").style.display="none";
				CIQ.Comparison.correlate(stx, symbol);
				stx.draw();
				if(!stx.comparisons[symbol]){
					var template=$$$(".symComparisonTemplate");
					var div=template.cloneNode(true);
					$$$(".stxItem", div).innerHTML=symbol;
					$$$(".stx-ico-close", div).onclick=function(stx, symbol){return function(){
						stx.getSeriesRenderer("_generic_series").removeSeries(symbol).ready();
					};}(stx, symbol);
					div.style.display="";
					template.parentNode.appendChild(div);
					stx.comparisons[symbol]={
							"div": div
					};
				}
				// Set up the next default color
				CIQ.Comparison.colorPointer++;
				if(CIQ.Comparison.colorPointer>=CIQ.Comparison.colorOrder.length) CIQ.Comparison.colorPointer=0;
				CIQ.Comparison.colorSelection=$$$("#menuWrapperCompare .stx-color").style.backgroundColor=CIQ.Comparison.colorOrder[CIQ.Comparison.colorPointer];
				if(cb) cb();
			};
		}

		if(!stx.chart.legend){
			stx.chart.legend={
					x: 260,
					y: 10
			};
		}

		var isComparison=(CIQ.Comparison.type=="compare");
		var sharedAxis=isComparison || CIQ.Comparison.type=="absolute";
		var requiredParams= {isComparison:isComparison, shareYAxis:sharedAxis};
		CIQ.extend(parameters, requiredParams);
		if (!parameters.gaps) parameters.gaps=true;
		if (!parameters.color) parameters.color= CIQ.Comparison.colorSelection;
		if (!parameters.display) parameters.display=displaySymbol;
		if (!parameters.chartType) parameters.chartType="line";
		CIQ.Comparison.fetch(stx, compareSymbol, parameters, processResponse(compareSymbol));
	};

	/**
	 * ** This function is maintained for legacy implementations only (not using web components). New implementations should use functionality included in the web components (stxUI.js) **<br>
	 * If you're not using a QuoteFeed, then add here your version of fetch to retrieve the comparison data.
	 * The data you fetch should be in the standard chart OHLC format, or as outlined by {@link CIQ.ChartEngine#addSeries}.
	 * Please review the [Data Format](index.html#data-format) section to properly format your OHLC quote objects.
	 * Once the comparison data is available, assign it to `parameters.data` and call `addSeries()`. See example for suggested code.
	 * @param {object} stx           The chart object
	 * @param {string} comparisonSymbol The symbol to compare.
	 * @param {function} cb Callback function
	 * @param {object} parameters Optional parameters to describe the series. See {@link CIQ.ChartEngine#addSeries} for full list
	 * @memberOf CIQ.Comparison
	 * @version ChartIQ Advanced Package
	 * @memberOf CIQ.Comparison
	 * @version ChartIQ Advanced Package
	 * @example
		CIQ.Comparison.fetch=function(stx, comparisonSymbol, parameters, cb){
			// fetch comparison data here and set the data for the series
			CIQ.postAjax("jason.asp?symbol="+comparisonSymbol+"&range=", null, function (status, response) {
				if (status != 200) {
					return; // error
				}
				parameters.data = JSON.parse(response);
				stx.addSeries(comparisonSymbol, parameters, cb);	// always include the callback (cb) function!
			});
		};
	 */
	CIQ.Comparison.fetch=function(stx, comparisonSymbol, parameters, cb){
		// if not using a quoteFeed, fetch comparison data here and set the parameters.data for the series as follows:
		// parameters.data= { your data array here };
		if(!parameters.data) parameters.data={useDefaultQuoteFeed:true};
		stx.addSeries(comparisonSymbol, parameters, cb);
	};


	/**
	 * ** This function is maintained for legacy implementations only (not using web components). New implementations should use functionality included in the web components (stxUI.js) **<br>
	 * Default implementation of CIQ.Comparison.fetch
	 * @memberOf CIQ.Comparison
	 * @private
	 * @deprecated -- now done in addSeries
	 */
	CIQ.Comparison.quoteFeedFetch=function(stx, comparisonSymbol, cb){
	  var driver=stx.quoteDriver;
	  var params=driver.makeParams(comparisonSymbol, stx.chart);
	  // for comparisons, you must  fetch enough data on the new Comparison to match the masterData, from  beginning to end ticks
	  params.startDate = stx.chart.masterData[0].DT;
	  params.endDate = stx.chart.masterData[stx.chart.masterData.length-1].DT;
	  driver.quoteFeed.fetch(params, function(dataCallback){
	    //if(dataCallback.error) return; // ignore any server errors
	    cb(dataCallback.error, dataCallback.quotes);
	  });
	};


	/**
	 * ** This function is maintained for legacy implementations only (not using web components). New implementations should use functionality included in the web components (stxUI.js) **<br>
	 * Resets comparisons, removing all existing comparisons and resetting the UI. Call this when changing symbols or to "remove all" comparisons.
	 * @param  {object} stx The chart object
	 * @memberOf CIQ.Comparison
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Comparison.reset=function(stx){
		for(var field in stx.comparisons){
			var comparison=stx.comparisons[field];
			var div=comparison.div;
			div.parentNode.removeChild(div);
			var gRenderer=stx.getSeriesRenderer("_generic_series");
			if(gRenderer) gRenderer.removeSeries(field);
		}
		stx.comparisons={};
		CIQ.Comparison.colorPointer=0;
		CIQ.Comparison.colorSelection=$$$("#menuWrapperCompare .stx-color").style.backgroundColor=CIQ.Comparison.colorOrder[CIQ.Comparison.colorPointer];
		stx.setComparison(false);
		for(var panel in stx.panels){
			if(stx.panels[panel].name.indexOf(CIQ.Comparison.correlationPanel)===0) stx.panelClose(stx.panels[panel]);
		}
		$$$("#compareNone").style.display="";
	};

	/**
	 * ** This function is maintained for legacy implementations only (not using web components). New implementations should use functionality included in the web components (stxUI.js) **<br>
	 * Initializes the comparison UI to handle keystrokes and color picking and to associate it with a chart object
	 * @param  {object} stx The chart object
	 * @param {boolean} [inputEventHandling] Set to false to bypass default input event handling
	 * @memberOf CIQ.Comparison
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Comparison.initialize=function(stx, inputEventHandling){
		CIQ.Comparison.attachColorPicker();
		stx.comparisons={};	// Holding object for comparison symbols
		if(inputEventHandling!==false){
			CIQ.inputKeyEvents($$$("#compareSymbol"), function(){
				var compareSymbol=$$$("#compareSymbol").value.toUpperCase();
				if(compareSymbol==stx.chart.symbol) return;
			    CIQ.MenuManager.closeThisMenu($$$("#compareSymbol"));
			    CIQ.Comparison.add(stx);
			});
		}
	};

	/**
	 * ** This function is maintained for legacy implementations only (not using web components). New implementations should use functionality included in the web components (stxUI.js) **<br>
	 * The comparison plugin adds functionality to the built in "removeSeries" function. This updates the comparison UI if a user
	 * removes a series by right clicking.
	 * @param  {CIQ.ChartEngine} stx The chart object
	 * @param  {string} field The comparison that is being removed
	 * @private
	 * @memberOf CIQ.Comparison
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Comparison.removeSeries=function(stx,field){
		if ( !stx.comparisons) return; // in case GUI not using the Comparison interface.
		var comparison=stx.comparisons[field];
		if(!comparison) return;
		var div=comparison.div;
		if(div.parentNode) div.parentNode.removeChild(div);
		delete stx.comparisons[field];
		if(CIQ.isEmpty(stx.comparisons)){
			CIQ.Comparison.reset(stx);
		}
	};

	/**
	 * ** This function is maintained for legacy implementations only (not using web components). New implementations should use functionality included in the web components (stxUI.js) **<br>
	 * Code for loading additional quote data for comparisons or studies. Use this when using {@link CIQ.QuoteFeed} "pull" data by
	 * calling it in the callback function. See stx-advanced.html for an example.
	 * This will be executed after every quoteFeed fetch call, and is used to keep the main symbol in sync with any other active symbols on the chart.
	 * @memberOf CIQ.Comparison
	 * @deprecated
	 */

	CIQ.Comparison.quoteFeedCallback=function(params){
		if(params.comparisonRequested) return;

		//use to determine startDate for a comparison if params.update=true
		function getStartDate(symbol){
			for(var c=params.stx.masterData.length-1;c>=0;c--){
				if(params.stx.masterData[c] && typeof params.stx.masterData[c][symbol] != "undefined"){
					return CIQ.strToDateTime(params.stx.masterData[c].Date);
				}
			}
			return params.startDate;
		}

		var syms={};
		var field;

		// get the symbol used in comparisons
	    for(field in params.stx.chart.series) {
			if(!params.stx.chart.series[field].parameters.isComparison && !params.stx.chart.series[field].parameters.quoteFeedCallbackRefresh) continue;
			syms[field]=true;
	    }

	    // get the symbols used in the studies
		for(var p in params.stx.panels){
			if(params.stx.panels[p].studyQuotes){
				for(var sq in params.stx.panels[p].studyQuotes) syms[sq]=true;
			}
		}

		var arr=[];
		for(field in syms){
			var seriesParam=CIQ.shallowClone(params.originalState);
			seriesParam.symbol=field;
			if(seriesParam.update) {
				seriesParam.startDate=getStartDate(field);
			} else {
				// since we support comparisons between instruments that may have different trading hours,
				// we can't depend on the params.ticks to keep them in sync.
				// Instead , when appending data, we must explicitly send exact ranges to load.
				// Using ticks may cause to load different ranges for instruments with different trading hours.
				if (!seriesParam.startDate) seriesParam.startDate = params.stx.masterData[0].DT;
				if (!seriesParam.endDate) seriesParam.endDate = params.stx.masterData[params.stx.masterData.length-1].DT;
			}
			arr.push(seriesParam);
		}
		if(!arr.length) return;
		params.comparisonRequested=true;
		var driver=params.stx.quoteDriver;
		driver.quoteFeed.multiFetch(arr, function(results){
			for(var i=0;i<results.length;i++){
				var result=results[i];
				if(!result.dataCallback.error){
					CIQ.addMemberToMasterdata(params.stx, result.params.symbol, result.dataCallback.quotes, null, null, params.stx.chart.series[result.params.symbol].parameters.field);
				}
	 		}
			params.stx.createDataSet();
			params.stx.draw();
		});
	};

	return _exports;
});