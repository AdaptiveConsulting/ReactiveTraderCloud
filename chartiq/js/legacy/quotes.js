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
		throw new Error("Only CommonJS, RequireJS, and <script> tags supported for quotes.js.");
	}
})(function(_exports){
	//console.log("quotes.js",_exports);
	var CIQ=_exports.CIQ;

	/**
	 * ** This class is maintained for legacy implementations only. New implementations should use {@link CIQ.QuoteFeed} **<br>
	 * Base class for Quotes infrastructure. Many of the built in UI capabilities such as comparison charts expect
	 * to follow this infrastructure. You should define your own classes that follow this pattern (or derive a class from CIQ.Quotes)
	 * in order to adapt your quote feed to make the most use of the built in componentry.
	 * @constructor
	 * @name CIQ.Quotes
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Quotes=function(){};

	/**
	 * If you support multiple data sources then this can be used to cascade through them if data is not available.
	 * @param  {object} params        Standard parameters
	 * @param  {string} currentSource Current source
	 * @return {string}               The next source in the cascade, or null if no more available
	 * @memberOf CIQ.Quotes
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Quotes.nextDataSource=function(params, currentSource){
		return null;
	};


	/**
	 * Fetch multiple quotes asynchronously, possibly from various data sources. This method can be used to update a chart with multiple symbols
	 * such as a comparison chart.
	 * @param  {array}   arr Array of params see {@link CIQ.Quotes.fetch}
	 * @param  {Function} cb  Function to callback when quotes are fetched. Will be passed an array of results. Each result is an object {err, data}. err will either be null or an error message.
	 * @memberOf CIQ.Quotes
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Quotes.multiFetch=function(arr, cb){
		var tracker={
			counter:0,
			finished: arr.length,
			results: []
		};

		function handleResponse(params, tracker, cb){
			return function(err, data){
				tracker.results.push({err:err, params: params, data:data});
				tracker.counter++;
				if(tracker.counter>=tracker.finished){
					var results=tracker.results;
					tracker.results=[];
					cb(results);
				}
			};
		}
		for(var i=0;i<arr.length;i++){
			var params=arr[i];
			CIQ.Quotes.fetch(params, handleResponse(params, tracker, cb));
		}
	};


	/**
	 * Fetch data. This will automatically fetch data from your data source, if you pass the approprite params.source string.
	 *
	 * @param  {object}   params Parameters required by your quote feed (such as start date, end date, number of bars, etc)
	 * @param {object} params.stx The Chart object
	 * @param {string} [source=Demo] The name of the requested data source
	 * @param  {Function} cb     Callback function will return fc(error, data) where error will be null if no error and data should be in format required by kernel
	 * @memberOf CIQ.Quotes
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Quotes.fetch=function(params, cb){
	    if(!params.source) params.source="Demo";
		function handleResponse(error, data){
			cb(error, data);
		}
		CIQ.Quotes[params.source].fetch(params, handleResponse);
	};

	/**
	 * Returns how many bars should be fetched. If we're fetching a series then it's simply the number
	 * of bars already in the chart. Otherwise it's the number of bars to fetch to fill up the screen.
	 * @param  {object} params Parameters
	 * @param  {object} stx    The chart object
	 * @return {number}        Number of bars to fetch
	 * @memberOf CIQ.Quotes
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Quotes.barsToFetch=function(params){
		if(params.isSeries) return params.stx.masterData.length;

		var p=params.stx.layout.periodicity;
		// Rough calculation, this will account for 24x7 securities
		if(params.stx.layout.interval=="month") p=30*p;
		if(params.stx.layout.interval=="week") p=7*p;

		var bars=params.stx.chart.maxTicks*p;
		return bars;
	};

	/*
	 * This is a demo version of fetch. You will need to create one for your own quote feed that behaves similarly.
	 * At the very least it should support params.symbol and params.interval. You may optionally use barsToFetch if your server supports
	 * specification of a maximum number of ticks. Depending on your implementation, you may also need to support
	 * start and end dates (for instance to support loading more when the user scrolls back or refresh updates)
	 */

	CIQ.Quotes.Demo=function(){};

	CIQ.Quotes.Demo.fetch=function(params, cb){
		function setQuotes(response){
			var varName=response.substr(0,response.indexOf("="));
			var valueToParse=response.substring(response.indexOf(varName+"=")+(varName+"=").length,response.length-1);
			try{
				return JSON.parse(valueToParse.replace(/,0+/g,",0").replace(/,[.]/g,",0.").replace(/;/g,""));
			}catch(e){
				return [];
			}
		}

		url="https://demoquotes.chartiq.com/" + params.symbol.toUpperCase();
		// Theoretically append interval to url as well (although Demo has limited EOD)
		var bars=CIQ.Quotes.barsToFetch(params);
		CIQ.postAjax(url, null, function(status, response){
			if(status!=200){
				cb(status);
				return;
			}
			var quotes=setQuotes(response);
			var newQuotes=[];
			for(var i=0;i<quotes.length;i++){
				newQuotes[i]={};
				newQuotes[i].Date=quotes[i][0];
				newQuotes[i].Open=quotes[i][1];
				newQuotes[i].High=quotes[i][2];
				newQuotes[i].Low=quotes[i][3];
				newQuotes[i].Close=quotes[i][4];
				newQuotes[i].Volume=quotes[i][5];
				newQuotes[i].Adj_Close=quotes[i][6];
			}
			cb(null, newQuotes);
		});
	};

	return _exports;
});