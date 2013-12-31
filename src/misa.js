var Misa = (function(window) {
	var m = {},key;

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
	
	/*
	 * DOM selector
	 * $(selector) ⇒  collection
	 * for example:
	 * $()	//=> empty Array 
	 * $('div')  //=> all DIV elements on the page
	 * $('#content') //=> element with ID "content"
	 */
	var $ = function(selector) {
		return m.init(selector)
	}
	//  prototype for $() collection
	$.fn = {
		// boolean check if any elements in the collecion have the specified class.
		hasClass: function(name) {
			//to do
		}
		,addClass: function(name) {
			this.each(function() {
				// to do
			})
		}
		,each: function(callback) {
			Array.prototype.forEach.call(this, function(el, index) {
				callback.call(el, el)
			})
			return this;
		}
		/* CSS operation
		 * $().css() 
		 * for example:
		 * $('#content').css('background-color') // get property
		 * $('p').css('color', 'red')	// set property
		 * $('p').css('color', '')	//remove property
		 * $('p').css({color: 'red', background: 'pink'})	//set multiple property
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
				for(key in property) {
					css += ';' + key + ':' + property[key];
				}
				this.each(function() {
					this.style.cssText += css
				})
			}
		}
	}
	/*
	 * insert DOM
	 * append(content) ⇒  self
	 * the content can be an HTML string or a DOM node
	 * for example:
	 * $('ul').append('<li>item</li>')	//insert <li>item</li> immediately before each </ul>
	 * $('p').before('<br/>')  //insert <br> immediately before each <p>
	 */
	var adjacencyOperators = {
		before: 'beforeBegin',
		prepend: 'afterBegin',
		append: 'beforeEnd',
		after: 'afterEnd'
	}
	for (key in adjacencyOperators) {
		$.fn[key] = (function(operator) {
			return function(html){
				return this.each(function(el) {
					el['insertAdjacent' + (html instanceof Element ? 'Element' : 'HTML')](operator, html)
				})
			}
		})(adjacencyOperators[key])
	}
	
	return $
})(window)

window.$ = Misa
