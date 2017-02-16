//-------------------------------------------------------------------------------------------
// Copyright 2012-2016 by ChartIQ, Inc.
// All rights reserved
//-------------------------------------------------------------------------------------------

(function (definition) {
	"use strict";

	if (typeof exports === "object" && typeof module === "object") {
		module.exports = definition( require('../core/polyfills') );
	} else if (typeof define === "function" && define.amd) {
		define(['core/polyfills'], definition);
	} else if (typeof window !== "undefined" || typeof self !== "undefined") {
		var global = typeof window !== "undefined" ? window : self;
		definition(global);
	} else {
		throw new Error("Only CommonJS, RequireJS, and <script> tags supported for ie8.js.");
	}
})(function(_exports){
	console.log("ie8.js",_exports);

	// IE8 shim, http://stackoverflow.com/questions/10173236/window-innerheight-ie8-alternative

	if(!window.innerHeight && window.innerHeight!==0){
	  (function (window, document) {
		var html = document.documentElement;

		var define = function (object, property, getter) {
			if (typeof object[property] === 'undefined') {
				Object.defineProperty(object, property, { get: getter });
			}
		};

		define(window, 'innerWidth', function () { return html.clientWidth; });
		define(window, 'innerHeight', function () { return html.clientHeight; });

		define(window, 'scrollX', function () { return window.pageXOffset || html.scrollLeft; });
		define(window, 'scrollY', function () { return window.pageYOffset || html.scrollTop; });

		define(document, 'width', function () { return Math.max(document.body.scrollWidth, html.scrollWidth, document.body.offsetWidth, html.offsetWidth, document.body.clientWidth, html.clientWidth); });
		define(document, 'height', function () { return Math.max(document.body.scrollHeight, html.scrollHeight, document.body.offsetHeight, html.offsetHeight, document.body.clientHeight, html.clientHeight); });

		return define;
	  }(window, document));
	}

	// Polyfill for IE8 Object.create http://stackoverflow.com/questions/18020265/object-create-not-supported-in-ie8
	if (!Object.create) {
		Object.defineProperty = (!window.isIE8 && Object.defineProperty) || function (obj, name, desc) {
			if (desc.get && obj.__defineGetter__)
				obj.__defineGetter__(name, desc.get);
			else if (desc.value || desc.get)
				obj[name] = desc.value || desc.get;
		};

		Object.create = function(proto, props) {
			var obj;

			function F() {}
			F.prototype = proto;
			obj = new F();

			for (var k in props) {
				if (Object.prototype.hasOwnProperty.call(props, k))
					Object.defineProperty(obj, k, props[k]);
			}

			return obj;
		};
	}

	// Adapted from https://gist.github.com/paulirish/1579671 which derived from
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

	// requestAnimationFrame polyfill by Erik Möller.
	// Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavič, Darius Bacon

	// MIT license

	if (!Date.now)
	    Date.now = function() { return new Date().getTime(); };

	(function() {
	    'use strict';

	    var vendors = ['webkit', 'moz'];
	    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
	        var vp = vendors[i];
	        window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
	        window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame'] ||
	        								window[vp+'CancelRequestAnimationFrame']);
	    }
	    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || // iOS6 is buggy
	    		!window.requestAnimationFrame || !window.cancelAnimationFrame) {
	        var lastTime = 0;
	        window.requestAnimationFrame = function(callback) {
	            var now = Date.now();
	            var nextTime = Math.max(lastTime + 16, now);
	            return setTimeout(function() { callback(lastTime = nextTime); },
	                              nextTime - now);
	        };
	        window.cancelAnimationFrame = clearTimeout;
	    }
	}());

	// IE8 addEventListener polyfill https://gist.github.com/jonathantneal/3748027
	if(!window.addEventListener){
	  (function (WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
		WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener) {
			var target = this;

			registry.unshift([target, type, listener, function (event) {
				event.currentTarget = target;
				event.preventDefault = function () { event.returnValue = false; };
				event.stopPropagation = function () { event.cancelBubble = true; };
				event.target = event.srcElement || target;
				if(typeof listener=="function")
					listener.call(target, event);
				else if(typeof listener=="object" && typeof listener.handleEvent=="function")
					listener.handleEvent.call(listener, event);
			}]);

			this.attachEvent("on" + type, registry[0][3]);
		};

		WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener) {
			for (var index = 0, register = registry[index]; register; register = registry[++index]) {
				if (register[0] == this && register[1] == type && register[2] == listener) {
					return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
				}
			}
		};

		WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
			return this.fireEvent("on" + eventObject.type, eventObject);
		};
	  })(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);
	}

	// IE8 bind() support: http://stackoverflow.com/questions/11054511/how-to-handle-lack-of-javascript-object-bind-method-in-ie-8
	if (!Function.prototype.bind) {
		Function.prototype.bind = function(oThis) {
			if (typeof this !== 'function') {
			  // closest thing possible to the ECMAScript 5
			  // internal IsCallable function
			  throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
			}

			var aArgs	= Array.prototype.slice.call(arguments, 1),
				fToBind = this,
				fNOP	= function() {},
				fBound	= function() {
				  return fToBind.apply(this instanceof fNOP &&
						  oThis ? this : oThis,
						 aArgs.concat(Array.prototype.slice.call(arguments)));
				};

			fNOP.prototype = this.prototype;
			fBound.prototype = new fNOP();

			return fBound;
		};
		
		// getComputedStyle polyfill
		if (!window.getComputedStyle) {
			window.getComputedStyle = function(el, pseudo) {
				var style = {};
				for(var prop in el.currentStyle){
					if(typeof el.currentStyle[prop] =="undefined") {
						continue;
					}
					if(prop =="outline" || prop =="outlineWidth") {
						// in ie8 these are not undefined but rather contain 'unspecified error' as their values. So we wil skip them.
						continue;
					}
					style[prop]=el.currentStyle[prop];
				}
				style.getPropertyValue = function(prop) {
					var re = /(\-([a-z]){1})/g;
					if (prop == 'float') prop = 'styleFloat';
					if (re.test(prop)) {
						prop = prop.replace(re, function () {
							return arguments[2].toUpperCase();
						});
					}
					return this[prop] ? this[prop] : null;
				};
				return style;
			};
		}

	}

	return _exports;
});