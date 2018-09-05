/**
 * Contains calls that allow a native iOS and Android application to interface the library
 * without having to clutter either Swift/Objective C or Java source with unnecessary Javascript.
 * Please note that all functions and variables are exposed globally on the webview.
 * @namespace NativeLibraryBridge
 */


/**
 * flag for showing if your currently running an Android device.
 * @memberof NativeLibraryBridge
 * @boolean
 * @default false
 */
var isAndroid = false;

/**
 * String representing the class for CIQ's default light theme.
 * @memberof NativeLibraryBridge
 * @string
 */
var dayCss = 'ciq-day';

/**
 * String representing the class for CIQ's default dark theme.
 * @memberof NativeLibraryBridge
 * @string
 */
var nightCss = 'ciq-night';

 /**
  * Determines where the chart is being loaded based on the userAgent.
  * If not loaded on Android then enables proxy logging automatically
  * @memberof NativeLibraryBridge
  */
function determineOs() {
	var userAgent = navigator.userAgent;

	if (/android/i.test(userAgent)) {
		isAndroid = true;
	} else {
		// Logging works automatically in Android native apps, so no proxyLogger necessary.
		proxyLogger();
	}
}

/**
 * Allow console logging in iOS. This will overwrite the default console logging on iOS to return messages via webkit.messageHandlers.
 * @memberof NativeLibraryBridge
 */
function proxyLogger() {
	var originals = {
		log: console.log,
		warn: console.warn,
		error: console.error
	};

	console.log = function() {
		webkit.messageHandlers.logHandler.postMessage({"method": "LOG", "arguments": JSON.parse(JSON.stringify(arguments))});

		return originals.log.apply(this, arguments);
	};

	console.warn = function() {
		webkit.messageHandlers.logHandler.postMessage({"method": "WARN", "arguments": JSON.parse(JSON.stringify(arguments))});

		return originals.warn.apply(this, arguments);
	};

	console.error = function() {
		webkit.messageHandlers.logHandler.postMessage({"method": "ERROR", "arguments": JSON.parse(JSON.stringify(arguments))});

		return originals.error.apply(this, arguments);
	};
}


 /**
  * A smiple quotefeed with data parsing functions
  * @param {Object} parameters
  * @param {Date} parameters.start A starting date for requesting data
  * @param {Date} [parameters.end] An ending date for requesting data
  * @param {string} parameters.symbol The symbol to fetch data for
  * @param {Number} parameters.period period from a chart layout
  * @param {string} [parameters.timeUnit] timeUnit from a chart layout
  * @param {Function} cb Function passed in to handle data after it is parsed.
  * @memberof NativeLibraryBridge
  */
function nativeQuoteFeed(parameters, cb) {
	var id=CIQ.uniqueID();
	if (parameters.func === "pullInitialData") {
		quoteFeedCallbacks[id] = cb;

		if(isAndroid) {
			QuoteFeed.pullInitialData(parameters.symbol, parameters.period, parameters.timeUnit, parameters.start.toISOString(), parameters.end.toISOString(), parameters, id);
		} else {
	    	webkit.messageHandlers.pullInitialDataHandler.postMessage({"cb": id, "symbol": parameters.symbol, "startDate": parameters.start.toISOString(), "endDate": parameters.end.toISOString(), "interval": parameters.timeUnit, "period": parameters.period});
		}
	}

	if (parameters.func === "pullUpdate") {
		quoteFeedCallbacks[id] = cb;

		if(isAndroid) {
			QuoteFeed.pullUpdate(parameters.symbol, parameters.period, parameters.timeUnit, parameters.start.toISOString(), parameters, id);
		} else {
			webkit.messageHandlers.pullUpdateDataHandler.postMessage({"cb": id, "symbol": parameters.symbol, "startDate": parameters.start.toISOString(), "interval": parameters.timeUnit, "period": parameters.period});
		}
	}

	if (parameters.func === "pullPagination") {
		quoteFeedCallbacks[id] = cb;

		if(isAndroid) {
			QuoteFeed.pullPagination(parameters.symbol, parameters.period, parameters.timeUnit, parameters.start.toISOString(), parameters.end.toISOString(), parameters, id);
		} else {
			webkit.messageHandlers.pullPaginationDataHandler.postMessage({"cb": id, "symbol": parameters.symbol, "startDate": parameters.start.toISOString(), "endDate": parameters.end.toISOString(), "interval": parameters.timeUnit, "period": parameters.period});
		}
	}
}

 /**
  * Native wrapper for {@link CIQ.ChartEngine#attachQuoteFeed}.
  * Will attach a quoteFeed to the {@link CIQ.ChartEngine}
  * If no refreshInterval is passed in the chart will never update on its own
  * @param {Number}[refreshInterval] Tells the chart how frequently in seconds to check for updates.
  * @memberof NativeLibraryBridge
  */
