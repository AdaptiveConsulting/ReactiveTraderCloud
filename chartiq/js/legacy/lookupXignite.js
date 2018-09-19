(function (definition) {
	"use strict";

	if (typeof exports === "object" && typeof module === "object") {
		module.exports = definition( require("../chartiq") );
	} else if (typeof define === "function" && define.amd) {
		define(["chartiq"], definition);
	} else if (typeof window !== "undefined" || typeof self !== "undefined") {
		var global = typeof window !== "undefined" ? window : self;
		definition(global);
	} else {
		throw new Error("Only CommonJS, RequireJS, and <script> tags supported for lookupXignite.js.");
	}
})(function(_exports){
	//console.log("lookupXignite",_exports);

	var CIQ=_exports.CIQ;
	
	CIQ.SymbolLookupModule={

		subscribedExchanges:[],		
		fastLookupMap:[],  //use for fast lookup of description by symbol (this is parsed with dashes to fit in the headsup)
		fastLookupShareMap:[],  //use for fast lookup of description for sharing (this is raw)

		source:"Xignite",
		currentRequest:0,
		maxResults:50,  //default search results count
		searchExchanges:[],
		internalSubscribedExchanges:{
			"XNYS":true,
			"XASE":true,
			"ARCX":true,
			"XNAS":true,
			"OOTC":true,
			"XOTC":true,
			"PINX":true,
			"metals":true,
			"forex":true,
			"futures":true,
			"mutualfund":true
		},
		
		cache:[],
		cacheIt:function(body,data){
			this.cache.push({body:body,data:data});
			while(this.cache.length>100) this.cache.shift();
		},

		ready:false,
		loadSymbolLookupTables:function(useDefaults){
			if(this.ready) return;
			if(!useDefaults) this.internalSubscribedExchanges={};
			for(var i=0;i<this.subscribedExchanges.length;i++){
				this.internalSubscribedExchanges[this.subscribedExchanges[i]]=true;
			}
			this.searchExchanges=[];
			for(var j in this.internalSubscribedExchanges){
				if(this.internalSubscribedExchanges[j]) this.searchExchanges.push(j);
			}
			this.ready=true;
		},
	
		doSymbolLookup:function(type,keyword,maxResults,cb){
			var self=this;
			if(!keyword){
				if(cb) cb({});
				return;
			}
			if(!maxResults) maxResults=this.maxResults;
			var url="https://services.chartiq.com/symbol_lookup_service/";
			var body="t="+encodeURIComponent(keyword)+"&m="+parseInt(maxResults,10);
			if(type && type!="ALL") body+="&e="+encodeURIComponent(type);
			body+="&x="+encodeURIComponent(JSON.stringify(this.searchExchanges));
			for(var i=0;i<self.cache.length;i++){
				if(self.cache[i].body==body){
					cb(self.cache[i].data);
					return;
				}
			}
			if(body.length<1800){
				url+="?"+body;
			}
			CIQ.SymbolLookupModule.currentRequest++;
			var thisRequest=CIQ.SymbolLookupModule.currentRequest;
			setTimeout(function(){
				if(thisRequest!=CIQ.SymbolLookupModule.currentRequest) return; // another keystroke happened in the timeout period
				CIQ.postAjax(url, body.length<1800?null:body, function(status, response){
					if(thisRequest!=CIQ.SymbolLookupModule.currentRequest) return; // An older request got ahead of a newer request.
					if(status!=200){
						if(cb) cb({});
						return;
					}
					//populate the map
					var results=response.split("\r\n");
					var filteredResults=[];
					var names;
					for(var r=1;r<results.length;r++){
						if(r==1) {
							names=results[0].split("|");
							headers={};
							for(var h=0;h<names.length;h++){
								headers[names[h]]=h;
							}
						}
						var fields=results[r].split("|");
						if(!self.internalSubscribedExchanges[fields[headers.source]]) continue;
						self.fastLookupShareMap[fields[headers.symbol]]=fields[headers.name];
						filteredResults.push({
							"symbol":fields[headers.symbol],
							"name":fields[headers.name],
							"exchDisp":fields[headers.exchDisp]
						});
					}
					if(filteredResults.length>10) self.cacheIt(body,filteredResults); // Only cache "heavy" results
					if(cb) cb(filteredResults);
				});
			},100);
		}
	};

	return _exports;

});
