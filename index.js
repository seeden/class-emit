define(['class-extend'], function(Class) {
	"use strict";

	return Class.extend({
		on: function(name, callback, context) {
			var self = this;
			context = context || this;

			if(!name || typeof callback !== 'function') {
				throw new Error('Parameter missing');
			}

			var events = this.__events || (this.__events = {});

			if(!events[name]) {
				events[name] = [];	
			}

			events.push({
      			callback: callback,
      			context: context
    		});

    		return function() {
    			self.off(name, callback);
    		}
		},

		once: function (name, callback, context) {
    		var self = this;
    		context = context || this;
    		
    		var fn = function () {
      			self.off(name, callback);
      			callback.apply(context, arguments);
    		};
    
    		return this.on(name, fn, context);
  		},

  		emit: function (name) {
    		var data = [].slice.call(arguments, 1);

    		if(!this.__events || !this.__events[name]) {
    			return this;
    		}

    		var evts = this.__events[name];
    
			for (var i=0; len = evts.length; i < len ; i++) {
				var e = evts[i];

				e.fn.apply(e.context, data);
			}
    
			return this;
		},

		off: function (name, callback) {
			if(!this.__events || !name || !this.__events[name] || !callback) {
    			return this;
    		}

    		var evts = this.__events[name];
    		var liveEvts = [];

			for (var i = 0, len = evts.length; i < len; i++) {
				if (evts[i].callback !== callback) {
					liveEvts.push(evts[i]);
				}
			}

			(liveEvts.length)
				? this.__events[name] = liveEvts 
				: delete this.__events[name];

			return this;
    	}
	});
});