function attachQuoteFeed(refreshInterval) {
	stxx.attachQuoteFeed(quoteFeedNativeBridge,{refreshInterval: refreshInterval});
}

 /**
  * Parses JSON data into an array of new OHLC quotes and updates the chart with them.
  * Will call {@link CIQ.ChartEngine#updateChartData} if no callback is provided to automatically update.
  * @param {JSON} data JSON object of your data from a query
  * @param {Function} [callbackID] A custom function to update
  * @memberof NativeLibraryBridge
  */
function parseData(data, callbackId) {
	var feeddata=JSON.parse(data);
	var newQuotes=[];

	for(var i=0;i<feeddata.length;i++){
		newQuotes[i]={};
		newQuotes[i].DT=new Date(feeddata[i].DT);
		newQuotes[i].Open=feeddata[i].Open;
		newQuotes[i].High=feeddata[i].High;
		newQuotes[i].Low=feeddata[i].Low;
		newQuotes[i].Close=feeddata[i].Close;
		newQuotes[i].Volume=feeddata[i].Volume;
	}

	if(callbackId) {
		// pull method
		var quoteFeedCb = quoteFeedCallbacks[callbackId];
		quoteFeedCb({quotes:newQuotes, moreAvailable:true});
		delete quoteFeedCallbacks[callbackId];
	} else {
		// push method
		stxx.updateChartData(newQuotes);
	}
}

 /**
  * Gathers the necessary information for any HUD based on cursor position and returns that data.
  * This function will provide Open, High, Low, Close and Volume for a given quote.
  * @memberof NativeLibraryBridge
  */
function getHudDetails() {
	var data = {};
	var tick=stxx.barFromPixel(stxx.cx);
	var prices=stxx.chart.xaxis[tick];

	if(prices!==null){
		if(prices.data){
			data.open = stxx.formatPrice(prices.data.Open);
			data.close = stxx.formatPrice(prices.data.Close);
			data.high = stxx.formatPrice(prices.data.High);
			data.low = stxx.formatPrice(prices.data.Low);
			data.volume = CIQ.condenseInt(prices.data.Volume);
		}
	}
	if(isAndroid) {
		return data;
	}

	return JSON.stringify(data);

}

//////////////////////////
/*** Chart functions ***/
////////////////////////

 /**
  * Native wrapper for {@link CIQ.ChartEngine#setPeriodicity}. Only accepts arguments individually and passes them into a params object
  * @param {number} params.period The number of elements from masterData to roll-up together into one data point on the chart (candle,bar, etc). If set to 30 in a candle chart, for example, each candle will represent 30 raw elements of `interval/timeUnit` type.
  * @param {string} [params.timeUnit] Type of data requested. Valid values are "millisecond","second","minute","day","week", "month" or 'tick'. If not set, will default to "minute". ** "hour" is NOT a valid timeUnit. Use `timeUnit:"minute", interval:60` instead**
  * @param {string} [params.interval] Further qualifies pre-rolled details of intra-day `timeUnits` ("millisecond","second","minute") and will be converted to “1” if used with "day","week" or  "month" 'timeUnit'. Some feeds provide data that is already rolled up. For example, there may be a feed that provides 5 minute bars. To let the chart know you want that 5-minute bar from your feed instead of having the chart get individual 1 minute bars and roll them up, you would set the `interval` to '5' and `timeUnit` to 'minute'
  * @memberof NativeLibraryBridge
  */
function setPeriodicity(period, interval, timeUnit) {
	var params = {
		period: period,
		interval: interval,
		timeUnit: timeUnit
	};

	stxx.setPeriodicity(params);
}

 /**
  * Native wrapper for {@link CIQ.ChartEngine#newChart}.
  * Unlike {@link CIQ.ChartEngine#newChart}, this function only accepts a symbol and data. If you need more functionality you to manually call the library implementation of newChart.
  * @param {string} symbol The new symbol for your chart
  * @param {array} data Static data in an array to load the chart with
  * @memberof NativeLibraryBridge
  */
