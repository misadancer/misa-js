var Misa = (function(window) {
	var m = {},key,
	tagRE = /^<(\w+)>$/;		// test tag
	
	// create tag
	m.tag = function(name, property) {
		var dom = $(document.createElement(name));
		for(key in property) {
			dom.attr(key, property[key]);
		}
		return dom;
	}

	// change nodeList to Misa Collection
	m.M = function(dom, nodeList) {
		if(!nodeList.length) {
			dom[0] = nodeList;
			return dom;
		}
		dom.length = nodeList.length;
    	for(key = nodeList.length - 1; key >= 0; key--) {
    		dom[key] = nodeList[key]
    	}
    	return dom
	}
	
	m.init = function(selector, property) {
		var dom = [];
		dom.__proto__ = $.fn;
		if(typeof selector == 'string') {
			if(selector[0] == '<' && tagRE.test(selector)) {
				dom = m.tag(RegExp.$1, property);
				return dom
			} 
			var nodeList = document.querySelectorAll(selector);
    		return m.M(dom, nodeList)
		}
		if(typeof selector == 'object') {
			return m.M(dom, selector)
		}
	}
	
	/*
	 * DOM selector
	 * $(selector) ⇒  collection
	 * for example:
	 * $()	//=> empty Array 
	 * $('div')  //=> all DIV elements on the page
	 * $('#content') //=> element with ID "content"
	 * $('<div>', {css: 'tag'}) //=> create <div> with class 'tag'
	 */
	var $ = function(selector, property) {
		return m.init(selector, property)
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
		/*
		 * attribute operation
		 * $('p span').attr('class', 'highlight')	//set single attribute
		 */
		,attr: function(name, value) {
			this.each(function() {
				this.setAttribute(name, value);
			})
			return this;
		}
		/*
		 * set innerHTML
		 * $('#year').html('<div class="text">2014</div>')
		 */
		,html: function(html) {
			this.each(function() {
				this.innerHTML = html;
			})
			return this;
		}
		// get the first child of each element of collection
		,first: function() {
			var dom = [];
			this.each(function() {
				dom.push(this.childNodes[0])
			})
			dom.__proto__ = $.fn;
			return dom;
		}
		// remove node self
		,remove: function() {
			this.each(function() {
				this.parentNode.removeChild(this);
			})
		}
	}
	/*
	 * insert DOM
	 * append(content) ⇒  self
	 * the content can be an HTML string, a DOM node or collection
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
				//insert collection
				if(typeof html == 'object') {
					var _ = this;
					return html.each(function(node) {
						_.each(function(el) {
							el.insertAdjacentElement(operator, node)
						})
					})
				}
				return this.each(function(el) {
					el['insertAdjacent' + (html instanceof Element ? 'Element' : 'HTML')](operator, html)
				})
			}
		})(adjacencyOperators[key])
	}
	
	return $
})(window)

window.$ = Misa
