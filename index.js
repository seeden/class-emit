(function (root) {
	"use strict";

	function ClassEmit() {
	}

	ClassEmit.prototype.on = function(name, callback, context) {
		var self = this;
		context = context || this;

		if(!name || typeof callback !== 'function') {
			throw new Error('Parameter missing');
		}

		var events = this.__events || (this.__events = {});

		if(!events[name]) {
			events[name] = [];	
		}

		events[name].push({
			callback: callback,
			context: context
		});

		return {
			name: name,
			callback: callback,
			context: context,
			remove: function() {
				self.off(name, callback);	
			}
		}
	};

	ClassEmit.prototype.once = function (name, callback, context) {
		var self = this;
		context = context || this;
			
		var fn = function () {
			self.off(name, fn);
			callback.apply(context, arguments);
		};
	
		return this.on(name, fn, context);
	};

	ClassEmit.prototype.emit = function (name) {
		var data = [].slice.call(arguments, 1);

		if(!this.__events || !this.__events[name]) {
			return this;
		}

		var evts = this.__events[name];
		var len = evts.length;
	
		for (var i=0; i<len; i++) {
			var e = evts[i];

			e.callback.apply(e.context, data);
		}
	
		return this;
	};

	ClassEmit.prototype.off = function (name, callback) {
		if(!this.__events || !name || !this.__events[name] || !callback) {
			return this;
		}

		var evts = this.__events[name];
		var len = evts.length;
		var liveEvts = [];

		for (var i = 0; i<len; i++) {
			if (evts[i].callback !== callback) {
				liveEvts.push(evts[i]);
			}
		}

		(liveEvts.length)
			? this.__events[name] = liveEvts 
			: delete this.__events[name];

		return this;
	};


	//Exports
	//AMD
	if (typeof define !== 'undefined' && define.amd) {
		define([], function () {
			return ClassEmit;
		});
	}

	//CommonJS
	else if (typeof module !== 'undefined' && module.exports) {
		module.exports = ClassEmit;
	}

	//Script tag
	else {
		root.ClassEmit = ClassEmit;
	}

} (this));