function callNewChart(symbol, data) {
	if(!symbol) symbol = stxx.chart.symbol;
	var loader = $$$("cq-loader");
	if(loader) loader.show();

	var cb = function(){
		stxx.dataSegmentLength = stxx.chart.dataSegment.length;
		if(loader) loader.hide();
	};

	if(!isAndroid) {
		cb = function() {
			stxx.dataSegmentLength = stxx.chart.dataSegment?stxx.chart.dataSegment.length:null;
			if(loader) loader.hide();
			webkit.messageHandlers.newSymbolCallbackHandler.postMessage(symbol);
		};
	}
	stxx.newChart(symbol, data, null, cb);
}

 /**
  * Native wrapper for {@link CIQ.ChartEngine#setChartType}. Will remove any aggregation type and switch your chart to display the new chartType.
  *
  * Valid chartTypes include: Candle, Bar, Colored Bar, Line, Hollow Candle, Mountain and Baseline.
  * This function should not be used for setting Aggregations. Instead use setAggregationType
  * @see {@tutorial Chart Styles and Types}
  * @param {string} chartType Type of chart to display
  * @memberof NativeLibraryBridge
  */
function setChartType(chartType) {
	stxx.layout.aggregationType = "";
	stxx.setChartType(chartType);
}

 /**
  * Native wrapper for {@link CIQ.ChartEngine#setAggregationType}. Sets an aggregation type for the chart.
  *
  * Valid aggregation types include: Heikin Ashi, Kagi, Renko, Range Bars, Point & Figure.
  * This function should not be used to set chartTypes. Instead use setChartType
  * @see {@tutorial Chart Styles and Types}
  * @param {string} aggregationType Type of chart to display
  * @memberof NativeLibraryBridge
  */
function setAggregationType(aggregationType) {
	stxx.layout.aggregationType = aggregationType;
	stxx.setChartType("candle");
}

 /**
  * Returns the chart's main symbol
  * @return {string} symbol
  * @memberof NativeLibraryBridge
  */
function getSymbol() {
	return stxx.chart.symbol;
}

/**
 * Will toggle the crosshairs on or off
 * @param boolean
 * @memberof NativeLibraryBridge
 */
function enableCrosshairs(active) {
	stxx.layout.crosshair = active;
}

 /**
  * Will return any currentVectoParameter
  * @see {@link CIQ.ChartEngine#currentVectorParameters}
  * @memberof NativeLibraryBridge
  */
function getCurrentVectorParameters() {
	return stxx.currentVectorParameters;
}

 /**
  * Used to set currentVectoParameters and any values for it
  * @param parameter
  * @param value
  * @see {@link CIQ.ChartEngine#currentVectorParameters}
  * @memberof NativeLibraryBridge
  */

function setCurrentVectorParameters(parameter, value) {
	stxx.currentVectorParameters[parameter] = value;
}

 /**
  * Native wrapper for {@link CIQ.ChartEngine#addSeries}. Can set a Series as a comparison and specify line color.
  * @param {string} symbol Symbol to set
  * @param {string} hexColor Color for your symbol to be displayed as
  * @param {boolean} isComparison Boolean telling the chart whether the symbol should be compared to the main symbol
  * @memberof NativeLibraryBridge
  */
function addSeries(symbol, hexColor, isComparison) {
	var parameters = {
		color: hexColor,
		isComparison: isComparison
	};

	stxx.addSeries(symbol, parameters);
}

 /**
  * Native wrapper for {@link CIQ.ChartEngine#removeSeries}. Removes a selected symbol from the chart's series
  * @param {string} symbol Symbol to remove OR the series ojbect itself
  * @memberof NativeLibraryBridge
  */
function removeSeries(symbol) {
	stxx.removeSeries(symbol);
}

/**
 * Sets the chart theme between 'day' or 'night' or none by adding in CSS classes to the chart's context. Also clears the chart containers backgroundColor and resets the engines styles.
 *
 * Adding one class will remove the other, to remove both set the theme to none
 * @param {String}  theme Theme to set either 'day', 'night' or none
 * @memberof NativeLibraryBridge
 */
