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
		 * $('#p').attr('class')	//get className of an element
		 * $('p span').attr('class', 'highlight')	//set single attribute
		 */
		,attr: function(name, value) {
			// get attribute
			if(!value && this.length == 1) {
				return this[0].getAttribute(name);
			}
			return this.each(function() {
				this.setAttribute(name, value);
			})
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
	
	// create Event
	$.Event = function(type) {
		var event = document.createEvent('Events');
		event.initEvent(type, true, true);
		return event;
	}
	
	return $
})(window)

window.$ = Misa
	
/*
 * Event
 * $().on 绑定事件
 * $().off 解绑事件
 */
;(function($) {
	var _id = 1,	//每个element的标示符
	handlers = {},	//事件管理对象
	customEvent = ['swipe'];	//自定义事件	

	//取element的唯一标示符，如果没有，则设置一个并返回
	function mid(element) {
		return element._id || (element._id = _id++)
	}

	/*
	 * $().on 绑定事件
	 * $('#btn').on('mousedown touchstart', callback)	//events可以为多个事件，用空格分隔 
	 * $('btn').on('click.first', callback)		//可为事件指定命名
	 */
	$.fn.on = function(events, callback) {
		var _ = this
		return _.each(function(el) {
			add(el, events, callback)
		})
	}
	
	/*
	 * $().off 解绑事件
	 * 只支持单个事件
	 * $('#btn').off('click.first')		//指定命名时，无需指定callback
	 */
	$.fn.off = function(event, callback) {
		this.each(function(el) {
			remove(el, event, callback)
		})
	}
	
	//用于触发事件
	$.fn.trigger = function(event) {
		var e = $.Event(event);	 //创建事件
		return this.each(function(el) {
			el.dispatchEvent(e);
		})
	}
	
	//查找指定handler
	function finHandlers(id, event, fn) {
		event = parse(event);
		if(event.ns) {
			return handlers[id].filter(function(handler) {
				return (handler.e == event.e) && (handler.ns == event.ns)
			})
		}
		return handlers[id].filter(function(handler) {
			return (handler.e == event.e) && (!fn || handler.fn == fn)
		});
	}
	
	/*
	 * 格式化事件对象，返回事件命名空间
	 * parse('click.first') => {e: 'click', ns: 'first'}
	 */
	function parse(event) {
		var parts = ('' + event).split('.');
		return {
			e: parts[0],
			ns: parts[1]
		}
	}
	//add events
	function add(element, events, fn) {
		var id = mid(element), handler = {},
		set = (handlers[id] || (handlers[id] = []));
		//对多个事件用空格分组，进行遍历
		events.split(/\s/).forEach(function(event) {
			var handler = parse(event);
			handler.fn = fn;
			handler.proxy = function(e) {
				//取得捕获事件的元素
				var currentTarget = e.currentTarget;
				var result = fn.apply(element, [e,currentTarget]);
				if(result === false) e.preventDefault(),e.stopPropagation();
				return result;
			}
			handler.i = set.length;
			set.push(handler);
			element.addEventListener(handler.e, handler.proxy, false);
		})
	}
	
	//remove event
	function remove(element, event, fn) {
		var id = mid(element);
		finHandlers(id, event, fn).forEach(function(handler) {
			delete handlers[id][handler.i];
			element.removeEventListener(handler.e, handler.proxy, false)
		})
	}
})(Misa)
