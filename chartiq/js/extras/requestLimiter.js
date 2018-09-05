// -------------------------------------------------------------------------------------------
// Copyright 2012-2017 by ChartIQ, Inc
// -------------------------------------------------------------------------------------------

/*
	Request Limiter
	===============
	Including this file will allow you to limit the number of outbound requests to any specific domain.
	Set CIQ.Extras.RequestLimiter.outboundAjaxLimit to a non-zero value to limit the requests per second to that value.
	When a limit is exceeded, the callback function is passed an status=429,
	Set CIQ.Extras.RequestLimiter.logToConsole to have the requests made that second output to the console.
	Set CIQ.Extras.RequestLimiter.logToServer to a URL to have the requests made that second POSTed there.
*/

(function (definition) {
	"use strict";

    if (typeof exports === "object" && typeof module === "object") {
        module.exports = definition(require('../chartiq'));
    } else if (typeof define === "function" && define.amd) {
        define(['chartiq'], definition);
    } else if (typeof window !== "undefined" || typeof self !== "undefined") {
		var global = typeof window !== "undefined" ? window : self;
		definition(global);
    } else {
		throw new Error("Only CommonJS, RequireJS, and <script> tags supported for requestLimiter.js.");
    }

})(function(_exports){
	var CIQ=_exports.CIQ;

	/**
	 * Namespace for Extras
	 * @namespace
	 * @name CIQ.Extras
	 * @since 3.0.0
	 */
	if(!CIQ.Extras) CIQ.Extras={};

	/** Rate limiter for outbound AJAX queries.  This can limit the number of outbound requests per second per domain.
	 * @namespace CIQ.Extras.RequestLimiter
	 * @since 3.0.0
	 */
	CIQ.Extras.RequestLimiter=function(){};

	/**
	 * Outbound Ajax rate limit
	 * Set to 0 or null to turn off limit
	 * @type {number}
	 * @default
	 * @alias outboundAjaxLimit
	 * @memberof CIQ.Extras.RequestLimiter
	 * @since 3.0.0
	 */
	CIQ.Extras.RequestLimiter.outboundAjaxLimit=25;

	/**
	 * Logging switch
	 * @type {boolean}
	 * @default
	 * @alias logToConsole
	 * @memberof CIQ.Extras.RequestLimiter
	 * @since 3.0.0
	 */
	CIQ.Extras.RequestLimiter.logToConsole=true;

	/**
	 * Remote Logging URL
	 * Set to complete URL of server to POST the exceeded limit requests to
	 * @type {string}
	 * @default
	 * @alias logToServer
	 * @memberof CIQ.Extras.RequestLimiter
	 * @example
	 * 	CIQ.Extras.RequestLimiter.logToServer="https://log.myserver.com/logging/limits/postHandler";
	 * @since 3.0.0
	 */
	CIQ.Extras.RequestLimiter.logToServer=null;

	/**
	 * Rate limiter test for outbound AJAX queries.  If rate is exceeded, request is not made and a 429 error status is returned.
	 * @param  {string} url    The url to send the ajax query to
	 * @return {boolean}       Whether rate is exceeded
	 * @memberof CIQ.Extras.RequestLimiter
	 * @private
	 * @since 3.0.0
	 */
	CIQ.Extras.RequestLimiter.hitRequestLimit=function(url){
		if(!CIQ.Extras.RequestLimiter.outboundAjaxLimit) return false;
		var urlParts=url.split("/");
		if(urlParts.length<2) return false;
		var domain=urlParts[2];
		if(!CIQ.Extras.RequestLimiter.ajaxRequestLog) CIQ.Extras.RequestLimiter.ajaxRequestLog={};
		var log=CIQ.Extras.RequestLimiter.ajaxRequestLog;
		if(!log[domain]) log[domain]=[];
		log=log[domain];
		var entry={url:url,time:new Date().getTime()};
		while(log.length && log[0].time+1000<=entry.time) log.shift();
		log.push(entry);
		if(log.length<CIQ.Extras.RequestLimiter.outboundAjaxLimit) return false;
		//print results
		var text="Ajax Request Limit Exceeded: "+domain+"\n";
		for(var i=0;i<log.length;i++){
			text+=(i+1).toString()+". "+log[i].time+"   "+log[i].url+"\n"; 
		}
		if(CIQ.Extras.RequestLimiter.logToConsole) console.log(text);
		if(CIQ.Extras.RequestLimiter.logToServer){
			CIQ.postAjax({
				url: CIQ.Extras.RequestLimiter.logToServer,
				payload: text,
				ungovernable:true
			});
		}
		return true;
	};
	
	return _exports;

});
