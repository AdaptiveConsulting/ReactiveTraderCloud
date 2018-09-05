// -------------------------------------------------------------------------------------------
// Copyright 2012-2018 by ChartIQ, Inc
// -------------------------------------------------------------------------------------------
/*
 * Simulator for the crypto package.  Used only to demonstrate functionality.
 * 
 * **************************** 
 * Your implementation should simply call updateCurrentMarketData() as documented in  
 * https://documentation.chartiq.comCIQ.ChartEngine.html#updateCurrentMarketData
 * *************************
 * 
 * To Start: load this file and call `simulateL2(params)` where params is an object:
 * params.stx - chart engine
 * params.onInterval - millisecond interval to create L2 records
 * params.onCreateDataSet - set to true to create L2 records when the regular quote updates occur
 * If masterData is empty, simulator will generate Last quote as well.  Otherwise it gets Last from the masterData's most recent Close.
 */


function moveBidAsk(bidAskOnly){
		function formatData(d){
			var ret=[];
			for(var i=0;i<d.prices.length;i++){
				if(d.volumes[i]) ret.push([d.prices[i],d.volumes[i]]);
			}
			return ret;
		}
		var data={
			BidL2: {
				prices: [-0.0074, -0.0073,
								 -0.0070,
								 -0.0056,
								 -0.0050, -0.0044, -0.0043,
								 -0.0040, -0.0039, -0.0038, -0.0037, -0.0036, -0.0035, -0.0034, -0.0033,
								 -0.0030, -0.0029, -0.0028, -0.0027, -0.0026, -0.0025, -0.0024, -0.0022, -0.0021,
								 -0.0020, -0.0019, -0.0018, -0.0017, -0.0016, -0.0015, -0.0014, -0.0013, -0.0012, -0.0011,
								 -0.0010, -0.0009, -0.0008, -0.0007, -0.0006, -0.0005, -0.0004, -0.0003, -0.0002, -0.0001],
				volumes: [1, 2,
				 				  3,
				 				  2,
				 				  5, 1, 12,
				 				  6, 7, 1, 3, 4, 1, 1, 25,
				 				  3, 2, 1, 2, 37, 10, 43, 8, 4,
				 				  3, 1, 60, 5, 7, 59, 3, 1, 4, 7,
				 				  89, 8, 95, 5, 16, 123, 7, 12, 207, 25]
				},
			AskL2: {
				prices: [0.0001, 0.0002, 0.0003, 0.0004, 0.0005, 0.0006, 0.0007, 0.0008, 0.0009,
		 			 			 0.0010, 0.0011, 0.0012, 0.0013, 0.0014, 0.0015, 0.0016, 0.0018, 0.0019,
		 			 			 0.0020, 0.0021, 0.0022, 0.0023, 0.0024, 0.0025, 0.0026, 0.0027, 0.0028, 0.0029,
		 			 			 0.0033, 0.0034, 0.0035, 0.0036, 0.0037, 0.0038, 0.0039,
		 			 			 0.0040, 0.0041, 0.0042, 0.0044, 0.0046, 0.0047,
		 			 			 0.0051, 0.0058,
					 			 0.0060, 0.0063,
					 			 0.0077],
				volumes: [3, 225, 34, 14, 189, 6, 2, 11, 134,
					  			12, 121, 6, 2, 9, 7, 3, 1, 88,
					  			4, 1, 3, 5, 4, 6, 10, 54, 9, 1,
					  			2, 1, 40, 2, 2, 4, 3,
					  			2, 4, 1, 1, 3, 12,
					  			6, 1,
					  			2, 1,
					  			1]
				}
		};
		var chart=this.chart;
		var mid=100+Math.round(10*Math.random()-5)*0.01;
		if(chart.masterData && chart.masterData.length){
			mid=this.masterData[this.masterData.length-1].Close || this.mostRecentClose();
		}else{
			data.Last=mid;
		}
		var mult=10*mid;
		var roundOffFactor=0;
		var shadowBreaks=[[1000,2],[5,4],[0.001,8]];
		for(var j=0;j<shadowBreaks.length;j++){
			var brk=shadowBreaks[j];
			if(mid<brk[0]) roundOffFactor=Math.pow(10,brk[1]);
		}
		var bids=data.BidL2.prices,asks=data.AskL2.prices,i;
		for(i=0;i<bids.length;i++) {
			bids[i]=mid+mult*bids[i];
			bids[i]=Math.round(bids[i]*roundOffFactor)/roundOffFactor;
		}
		for(i=0;i<asks.length;i++) {
			asks[i]=mid+mult*asks[i];
			asks[i]=Math.round(asks[i]*roundOffFactor)/roundOffFactor;
		}
		var bidVs=data.BidL2.volumes,askVs=data.AskL2.volumes;
		for(i=0;i<bidVs.length;i++) {
			bidVs[i]=Math.max(0,bidVs[i]+Math.round(10*Math.random()-5));
		}
		for(i=0;i<askVs.length;i++) {
			askVs[i]=Math.max(0,askVs[i]+Math.round(10*Math.random()-5));
		}
		for(i=0;i<bidVs.length;i++) {
			if(bidVs[i]) {
				data.Bid=bids[i];
				data.BidSize=bidVs[i];
			}
		}		
		for(i=askVs.length-1;i>=0;i--) {
			if(askVs[i]) {
				data.Ask=asks[i];
				data.AskSize=askVs[i];
			}
		}
		data.BidL2=formatData(data.BidL2);
		data.AskL2=formatData(data.AskL2);
		if(bidAskOnly){
			var smi=this.standardMarketIterator(new Date());
			data.DT=smi.previous();
			this.updateCurrentMarketData(data);
		}else{
			if(this.masterData && this.masterData.length){
				CIQ.ensureDefaults(data, this.masterData[this.masterData.length-1]);
			}
			this.updateChartData(data, null, {noCreateDataSet:true});
		}
};

function simulateL2(params){
	if(params.onCreateDataSet) params.stx.prepend("createDataSet",moveBidAsk);
	if(params.onInterval) setInterval(function(){moveBidAsk.call(params.stx,true);},params.onInterval);
}