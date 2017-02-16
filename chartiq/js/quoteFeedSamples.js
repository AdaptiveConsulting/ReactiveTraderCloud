// -------------------------------------------------------------------------------------------
// Copyright 2012-2016 by ChartIQ, Inc
// -------------------------------------------------------------------------------------------
(function (definition) {
    "use strict";

	if (typeof exports === "object" && typeof module === "object") {
		module.exports = definition(require('./quoteFeed'));
	} else if (typeof define === "function" && define.amd) {
		define(['quoteFeed'], definition);
	} else if (typeof window !== "undefined" || typeof self !== "undefined") {
		var global = typeof window !== "undefined" ? window : self;
		definition(global);
	} else {
		throw new Error("Only CommonJS, RequireJS, and <script> tags supported for quoteFeedSamples.js.");
	}

})(function(_exports) {
	var CIQ=_exports.CIQ;

	/* Copy and paste CIQ.QuoteFeed.CopyAndPasteMe. Change "CopyAndPasteMe" to the name
	of your quote service. Then implement the fetch() method based on the included comments */

	CIQ.QuoteFeed.CopyAndPasteMe=function(){};

	CIQ.QuoteFeed.CopyAndPasteMe.ciqInheritsFrom(CIQ.QuoteFeed.Subscriptions);

	CIQ.QuoteFeed.CopyAndPasteMe.prototype.fetchFromSource=function(params, cb){

		// This is an outline for how to implement fetch in your custom feed. Cut and paste
		// this code and then implement. Leave any portion blank that you cannot support.
		// 
		// Most quote feeds will support startDate and endDate. This will be enough to implement
		// charts. It is also possible to implement charts with quote feeds that support other
		// request parameters but you may need to do some manipulation within this code to
		// accomplish this.
		// 
		// See CIQ.QuoteFeed.Demo or CIQ.QuoteFeed.EndOfDay below for actual implementations.

		if(params.startDate && params.endDate){
			// If you receive both a startDate and endDate then the chart is asking for a
			// specific data range. This usually happens when a comparison symbol has been
			// added to the chart. You'll want the comparison symbol to show up on all the same
			// bars on the screen.
			// 
			// You should return data for the entire range, otherwise you could get a gap of data on the screen.
		} else if(params.startDate){
			// This means the chart is asking for a refresh of most recent data.
			// (This is streaming by "polling". For actual push based streaming see {@link CIQ.ChartEngine#streamTrade} and {@link CIQ.ChartEngine.appendMasterData}.
			// 
			// The chart will call this every X seconds based on what you have specified in behavior.refreshInterval
			// when you initially attached the quote feed to stxx (attachQuoteFeed).
			// 
			// If you don't support polling then just do nothing and return.
			// Otherwise fetch your data, probably using Ajax, and call the cb method with your data.
			// 
			// Please note that you may need to return more than 1 bar of data. If the chart has moved
			// forward then the requested startDate will be the previous bar (to finalized the bar) and
			// you should return that bar as well as the current (new) bar. To simplify, always return
			// all of the bars starting with startDate and ending with the most recent bar.
		}else if(params.endDate){
			// If you only receive an endDate, it means the user has scrolled past the end of
			// the chart. The chart needs older data, if it's available.
			// If you don't support pagination just return and do nothing.
			// 
			// Note: If your server requires a startDate then you'll need to calculate one here. A simple method
			// would be to take the endDate and then, using JavaScript Date math, create a date that is far enough
			// in the past based on params.period, params.interval and params.ticks. @todo, provide a convenience method
			// 
			// Otherwise fetch your data, probably using Ajax, and call the call with cb method with your data.
		}else{
			// The chart needs an initial load.
			// 
			// params.tick provides an suggested number of bars to retrieve to fill up the chart
			// and provide some bars off the left edge of the screen. It's good to provide more initial
			// data than just the size of the chart because many users will immediately zoom out. If you
			// have extra data off the left edge of the chart, then the zoom will be instantaneous. There
			// is very little downside to sending extra data.
			// 
			// You do not need to retrieve exactly params.tick number of bars. This is a suggestion.
			// You can return as many as you want. Fetching 1,000 bars is another good approach. This will
			// cover the immediate zooming and panning needs of 95% of users.
			//
			// Note: If your server requires startDate and endDate then use Date.now() for the endDate
			// and calculate a startDate using JavaScript Date math. params.period, params.interval and params.ticks
			// provide all the variables necessary to do the math. @todo, provide a convenience method
			// 
			// Fetch your data, probably using Ajax, and call the cb method with yourdata. This
			// is where you'll need to reformat your data into the format required by the chart.
			// 
			//  Put your code here to format the response according to the specs and return it in the callback.
			//
			//	Example code:
			//	
			// CIQ.postAjax(url, null, function(status, response){
			//	if(status!=200){
			//		cb({error:status});	// something went wrong, use the callback function to return your error
			//		return;
			//	}
			//	
			//	var quotes=formatQuotes(response);
			//	var newQuotes=[];
			//	for(var i=0;i<quotes.length;i++){
			//		newQuotes[i]={};
			//		newQuotes[i].Date=quotes[i][0]; // Or set newQuotes[i].DT if you have a JS Date
			//		newQuotes[i].Open=quotes[i][1];
			//		newQuotes[i].High=quotes[i][2];
			//		newQuotes[i].Low=quotes[i][3];
			//		newQuotes[i].Close=quotes[i][4];
			//		newQuotes[i].Volume=quotes[i][5];
			//		newQuotes[i].Adj_Close=quotes[i][6];
			//	}
			//  cb({quotes:newQuotes, moreAvailable:false}); // set moreAvailable to true or false if your server supports fetching older data, and you know that older data is available.
			// });
			// 
		}
	};

	CIQ.QuoteFeed.CopyAndPasteMe.prototype.subscribe=function(params){
		// This will get called each time the chart encounters a new symbol. This
		// could happen from a user changing symbol, a user adding a comparison symbol,
		// a new study that requires a new symbol.
		// 
		// You can use this along with unsubscribe() to keep track for the purpose
		// of maintaining legends, lists of securities, or to open or close streaming
		// connections.
		// 
		// If using a push streamer, subscribe to this security and then have the push
		// streamer push updates using {@link CIQ.ChartEngine#streamTrade} if you have
		// a "last trade" stream or {@link CIQ.ChartEngine@appendMasterData} if you have an "OHLC" stream.
		// 
		// Use params.interval, params.period, params.symbolObject to inform your streamer
		// what it needs to send
	};

	CIQ.QuoteFeed.CopyAndPasteMe.prototype.unsubscribe=function(params){
		// When a chart no longer needs to keep track of a symbol it will call
		// unsubscribe(). You can use this to tell your streamer it no longer
		// needs to send updates.
	};


	/**
	 * Demo version of quotes which uses EOD data. See full demo code in quoteFeedSamples.js.
	 * @name  CIQ.QuoteFeed.Demo
	 * @constructor
	 */
	CIQ.QuoteFeed.Demo=function(){
	};

	CIQ.QuoteFeed.Demo.ciqInheritsFrom(CIQ.QuoteFeed.Subscriptions);

	/**
	 * This is a demo version of fetch. You will need to create one for your own quote feed that behaves similarly.
	 * @memberOf CIQ.QuoteFeed.Demo
	 */
	CIQ.QuoteFeed.Demo.prototype.fetchFromSource=function(params, cb){

		if(params.startDate && params.endDate ){
			//date range
			if(params.interval=='tick' || params.interval=="minute" || params.interval=="second" || params.interval=="millisecond"){
				this.generateIntradayRange(params, cb);
			} else {
				this.generateDaily(params, cb);
			}
			return;
		} else if(params.startDate ){
			// new update
			if(params.interval=='tick' || params.interval=="minute" || params.interval=="second" || params.interval=="millisecond"){
				this.update(params, cb);
			}else{
				cb({error:"CIQ.QuoteFeed.Demo does not support updates for daily charts"});
			}
			return;
		} else if(params.endDate){
			// pagination
			if(params.interval=='tick' || params.interval=="minute" || params.interval=="second" || params.interval=="millisecond"){
				this.loadMore(params, cb);
			}else{
				cb({error:"CIQ.QuoteFeed.Demo does not support loadMore for daily charts"});
			}
			return;
		} else {
			// initial load
			if(params.interval=='tick' || params.interval=="minute" || params.interval=="second" || params.interval=="millisecond"){
				this.generateIntraday(params, cb);
			} else {
				this.generateDaily(params, cb);
			}
			return;
		}
	};


	/**
	 * Creates a random update. Note that updates are returned as an array. You should check params.startDate to decide
	 * the starting point for an update.
	 * @memberOf CIQ.QuoteFeed.Demo
	 */
	CIQ.QuoteFeed.Demo.prototype.update=function(params, cb){

		// market closed return empty update.
		if (!this.market.isOpen()) {
			cb({quotes:[], attribution:{source:"demo", exchange:"RANDOM"}});
			return;
		}

		var masterData=params.stx.chart.masterData;
		var current=masterData[masterData.length-1];
		var previous=masterData[masterData.length-2];

		var ms=this.market.marketZoneNow().getTime();
		var divisor=60*1000;
		if(params.interval=="second") divisor=1000;
		if(params.interval=="millisecond") divisor=1;
		ms=ms-ms%(params.period*divisor); // move to evenly divided bar
		var now=new Date(ms);

		var newQuote={};
		newQuote.DT=now; // Or set newQuote.Date if you have a string form date
		var field=params.symbol;
		if(!current[field]){
			if(previous[field]) current=previous; // get series which might be lagging behind a bar
			else field="Close";
		}
		newQuote.Close=Math.round((current[field]-(Math.random()-0.5)*0.8)*100)/100;

		if(ms==masterData[masterData.length-1].DT.getTime()){
			if(field=="Close"){
				newQuote.Open=current.Open;
				newQuote.High=Math.max(current.High, newQuote.Close);
				newQuote.Low=Math.min(current.Low, newQuote.Close);
			}else{
				newQuote.Open=Math.round((current[field]-(Math.random()-0.5)*0.8)*100)/100;
				newQuote.High=Math.max(newQuote.Open, newQuote.Close);
				newQuote.Low=Math.min(newQuote.Open, newQuote.Close);					
			}
			newQuote.Volume=current.Volume+Math.round(Math.random()*1000);
		}else{
			newQuote.Open=newQuote.High=newQuote.Low=newQuote.Close;
			newQuote.Volume=1000;
		}
		cb({quotes:[newQuote], attribution:{source:"demo", exchange:"RANDOM"}});
	};

	CIQ.QuoteFeed.Demo.prototype.randomQuote=function(seed){
		var Open=seed-(Math.random()-0.5)*2;
		var Close=seed-(Math.random()-0.5)*2;
		var High=Math.max(seed-(Math.random()-0.5)*2, Open, Close);
		var Low=Math.min(seed-(Math.random()-0.5)*2, Open, Close);
		var newQuote={
			Open: Math.round(Open*100)/100,
			Close: Math.round(Close*100)/100,
			High: Math.round(High*100)/100,
			Low: Math.round(Low*100)/100
		};
		// Reasonable random volume generator. Higher volumes for red candles.
		if(newQuote.Close<newQuote.Open){
			newQuote.Volume=1000000+Math.round(Math.random()*1500000);
		}else{
			newQuote.Volume=1000000+Math.round(Math.random()*300000);
		}
		return newQuote;
	};


	/**
	 * Creates daily data for the chart
	 * @memberOf CIQ.QuoteFeed.Demo
	 */
	CIQ.QuoteFeed.Demo.prototype.generateDaily=function(params, cb){
		function setQuotes(response){
			var varName=response.substr(0,response.indexOf("="));
			var valueToParse=response.substring(response.indexOf(varName+"=")+(varName+"=").length,response.length-1);
			try{
				return JSON.parse(valueToParse.replace(/,0+/g,",0").replace(/,[.]/g,",0.").replace(/;/g,""));
			}catch(e){
				return [];
			}
		}

		var symbol=params.symbol.toUpperCase();
		if(symbol.charAt(0)!="^" && CIQ.Market.Symbology.isForexSymbol(symbol)) symbol="^"+symbol;
		var url="https://demoquotes.chartiq.com/" + symbol.replace(/\//g,"-");
		CIQ.postAjax(url, null, function(status, response){
			if(status!=200){
				cb({error:status});
				return;
			}
			var quotes=setQuotes(response);
			var newQuotes=[];
			for(var i=0;i<quotes.length;i++){
				newQuotes[i]={};
				newQuotes[i].Date=quotes[i][0]; // Or set newQuotes[i].DT if you have a JS Date
				newQuotes[i].Open=quotes[i][1];
				newQuotes[i].High=quotes[i][2];
				newQuotes[i].Low=quotes[i][3];
				newQuotes[i].Close=quotes[i][4];
				newQuotes[i].Volume=quotes[i][5];
				newQuotes[i].Adj_Close=quotes[i][6];
			}
			params.noUpdate=true;   //Daily demo quotes do not support updates
			cb({quotes:newQuotes, moreAvailable:false, attribution:{source:"demo", exchange:"RANDOM"}}); // set moreAvailable to true so that the chart will request more when scrolling into the past. Set to false if at the end of data.
		});
	};


	/**
	 * Creates a random intraday chart (uses CIQ.Market to be market hours aware)
	 * @memberOf CIQ.QuoteFeed.Demo
	 */
	CIQ.QuoteFeed.Demo.prototype.generateIntraday=function(params, cb){
		
		if(params.stx.marketFactory) {
			params.stx.setMarket(params.stx.marketFactory(params.symbolObject),params.stx.chart);
		}
		this.market = params.stx.chart.market;

		var seed=155.43;
		var quotes=[];
		var ticksToLoad=params.ticks*3; // load extra to fill up space before chart
		if( ticksToLoad > 2000 ) ticksToLoad =2000; // demo data could be slow for very large data sets since it recursively calls iter.previous() wich is not inteded to be uses this way normally
		if(isNaN(ticksToLoad)) ticksToLoad=params.stx.chart.dataSet.length;

		var ms=this.market.marketZoneNow().getTime();
		var divisor=60*1000;
		if(params.interval=="second") divisor=1000;
		if(params.interval=="millisecond") divisor=1;
		ms=ms-ms%(params.period*divisor); // move to evenly divided bar
		var now=new Date(ms);

		var iter = this.market.newIterator(
				{
					'begin': now,
					'interval': params.stx.layout.interval == 'tick' ? 1:params.stx.layout.interval,
					'periodicity': 1, //params.stx.layout.periodicity, // allways do 1 since this is the raw data. The agregation will happen upon data returned.
					'timeUnit': params.stx.layout.timeUnit,
					'inZone': params.stx.dataZone,
					'outZone': params.stx.dataZone
				}
		);

		if (!this.market.isOpen()) now = iter.previous();
		// if we are only loading market hours, we may reach today's date before the number of max ticks.
		// So we go backwards based on ticks and not date, then reverse the array.
		for(var i=0;i<ticksToLoad ;i++){
			var newQuote=this.randomQuote(seed);
			newQuote.DT=new Date(now);
			newQuote.Volume=Math.round(newQuote.Volume*params.period/500);
			quotes.push(newQuote);
			now = iter.previous();
			//console.log(now);
			seed=newQuote.Close;
		}

		cb({quotes:quotes.reverse(), moreAvailable:true, attribution:{source:"demo", exchange:"RANDOM"}}); // set moreAvailable to true so that the chart will request more when scrolling into the past. Set to false if at the end of data.
	};

	/**
	 * Creates a random intraday range of data for a chart
	 * @memberOf CIQ.QuoteFeed.Demo
	 */
	CIQ.QuoteFeed.Demo.prototype.generateIntradayRange=function(params, cb){

		var seed=155.43;
		var quotes=[];

		var now=new Date(params.startDate);

		var iter = this.market.newIterator(
				{
					'begin': now,
					'interval': params.stx.layout.interval == 'tick' ? 1:params.stx.layout.interval,
					'periodicity': 1, //params.stx.layout.periodicity,
					'timeUnit': params.stx.layout.timeUnit,
					'inZone': params.stx.dataZone,
					'outZone': params.stx.dataZone
				}
		);

		while (now <=params.endDate){
			var newQuote=this.randomQuote(seed);
			newQuote.DT=new Date(now);
			newQuote.Volume=Math.round(newQuote.Volume*params.period/500);
			quotes.push(newQuote);
			now = iter.next();
			seed=newQuote.Close;
		}

		cb({quotes:quotes,moreAvailable:true, attribution:{source:"demo", exchange:"RANDOM"}});
	};

	/**
	 * Loads more random data when the user scrolls back.
	 * @memberOf CIQ.QuoteFeed.Demo
	 */
	CIQ.QuoteFeed.Demo.prototype.loadMore=function(params, cb){

		var firstQuote=params.chart.masterData[0];
		var i;
		for(i=0;i<params.chart.masterData.length;i++){
			if(params.chart.masterData[i].DT.getTime()>=params.endDate.getTime()){
				firstQuote=params.chart.masterData[i];
				if( firstQuote[params.symbol] || firstQuote.Close) break;
			}
		}
		var field=params.symbol;
		if ( !firstQuote[field] ) field="Close";
		var seed=firstQuote[field];
		var quotes=[];

		var iter = this.market.newIterator(
				{
					'begin': params.endDate,
					'interval': params.stx.layout.interval == 'tick' ? 1:params.stx.layout.interval,
					'periodicity': 1, //params.stx.layout.periodicity,
					'timeUnit': params.stx.layout.timeUnit,
					'inZone': params.stx.dataZone,
					'outZone': params.stx.dataZone
				}
		);

		var now = new Date(iter.previous());
		for(i=0;i<params.ticks;i++){
			var newQuote=this.randomQuote(seed);
			newQuote.DT=new Date(now);
			if(params.interval=="minute") newQuote.Volume=Math.round(newQuote.Volume*params.period/500);
			quotes.push(newQuote);
			now = iter.previous();
			seed=newQuote.Close;
		}
		quotes.reverse();

		cb({quotes:quotes, moreAvailable:params.chart.masterData.length<100000, attribution:{source:"demo", exchange:"RANDOM"}}); // set moreAvailable to true so that the chart will request more when scrolling into the past. Set to false if at the end of data.
	};


	CIQ.QuoteFeed.ChartIQEOD=function(urlQuick, urlFull){
		this.urlQuick=urlQuick;
		this.urlFull=urlFull;
	};

	CIQ.QuoteFeed.ChartIQEOD.ciqInheritsFrom(CIQ.QuoteFeed);

	/**
	 * EOD quotes from ChartIQ. You'll need to get a valid url from ChartIQ to use this.
	 * @memberOf CIQ.QuoteFeed.ChartIQEOD
	 */
	CIQ.QuoteFeed.ChartIQEOD.prototype.fetch=function(params, cb){
		function setQuotes(response){
			var varName=response.substr(0,response.indexOf("="));
			var valueToParse=response.substring(response.indexOf(varName+"=")+(varName+"=").length,response.length-1);
			try{
				return JSON.parse(valueToParse.replace(/,0+/g,",0").replace(/,[.]/g,",0.").replace(/;/g,""));
			}catch(e){
				return [];
			}
		}

		if(params.startDate && !params.endDate){
			cb({error:"CIQ.QuoteFeed.ChartIQEOD does not support updates for daily charts"});
			return;
		}
		if(params.endDate && !params.loadMoreReplace){
			cb({error:"CIQ.QuoteFeed.ChartIQEOD does not support loadMore for daily charts"});
			return;
		}
		if(params.interval=="minute"){
			cb({error:"CIQ.QuoteFeed.ChartIQEOD does not support intraday charts"});
			return;
		}
		var symbol=params.symbol.toUpperCase();
		if(symbol.charAt(0)!="^" && CIQ.Market.Symbology.isForexSymbol(symbol)) symbol="^"+symbol;
		var url=this.urlQuick;
		var moreAvailable=true;
		if(params.endDate && params.loadMoreReplace) url=this.urlFull;
		else if((new Date().getTime()-1333238400000)/86400000<params.ticks) url=this.urlFull;  // start predates quick cache
		if(url==this.urlFull){
			delete params.endDate;
			moreAvailable=false;
		}
		if(!url) url=this.urlQuick+"/pts";
		var self=this;
		CIQ.postAjax(url+"/"+symbol.replace(/\//g,"-").toUpperCase(), null, function(status, response){
			if(status!=200){
				cb({error:status});
				return;
			}
			var quotes=setQuotes(response);
			var newQuotes=[];
			for(var i=0;i<quotes.length;i++){
				newQuotes[i]={};
				newQuotes[i].Date=quotes[i][0]; // Or set newQuotes[i].DT if you have a JS Date
				newQuotes[i].Open=quotes[i][1];
				newQuotes[i].High=quotes[i][2];
				newQuotes[i].Low=quotes[i][3];
				newQuotes[i].Close=quotes[i][4];
				newQuotes[i].Volume=quotes[i][5];
				newQuotes[i].Adj_Close=quotes[i][6];
			}
			var result={
						quotes:newQuotes,
						moreAvailable:moreAvailable,
						attribution:{
							source:"chartiq",
							exchange:"EOD"
						}
			};
			var now=new Date().getTime();
			if(!result.quotes.length || now-CIQ.strToDate(result.quotes[result.quotes.length-1].Date).getTime()>24*60*60*1000){
				if(self.realTimeHook) return self.realTimeHook(params,result,cb);
			}
			cb(result);
		});
	};

	/** You can override this function to fetch a RT update from a different source
	 * @memberOf CIQ.QuoteFeed.ChartIQEOD
	 */
	CIQ.QuoteFeed.ChartIQEOD.prototype.realTimeHook=function(params,result,cb){
		cb(result);
	};

	return _exports;
});