function setTheme(theme) {
	var context = $('cq-context');

	if(theme.toLowerCase() === 'day') {
		context.removeClass(nightCss);
		context.addClass(dayCss);
	} else if(theme.toLowerCase() === 'night') {
		context.removeClass(dayCss);
		context.addClass(nightCss);
	} else if(theme.toLowerCase() === 'none') {
		context.removeClass(nightCss);
		context.removeClass(dayCss);
	} else {
		return;
	}

	stxx.chart.container.style.backgroundColor="";
	stxx.styles={};
	stxx.draw();
}


//////////////////////////
/*** Study functions ***/
////////////////////////

/**
 * Native wrapper for {@link CIQ.Studies.addStudy}. Adds a specific study to the chart
 *
 * @param {String} studyName Study to add from the {@link CIQ.Studies.studyLibrary}
 * @param {Object} inputs Object containing custom inputs for instantiating the study
 * @param {Object} outputs Object containing custom outputs for instantiating the study
 * @memberof NativeLibraryBridge
 */
function addStudy(studyName, inputs, outputs) {
	CIQ.Studies.addStudy(stxx, studyName, inputs, outputs);
}

/**
 * Removes an active study in the chart engine's layout from the chart
 * @param {String} studyName The name of the study as it appears in the chart engines layout
 * @memberof NativeLibraryBridge
 */
function removeStudy(studyName) {
	var studyList=stxx.layout.studies;
	for(var study in studyList) {
		var sd=studyList[study];
		if (sd.name === studyName) {
			CIQ.Studies.removeStudy(stxx,sd);
		}
	}
}

/**
 * Convenience function to remove all studies on the chart at once
 * @memberof NativeLibraryBridge
 */
function removeAllStudies() {
	var studyList=stxx.layout.studies;
	for(var study in studyList) {
		var sd=studyList[study];
		CIQ.Studies.removeStudy(stxx,sd);
	}
}

/**
 * Returns an array of all the studies in the {@link CIQ.Studies.studyLibrary} with a shortName derived from the key.
 * Used for gathering all available studies a user can access
 * @return {Array} Array of studies with shortName of study
 * @memberof NativeLibraryBridge
 */
function getStudyList() {
	var result = [];

	for(var key in CIQ.Studies.studyLibrary) {
		CIQ.Studies.studyLibrary[key].shortName = key;
		result.push(CIQ.Studies.studyLibrary[key]);
	}

	return result;
}

/**
 * Returns the active studies in the chart engine's layout
 *
 * *Note:* For Android devices this will return a raw, unstringified, array of studies
 * @return {String} The JSON stringified list of studies
 * @memberof NativeLibraryBridge
 */
function getActiveStudies() {
	var result = [];

	for(var key in stxx.layout.studies) {
		stxx.layout.studies[key].shortName = key;
		result.push(stxx.layout.studies[key]);
	}

	if(isAndroid) {
		return result;
	}

	var seen = [];
	return JSON.stringify(result, function(key, val) {
		if (val !== null && typeof val === "object") {
			if (seen.indexOf(val) >= 0) {
				return;
			}
			seen.push(val);
		}
		return val;
	});
}

// temporary iOS helper function
function getAddedStudies() {
	var list = [];
	var s=stxx.layout.studies;
	var seen1 = [];
	var seen2 = [];
	var seen3 = [];

	function isUnique(arr){
		return function(key, value){
			if (typeof value === 'object' && value !== null) {
				if (arr.indexOf(value) !== -1) {
					// Circular reference found, discard key
					return;
				}
				// Store value in our collection
				arr.push(value);
			}
			return value;
		};
	}

	for(var n in s) {
		var sd=s[n];
		var inputs = JSON.stringify(sd.inputs, isUnique(seen1));
		var outputs = JSON.stringify(sd.outputs, isUnique(seen2));
		var parameters = JSON.stringify(sd.parameters, isUnique(seen3));
		list.push(sd.name + "___" + inputs + "___" + outputs + "___" + parameters);
	}

	var joinedList = list.join("|||");
	return joinedList;
}

/**
 * Given an active study name this will update the study based on key value pair you pass in to a {@link CIQ.Studies.DialogHelper}.
 * If the given key is not found in the DialogHelpers inputs then the key will be searched for in DialogHelper.outputs and try to update them instead
 *
 * @param {String} name Name of the study from the chart engine's layout
 * @param {String} key Key to set in the studies corresponding DialogHelper
 * @param {String} value Value to set in the studies corresponding DialogHelper
 * @memberof NativeLibraryBridge
 */
