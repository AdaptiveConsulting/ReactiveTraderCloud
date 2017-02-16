(function (definition) {
	"use strict";
	// This file will function properly as a <script> tag, or a module
	// using CommonJS and NodeJS or RequireJS module formats.  In
	// Common/Node/RequireJS, the module exports the FSBL API and when
	// executed as a simple <script>, it creates a FSBL global instead.

	if (typeof exports === "object" && typeof module === "object") {
		module.exports = definition(require('../core/polyfills'));
	} else if (typeof define === "function" && define.amd) {
		define(['core/polyfills'], definition);
	} else if (typeof window !== "undefined" || typeof self !== "undefined") {
		var global = typeof window !== "undefined" ? window : self;
		definition(global);
	} else {
		throw new Error("Only CommonJS, RequireJS, and <script> tags supported for splines.js.");
	}

})(function(_exports) {
		/*
		plotSplinePrimitive function adapted from http://scaledinnovation.com/analytics/splines/spline.html
		Copyright 2010 by Robin W. Spencer
		Please refer to above URL for unmodified source code.
		
		Copyright 2010 by Robin W. Spencer
	
	    This program is free software: you can redistribute it and/or modify
	    it under the terms of the GNU General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    This program is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU General Public License for more details.
	
	    You can find a copy of the GNU General Public License
	    at http://www.gnu.org/licenses/.

		*/
		_exports.plotSpline=function(points, tension, context) {
			function getControlPoints(i){
				var x0=points[i];
				var y0=points[i+1];
				var x1=points[i+2];
				var y1=points[i+3];
				var x2=points[i+4];
				var y2=points[i+5];

				if(isNaN(x0) || isNaN(x1) || isNaN(x2) || isNaN(y0) || isNaN(y1) || isNaN(y2)){
					return null;
				}
				//	x0,y0,x1,y1 are the coordinates of the end (knot) points of this segment
				//	x2,y2 is the next knot -- not connected here but needed to calculate p2
				//	p1 is the control point calculated here, from x1 back toward x0.
				//	p2 is the next control point, calculated here and returned to become the
				//	next segment's p1.
				//	tension controls how far the control points spread.

				//	Scaling factors: distances from this knot to the previous and following knots.
				var d01=Math.sqrt(Math.pow(x1-x0,2)+Math.pow(y1-y0,2));
				var d12=Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));

				var fa=tension*d01/(d01+d12);
				var fb=tension-fa;

				var p1x=x1+fa*(x0-x2);
				var p1y=y1+fa*(y0-y2);

				var p2x=x1-fb*(x0-x2);
				var p2y=y1-fb*(y0-y2);

				return [p1x,p1y,p2x,p2y];
			}

			var cp=[];	 // array of control points, as x0,y0,x1,y1,...
			var n=points.length;
			// Draw an open curve, not connected at the ends
			for(var i=0;i<n-4;i+=2){
				cp=cp.concat(getControlPoints(i));
			}
			if(cp===null) return;

			//plot the first segment
			context.quadraticCurveTo(cp[0],cp[1],points[2],points[3]);

			for(i=2;i<points.length-5;i+=2){
				context.bezierCurveTo(cp[2*i-2],cp[2*i-1],cp[2*i],cp[2*i+1],points[i+2],points[i+3]);
			}

			//plot the last segment
			context.quadraticCurveTo(cp[2*n-10],cp[2*n-9],points[n-4],points[n-3]);
		};
		
	return _exports;

});
	

