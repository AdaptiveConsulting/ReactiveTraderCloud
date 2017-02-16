//-------------------------------------------------------------------------------------------
// Copyright 2012-2016 by ChartIQ, Inc.
// All rights reserved
//-------------------------------------------------------------------------------------------

(function (definition) {
	"use strict";

	if (typeof exports === "object" && typeof module === "object") {
		module.exports = definition( require('./quoteFeed') );
	} else if (typeof define === "function" && define.amd) {
		define(["quoteFeed"], definition);
	} else if (typeof window !== "undefined" || typeof self !== "undefined") {
		var global = typeof window !== "undefined" ? window : self;
		definition(global);
	} else {
		throw new Error("Only CommonJS, RequireJS, and <script> tags supported for quoteFeedBarChart.js.");
	}
})(function(_exports){
	var CIQ=_exports.CIQ;


	CIQ.QuoteFeed.BarChart=function(url){
		this.url=url;
		this.exchangeZones={"AX":"Australia/Sydney"};
	};

	/**
	 * Barchart version of quotes which uses web API to fetch data
	 * @name  Barchart
	 * @constructor
	 */

	CIQ.QuoteFeed.BarChart.ciqInheritsFrom(CIQ.QuoteFeed);

	CIQ.QuoteFeed.BarChart.prototype.isBats=function(symbol){
		if(symbol.length<5) return true;
		return false;
	};

	CIQ.QuoteFeed.BarChart.prototype.isIndex=function(symbol){
		if(symbol.length && symbol[0]=='$') return true;
		return false;
	};

	CIQ.QuoteFeed.BarChart.prototype.symbology=function(symbol){
		return symbol;
	};

	CIQ.QuoteFeed.BarChart.prototype.batsOpen=function(){
		var nd=CIQ.getETDateTime();
		if(nd.getHours()>=17) return false;
		if(nd.getHours()<8) return false;
		return true;
	};

	CIQ.QuoteFeed.BarChart.prototype.isAfterDelayed=function(){
		var nd=CIQ.getETDateTime();
		if((nd.getHours()>16 || (nd.getHours()==16 && nd.getMinutes()>20))) return true;
		return false;
	};

	CIQ.QuoteFeed.BarChart.prototype.fetch=function(params, cb){
		var url = this.url + "/getHistory.csv";

		var isbats=!params.noBats && this.isBats(params.symbol);
		if(CIQ.ChartEngine.isDailyInterval(params.interval)){
			url+="?type=dailyContinue";
		}else{
			if(params.extended && isbats){
				url+="?type=formTMinutes";
			}else{
				url+="?type=minutes";
			}
			url+="&interval=" + params.period;
		}
		if(params.adj===false){
			url+="&splits=false";
		}else{
			url+="&splits=true";
		}

		var myDate=new Date();
		var startDate;
		if(params.endDate){
			myDate=params.endDate;
			if(CIQ.ChartEngine.isDailyInterval(params.interval)){
				myDate.setDate(myDate.getDate() - 1);   // set a day back since data with end day date,
														// 00:00 time is actually included in the results,
														// (even though API doc says exclusive of end date)
														// we don't want that result again

			}
			myDate=CIQ.convertTimeZone(myDate,null,"America/New_York");
			url+="&endDate=" + CIQ.yyyymmddhhmm(myDate);

			if(params.startDate){
				startDate=new Date(params.startDate);
				if(CIQ.ChartEngine.isDailyInterval(params.interval)){
					startDate.setDate(startDate.getDate() + 1);   // set a day ahead, same reason as above, 00:00 is included in results.
				}
				startDate=CIQ.convertTimeZone(startDate,null,"America/New_York");
				url+="&startDate=" + CIQ.yyyymmddhhmm(startDate);
				params.maxRecords=0;
			}else if(!params.maxRecords) params.maxRecords=maxTicks;
		}else{
			if(params.startDate){
				startDate=new Date(params.startDate);
				if(CIQ.ChartEngine.isDailyInterval(params.interval)){
					startDate.setDate(startDate.getDate() + 1);   // set a day ahead, same reason as above, 00:00 is included in results.
				}
				startDate=CIQ.convertTimeZone(startDate,null,"America/New_York");
				url+="&startDate=" + CIQ.yyyymmddhhmm(startDate);
				params.maxRecords=0;
			}else if(!params.maxRecords){
				params.maxRecords=params.ticks*3;
			}
		}
		if(params.maxRecords) url+="&maxRecords=" + params.maxRecords;

		url+="&order=asc";

		var symbol=this.symbology(params.symbol);

		if(isbats && params.update){
			if(symbol.indexOf(".BZ")==-1 && (!this.isAfterDelayed() || params.extended) && this.batsOpen() && symbol.charAt(0)!='$')	// After 4:20 always get delayed data on refreshes
				symbol=symbol+".BZ";
		}
		url+="&symbol=" + encodeURIComponent(symbol);

		if(params.nocache) url+="&nocache";

		var self=this;
		CIQ.postAjax(url, null, function(status, res){
			if(status!=200){
				cb({error:status});
				return;
			}
			if(res=="\r\n"){
				cb({quotes:[]});
				return;
			}
			res=self.process(res, params);

			var moreToLoad=!params.stx.quoteDriver.behavior.noLoadMore;
			if(!params.maxRecords || res.length<params.maxRecords){
				moreToLoad=false;
			}
			var attrExch="DELAYED";
			if(isBats) attrExch="BATS";
			else if(CIQ.Market.Symbology.isForexSymbol(params.symbol)) attrExch="REAL-TIME";
			cb({quotes:res, moreAvailable:moreToLoad, attribution:{source:"barchart",exchange:attrExch}});
		});
	};

	CIQ.QuoteFeed.BarChart.prototype.process=function(quotes, params){
		var interval=params.interval;
		var stx=params.stx;
		var symbol=params.symbol;
		var newQuotes=[];
		var arr=quotes.split("\r\n");
		if(arr.length<2) return newQuotes;
		var fds=arr[0].split(",");
		var fieldNames={};
		var suppressVolume=(params.update && CIQ.ChartEngine.isDailyInterval(interval));
		var i;
		for(i=0;i<fds.length;i++){
			fieldNames[fds[i]]=i;
		}
		for(i=1;i<arr.length;i++){
			var fields=arr[i].split(',');
			if(fields.length<fds.length) continue;
			var field=fields[fieldNames.timestamp].replace(/"/g,"");
			if(field==="") continue;
			var bcdt=CIQ.strToDateTime(field);
			if(params.startDate && bcdt<params.startDate) continue;
			newQuotes.push({
				Date: CIQ.yyyymmddhhmm(bcdt),
				Open: parseFloat(fields[fieldNames.open].replace(/"/g,"")),
				High: parseFloat(fields[fieldNames.high].replace(/"/g,"")),
				Low: parseFloat(fields[fieldNames.low].replace(/"/g,"")),
				Close: parseFloat(fields[fieldNames.close].replace(/"/g,"")),
				Volume: (suppressVolume?0:parseFloat(fields[fieldNames.volume].replace(/"/g,""))),
				Adj_Close: parseFloat(fields[fieldNames.close].replace(/"/g,""))
			});
		}
		return newQuotes;
	};

	return _exports;
});