function setStudy(name, key, value) {
	var s=stxx.layout.studies;
	var selectedSd = {};
	for(var n in s){
		var sd=s[n];
		if (sd.name === name) { selectedSd = sd; }
	}

	var helper = new CIQ.Studies.DialogHelper({sd:selectedSd,stx:stxx});
	var isFound = false;
	var newInputParameters = {};
	var newOutputParameters = {};

	for (var x in helper.inputs) {
		var input = helper.inputs[x];
		if (input.name === key) {
			isFound = true;
			if (input.type === "text" || input.type === "select") {
				newInputParameters[key] = value;
			} else if (input.type === "number") {
				newInputParameters[key] = parseInt(value);
			} else if (input.type === "checkbox") {
				newInputParameters[parameter] = (value == "false" ? false : true);
			}
		}
	}
	if (isFound === false) {
		for (x in helper.outputs) {
			var output = helper.outputs[x];
			if (output.name === key) {
				newOutputParameters[key] = value;
			}
		}
	}
	isFound = false;
	helper.updateStudy({inputs:newInputParameters, outputs:newOutputParameters});
}

/**
 * Will return the default parameters of a study if it is not active, or actual parameters for an active study
 *
 * *Note:* For Android devices this will return the raw unstringified paramaters
 * @param {string} studyName Study to get parameters for
 * @param {string} prop What to return for the study.  Valid values: "inputs", "outputs", "parameters".  Default is "outputs".
 * @returns {String} JSON stringified parameters from the DialogHelper
 * @memberof NativeLibraryBridge
 * @since 6.1.0 second argument changed from boolean isInputs to string prop.  If prop==true, will return inputs, as before.
 */
function getStudyParameters(studyName, prop) {
	var params = {stx:stxx};
	if( stxx.layout.studies && stxx.layout.studies[studyName] ) params.sd=stxx.layout.studies[studyName];
	else params.name = studyName;
	var helper = new CIQ.Studies.DialogHelper(params);
	var parameters;

	switch(prop){
		case "inputs":
		case true:
			parameters = helper.inputs;
			break;
		case "parameters":
			parameters = helper.parameters;
			break;
		default:
			parameters = helper.outputs;
	}

	if(isAndroid) {
		return parameters;
	}

	return JSON.stringify(parameters);
}

/**
 * Given an active study name this will update the study based on key value pair you pass in to a {@link CIQ.Studies.DialogHelper}.
 * By default this will assume that key belongs to DialogHelper.outputs unless `isInput` is `true`
 *
 * @param {String} studyName  Name of the study from the chart engine's layout
 * @param {String} key Key to set in the studies corresponding DialogHelper
 * @param {String} value Value to set in the studies corresponding DialogHelper
 * @param {Boolean} isInput Boolean telling to update input instead of outputs
 * @memberof NativeLibraryBridge
 */
function setStudyParameter(studyName, key, value, isInput) {
	var helper = new CIQ.Studies.DialogHelper({sd:stxx.layout.studies[studyName], stx:stxx});

	if(isInput) {
		helper.updateStudy({inputs:{
			key: value
		}, outputs:{}});
	} else {
		helper.updateStudy({inputs:{}, outputs:{
			key: value
		}});
	}
}

////////////////////////////////
/*** Chart Event Listeners ***/
//////////////////////////////

/**
 * Sets a callbackListener with a type of drawing. For more info on adding event callbacks to the chart see {@link CIQ.ChartEngine#addEventListener}.
 * @memberof NativeLibraryBridge
 */
function addDrawingListener() {
	stxx.addEventListener("drawing", function(drawingObject){
		var s = drawingObject.drawings;
		var drawings = [];

		for(var n in s) {
			var drawing=s[n];
			drawings.push(drawing.serialize());
		}

		if(!isAndroid) {
			webkit.messageHandlers.drawingHandler.postMessage(JSON.stringify(drawings));
		}
	});
}

/**
 * Sets a callbackListener with a type of layout. For more info on adding event callbacks to the chart see {@link CIQ.ChartEngine#addEventListener}.
 * @memberof NativeLibraryBridge
 */
function addLayoutListener() {
	stxx.addEventListener("layout", function(layoutObject) {
		if(!isAndroid) {
			var seen = [];
			webkit.messageHandlers.layoutHandler.postMessage(JSON.stringify(layoutObject.layout, function(key, val){
				if (val !== null && typeof val == "object") {
					if (seen.indexOf(val) >= 0) {
						return;
					}
					seen.push(val);
				}
				return val;
			}));
		}
	});
}

