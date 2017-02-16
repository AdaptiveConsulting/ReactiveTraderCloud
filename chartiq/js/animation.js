// -------------------------------------------------------------------------------------------
// Copyright 2012-2016 by ChartIQ, Inc
// -------------------------------------------------------------------------------------------
(function (definition) {
	"use strict";

	if (typeof exports === "object" && typeof module === "object") {
		module.exports = definition(require('./chartiq'));
	} else if (typeof define === "function" && define.amd) {
		define(['chartiq'], definition);
	} else if (typeof window !== "undefined" || typeof self !== "undefined") {
		var global = typeof window !== "undefined" ? window : self;
		definition(global);
	} else {
		throw new Error("Only CommonJS, RequireJS, and <script> tags supported for animation.js.");
	}

})(function(_exports) {
	var CIQ=_exports.CIQ;
	console.log("animation.js",_exports);

	
	/**************************************************************/

	// Animation plugin
	// To use add the following to your primary HTML file:
	// <script src="js/animation.js"></script>  

	// In your code, link an animator to each chart you want to animate by adding a line like this:
	// stxx.tickAnimator=new CIQ.EaseMachine(Math.easeOutCubic, 1000);

	//The following options are available and must be set before enabling animation:
	//stxx.chart.tension=0.3;  // if you want to soften the curves on a line or mountain chart.


	// set this to true if you want the last tick to stay in the position it was scrolled and have the rest of the chart move backwards as a new tick is added
	// instead of having the new tick advance forward and leave the rest of the chart in place. 
	var stayPut=false;	

	// set this to the number of ticks from the right edge the chart should stop moving forward so the last tick never goes off screen
	// only applicable if stayPut=false.
	var ticksFromEdgeOfScreen=5;

	// set this to a value that will give you enough granularity for the animation. 
	// The larger the number the smaller the price jump between frames.
	// So a larger number is good for charts that need a very slow smooth animation either because the price jumps between ticks are very small,
	// or because the animation was set up to run over a large number of frames when instantiating the CIQ.EaseMachine.
	var granularity=1000000;

	/**************************************************************/

	CIQ.ChartEngine.prototype.prepend("appendMasterData", function(appendQuotes, chart, params) {

	    var self=this;
	    if (!chart) {
	        chart = self.chart;
	    }
	    
	    if( !self.tickAnimator) {
	       	alert('Animation plug-in can not run because the tickAnimator has not be declared. See instructions in animation.js');
	    	return;
	    }
	    var tickAnimator=self.tickAnimator;

	    function unanimateScroll(){
	        if(chart.animatingHorizontalScroll) {
	            chart.animatingHorizontalScroll = false;
	            self.micropixels = self.nextMicroPixels = self.previousMicroPixels;  // <-- Reset self.nextMicroPixels here
	            chart.lastTickOffset = 0;
	        }
	        if(chart.closePendingAnimation) {
	            chart.masterData[chart.masterData.length-1].Close=chart.closePendingAnimation;
	            chart.closePendingAnimation=0;
	        }
	    }
	    if (chart === null || chart === undefined) return;

	    if (params !== undefined && params.animationEntry) return;

		// If symbol changes then reset all of our variables
		if(this.prevSymbol!=chart.symbol){
			this.prevQuote=0;
			chart.closePendingAnimation=0;
			this.prevSymbol=chart.symbol;
		}
	    unanimateScroll();
	    tickAnimator.stop();
	    if(appendQuotes.length > 2) {
	        return;
	    }
	    var newParams = CIQ.clone(params);
	    if (!newParams) newParams = {};
	    newParams.animationEntry = true;
	    newParams.bypassGovernor = true;
	    newParams.noCreateDataSet = false;
	    newParams.allowReplaceOHL = true;
	    newParams.force = true;
	    newParams.firstLoop=true;
	    var symbol = this.chart.symbol;
	    var interval = this.layout.interval;
	    var timeUnit = this.layout.timeUnit;

	    function cb(quote, prevQuote, chartJustAdvanced) {
	        return function(newData) {
	            var newClose = newData.Close;
		        if(symbol != chart.symbol || interval != self.layout.interval || timeUnit != self.layout.timeUnit) {
	            	//console.log ("---- STOP animating: Old",symbol,' New : ',chart.symbol, Date())
				    unanimateScroll();
				    tickAnimator.stop();
	                return; // changed symbols mid animation
	            }
	            var q = CIQ.clone(quote);
	            q.Close = Math.round(newClose*granularity)/granularity; //<<------ IMPORTANT! Use 1000000 for small price increments, otherwise animation will be in increments of .0001
	            //q.Close = Math.round(newClose*chart.roundit)/chart.roundit; // to ensure decimal points don't go out too far for interim values
	            if (quote.Close > prevQuote.High) q.High = q.Close;
	            if (quote.Close < prevQuote.Low) q.Low = q.Close;
	            if (chartJustAdvanced) {
	                q.Open = q.High = q.Low = q.Close;
	            }
	            if (chart.animatingHorizontalScroll) {
	                self.micropixels = newData.micropixels;
	                chart.lastTickOffset = newData.lineOffset;
	            }
	            newParams.updateDataSegmentInPlace =! tickAnimator.hasCompleted;
	            //console.log("animating: Old",symbol,' New : ',chart.symbol);            
	            self.appendMasterData([q], chart, newParams);
	            newParams.firstLoop=false;
	            if (tickAnimator.hasCompleted) {
	            	//console.log( 'animator has completed') ;           	
	            	//self.pendingScrollAdvance=false;
	                //var possibleYAxisChange = chart.animatingHorizontalScroll;
	                unanimateScroll();
	                /*if (possibleYAxisChange) { // <---- Logic no longer necessary
	                    // After completion, one more draw for good measure in case our
	                    // displayed high and low have changed, which would trigger
	                    // the y-axis animation
	                    setTimeout(function(){
	                        self.draw();
	                    }, 0);
	                }*/
	            }
	        };
	    }

	    var quote = appendQuotes[appendQuotes.length-1];
	    if(!this.prevQuote) this.prevQuote = this.currentQuote();  // <---- prevQuote logic has been changed to prevent forward/back jitter when more than one tick comes in between animations
	    var chartJustAdvanced = false; // When advancing, we need special logic to deal with the open
	    if (appendQuotes.length == 2){
	        this.prevQuote=appendQuotes[0];
	        appendQuotes.splice(1,1);
	    }
	    if (quote.DT.getTime() !== this.prevQuote.DT.getTime()) chartJustAdvanced=true;
	    var linearChart=(this.layout.chartType=="mountain" || this.layout.chartType=="line");

	    var beginningOffset = 0;
	    if(chart.scroll < chart.maxTicks && chartJustAdvanced) {
	        this.previousMicroPixels = this.micropixels;
	        this.nextMicroPixels = this.micropixels + this.layout.candleWidth;
	        beginningOffset = this.layout.candleWidth * -1;
	        if (chart.dataSegment.length < chart.maxTicks - ticksFromEdgeOfScreen && !stayPut){
	            this.nextMicroPixels = this.micropixels;
	            chart.scroll++;
	        }
	        chart.animatingHorizontalScroll = linearChart; // When the chart advances we also animate the horizontal scroll by incrementing micropixels
	        chart.previousDataSetLength = chart.dataSet.length;
	    }
	    chart.closePendingAnimation = quote.Close;
	    tickAnimator.run(cb(quote, CIQ.clone(this.prevQuote), chartJustAdvanced), {"Close":this.prevQuote.Close, "micropixels":this.nextMicroPixels, "lineOffset":beginningOffset}, {"Close":quote.Close, "micropixels": this.micropixels, "lineOffset":0});
	    this.prevQuote=quote;
	    return true; // bypass default behavior in favor of animation

	});

	var scrollAnimator = new CIQ.EaseMachine(Math.easeInOutCubic, 200);

	CIQ.ChartEngine.prototype.prepend("renderYAxis", function(chart){
	    if(!this.grabbingScreen) return;

	    var panel = chart.panel;
	    var arr = panel.yaxisRHS.concat(panel.yaxisLHS);

	    function closure(self){
	        return function(values){
	            chart.animatedLow=values.low;
	            chart.animatedHigh=values.high;
	            self.draw();
	        };
	    }
	    var i;
	    for (i = 0; i < arr.length; i++) {
	        var yAxis = arr[i];
	        var low = null, high = null;
	        if(panel.yAxis === yAxis){
	            // initialize prev values
	            if(!chart.prevLowValue){
	                chart.prevLowValue=chart.animatedLow=chart.lowValue;
	            }
	            if(!chart.prevHighValue){
	                chart.prevHighValue=chart.animatedHigh=chart.highValue;
	            }

	            // check for a change, if so we will spin off an animation

				if(chart.prevLowValue!=chart.lowValue || chart.prevHighValue!=chart.highValue){
	                scrollAnimator.stop();
	                var prevLow=chart.prevLowValue; var prevHigh=chart.prevHighValue;
	                chart.prevLowValue=chart.lowValue;
	                chart.prevHighValue=chart.highValue;
	                scrollAnimator.run(closure(this), {"low": prevLow, "high": prevHigh}, {"low":chart.lowValue, "high":chart.highValue});
	                return true;
	            }else{
	                low=chart.animatedLow;
	                high=chart.animatedHigh;
	            }
	        }
	        this.calculateYAxisRange(panel, yAxis, low, high);
	    }

	    var parameters={};

	    for(i=0;i<arr.length;i++){
	        parameters.yAxis=arr[i];
	        this.createYAxis(panel, parameters);
	        this.drawYAxis(panel, parameters);
	    }
	    return true; // bypass original kernel code
	});

	var flashingColors=['#0298d3','#19bcfc','#5dcffc','#9ee3ff'];
	var flashingColorIndex=0;
	var flashingColorThrottle=20;
	var flashingColorThrottleCounter=0;
	
	CIQ.ChartEngine.prototype.append("draw", function() {
	  if (this.chart.dataSet && this.chart.dataSet.length ) {
		if(flashingColorThrottleCounter%flashingColorThrottle===0) {
			flashingColorIndex++;
			flashingColorThrottleCounter=0;
		}
		flashingColorThrottleCounter++;
		
	    var context = this.chart.context;
	    var panel = this.chart.panel;
	    var price = this.currentQuote().Close;
	    var x = this.pixelFromDate(this.currentQuote().DT, this.chart);
	    if( this.chart.lastTickOffset ) x = x + this.chart.lastTickOffset;
	    var y = this.pixelFromPrice(price, panel);
	    if (this.chart.yAxis.left > x) {
	      if(flashingColorIndex >= flashingColors.length) flashingColorIndex = 0;
	      context.beginPath();
	      context.moveTo(x, y);
	      context.arc(x, y, 2+flashingColorIndex*1.07, 0, Math.PI * 2, false);    	  
		  context.fillStyle = flashingColors[flashingColorIndex];
		  context.fill();
	    }
	  }
	});

	return _exports;

});
