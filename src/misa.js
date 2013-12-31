/*
 * DOM selector
 * $(selector) ⇒  collection
 * for example:
 * $()	//=> empty Array 
 * $('div')  //=> all DIV elements on the page
 * $('#content') //=> element with ID "content"
 */
var m = {};
m.init = function(selector) {
	var dom = [];
	dom.__proto__ = $.fn;
	if(typeof selector == 'string') {
		var nodeList = document.querySelectorAll(selector);
    	dom.length = nodeList.length;
    	for(var i = nodeList.length - 1; i >= 0; i--) {
    		dom[i] = nodeList[i]
    	}
	}
	return dom
}

var $ = function(selector) {
	return m.init(selector)
}
//  prototype for $() collection
$.fn = {
	each: function(callback) {
		Array.prototype.forEach.call(this, function(el, index) {
			callback.call(el)
		})
	}
	/* CSS operation
	 * $().css() 
	 * for example:
	 * $('#content').css('background-color') // get property
	 * $('p').css('color': 'red')	// set property
	 * $('p').css('color': '')	//remove property
	 */
	,css: function(property, value) {
		// get property
		if(arguments.length == 1) {
			if(typeof property == 'string') {
				var elements = this[0],
				computedStyle = getComputedStyle(elements, '');
				return computedStyle.getPropertyValue(property)
			}
		}
		// remove property
		if( value !== 0) {
			this.each(function() {
				this.style.removeProperty(property)
			})
		}
		var css = '';
		// set property
		if(typeof property == 'string') {
			css = property + ':' + value;
			this.each(function() {
				this.style.cssText += ';' + css
			})
			return;
		}
		// set multiple property
		if(typeof property == 'object') {
			for(var key in property) {
				css += ';' + key + ':' + property[key];
			}
			this.each(function() {
				this.style.cssText += css
			})
		}
	}
}