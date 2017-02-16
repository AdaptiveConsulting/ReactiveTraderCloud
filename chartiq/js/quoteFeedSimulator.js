// -------------------------------------------------------------------------------------------
// Copyright 2012-2017 by ChartIQ, Inc
// -------------------------------------------------------------------------------------------
// SAMPLE QUOTEFEED IMPLEMENTATION -- Connects charts to ChartIQ Simulator
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// -------------------------------------------------------------------------------------------
// Copyright 2012-2017 by ChartIQ, Inc
// -------------------------------------------------------------------------------------------

/*    eslint   */ /*   jshint   */
/* globals CIQ */ /* global CIQ */

var quotefeedSimulator={}; // the quotefeed object
var quoteFeedSimulator=quotefeedSimulator; // prevent typos

/**
 * Convenience function for generating a globally unique id (GUID).
 * See http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 * @private
 */
quotefeedSimulator.generateGUID=function(){
	var d = new Date().getTime();
	if(window.performance && typeof window.performance.now === "function"){
		d += window.performance.now(); //use high-precision timer if available
	}
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
	return uuid;
};

quotefeedSimulator.url="http://simulator.chartiq.com/datafeed";
quotefeedSimulator.url += "?session=" + quotefeedSimulator.generateGUID(); // add on unique sessionID required by ChartIQ simulator;

// called by chart to fetch initial data
quotefeedSimulator.fetchInitialData=function (symbol, suggestedStartDate, suggestedEndDate, params, cb) {
	var queryUrl = this.url +
		"&identifier=" + symbol +
		"&startdate=" + suggestedStartDate.toISOString()  +
		"&enddate=" + suggestedEndDate.toISOString()  +
		"&interval=" + params.interval +
		"&period=" + params.period;

	CIQ.postAjax(queryUrl, null, function(status, response){
		// process the HTTP response from the datafeed
		if(status==200){ // if successful response from datafeed
			var newQuotes = quotefeedSimulator.formatChartData(response);
			cb({quotes:newQuotes, attribution:{source:"simulator", exchange:"RANDOM"}}); // return the fetched data; init moreAvailable to enable pagination
		} else { // else error response from datafeed
			cb({error:status});	// specify error in callback
		}
	});
};

// called by chart to fetch update data
quotefeedSimulator.fetchUpdateData=function (symbol, startDate, params, cb) {
	var queryUrl = this.url +
		"&identifier=" + symbol +
		"&startdate=" + startDate.toISOString()  +
		"&interval=" + params.interval +
		"&period=" + params.period;

	CIQ.postAjax(queryUrl, null, function(status, response){
		// process the HTTP response from the datafeed
		if(status==200){ // if successful response from datafeed
			var newQuotes = quotefeedSimulator.formatChartData(response);
			cb({quotes:newQuotes, attribution:{source:"simulator", exchange:"RANDOM"}}); // return the fetched data
		} else { // else error response from datafeed
			cb({error:status});	// specify error in callback
		}
	});
};

// called by chart to fetch pagination data
quotefeedSimulator.fetchPaginationData=function (symbol, suggestedStartDate, endDate, params, cb) {
	var queryUrl = this.url +
		"&identifier=" + symbol +
		"&startdate=" + suggestedStartDate.toISOString()  +
		"&enddate=" + endDate.toISOString()  +
		"&interval=" + params.interval +
		"&period=" + params.period;

	CIQ.postAjax(queryUrl, null, function(status, response){
		// process the HTTP response from the datafeed
		if(status==200){ // if successful response from datafeed
			var newQuotes = quotefeedSimulator.formatChartData(response);
			cb({quotes:newQuotes, attribution:{source:"simulator", exchange:"RANDOM"}}); // return fetched data (and set moreAvailable)
		} else { // else error response from datafeed
			cb({error:status});	// specify error in callback
		}
	});
};

// utility function to format data for chart input; given simulator was designed to work with library, very little formatting is needed
quotefeedSimulator.formatChartData=function (response) {
	var feeddata=JSON.parse(response);
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
	return newQuotes;
};


