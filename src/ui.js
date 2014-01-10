;(function($){
	$.UI = {
		// 在页面中间弹出一个模态窗口，msg为文字内容，delay为延迟消失时间（可不传，即需通过closeToast()手工关闭）
		toast: function(msg, delay) {
			$('#toastBox') && $('#toastBox').remove();
			var toastBox = $('<div>', {
				id: 'toastBox'
			})
			toastBox.css({
				padding:'.3em .6em',
				'border-radius': '.4em',
				'line-height': '1.5em',
				position: 'absolute',				
				'z-index': 999,
				background: '#5E5C5C',
				'text-align': 'center',
				'font-size': '0.85em',
				color: '#fff',
				opacity: 0.8
			})
			toastBox.html(msg);
			$('body').append(toastBox);
			var top =  (document.body.clientHeight - parseInt(toastBox.css('height'))) / 2,
			left =  (document.body.clientWidth - parseInt(toastBox.css('width'))) / 2; 
			 toastBox.css({
				top: top + 'px',
				left: left + 'px',
			})
			if(delay) {
				setTimeout(function() {
					$.UI.closeToast()
				}, delay)
			}
		}
		,closeToast: function() {
			$('#toastBox').remove();
		}
	}

})(Misa)