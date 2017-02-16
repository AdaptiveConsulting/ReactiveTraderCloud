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
		throw new Error("Only CommonJS, RequireJS, and <script> tags supported for quoteFeedXignite.js.");
	}
})(function(_exports){
	var CIQ=_exports.CIQ;



	/**
	 * Xignite version of quotes which uses web API to fetch data. 
	 * Pass the Xignite provided token to the constructor ( intended for internal testing only). 
	 * If constructed without a token then the CIQ.QuoteFeed.Xignite.Utility.overrides members will be examined for rules on building the url path and token. 
	 *
	 * **Note:** please review the following tutorial about data accessibility before attempting to request data from the browser : {@tutorial Integrating Third Party Data Feeds}
	 *
	 * - If you need to have a different protocol than the default ("https://") add the following line, changing the protocol as needed.
	 * 		CIQ.QuoteFeed.Xignite.Utility.overrides.protocol="https://";
	 *
	 * - If you need to have a different path than the defaults (see proxy config sample) add the following line. The same path will be appended to all calls.
	 * 		CIQ.QuoteFeed.Xignite.Utility.overrides.path="your path here";
	 * 
	 * - If you need to point to a specific server add the following line.
	 * 		CIQ.QuoteFeed.Xignite.Utility.overrides.server = serverhere;
	 *
	 * - To set the **encrypted** token add the following line
	 *		CIQ.QuoteFeed.Xignite.Utility.overrides.token = encryptedTokenHere;
	 *
	 * - To set the userid  add the following line
	 *		CIQ.QuoteFeed.Xignite.Utility.overrides.tokenUser= userIdHere;
	 *
	 *	**Notes:**
	 *	- The client is responsible for the formation and management of the encrypted token.  
	 *	- The client should make sure they have a non-expired token before querying Xignite.  
	 *	- The client should be writing their own encryption **on the server side**.  
	 *	- The client may store their unencrypted token within this script or elsewhere on their server, but **not on the files delivered by the web server**.
	 *
	 * @example Default use case
	 * stxx.attachQuoteFeed(new CIQ.QuoteFeed.Xignite(myToken));
	 *
	 * @example Using an encrypted token
	 * CIQ.QuoteFeed.Xignite.Utility.overrides.protocol = null;
	 * CIQ.QuoteFeed.Xignite.Utility.overrides.server = null;
	 * CIQ.QuoteFeed.Xignite.Utility.overrides.path = "";  // note this is "" and not null
	 * CIQ.QuoteFeed.Xignite.Utility.overrides.token = 'encrypted token';
	 * CIQ.QuoteFeed.Xignite.Utility.overrides.tokenUser= 'firm';
	 * stxx.attachQuoteFeed(new CIQ.QuoteFeed.Xignite());
	 *
	 * @param  {string} [token] optional Xignite API token
	 * @param  {object} [params] optional Xignite parameters
	 * @name  Xignite
	 * @constructor
	 */
	CIQ.QuoteFeed.Xignite=function(token,params){
		if(!params) params={};
		this.token=token;
		this.useSuperquotes=params.useSuperquotes===true;  //TODO: invert this logic when Xignite enhances this call
		this.mfUpdate=params.mfUpdate===true;  //Set to true if GetNAV entitlement is enabled
		this.exchangeZones=CIQ.QuoteFeed.Xignite.Utility.timeZone;

		/** If a token is passed in then we're going to assume that the customer is going to attempt
		to connect to Xignite against their raw API. This means that we will use the server that is set
		for each data Template, and that no path needs to be appended.

		The exception to this rule is if the developer has already set the overrides.server to something
		other than the default. This indicates that the developer knows what they are doing so we won't
		make any assumptions */
		if(token && CIQ.QuoteFeed.Xignite.Utility.overrides.server=="devservices.chartiq.com/data"){
			CIQ.QuoteFeed.Xignite.Utility.overrides.server=null;
			CIQ.QuoteFeed.Xignite.Utility.overrides.path="";
		}
	};

	CIQ.QuoteFeed.Xignite.ciqInheritsFrom(CIQ.QuoteFeed);

	CIQ.QuoteFeed.Xignite.prototype.requiresImmediateRefresh=function(params){
		return this.isBats(params.chart.symbol);
	};

	CIQ.QuoteFeed.Xignite.prototype.isBats=function(symbol){
		return (symbol && (symbol.length<5 || (symbol.length==5 && symbol[4]!="X")) &&
				symbol.indexOf(".")==-1 && symbol.indexOf(":")==-1 && symbol.charAt(0)!='/' && symbol.charAt(0)!='^');
	};

	CIQ.QuoteFeed.Xignite.prototype.isIndex=function(symbol){
		if(symbol && symbol.indexOf(".IND")>0) return true;
		if(symbol && symbol.charAt(0)=="^" && symbol.length<6) return true;
		return false;
	};

	// Can be overridden if RT Equities to be supported
	CIQ.QuoteFeed.Xignite.prototype.isRTEquity=function(symbol){
		return false;
	};

	// Can be overridden if RT Indexes to be supported for certain symbols
	CIQ.QuoteFeed.Xignite.prototype.isRTIndex=function(symbol){
		return false;
	};

	CIQ.QuoteFeed.Xignite.prototype.isMutual=function(symbol){
		if(!symbol || symbol.length<5 || symbol.length>6) return false;
		for(var j=0;j<symbol.length;j++){
			if(symbol[j]<'A' || symbol[j]>'Z') return false;
		}
		if(symbol[symbol.length-1]=='X') return true;
		return false;
	};

	CIQ.QuoteFeed.Xignite.prototype.symbology=function(symbol){
		return symbol.toUpperCase();
	};

	CIQ.QuoteFeed.Xignite.prototype.batsOpen=function(){
		var nd=CIQ.getETDateTime();
		if(nd.getHours()>=17) return false;
		if(nd.getHours()<8) return false;
		return true;
	};

	CIQ.QuoteFeed.Xignite.prototype.fetch=function(params, cb){

		var missingBarsShutoff=true;  //not very effective unless we can fetch all of our data at once

		function toMarketTime(date,tz){
			var utcTime=new Date(date.getTime() + date.getTimezoneOffset() * 60000);
			if(tz && tz.indexOf("UTC")!=-1) return utcTime;
			else return CIQ.convertTimeZone(utcTime,"UTC",tz);
		}

		function useBats(date,extended){
			if(date.getDay()%6===0) return false;
			if(extended){
				if(date.getHours()>17) return false;
				if(date.getHours()<8) return false;
				if(date.getHours()==17 && date.getMinutes()>=15) return false;  //assumes 15 minute delay
			}else{
				if(date.getHours()>16) return false;
				if(date.getHours()<9) return false;
				if(date.getHours()==16 && date.getMinutes()>=30) return false;  //assumes 15 minute delay
				if(date.getHours()==9 && date.getMinutes()<30) return false;
			}
			return true;
		}
		
		var _checkAssetClass = function(asset, assetConstant){
			var isAsset = false;
			if(asset){
				isAsset = asset.toLowerCase() === assetConstant.toLowerCase();
			} else{
				isAsset = false;
			}
			
			return isAsset;
		};

		if(!params.symbolObject) params.symbolObject={symbol:params.symbol};
		var currentSymbol = params.symbolObject.customSymbol ? params.symbolObject.customSymbol : params.symbol;
		var symbol=this.symbology(currentSymbol);
		var identifierType=params.symbolObject.identifierType ? params.symbolObject.identifierType : "Symbol";
		var isRTEquity=this.isRTEquity(symbol) && !params.symbolObject.assetClass;
		var isBats=!isRTEquity && !params.noBats && this.isBats(symbol) && !params.symbolObject.noBats && !params.symbolObject.assetClass;
		var isIndex=this.isIndex(symbol) || _checkAssetClass(params.symbolObject.assetClass, CIQ.QuoteFeed.Xignite.Constants.INDEX);
		var isRTIndex=this.isRTIndex(symbol) && !params.symbolObject.assetClass;
		var isMutual=this.isMutual(symbol) && !params.symbolObject.assetClass;
		var isForex=CIQ.Market.Symbology.isForexSymbol(symbol) || _checkAssetClass(params.symbolObject.assetClass, CIQ.QuoteFeed.Xignite.Constants.CURRENCY);
		var isFuture=CIQ.Market.Symbology.isFuturesSymbol(symbol) || _checkAssetClass(params.symbolObject.assetClass, CIQ.QuoteFeed.Xignite.Constants.FUTURES);
		var isOption=_checkAssetClass(params.symbolObject.assetClass, CIQ.QuoteFeed.Xignite.Constants.OPTIONS);
		var isOptionFuture=_checkAssetClass(params.symbolObject.assetClass, CIQ.QuoteFeed.Xignite.Constants.OPTION_FUTURE);
		var isFutureSpread=_checkAssetClass(params.symbolObject.assetClass, CIQ.QuoteFeed.Xignite.Constants.FUTURE_SPREAD);
		var isDaily=CIQ.ChartEngine.isDailyInterval(params.interval);
		var expiredFuture=false;
		var marketZone=null;
		var getSplitInfo=false;
		var batsQuote=false;
		var realTimeQuote=isForex;
		var eodQuote=isMutual;

		var maxTicks=20000;  //should be large enough to bridge the weekend gap for 1 minute intervals (at least 5000)

		if(params.chart.loadingMore) params.loadMore=true;
		
		if(!params.update) params.xigniteID=new Date().getTime();
		if(!this.resultsCache) this.resultsCache={};
		//initialize or don't use when loading more (since we prepend data, not replace it)
		if(isForex && symbol.charAt(0)!="^") symbol="^"+symbol;

		// Default to today
		var myDate=new Date();
		if(params.endDate){
			myDate=params.endDate;  // pointer to endDate
			if(params.loadMore) params.maxRecords=maxTicks;
		}else if(!params.startDate){
			if(this.startDate) params.startDate=this.startDate;
			if(!params.maxRecords){
				params.maxRecords=params.ticks*3;
			}
		}
		//adjust periods to account for those where there is no market activity
		var theFactor=1;
		if(params.interval=="day") theFactor=CIQ.QuoteFeed.Xignite.Utility.nonMarketMaxRecordsFactor;
		else if(!isDaily) theFactor=CIQ.QuoteFeed.Xignite.Utility.marketClosedMaxRecordsFactor;
		//normalize ticks
		var myMaxRecords=1000;
		if(params.interval=="month"){
			console.log("Interval 'month' not supported natively by Xignite!");
		}else if(params.interval=="week"){
			console.log("Interval 'week' not supported natively by Xignite!");
		}
		if(!params.maxRecords){
			myMaxRecords=Math.min(myMaxRecords,maxTicks);
		}else{
			if(!isDaily && params.period<10){
				myMaxRecords=Math.ceil(Math.min(Math.max(params.maxRecords*theFactor,6000),maxTicks));
			}else{
				myMaxRecords=Math.ceil(Math.min(Math.max(params.maxRecords*theFactor,1000),maxTicks));
			}
		}

		if(myMaxRecords>maxTicks || (params.stx.chart.symbol==params.symbol && params.fetchMaximumBars)) myMaxRecords=maxTicks;

		var api=null;
		var args=null;
		var error="";
		var startDate;

		if(!params.symbol){
			error="No Symbol";
		}else if(isForex){
			marketZone="UTC";
			myDate=toMarketTime(myDate,marketZone);
			if(symbol.charAt(0)=="^") symbol=symbol.substr(1);
			if(symbol.substr(0,3).toUpperCase()==symbol.substr(3,3).toUpperCase()) error="Invalid Forex symbol";

			if(params.stx.quoteDriver.behavior.snapshotRefresh && myDate.getDay()!=6){
				if(CIQ.QuoteFeed.Xignite.getSnapshotQuote(params,symbol,isDaily,0,cb,this)) return;
			}

			startDate=myDate;
			if(!params.startDate && params.maxRecords){  //must calculate startdate so we can use API
				startDate=new Date(myDate.getTime());
				if(isDaily) startDate.setDate(startDate.getDate()-myMaxRecords);
				else startDate.setMinutes(startDate.getMinutes()-myMaxRecords*(isNaN(params.interval)?params.period:params.interval));
			}else if(params.startDate){
				startDate=toMarketTime(params.startDate,marketZone);
			}
			if(startDate>myDate) myDate.setDate(myDate.getDate()+1);
			if(!params.update && isDaily){
				if(CIQ.Market.Symbology.isForexMetal(symbol)){
					if(",USD,AUD,CAD,CHF,EUR,GBP,HKD,ZAR,".indexOf(","+symbol.substr(3,3)+",")!=-1){
						api=CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.HistoricalMajorMetals);
					}else{
						api=CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.HistoricalMetals);
					}
				}else{
					api=CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.HistoricalForex);
				}
				args={
					Symbol: symbol,
					StartDate: CIQ.mmddyyyy(CIQ.yyyymmdd(startDate)),
					EndDate: CIQ.mmddyyyy(CIQ.yyyymmdd(myDate))
				};
				eodQuote=true;
			}else{
				if(CIQ.Market.Symbology.isForexMetal(symbol,true)){
					error="Intraday data not available.";  //intraday not available
				}else{
					if(CIQ.Market.Symbology.isForexMetal(symbol)){
						api=CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.IntradayRTMetals);
					}else{
						api=CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.IntradayRTForex);
					}
					args={
						Symbol: symbol,
						StartTime: CIQ.mmddyyyy(CIQ.yyyymmdd(startDate))+" 00:00:00",
						EndTime: CIQ.mmddyyyy(CIQ.yyyymmdd(myDate))+" 23:59:59",
						Period: (params.interval=="hour"?params.period*60:params.period)
					};
					if(isDaily){
						//api.results.time=null;
						args.Period=1440;
					}else if(params.update){
						if(params.startDate){
							var pStartDate1=toMarketTime(params.startDate,marketZone);
							args.StartTime=CIQ.mmddyyyy(CIQ.yyyymmdd(startDate))+" "+CIQ.friendlyDate(pStartDate1).split(" ")[1]+":00";
						}
					}else{
						args.StartTime=CIQ.mmddyyyy(CIQ.yyyymmdd(startDate))+" "+CIQ.friendlyDate(startDate).split(" ")[1]+":00";
						args.EndTime=CIQ.mmddyyyy(CIQ.yyyymmdd(myDate))+" "+CIQ.friendlyDate(myDate).split(" ")[1]+":59";
					}
				}
			}
			if(symbol.charAt(0)!="^") symbol="^"+symbol;
		}else if(isFuture){
			marketZone="America/New_York";
			myDate=toMarketTime(myDate,marketZone);
			var root=symbol;
			if(root.charAt(0)=="/") root=root.substr(1);
			var month=0,year=0;  //default to continuous contract
			var cash=false;
			var futureMatch=(/(^[A-Z0-9]{1,3})([A-Z])([0-9]{1,2}$)/i).exec(root);
			if(futureMatch){  //includes month and year
				root=futureMatch[1];
				var thisYear=(toMarketTime(new Date(),marketZone)).getFullYear();
				year=thisYear+9;
				var symYear=futureMatch[3];
				var symYearAsInt=parseInt(symYear,10);
				if(symYear.length<=4 && symYearAsInt>0 && symYearAsInt<year){
					while(year%(Math.pow(10,symYear.length))!=symYearAsInt) {
						year--;
					}
					if(thisYear>year) expiredFuture=true;
				}else year="X";
				month=CIQ.convertFutureMonth(futureMatch[2]);
				if(month=="Y" && symYearAsInt===0) {
					cash=true;
					month=0;
					year=0;
					expiredFuture=true; //turn off updates for the ..Y0 futures, they don't seem to be up torootnor accessible in delayed API
				}
			}
			if(isNaN(year) || isNaN(month)){
				error="Invalid futures symbol.";
			}else if(!isDaily){
				error="Intraday futures data is not supported.";  //intraday not available
			}else if(!params.update){
				api=CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.HistoricalFuture);
				var endDate=new Date(myDate.getTime());
				if(year>0 && year<=endDate.getFullYear()) {
					endDate.setYear(year);
					if(month>0 && month<=endDate.getMonth()+1) {
						endDate.setDate(28);
						endDate.setMonth(month-1);
					}
				}
				if(!params.startDate && params.maxRecords){  //must calculate startdate so we can use API
					startDate=new Date(endDate.getTime());
					if(year>0) startDate.setFullYear(Math.min(year,startDate.getFullYear()));
					startDate.setDate(startDate.getDate()-myMaxRecords);
				}else if(params.startDate){
					startDate=toMarketTime(params.startDate,marketZone);
				}
				args={
					Symbol: root,
					StartDate: (startDate?CIQ.mmddyyyy(CIQ.yyyymmdd(startDate)):null),
					EndDate: CIQ.mmddyyyy(CIQ.yyyymmdd(endDate))
				};
				if(year!==0 || cash){  //includes month and year
					api.method=api.method.future;
					args.Month=month.toString();
					args.Year=year.toString();
				}else{
					api.method=api.method.commodity;
				}
				eodQuote=true;
			}else if(!expiredFuture){
				api=CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.DelayedFuture);
				args={
					Symbol: root,
					Month: month.toString(),
					Year: year.toString()
				};
			}
		} else if (isOption) {
			if (!marketZone) {
				marketZone = "America/New_York";
			}
			myDate = toMarketTime(myDate, marketZone);
			api = CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.HistoricalOptions);

			// just in case start date isn't available go back a year
			// the start date check is still needed even if there is a symbol.
			// This will only apply when there is no chart and the user is requesting an equity option.
			// After that the chart drawn the stxChart will have a start date in combination with the master data.
			// We wouldn't need this check if the Xignite api wasn't strict in having a non-null value. Other api's are smarter in that way.
			var pastDate = new Date();
			pastDate.setMonth(pastDate.getMonth() - 12);

			args = {
				Symbol: symbol,
				StartTime: params.startDate ? CIQ.mmddyyyy(toMarketTime(params.startDate, marketZone))
					: CIQ.mmddyyyy(pastDate),
				EndTime: CIQ.mmddyyyy(myDate),
			};
			eodQuote=true;
		} else if (isOptionFuture) {
			if (!marketZone) {
				marketZone = "America/New_York";
			}
			myDate = toMarketTime(myDate, marketZone);
			api = CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.FutureOption);

			args = {
				Identifier: symbol,
				Exchange: symbolObject.exchange
			};
		 } else if(isBats && params.startDate && params.update){
			marketZone="America/New_York";
			myDate=toMarketTime(myDate,marketZone);
			if(params.stx.quoteDriver.behavior.snapshotRefresh && myDate.getDay()%6){
				var newDT=new timezoneJS.Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate(), myDate.getHours(), myDate.getMinutes(), marketZone);
				if(CIQ.QuoteFeed.Xignite.getSnapshotQuote(params,symbol,isDaily,newDT.getTimezoneOffset(),cb,this)) return;
			}

			if(isDaily){
				if(params.extended){
					if(useBats(myDate,true)){
						api=CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.BATSRealQuote);
						batsQuote=true;
					}else{
						api=CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.DelayedEquity);
					}
					api.results.extCls="ExtendedHoursPrice";
					api.fields+=",ExtendedHoursPrice";
				}else if(useBats(myDate)){
					api=CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.BATSRealQuote);
					batsQuote=true;
				}else{
					api=CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.DelayedEquity);
				}
				args={
					Identifier: symbol.replace(/-/g,"/")
				};
		   	}else if(params.update){
				//We need to force the start date to be today, since Xignite may not provide BATS across days in the future
				//Besides, we shouldn't need BATS data from any day besides today anyway.
				//var startDate=CIQ.mmddyyyy(CIQ.yyyymmdd(toMarketTime(params.startDate,marketZone)));
				startDate=CIQ.mmddyyyy(CIQ.yyyymmdd(myDate));
				if(params.extended && useBats(myDate,true)){
					api=CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.IntradayBATSRTEquity);
					batsQuote=true;
				}else if(useBats(myDate)){
					api=CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.IntradayBATSRTEquity);
					batsQuote=true;
				}else{
					api=CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.IntradayEquity);
				}
				args={
					Identifier: symbol.replace(/-/g,"/"),
					Period: (params.interval=="hour"?params.period*60:params.period),
					StartTime: startDate+" 00:00:00",
					EndTime: CIQ.mmddyyyy(CIQ.yyyymmdd(myDate))+" 23:59:59",
					IncludeExtended: (!!params.extended).toString()
				};
				if(params.startDate){
					var pStartDate2=toMarketTime(params.startDate,marketZone);
					if(myDate.getDate()==pStartDate2.getDate()){
						args.StartTime=CIQ.mmddyyyy(CIQ.yyyymmdd(myDate))+" "+CIQ.friendlyDate(pStartDate2).split(" ")[1]+":00";
					}
				}
			}
		}else{
			delete params.noBats;
			var exchange=symbol.split(".").pop();
			if(exchange){
				if(symbol.indexOf(".")>-1 && exchange.length<4) error="Invalid Exchange";
				else marketZone=CIQ.QuoteFeed.Xignite.Utility.timeZone[exchange];
			}
			if(!marketZone) marketZone="America/New_York";
			myDate=toMarketTime(myDate,marketZone);
			if(!params.update && isDaily){
				if(isIndex)
					api=CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.HistoricalIndex);
				else
					api=CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.HistoricalEquity);
				args={
					Identifier: symbol.replace(/-/g,"/"),
					StartDate: (params.startDate?CIQ.mmddyyyy(CIQ.yyyymmdd(toMarketTime(params.startDate,marketZone))):null),
					EndDate: CIQ.mmddyyyy(CIQ.yyyymmdd(myDate)),
					PeriodType: CIQ.QuoteFeed.Xignite.Utility.xIgniteInterval(params.interval),
					Periods: myMaxRecords
				};
				eodQuote=true;
			}else{
				if(isDaily){
					if(isMutual){
						if(this.mfUpdate)
							api=CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.DelayedMF);
						else
							error="Intraday data not available.";  //intraday not available
					}else if(isRTIndex){
						api=CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.RealTimeIndex);
					}else if(isIndex){
						api=CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.DelayedIndex);
					}else if(this.useSuperquotes){
						api=CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.SuperQuoteEquity);
						if(params.extended) {
							api.results.extCls="ExtendedHoursPrice";
							api.fields+=",ExtendedHoursPrice";
						}
					}else if(isRTEquity){
						api=CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.RealTimeEquity);
						if(params.extended) {
							api.results.extCls="ExtendedHoursPrice";
							api.fields+=",ExtendedHoursPrice";
						}
						realTimeQuote=true;
					}else{
						api=CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.DelayedEquity);
						if(params.extended) {
							api.results.extCls="ExtendedHoursPrice";
							api.fields+=",ExtendedHoursPrice";
						}
					}
					args={
						Identifier: symbol.replace(/-/g,"/")
					};
				}else{
					if(isMutual){
						error="Intraday data not available.";  //intraday not available
					}else if(isRTIndex){
						api=CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.IntradayRTIndex);
					}else if(isIndex){
						api=CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.IntradayIndex);
					}else if(this.useSuperquotes){
						api=CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.SuperIntradayEquity);
						if(!params.loadMore){
							api.results.timing="Timing";
							api.fields+=",Timing";
						}
					}else if(isRTEquity){
						api=CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.IntradayRTEquity);
						realTimeQuote=true;
					}else{
						api=CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.IntradayEquity);
					}
					startDate=myDate;
					if(!params.startDate && params.maxRecords){  //must calculate startdate so we can use API
						startDate=new Date(myDate.getTime());
						startDate.setMinutes(startDate.getMinutes()-myMaxRecords*(params.interval=="hour"?params.period*60:params.period));
					}else if(params.startDate){
						startDate=toMarketTime(params.startDate,marketZone);
					}
					//temporary fix, Xignite is not returning any intraday bars when start date is before 2011
					//if(!isIndex && startDate<new Date(2011,0,1,0,0,0,0)) startDate=new Date(2011,0,1,0,0,0,0);
					args={
						Identifier: symbol.replace(/-/g,"/"),
						StartTime: CIQ.mmddyyyy(CIQ.yyyymmdd(startDate))+" 00:00:00",
						EndTime: CIQ.mmddyyyy(CIQ.yyyymmdd(myDate))+" 23:59:59",
						Period: (params.interval=="hour"?params.period*60:params.period),
						IncludeExtended: params.extended?"true":"false"
					};
				   	if(params.update){
						if(params.startDate){
							if(myDate.getDate()>=startDate.getDate()){
								args.StartTime=args.StartTime.split(" ")[0]+" "+CIQ.friendlyDate(startDate).split(" ")[1]+":00";
							}
						}
					}else{
						args.StartTime=args.StartTime.split(" ")[0]+" "+CIQ.friendlyDate(startDate).split(" ")[1]+":00";
						args.EndTime=args.EndTime.split(" ")[0]+" "+CIQ.friendlyDate(myDate).split(" ")[1]+":59";
						if(!isIndex) getSplitInfo=true;
					}
				}
			}
		}

		if(api && args && error===""){
			var splitArray=[];
			if(api.results.eod) eodQuote=true;  //initialize
			var mamaCallbackFunction=function(status, res){
				if(status!=200){  
					if(cb) cb({error:status});
					return;
				}

				function processData(quotes, params){
					var newQuotes=[];
					var arr=quotes.split("\r\n");
					if(arr.length<2) return newQuotes;
					var fds=arr[0].split(",");
					var fieldNames={};
					var i;
					for (i=0;i<fds.length;i++){
						fieldNames[fds[i]]=i;
					}
					var dt=null;
					var stick=false;
					var NYOffsetMap={};
					for(i=1;i<arr.length;i++){
						var fields=arr[i].split(',');
						if(fields.length<fds.length) continue;
						//if(fields[fieldNames["Outcome"]]!="Success") continue;
						var date=fields[fieldNames[api.results.date]];
						if(date==="") {
							if(batsQuote && fields[fieldNames[api.results.market]].indexOf("OTC")>-1) params.symbolObject.noBats=true;
							continue;
						}
						if(api.results.time){
							date+=" "+fields[fieldNames[api.results.time]];
						}else if(isDaily) date=date.split(" ")[0];
						var vDate=date;
						if(api.results.vdate) vDate=fields[fieldNames[api.results.vdate]];
						//date is in market time.  we want to store in YYYY-MM-DDTHH:MM:SSZ format (UTC)
						//params filter dates are in local time
						//market time-market UTC offset = UTC time (for storing)
						//UTC time+local offset = local time (for filtering)
						var bcdt=CIQ.strToDateTime(date);
						if(isForex && isDaily && params.update && bcdt.getHours()==23){  //Xignite bug is enabled, for forex daily update
							bcdt.setHours(bcdt.getHours()+1);
						}
						if(bcdt.getDay()==6) continue; //filter out erroneous Saturday data
						if(!isDaily){
							var marketOffset=0;
							//TODO futures offset should be in eastern (once we have intraday programmed for them)
							if(api.results.offset){
								marketOffset=fields[fieldNames[api.results.offset]];
							}
							bcdt.setMinutes(bcdt.getMinutes()-bcdt.getTimezoneOffset()-60*marketOffset);

							/* NOTE: not sure how necessary this code is.
							 * 		even though Xignite is returning data after 4PM, it is still classified as "Market" session.
							 * 		so we may want to rip this block out in the future if there are complaints.
							 */

							// The hours are in New York Time.
							var hours={"beginHour":9,"beginMinute":30,"endHour":16,"endMinute":0};
							if(isForex || isFuture){
								hours={"beginHour":0,"beginMinute":0,"endHour":23,"endMinute":59};
							}else if(symbol.indexOf(".")>1){  //TODO: get proper exchange times and use timezone lib to convert to EST
								hours={"beginHour":0,"beginMinute":0,"endHour":23,"endMinute":59};
							}else if(params.extended){
								hours={"beginHour":8,"beginMinute":0,"endHour":20,"endMinute":0};
							}
							if(!(hours.endHour==23 && hours.endMinute==59)){
								//Calculate the timezone difference just once per day
								//Store the offsets in a map NYOffsetMap
								var key=bcdt.getFullYear().toString()+"-"+(bcdt.getMonth()+1).toString()+"-"+bcdt.getDate().toString();
								if(!NYOffsetMap[key] && NYOffsetMap[key]!==0){
									var sessionTest=CIQ.convertTimeZone(bcdt, null, "America/New_York");
									var sessionTestOffset=sessionTest.getTimezoneOffset()-bcdt.getTimezoneOffset();
									NYOffsetMap[key]=sessionTestOffset*60000;
								}
								var bcdt2=new Date(bcdt.getTime()-NYOffsetMap[key]);
								if(bcdt2.getHours()>hours.endHour || (bcdt2.getHours()==hours.endHour && bcdt2.getMinutes()>=hours.endMinute) ||
									bcdt2.getHours()<hours.beginHour || (bcdt2.getHours()==hours.beginHour && bcdt2.getMinutes()<hours.beginMinute))
									continue;
							}
						}
						if(params.startDate && bcdt<params.startDate) continue;
						if(params.endDate && bcdt>=params.endDate) continue;
						/*if(!missingBarsShutoff && params.stx.cleanupGaps && !isDaily){
							// NOTE: this will not longer work since CIQ.LegacyMarket.nextPeriod is no longer.
							// To get this working (if we ever need it), import code from doCleanupGaps.
							if(dt===null){
								dt=bcdt;
							}else{
								for(var zz=0;zz<1440;zz++){
									if(!stick) dt=CIQ.LegacyMarket.nextPeriod(dt, params.stx.layout.interval, 1, params.stx, params.symbol);
									if(bcdt.getTime()==dt.getTime()) break;
									else if(bcdt.getTime()<dt.getTime()) {
										stick=true;  //do not advance dt any further
										break;
									}else{
										var lastQuote1=newQuotes[newQuotes.length-1];
										newQuotes.push({
												DT: dt,
												Open: lastQuote1.Close,
												High: lastQuote1.Close,
												Low: lastQuote1.Close,
												Close: lastQuote1.Close,
												Volume: 0,
												Adj_Close: lastQuote1.Adj_Close
										});
										stick=false;
									}
								}
							}
						}*/
						var ratio=parseFloat(fields[fieldNames[api.results.ratio]]);
						if(!ratio || isNaN(ratio)) ratio=1;
						if(getSplitInfo){
							if(splitArray.length){
								if(bcdt<splitArray[0].ExDate) ratio*=splitArray[0].SplitRatio;
								else splitArray.pop();
							}
						}
						var open=parseFloat(fields[fieldNames[api.results.open]]);
						var high=parseFloat(fields[fieldNames[api.results.high]]);
						var low=parseFloat(fields[fieldNames[api.results.low]]);
						var close=parseFloat(fields[fieldNames[api.results.close]]);
						if(api.results.timing) {
							var timing=fields[fieldNames[api.results.timing]];
							if(timing=="Real Time") realTimeQuote=true;
							if(timing!="Historical") eodQuote=false;
						}else if(api.results.eod) {
							var eod=fields[fieldNames[api.results.eod]];
							if(parseFloat(eod)!=close) eodQuote=false;
						}
						//Xignite bad data fixes
						if(open===0 && high==low) open=close;
						if(high===0) high=Math.max(open,close);
						if(low===0) low=Math.min(open,close);
						if(close>0){
							newQuotes.push({
								//Date: CIQ.yyyymmddhhmm(bcdt),
								DT: bcdt,
								Open: open,
								High: high,
								Low: low,
								Close: close,
								Volume: ((api.results.volume && vDate==date)?parseFloat(fields[fieldNames[api.results.volume]]):0),
								Adj_Close: parseFloat(fields[fieldNames[api.results.close]])/ratio
							});
							var extendedClose=parseFloat(fields[fieldNames[api.results.extCls]]);
							if(extendedClose){
								newQuotes[newQuotes.length-1].Reg_Close=close;
								newQuotes[newQuotes.length-1].Close=extendedClose;
								newQuotes[newQuotes.length-1].Adj_Close=extendedClose;
								eodQuote=false;
							}
							if(batsQuote && params.batsVolumeMultiplier) newQuotes[newQuotes.length-1].Volume*=params.batsVolumeMultiplier;
						}else if(!missingBarsShutoff && params.stx.cleanupGaps){
							var lastQuote=newQuotes[newQuotes.length-1];
							newQuotes.push({
									DT: bcdt,
									Open: lastQuote.Close,
									High: lastQuote.Close,
									Low: lastQuote.Close,
									Close: lastQuote.Close,
									Volume: 0,
									Adj_Close: lastQuote.Adj_Close
							});
						}
					}

					if(newQuotes.length){
						params.attempts=0;
						if(newQuotes[0].DT>newQuotes[newQuotes.length-1].DT) newQuotes.reverse();
					}
					if(!params.totalRecords) params.totalRecords=0;
					params.totalRecords+=newQuotes.length;
					if(!missingBarsShutoff) params.missingBarsCreated=true;
					return newQuotes;
				}

				var results=processData(res, params);

				var todayBarFetch=null;

				if(!params.loadMore){
					if(isDaily) {
						if(this.resultsCache[params.xigniteID]){
							while(results.length && this.resultsCache[params.xigniteID] && this.resultsCache[params.xigniteID].length){
								if(results[0].DT<this.resultsCache[params.xigniteID][this.resultsCache[params.xigniteID].length-1].DT) results.shift();  //strip dups
								else if(+results[0].DT==+this.resultsCache[params.xigniteID][this.resultsCache[params.xigniteID].length-1].DT) {
									var popped=this.resultsCache[params.xigniteID].pop();
									if(popped.Volume>results[0].Volume) results[0].Volume=popped.Volume;  //replace last bar with one just fetched, preserving Volume if necessary
								}
								else break;
							}
						}else this.resultsCache[params.xigniteID]=[];
						results=this.resultsCache[params.xigniteID]=this.resultsCache[params.xigniteID].concat(results);
						if(isFuture && this.resultsCache[params.xigniteID].length>1 && this.resultsCache[params.xigniteID][this.resultsCache[params.xigniteID].length-2].DT.getTime()==this.resultsCache[params.xigniteID][this.resultsCache[params.xigniteID].length-1].DT.getTime()){
							this.resultsCache[params.xigniteID].splice(-2,1);
						}
						if(!params.update){
							params.update=true;
							params.endDate=null;
							if(results.length){
								params.startDate=new Date(results[results.length-1].DT.getTime());
							}else{
								params.startDate=new Date();
								params.startDate.setDate(params.startDate.getDate()-2);  //params.StartDate is not used for daily forex real time but we
																			//need to set it and make sure it is before any ticks
																			//we get from real time query or those ticks will be discarded
																			//and we need to set it so maxRecords does not get computed.
							}
							if(!results.length || CIQ.yyyymmddhhmm(new Date(myDate)).substr(0,8)!=CIQ.yyyymmddhhmm(results[results.length-1].DT).substr(0,8)){
								if(!expiredFuture && !CIQ.Market.Symbology.isForexMetal(symbol,true) && !params.noUpdate){
									if(!isMutual || this.mfUpdate){
										todayBarFetch=function(s){
											return function(p,c){
												setTimeout(function(){ s.fetch(p,c); },10);
											};
										}(this);
									}
								}
							}
						}
						if(!todayBarFetch) delete this.resultsCache[params.xigniteID];
					}else if(isBats){
						if(this.resultsCache[params.xigniteID]){
							while(results.length && this.resultsCache[params.xigniteID].length){
								if(results[0].DT<this.resultsCache[params.xigniteID][this.resultsCache[params.xigniteID].length-1].DT) results.shift();  //strip dups
								else if(+results[0].DT==+this.resultsCache[params.xigniteID][this.resultsCache[params.xigniteID].length-1].DT) {
									var popped2=this.resultsCache[params.xigniteID].pop();
									//sew together
									results[0].Open=popped2.Open;
									if(popped2.Low<results[0].Low) results[0].Low=popped2.Low;
									if(popped2.High>results[0].High) results[0].High=popped2.High;
									if(popped2.Volume>results[0].Volume) results[0].Volume=popped2.Volume;
								}
								else break;
							}
						}else this.resultsCache[params.xigniteID]=[];
						results=this.resultsCache[params.xigniteID]=this.resultsCache[params.xigniteID].concat(results);

						if(!params.update && !params.noUpdate){
							params.update=true;
							params.endDate=null;
							if(results.length){
								params.startDate=new Date(results[results.length-1].DT.getTime());
							}else{
								params.startDate=new Date();
								params.startDate.setHours(0,0,0,0);
								params.startDate.setDate(params.startDate.getDate());
							}
							todayBarFetch=function(s){
								return function(p,c){
									setTimeout(function(){ s.fetch(p,c); },10);
								};
							}(this);
						}else delete this.resultsCache[params.xigniteID];
					}
				}

				//Regardless of all past calculations if the data is sparse, then we may not have gotten back
				//enough bars.  In that case, we will set params.moreToLoad to true if we feel there is more data behind there.
				var moreToLoad=false;
				if(!todayBarFetch && params.totalRecords>0 && params.maxRecords){
					moreToLoad=!params.stx.quoteDriver.behavior.noLoadMore;
				}
				// calling cb will return the data in daily pieces.
				// we only want to do that if we:
				// 1. are not chaining multiple requests to server
				// 2. are not requesting a start date on the data
				// 3. are requesting maxRecords (normal fetch) but are not asking for a real time update
				if(!todayBarFetch || !params.startDate || (params.maxRecords && !params.update)) {
					params.noUpdate=!!todayBarFetch; //suppress a real time update when fetching today's bar
					if(params.moreToLoad) {
						moreToLoad=true;
						params.moreToLoad=false;
					}
					if(!todayBarFetch){
						if(cb){
							if(results.length===0 && !params.loadMore){
								cb({error:"Symbol not found"});
							}else{
								var attrExch="DELAYED";
								if(batsQuote) attrExch="BATS";
								else if(realTimeQuote) attrExch="REAL-TIME";
								if(eodQuote) attrExch="EOD";
								var charge=(attrExch=="REAL-TIME" && !isForex && !params.loadMore ? 1 : 0);
								cb({quotes:results, moreAvailable:moreToLoad, attribution:{source:"xignite",exchange:attrExch,charge:charge}});
							}
						}
						params.loadMore=false;
					}
				}else{
					if(moreToLoad) params.moreToLoad=true;
				}

				if(todayBarFetch){
					params.bypassSnapshot=true;
					if(isDaily) params.noBats=true;
					todayBarFetch(params, cb);
				}
			};
			CIQ.postAjax(CIQ.QuoteFeed.Xignite.Utility.url(api,args,params,this.token,identifierType), null, function(status, res){
				if(getSplitInfo){
					splitApi=CIQ.clone(CIQ.QuoteFeed.Xignite.Templates.SplitRatio);
					var splitArgs={
						Identifier: symbol,
						StartDate: CIQ.mmddyyyy(CIQ.yyyymmdd(startDate)),
						EndDate:   CIQ.mmddyyyy(CIQ.yyyymmdd(new Date()))
					};
					CIQ.postAjax(CIQ.QuoteFeed.Xignite.Utility.url(splitApi,splitArgs,null,this.token,identifierType), null, function(status2, res2){
						if(status2==200){
							try{
								splitArray=JSON.parse(res2).Splits;
							}catch(e){}
							for(var i=0;i<splitArray.length;i++) {
								splitArray[i].ExDate=CIQ.strToDateTime(splitArray[i].ExDate);
								if(i) splitArray[i].SplitRatio*=splitArray[i-1].SplitRatio;
							}
						}
						mamaCallbackFunction.call(this,status,res);
					}.bind(this), null, true);
				}else{
					mamaCallbackFunction.call(this,status,res);
				}
			}.bind(this), null, true);
		}

		if(error!==""){
			if(cb) cb({error:error});
		}
	};
	
	CIQ.QuoteFeed.Xignite.Constants={
			EQUITY : "Equity",
			OPTIONS : "Options",
			FUTURES : "Futures",
			INDEX : "Index",
			CURRENCY : "Currency",
			OPTION_FUTURE : "OptionOnFuture",
			FUTURE_SPREAD : "FutureSpread"
	};

	CIQ.QuoteFeed.Xignite.Templates={

		token: "/* xignite token */",

		/* Daily/weekly/monthly historical equity request */
		HistoricalEquity: {
			host: {
				protocol: "https://",
				server: "GlobalHistorical-chartiq.xignite.com",  //"www.xignite.com"
				path: "/www_xignite"
			},
			version:null,
			func:	"xGlobalHistorical",
			format:	"csv",
			method:	{
				day:	"GetGlobalHistoricalQuotesRange",
				week:	"GetGlobalHistoricalWeeklyQuotesRange",
				month:	"GetGlobalHistoricalMonthlyQuotesRange",
				as_of:	"GetGlobalHistoricalQuotesAsOf"
			},
			statics:"AdjustmentMethod=None",
			fields:	"GlobalQuotes.Date,GlobalQuotes.Last,GlobalQuotes.Open,GlobalQuotes.High,GlobalQuotes.Low,GlobalQuotes.Volume,GlobalQuotes.SplitRatio",
			results:{
				date:	"GlobalQuotes Date",
				time:	null,
				open:	"GlobalQuotes Open",
				close:	"GlobalQuotes Last",
				high:	"GlobalQuotes High",
				low:	"GlobalQuotes Low",
				volume:	"GlobalQuotes Volume",
				offset: null,
				ratio:	"GlobalQuotes SplitRatio"
			}
		},

		/* Historical index request */
		HistoricalIndex: {
			host: {
				protocol: "https://",
				server: "GlobalIndicesHistorical-chartiq.xignite.com",
				path: "/globalindiceshistorical_xignite"
			},
			version:null,
			func:	"xglobalindiceshistorical",
			format:	"csv",
			method:	{
				day:	"GetHistoricalIndexValues",
				as_of:	"GetHistoricalIndexValuesTrailing"
			},
			statics:null,
			fields:	"Values.Date,Values.Last,Values.Open,Values.High,Values.Low,Values.Volume",
			results:{
				date:	"Values Date",
				time:	null,
				open:	"Values Open",
				close:	"Values Last",
				high:	"Values High",
				low:	"Values Low",
				volume:	"Values Volume",
				offset: null,
				ratio:	null
			}
		},

		/* Historical FOREX request */
		HistoricalForex: {
			host: {
				protocol: "https://",
				server: "GlobalCurrencies-chartiq.xignite.com",
				path: "/globalcurrencies_xignite"
			},
			version:null,
			func:	"xGlobalCurrencies",
			format:	"csv",
			method:	"GetHistoricalRatesRange",
			statics:"FixingTime=00:00:00&PriceType=Bid&PeriodType=Daily",
			fields:	"StartDate,Open,High,Low,Close",//,Volume",
			results:{
				date:	"StartDate",
				time:	null,
				open:	"Open",
				close:	"Close",
				high:	"High",
				low:	"Low",
				volume:	null,
				offset: null,
				ratio:	null
			}
		},
		
		/* Global Options request */
		HistoricalOptions: {
			host: {
		      protocol: "https://",
		      server: "globaloptionshistorical.xignite.com/",
		      path: ""
		    },
		    version: null,
		    func: "xGlobalOptionsHistorical",
		    format: "csv",
		    method: "GetChartBars",
		    statics: "SymbologyType=ListingSymbol&Period=24&Precision=Hour&IncludeExtended=false&_order=descending",
		    fields: "ChartBars.StartDate,ChartBars.Open,ChartBars.Close,ChartBars.High,ChartBars.Low,ChartBars.Volume",
		    results: {
		      date: "ChartBars StartDate",
		      time: null,
		      open: "ChartBars Open",
		      close: "ChartBars Close",
		      high: "ChartBars High",
		      low: "ChartBars Low",
		      volume: "ChartBars Volume",
		      offset: null,
		      ratio: null
		    }
		},

		/* Historical Major (USD,AUD,CAD,CHF,EUR,GBP,HKD,ZAR) Metals request when metal is first in pair */
		HistoricalMajorMetals: {
			host: {
				protocol: "https://",
				server: "GlobalMetals-chartiq.xignite.com",
				path: "/globalmetals_xignite"
			},
			version:null,
			func:	"xGlobalMetals",
			format:	"csv",
			method:	"GetHistoricalMetalQuotesRange",
			statics:"FixingTime=00:00:00&PriceType=Bid&PeriodType=Daily&Currency=",
			fields:	"StartDate,StartTime,Open,High,Low,Close",//,Volume",
			results:{
				date:	"StartDate",
				time:	null,
				open:	"Open",
				close:	"Close",
				high:	"High",
				low:	"Low",
				volume:	null,
				offset: null,
				ratio:	null
			}
		},

		/* Historical Metals request for other currencies and when metal is second in pair*/
		HistoricalMetals: {
			host: {
				protocol: "https://",
				server: "GlobalCurrencies-chartiq.xignite.com",
				path: "/globalcurrencies_xignite"
			},
			version:null,
			func:	"xGlobalCurrencies",
			format:	"csv",
			method:	"GetLondonHistoricalRatesRange",
			statics:null,
			fields:	"StartDate,Open,High,Low,Close",//,Volume",
			results:{
				date:	"StartDate",
				time:	null,
				open:	"Open",
				close:	"Close",
				high:	"High",
				low:	"Low",
				volume:	null,
				offset: null,
				ratio:	null
			}
		},

		/* Historical Futures request */
		HistoricalFuture: {
			host: {
				protocol: "https://",
				server: "Futures-chartiq.xignite.com",
				path: "/www_xignite"
			},
			version:null,
			func:	"xFutures",
			format:	"csv",
			method:	{
				"future": 	"GetHistoricalFutureRange",
				"commodity":"GetHistoricalCommodityRange"
			},
			statics:null,
			fields:	"Quotes.Date,Quotes.Open,Quotes.High,Quotes.Low,Quotes.Last,Quotes.Volume",
			results:{
				date:	"Quotes Date",
				time:	null,
				open:	"Quotes Open",
				close:	"Quotes Last",
				high:	"Quotes High",
				low:	"Quotes Low",
				volume:	"Quotes Volume",
				offset: null,
				ratio:	null
			}
		},
		
		/* Futures Option request */
		FutureOption: {
			host: {
		      protocol: "https://",
		      server: "globalfutures.xignite.com",
		      path: "/globalfutures_xignite"
		    },
		    version: null,
		    func: "xGlobalFutures",
		    format: "csv",
		    method: "GetFutureOptionQuote",
		    statics: null,
		    fields: "Date,Open,High,Low,Last,Volume",
		    results: {
		      date: "Date",
		      time: null,
		      open: "Open",
		      close: "Last",
		      high: "High",
		      low: "Low",
		      volume: "Volume",
		      offset: null,
		      ratio: null
		    }
		},

		/* Equity Delayed Quote */
		DelayedEquity: {
			host: {
				protocol: "https://",
				server: "GlobalQuotes-chartiq.xignite.com",
				path: "/globalquotes_xignite"
			},
			version:"v3",
			func:	"xglobalquotes",
			format:	"csv",
			method:	"GetGlobalExtendedQuote",
			statics:null,
			fields:	"Date,Volume,Open,High,Low,Last,Close,VolumeDate",
			results:{
				date:	"Date",
				time:	null,  //not needed for daily update
				open:	"Open",
				close:	"Last",
				high:	"High",
				low:	"Low",
				volume:	"Volume",
				offset: null,
				ratio:	null,
				extCls: null, //"ExtendedHoursPrice"
				eod:	"Close",
				vdate:	"VolumeDate"
			}
		},

		/* Equity Real Time (Consolidated) Quote */
		RealTimeEquity: {
			host: {
				protocol: "https://",
				server: "GlobalRealTime-chartiq.xignite.com",
				path: "/globalrealtime_xignite"
			},
			version:"v3",
			func:	"xGlobalRealTime",
			format:	"csv",
			method:	"GetGlobalExtendedQuote",
			statics:null,
			fields:	"Date,Volume,Open,High,Low,Last,Close",
			results:{
				date:	"Date",
				time:	null,  //not needed for daily update
				open:	"Open",
				close:	"Last",
				high:	"High",
				low:	"Low",
				volume:	"Volume",
				offset: null,
				ratio:	null,
				extCls: null, //"ExtendedHoursPrice"
				eod:	"Close"
			}
		},

		/* Equity Super Quote */
		SuperQuoteEquity: {
			host: {
				protocol: "https://",
				server: "SuperQuotes-chartiq.xignite.com",
				path: "/superquotes_xignite"
			},
			version:null,
			func:	"xsuperquotes",
			format:	"csv",
			method:	"GetQuote",
			statics:null,
			fields:	"DateTime,Volume,Open,High,Low,Last,Close",
			results:{
				date:	"DateTime",
				time:	null,  //not needed for daily update
				open:	"Open",
				close:	"Last",
				high:	"High",
				low:	"Low",
				volume:	"Volume",
				offset: null,
				ratio:	null,
				extCls: null, //"ExtendedHoursPrice"
				eod:	"Close"
			}
		},

		/* Intraday delayed equity request */
		IntradayEquity: {
			host: {
				protocol: "https://",
				server: "GlobalQuotes-chartiq.xignite.com",
				path: "/chartiq_xignite"
			},
			version:"v3",
			func:	"xGlobalQuotes",
			format:	"csv",
			method:	"GetChartBars",
			statics:"Precision=Minutes&AdjustmentMethod=None",
			fields:	"ChartBars.StartDate,ChartBars.StartTime,ChartBars.UTCOffset,ChartBars.Close,ChartBars.Open,ChartBars.High,ChartBars.Low,ChartBars.Volume,ChartBars.AdjustmentRatio",
			results:{
				date:	"ChartBars StartDate",
				time:	"ChartBars StartTime",
				open:	"ChartBars Open",
				close:	"ChartBars Close",
				high:	"ChartBars High",
				low:	"ChartBars Low",
				volume:	"ChartBars Volume",
				offset: "ChartBars UTCOffset",
				ratio:	null // field not implemented yet "ChartBars AdjustmentRatio"
			}
		},

		/* Intraday RT equity request */
		IntradayRTEquity: {
			host: {
				protocol: "https://",
				server: "GlobalRealTime-chartiq.xignite.com",
				path: "/chartiq_xignite"
			},
			version:"v3",
			func:	"xGlobalRealTime",
			format:	"csv",
			method:	"GetChartBars",
			statics:"Precision=Minutes&AdjustmentMethod=None",
			fields:	"ChartBars.StartDate,ChartBars.StartTime,ChartBars.UTCOffset,ChartBars.Close,ChartBars.Open,ChartBars.High,ChartBars.Low,ChartBars.Volume,ChartBars.AdjustmentRatio",
			results:{
				date:	"ChartBars StartDate",
				time:	"ChartBars StartTime",
				open:	"ChartBars Open",
				close:	"ChartBars Close",
				high:	"ChartBars High",
				low:	"ChartBars Low",
				volume:	"ChartBars Volume",
				offset: "ChartBars UTCOffset",
				ratio:	null // field not implemented yet "ChartBars AdjustmentRatio"
			}
		},

		/* Intraday equity request supplemented with some RT component (configured with token)*/
		SuperIntradayEquity: {
			host: {
				protocol: "http"+(CIQ.isIE9?"":"s")+"://",
				server: "SuperQuotes-chartiq.xignite.com",
				path: "/superquotes_xignite"
			},
			version:null,
			func:	"xSuperQuotes",
			format:	"csv",
			method:	"GetChartBars",
			statics:"Precision=Minutes&AdjustmentMethod=None",
			fields:	"ChartBars.StartDateTime,ChartBars.UTCOffset,ChartBars.Close,ChartBars.Open,ChartBars.High,ChartBars.Low,ChartBars.Volume,ChartBars.AdjustmentRatio",
			results:{
				date:	"ChartBars StartDateTime",
				time:	null,
				open:	"ChartBars Open",
				close:	"ChartBars Close",
				high:	"ChartBars High",
				low:	"ChartBars Low",
				volume:	"ChartBars Volume",
				offset: "ChartBars UTCOffset",
				ratio:	null, // field not implemented yet "ChartBars AdjustmentRatio"
				timing: null // Timing
			}
		},

		/* Intraday BATS Real Time equity request */
		IntradayBATSRTEquity: {
			host: {
				protocol: "https://",
				server: "BATSRealTime-chartiq.xignite.com",
				path: "/chartiq_xignite"
			},
			version:null,
			func:	"xBATSRealTime",
			format:	"csv",
			method:	"GetChartBars",
			statics:"Precision=Minutes&AdjustmentMethod=None",
			fields:	"ChartBars.StartDate,ChartBars.StartTime,ChartBars.UTCOffset,ChartBars.Close,ChartBars.Open,ChartBars.High,ChartBars.Low,ChartBars.Volume,ChartBars.AdjustmentRatio,Security.MarketIdentificationCode",
			results:{
				date:	"ChartBars StartDate",
				time:	"ChartBars StartTime",
				open:	"ChartBars Open",
				close:	"ChartBars Close",
				high:	"ChartBars High",
				low:	"ChartBars Low",
				volume:	"ChartBars Volume",
				offset: "ChartBars UTCOffset",
				ratio:	null, // field not implemented yet "ChartBars AdjustmentRatio"
				market: "Security MarketIdentificationCode"
			}
		},

		/* BATS Real Time Quote */
		BATSRealQuote: {
			host: {
				protocol: "https://",
				server: "BatsRealTime-chartiq.xignite.com",
				path: "/batsrealtime_xignite"
			},
			version:"v3",
			func:	"xBATSRealTime",
			format: "csv",
			method: "GetExtendedQuote",
			statics:null,
			fields: "Date,Open,High,Low,Last,Close,Security.MarketIdentificationCode",
			results:{
				date:	"Date",
				time:	null,  //not needed for fdaily update
				open:	"Open",
				close:	"Last",
				high:	"High",
				low:	"Low",
				volume:	null,  //not needed for daily update
				offset: null,
				ratio:	null,
				extCls: null, //"ExtendedHoursPrice"
				eod:	"Close",
				market: "Security MarketIdentificationCode"
			}
		},

		/* Index Delayed Quote */
		DelayedIndex: {
			host: {
				protocol: "https://",
				server: "GlobalIndices-chartiq.xignite.com",
				path: "/globalindices_xignite"
			},
			version:null,
			func:	"xglobalindices",
			format:	"csv",
			method:	"GetDelayedIndexValue",
			statics:null,
			fields:	"Value.Date,Value.Volume,Value.Open,Value.High,Value.Low,Value.Last,Value.Close",
			results:{
				date:	"Value Date",
				time:	null,  //not needed for daily update
				open:	"Value Open",
				close:	"Value Last",
				high:	"Value High",
				low:	"Value Low",
				volume:	"Value Volume",
				offset: null,
				ratio:	null,
				eod:	"Value Close"
			}
		},

		/* Index Real Time Quote */
		RealTimeIndex: {
			host: {
				protocol: "https://",
				server: "GlobalIndicesRealTime-chartiq.xignite.com",
				path: "/globalindicesrealtime_xignite"
			},
			version:null,
			func:	"xglobalindicesrealtime",
			format:	"csv",
			method:	"GetRealTimeIndexValue",
			statics:null,
			fields:	"Value.Date,Value.Volume,Value.Open,Value.High,Value.Low,Value.Last,Value.Close",
			results:{
				date:	"Value Date",
				time:	null,  //not needed for daily update
				open:	"Value Open",
				close:	"Value Last",
				high:	"Value High",
				low:	"Value Low",
				volume:	"Value Volume",
				offset: null,
				ratio:	null,
				eod:	"Value Close"
			}
		},

		/* Intraday delayed index request */
		IntradayIndex: {
			host: {
				protocol: "https://",
				server: "GlobalIndices-chartiq.xignite.com",
				path: "/chartiq_xignite"
			},
			version:null,
			func:	"xglobalindices",
			format:	"csv",
			method:	"GetChartBars",
			statics:"Precision=Minutes&AdjustmentMethod=None",
			fields:	"ChartBars.StartDate,ChartBars.StartTime,ChartBars.UTCOffset,ChartBars.Close,ChartBars.Open,ChartBars.High,ChartBars.Low,ChartBars.Volume",
			results:{
				date:	"ChartBars StartDate",
				time:	"ChartBars StartTime",
				open:	"ChartBars Open",
				close:	"ChartBars Close",
				high:	"ChartBars High",
				low:	"ChartBars Low",
				volume:	"ChartBars Volume",
				offset: "ChartBars UTCOffset",
				ratio:	null
			}
		},

		/* Intraday Real Time index request */
		IntradayRTIndex: {
			host: {
				protocol: "https://",
				server: "GlobalIndicesRealTime-chartiq.xignite.com",
				path: "/chartiq_xignite"
			},
			version:null,
			func:	"xglobalindicesrealtime",
			format:	"csv",
			method:	"GetChartBars",
			statics:"Precision=Minutes&AdjustmentMethod=None",
			fields:	"ChartBars.StartDate,ChartBars.StartTime,ChartBars.UTCOffset,ChartBars.Close,ChartBars.Open,ChartBars.High,ChartBars.Low,ChartBars.Volume",
			results:{
				date:	"ChartBars StartDate",
				time:	"ChartBars StartTime",
				open:	"ChartBars Open",
				close:	"ChartBars Close",
				high:	"ChartBars High",
				low:	"ChartBars Low",
				volume:	"ChartBars Volume",
				offset: "ChartBars UTCOffset",
				ratio:	null
			}
		},

		/* Intraday FOREX request */
		IntradayRTForex: {
			host: {
				protocol: "https://",
				server: "GlobalCurrencies-chartiq.xignite.com",
				path: "/chartiq_xignite"
			},
			version:null,
			func:	"xGlobalCurrencies",
			format:	"csv",
			method:	"GetChartBars",
			statics:"Precision=Minutes&PriceType=Bid",
			fields:	"ChartBars.StartDate,ChartBars.StartTime,ChartBars.UTCOffset,ChartBars.Open,ChartBars.High,ChartBars.Low,ChartBars.Close,ChartBars.Volume",
			results:{
				date:	"ChartBars StartDate",
				time:	"ChartBars StartTime",
				open:	"ChartBars Open",
				close:	"ChartBars Close",
				high:	"ChartBars High",
				low:	"ChartBars Low",
				volume:	"ChartBars Volume",
				offset: "ChartBars UTCOffset",
				ratio:	"ChartBars AdjustmentRatio"
			}
		},

		/* Intraday Metals request */
		IntradayRTMetals: {
			host: {
				protocol: "https://",
				server: "GlobalMetals-chartiq.xignite.com",
				path: "/chartiq_xignite"
			},
			version:null,
			func:	"xGlobalMetals",
			format:	"csv",
			method:	"GetChartBars",
			statics:"Precision=Minutes&PriceType=Bid&Currency=",
			fields:	"ChartBars.StartDate,ChartBars.StartTime,ChartBars.UTCOffset,ChartBars.Open,ChartBars.High,ChartBars.Low,ChartBars.Close,ChartBars.Volume",
			results:{
				date:	"ChartBars StartDate",
				time:	"ChartBars StartTime",
				open:	"ChartBars Open",
				close:	"ChartBars Close",
				high:	"ChartBars High",
				low:	"ChartBars Low",
				volume:	"ChartBars Volume",
				offset: "ChartBars UTCOffset",
				ratio:	"ChartBars AdjustmentRatio"
			}
		},

		/* Delayed Futures request (for today)*/
		DelayedFuture: {
			host: {
				protocol: "https://",
				server: "Futures-chartiq.xignite.com",
				path: "/www_xignite"
			},
			version:null,
			func:	"xFutures",
			format:	"csv",
			method:	"GetDelayedFuture",
			statics:null,
			fields:	"Date,Time,Open,High,Low,Last,Volume",
			results:{
				date:	"Date",
				time:	null,
				open:	"Open",
				close:	"Last",
				high:	"High",
				low:	"Low",
				volume:	"Volume",
				offset: null,
				ratio:	null
			}
		},

		/* Delayed Mutual Fund request (for last NAV)*/
		DelayedMF: {
			host: {
				protocol: "https://",
				server: "NAVs-chartiq.xignite.com",
				path: "/navs_xignite"
			},
			version:"v2",
			func:	"xNAVs",
			format:	"csv",
			method:	"GetNAV",
			statics:null,
			fields:	"Date,NAV,PreviousNAV",
			results:{
				date:	"Date",
				time:	null,
				open:	"NAV",
				close:	"NAV",
				high:	"NAV",
				low:	"NAV",
				volume:	null,
				offset: null,
				ratio:	null
			}
		},

		/* Split Ratio request (for intraday)*/
		SplitRatio: {
			host: {
				protocol: "https://",
				server: "GlobalHistorical-chartiq.xignite.com",
				path: "/www_xignite"
			},
			version:null,
			func:	"xGlobalHistorical",
			format:	"json",
			method:	"GetSplitHistory",
			statics:null,
			fields:	"Splits.ExDate,Splits.SplitRatio",
			results:{
				date: "Splits ExDate",
				ratio:"Splits SplitRatio"
			}
		},
		
		/* Fundamental Data */
		FundamentalData: {
			host: {
		      protocol: "https://",
		      server: "factsetfundamentals.xignite.com",
		      path: ""
		    },
		    version: null,
		    func: "xFactSetFundamentals",
		    format: "json",
		    method: "GetLatestFundamentals",
		    statics: "UpdatedSince=",
		    fields: null,
		    fundamentaltypes: "DividendYieldFiscal,AverageDailyVolumeYTD,HighPriceLast52Weeks,LowPriceLast52Weeks,Beta,EPS,MarketCapitalization,SharesOutstanding,PERatio",
		},

		/* Exchange hours */
		ExchangeData: {
			host: {
		      protocol: "https://",
		      server: "globalholidays.xignite.com",
		      path: ""
		    },
		    version: null,
		    func: "xGlobalHolidays",
		    format: "json",
		    method: "GetExchangeHoursRange",
		    statics: "TimeZone=Local",
		    fields: null,
		},

		/* Retrieve splits for a stock */
		CorpActionData: {
			host: {
		      protocol: "https://",
		      server: "www.xignite.com",
		      path: ""
		    },
		    version: null,
		    func: "xGlobalHistorical",
		    format: "json",
		    method: "GetSplitHistory",
		    statics: "StartDate=&EndDate=",
		    fields: null,
		},

		DividendData: {
			host: {
		      protocol: "https://",
		      server: "www.xignite.com",
		      path: ""
		    },
		    version: null,
		    func: "xGlobalHistorical",
		    format: "json",
		    method: "GetCashDividendHistory",
		    statics: "StartDate=&EndDate=",
		    fields: null,
		},
	};

	CIQ.QuoteFeed.Xignite.getSnapshotQuote=function(params, symbol, isDaily, offset, cb, caller){
		return false;
	/*
		//snapshot update code
		if(params.update &&
			!params.bypassSnapshot &&
			params.stx.chart.masterData &&
			params.stx.chart.masterData.length &&
			",line,colored_line,mountain,baseline_delta,".indexOf(params.stx.layout.chartType)>-1){
			var url;
			var field="Bid";
			if(CIQ.LegacyMarket.isForexMetal(params.symbol)){
				url=(caller.server?caller.server:"https://"+"services.chartiq.com")+"/chartiq_xignite/xGlobalMetals.json/GetRealTimeMetalQuote?Symbol="+symbol+"&Currency=&_fields=Date,Time,Bid";
			}else if(CIQ.LegacyMarket.isForexSymbol(params.symbol)){
				url=(caller.server?caller.server:"https://"+"services.chartiq.com")+"/chartiq_xignite/xGlobalCurrencies.json/GetRealTimeRate?Symbol="+symbol+"&_fields=Date,Time,Bid";
			}else{
				url=(caller.server?caller.server:"https://"+"services.chartiq.com")+"/chartiq_xignite/xBATSRealTime.json/GetRealQuote?Symbol="+symbol+"&_fields=Date,Time,Close";
				field="Close";
			}
			if(caller.token!=null){
				if(caller.token!="") url+="&_Token="+caller.token;
			}else if(CIQ.QuoteFeed.Xignite.Templates.token.indexOf("/*")==-1){
				if(CIQ.QuoteFeed.Xignite.Templates.token!="") url+="&_Token="+CIQ.QuoteFeed.Xignite.Templates.token;
			}
			CIQ.postAjax(url, null, function(status, res){
				if(status==200){
					res=JSON.parse(res);
					var mdDate=params.stx.chart.masterData[params.stx.chart.masterData.length-1].DT;
					// align date to beginning of interval
					var nextDate=new Date(mdDate);
					if(isDaily) nextDate.setDate(nextDate.getDate()+1);
					else nextDate.setMinutes(nextDate.getMinutes()+(isNaN(params.interval)?params.period:params.interval));

					var bcdt=CIQ.strToDateTime(res.Date+" "+res.Time);
					bcdt.setMinutes(bcdt.getMinutes()+offset-bcdt.getTimezoneOffset());
					bcdt.setSeconds(0); bcdt.setMilliseconds(0);
					var quote=res[field];
					if(bcdt>=mdDate && bcdt<=nextDate && quote>0) {
						var update=[{
							DT: (+bcdt==+nextDate?nextDate:mdDate),
							Open: quote,
							High: quote,
							Low: quote,
							Close: quote,
							Volume: 0,
							Adj_Close: quote
						}];
						if(params.stx.quoteDriver) cb({quotes:update});
						else cb(null, update);
						return;
					}
				}
				params.bypassSnapshot=true;
				caller.fetch(params,cb);
			});
			return true;
		}
		return false;
	*/
	};

	CIQ.QuoteFeed.Xignite.Utility={
		/**
		 * Set the overrides values to control how Xignite works. The "server" member will override the individual
		 * server settings for each of the CIQ.QuoteFeed.Xignite.Templates.
		 *
		 * Set path to "" to override the default proxy paths for the templates.
		 *
		 * Set token to "" to not send a token
		 *
		 * Set tokenUser if using encrypted tokens
		 */
		overrides :{
			protocol: "https://",
			server: "devservices.chartiq.com/data",
			path: null,
			token: null,
			tokenUser: null,
		},

		xIgniteInterval: function(interval){
			if(!isNaN(interval)) return "";
			else if(interval.charAt(0)=='d') return "Day";
			else if(interval.charAt(0)=='w') return "Week";
			else if(interval.charAt(0)=='m') return "Month";
			else if(interval.charAt(0)=='y') return "Year";
			else return interval;
		},
		url: function(api,args,params,token,identifierType){
			var override=CIQ.QuoteFeed.Xignite.Utility.overrides;
			var u="";
			if(api.host instanceof Object){
				u+=(override.protocol!==null)?override.protocol:api.host.protocol;
				u+=(override.server!==null)?override.server:api.host.server;
				u+=(override.path!==null)?override.path:api.host.path;
			}else{
				u+=api.host;
			}
			if(api.version) u+="/"+api.version;
			u+="/"+api.func+"."+api.format;
			if(api.method instanceof Object){
				if(api.method.as_of && !params.startDate && params.maxRecords){
					u+="/"+api.method.as_of;
				}
				//else u+="/"+api.method[params.interval];
				else{
					u+="/"+api.method.day;
				}
			}else{
				u+="/"+api.method;
			}
			u+="?";
			if(token!==null && typeof(token)!="undefined"){
				if(token!=="") u+="&_Token="+token;
			}else if(CIQ.QuoteFeed.Xignite.Templates.token.indexOf("/*")==-1){
				if(CIQ.QuoteFeed.Xignite.Templates.token!=="")
					u+=(override.token!==null)?override.token:("&_Token="+CIQ.QuoteFeed.Xignite.Templates.token);
			}else if(override.token!==null){
				u+="&_Token="+override.token;
			}
			if(override.tokenUser) u+="&_Token_Userid="+override.tokenUser;
			if(identifierType) u += "&IdentifierType=" + identifierType;
			if(api.statics) u+="&"+api.statics;
			if(api.fields) u+="&_fields="+api.fields;
			for(var a in args){
				u+="&"+a+"="+ (args[a]?args[a]:"");
			}
			return u;
		},
		nonMarketMaxRecordsFactor:	8/5,	// These APIs return fewer records than requested
											// because the records requested (periods)
											// include non-market days
		marketClosedMaxRecordsFactor:  7/2, // These APIs return fewer records than requested
											// because the records requested (periods)
											// include market closed times
		timeZone: {							//Note: this may be replaced by the new CIQ.Market classes
			"BVMF":"America/Sao_Paulo",
			"MISX":"Europe/Moscow",
			"MTAA":"Europe/Rome",
			"RTSX":"Europe/Moscow",
			"XAMS":"Europe/Amsterdam",
			"XASX":"Australia/Sydney",
			"XATH":"Europe/Athens",
            "XBAR": "Europe/Madrid",
			"XBER":"Europe/Berlin",
			"XBOM":"Asia/Calcutta",
			"XBRA":"Europe/Bratislava",
			"XBRU":"Europe/Brussels",
			"XBUD":"Europe/Budapest",
			"XCNQ":"America/Toronto",
			"XCSE":"Europe/Copenhagen",
			"XDUB":"Europe/Dublin",
			"XDUS":"Europe/Berlin",
			"XETR":"Europe/Berlin",
			"XFRA":"Europe/Berlin",
			"XHAM":"Europe/Berlin",
			"XHAN":"Europe/Berlin",
			"XHEL":"Europe/Helsinki",
			"XHKG":"Asia/Hong_Kong",
			"XICE":"Atlantic/Reykjavik",
			"XJSE":"Africa/Johannesburg",
			"XKOS":"Asia/Seoul",
			"XKRX":"Asia/Seoul",
			"XLIM":"America/Lima",
			"XLIS":"Europe/Lisbon",
			"XLIT":"Europe/Vilnius",
			"XLON":"Europe/London",
			"XMAD":"Europe/Madrid",
			"XMCE":"Europe/Madrid",
			"XMEX":"America/Mexico_City",
			"XMOD":"America/Montreal",
			"XMUN":"Europe/Berlin",
			"XMUS":"Asia/Muscat",
			"XNSE":"Asia/Calcutta",
			"XNZE":"Pacific/Auckland",
			"XOSL":"Europe/Oslo",
			"XPAR":"Europe/Paris",
			"XPRA":"Europe/Prague",
			"XRIS":"Europe/Riga",
			"XSES":"Asia/Singapore",
			"XSGO":"America/Santiago",
			"XSHE":"Asia/Shanghai",
			"XSHG":"Asia/Shanghai",
			"XSTO":"Europe/Stockholm",
			"XSTU":"Europe/Berlin",
			"XSWX":"Europe/Zurich",
			"XTAE":"Asia/Tel_Aviv",
			"XTAI":"Asia/Taipei",
			"XTAL":"Europe/Tallinn",
			"XTKS":"Asia/Tokyo",
			"XTNX":"America/Toronto",
			"XTSE":"America/Toronto",
			"XTSX":"America/Toronto",
            "XVAL": "Europe/Madrid",
			"XVTX":"Europe/Zurich",
			"XWAR":"Europe/Warsaw",
			"XWBO":"Europe/Vienna",
			"XIDX":"Asia/Jakarta",
			"XKLS":"Asia/Kuala_Lumpur",
			"XPHS":"Asia/Manila",
			"XBKK":"Asia/Bangkok",
			"HSTC":"Asia/Ho_Chi_Minh",
			"XSTC":"Asia/Ho_Chi_Minh",
			"XBOT":"Africa/Gaborone",
			"XGHA":"Africa/Accra",
			"XNAI":"Africa/Nairobi",
			"INDARCX":"America/New_York",
			"INDBVMF":"America/Sao_Paulo",
			"INDCBSX":"America/Chicago",
			"INDMTAA":"Europe/Rome",
			"INDXASE":"America/New_York",
			"INDXASX":"Australia/Sydney",
			"INDXATH":"Europe/Athens",
			"INDXBOM":"Asia/Calcutta",
			"INDXBRA":"Europe/Bratislava",
			"INDXBSE":"Europe/Bucharest",
			"INDXBUD":"Europe/Budapest",
			"INDXCME":"America/Chicago",
			"INDXCSE":"Europe/Copenhagen",
			"IND_DBI":"Europe/Berlin",
			"INDXDUB":"Europe/Dublin",
			"INDXHEL":"Europe/Helsinki",
			"INDXHKG":"Asia/Hong_Kong",
			"INDXJSE":"Africa/Johannesburg",
			"INDXKOS":"Asia/Seoul",
			"INDXKRX":"Asia/Seoul",
			"INDXMAD":"Europe/Madrid",
			"INDXMCE":"Europe/Madrid",
			"INDXMEX":"America/Mexico_City",
			"INDXNAS":"America/New_York",
			"INDXNSE":"Asia/Calcutta",
			"INDXNZE":"Pacific/Auckland",
			"INDXOSL":"Europe/Oslo",
			"INDXPHL":"America/New_York",
			"INDXSES":"Asia/Singapore",
			"INDXSGO":"America/Santiago",
			"INDXSHE":"Asia/Shanghai",
			"INDXSHG":"Asia/Shanghai",
			"INDXSTO":"Europe/Stockholm",
            "INDXSTU": "Europe/Berlin",
			"INDXSTX":"Europe/Zurich",
			"INDXSWX":"Europe/Zurich",
			"INDXTAE":"Asia/Tel_Aviv",
			"INDXTAI":"Asia/Taipei",
			"INDXTKS":"Asia/Tokyo",
			"INDXTSE":"America/Toronto",
			"INDXTSX":"America/Toronto",
			"INDXWAR":"Europe/Warsaw",
			"INDXWBO":"Europe/Vienna",
			"IND_BBGI":"America/New_York",
			"IND_DJI":"America/New_York",
			"IND_DJTSMI":"America/New_York",
			"IND_EURONEXT":"Europe/Brussels",
			"IND_FTSE":"Europe/London",
			"IND_FTSEEUR":"Europe/London",
			"IND_FTSEUSD":"Europe/London",
			"IND_GIDS":"America/New_York",
			"IND_GIF":"America/New_York",
			"IND_HKGI":"Asia/Shanghai",
			"IND_MSCI":"America/New_York",
			"IND_NIKKEI":"Asia/Tokyo",
			"IND_OPRAUnderlying":"America/Chicago",
			"IND_RSL":"America/New_York",
			"IND_SPF":"America/New_York",
			"IND_SPW":"America/Chicago"
		}
	};

	return _exports;
});