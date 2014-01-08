/*
 * 基于手持设备的事件封装
 */
;(function($){
	var document = window.document,
	now, delta,	//用于记录间隔时间
	touch = {};	//记录touch事件相关属性
	
	//取消事件
	function cancelAll() {
		if(swipeTimeout) clearTimeout(swipeTimeout);
		swipeTimeout = null;
		touch = {}
	}

	$(document)
	//touch事件委托
	.on('touchstart', function(e) {
		//初始化事件
		if(e.touches && e.touches.length == 1){
			touch = {}
		}
		/* now = Date.now();
		delta = now - (touch.last || now);
		touch.last = now;	//用来记录上次发生touchsatrt的时间 */
		touch.a = e.touches[0];
		//捕获触发事件的元素
		touch.el = $('tagName' in touch.a.target ? touch.a.target : touch.a.target.parentNode);
	})
	.on('touchmove', function(e) {
		//双指事件
		if (e.touches.length > 1) {
			touch.a = e.touches[0];	//第一个点
			touch.b = e.touches[1];	//第二个点
			//计算两点距离
			var c1 = touch.a.pageX - touch.b.pageX, c2 = touch.a.pageY - touch.b.pageY;
			touch.distance = c1 * c1 + c2 * c2;	
			touch.firstDistance = touch.firstDistance || touch.distance;	//记录初始距离
			return false;
		}
		/* if (e.touches.length = 1) {
			firstTouch = true
		}
		touch.x2 = firstTouch.pageX; */
	})
	.on('touchend', function(e) {
		// zoom in & out
		if (touch.b){
			var distance = touch.distance - touch.firstDistance;
			//zoom out 这个数值初步试用
			if (distance > 80000) { 
				touch.el.trigger('zoomOut');
			}
			//zoom in
			if(distance < -80000) {
				touch.el.trigger('zoomIn');
			}
			return;
		}
		// 触发swipe
		/* if (touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) {
			swipeTimeout = setTimeout(function() {
				touch.el.trigger('swipe');
			}, 0)
		} */
		
	})
	

})(Misa)