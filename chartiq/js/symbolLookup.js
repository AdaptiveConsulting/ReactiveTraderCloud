// -------------------------------------------------------------------------------------------
// Copyright 2018 by ChartIQ, Inc
// -------------------------------------------------------------------------------------------
(function (definition) {
    "use strict";

    if (typeof exports === "object" && typeof module === "object") {
        module.exports = definition(require('./chartiq'));
    } else if (typeof define === "function" && define.amd) {
        define(['chartiq'], definition);
    } else if (typeof window !== "undefined" || typeof self !== "undefined") {
		var global = typeof window !== "undefined" ? window : self;
		definition(global,global);
    } else {
		throw new Error("Only CommonJS, RequireJS, and <script> tags supported for symbolLookup.js.");
    }

})(function(_exports) {
	var CIQ=_exports.CIQ;
	
	/**
	 * Base class that drives the lookup functionality. You should derive your own Driver.Lookup that interacts with your datafeed.
	 * 
	 * This is used with the [cq-lookup web component]{@link WebComponents.cq-lookup} and [CIQ.UI.Context.setLookupDriver](CIQ.UI.Context.html#setLookupDriver)
	 *
	 * @name CIQ.ChartEngine.Driver.Lookup
	 * @constructor
	 * @param {array} exchanges An array of exchanges that can be searched against
	 * @example
	 * // sample implementation
	 * CIQ.ChartEngine.Driver.Lookup.ChartIQ=function(exchanges){
	 *	this.exchanges=exchanges;
	 *	if(!this.exchanges) this.exchanges=["XNYS","XASE","XNAS","XASX","INDCBSX","INDXASE","INDXNAS","IND_DJI","ARCX","INDARCX","forex"];
	 *	this.url="https://symbols.chartiq.com/chiq.symbolserver.SymbolLookup.service";
	 *	this.requestCounter=0;  //used to invalidate old requests
	 * };
	 *
	 * //Inherits all of the base Look Driver's properties via `ciqInheritsFrom()`
	 * 	CIQ.ChartEngine.Driver.Lookup.ChartIQ.ciqInheritsFrom(CIQ.ChartEngine.Driver.Lookup);
	 * @since 6.0.0
	 */
	CIQ.ChartEngine.Driver.Lookup=function(){};

	/**
	 * **Abstract method** used to accept the selected text with optional filter and return an array of properly formatted objects.
	 *
	 * You should implement your own instance of this method to fetch results from your symbol list and return them by calling cb(your-results-array-here);
	 *
	 * Each element in the array should be of the following format:
	 * {
	 * 		display:["symbol-id","Symbol Description","exchange"],
	 * 		data:{
	 * 			symbol:"symbol-id",
	 * 			name:"Symbol Description",
	 * 			exchDis:"exchange"
	 * 		}
	 * }
	 *
	 * @param {string} text The text entered by the user
	 * @param {string} [filter] The optional filter text selected by the user. This will be the innerHTML of the cq-filter element that is selected.
	 * @param {number} maxResults Max number of results to return from the server
	 * @param {function} cb Callback upon results
	 * @memberof CIQ.ChartEngine.Driver.Lookup
	 * @example
		// sample implementation
		CIQ.ChartEngine.Driver.Lookup.ChartIQ.prototype.acceptText=function(text, filter, maxResults, cb){
			if(filter=="FX") filter="FOREX";
			if(isNaN(parseInt(maxResults, 10))) maxResults=100;
			var url=this.url+"?t=" + encodeURIComponent(text) + "&m="+maxResults+"&x=[";
			if(this.exchanges){
				url+=this.exchanges.join(",");
			}
			url+="]";
			if(filter && filter.toUpperCase()!="ALL"){
				url+="&e=" + filter;
			}

			var counter=++this.requestCounter;
			var self=this;
			function handleResponse(status, response){
				if(counter<self.requestCounter) return;
				if(status!=200) return;
				try{
					response=JSON.parse(response);
					var symbols=response.payload.symbols;

					var results=[];
					for(var i=0;i<symbols.length;i++){
						var fields=symbols[i].split('|');
						var item={
							symbol: fields[0],
							name: fields[1],
							exchDisp: fields[2]
						};
						results.push({
							display:[item.symbol, item.name, item.exchDisp],
							data:item
						});
					}
						cb(results);
				}catch(e){}
			}
			CIQ.postAjax({url: url, cb: handleResponse});
		};
	 * @example
	 *  // sample response array
	 *  [
	 *  	{"display":["A","Agilent Technologies Inc","NYSE"],"data":{"symbol":"A","name":"Agilent Technologies Inc","exchDisp":"NYSE"}},
	 *  	{"display":["AA","Alcoa Corp","NYSE"],"data":{"symbol":"AA","name":"Alcoa Corp","exchDisp":"NYSE"}}
	 *  ];
	 * @since 6.0.0
	 */
	CIQ.ChartEngine.Driver.Lookup.prototype.acceptText=function(text, filter, maxResults, cb){
		if(!this.cb) return;
	};

	/**
	 * An example of an asynchronous Lookup.Driver that uses ChartIQ's suggestive search as its source for symbol search
	 * @memberof CIQ.ChartEngine.Driver.Lookup
	 * @param {array} exchanges An array of exchanges that can be searched against
	 * @private
	 * @since 6.0.0
	 */
	CIQ.ChartEngine.Driver.Lookup.ChartIQ=function(exchanges){
		this.exchanges=exchanges;
		if(!this.exchanges) this.exchanges=["XNYS","XASE","XNAS","XASX","INDCBSX","INDXASE","INDXNAS","IND_DJI","ARCX","INDARCX","forex"];
		this.url="https://symbols.chartiq.com/chiq.symbolserver.SymbolLookup.service";
		this.requestCounter=0;  //used to invalidate old requests
		//t=ibm&m=10&x=[]&e=STOCKS
	};

	/**
	 * An example instance of the Driver Lookup scoped to CIQ.ChartEngine.Driver.Lookup
	 *
	 * Inherits all of the base Driver Lookup's properties via `ciqInheritsFrom()`
	 * @name ChartIQ
	 * @memberof CIQ.ChartEngine.Driver.Lookup
	 * @private
	 * @since 6.0.0
	 */
	CIQ.ChartEngine.Driver.Lookup.ChartIQ.ciqInheritsFrom(CIQ.ChartEngine.Driver.Lookup);

	/**
	 * @memberof CIQ.ChartEngine.Driver.Lookup.ChartIQ
	 * @param {string} text Text to search for
	 * @param {string} filter Any filter to be applied to the search results
	 * @param {number} maxResults Max number of results to return from the server
	 * @param {function} cb Callback upon results
	 * @private
	 * @since 6.0.0
	 */
	CIQ.ChartEngine.Driver.Lookup.ChartIQ.prototype.acceptText=function(text, filter, maxResults, cb){
		if(filter=="FX") filter="FOREX";
		if(isNaN(parseInt(maxResults, 10))) maxResults=100;
		var url=this.url+"?t=" + encodeURIComponent(text) + "&m="+maxResults+"&x=[";
		if(this.exchanges){
			url+=this.exchanges.join(",");
		}
		url+="]";
		if(filter && filter.toUpperCase()!="ALL"){
			url+="&e=" + filter;
		}

		var counter=++this.requestCounter;
		var self=this;
		function handleResponse(status, response){
			if(counter<self.requestCounter) return;
			if(status!=200) return;
			try{
				response=JSON.parse(response);
				var symbols=response.payload.symbols;

				var results=[];
				for(var i=0;i<symbols.length;i++){
					var fields=symbols[i].split('|');
					var item={
						symbol: fields[0],
						name: fields[1],
						exchDisp: fields[2]
					};
					results.push({
						display:[item.symbol, item.name, item.exchDisp],
						data:item
					});
				}
				cb(results);
			}catch(e){}
		}
		CIQ.postAjax({url: url, cb: handleResponse});
	};

	return _exports;
});
