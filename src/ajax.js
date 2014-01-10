;(function($){
	/*
	 * @name: $.Ajax
	 * @description: 全局ajax处理,使用时需先new
	 * @type: constructor
	 * @parm o: {Object} ajax配置参数
	 * @example:
	 * var ajax = new Ajax({
	 * 	srv: 'http://xnbapi.xici.com/index.php?',
	 *	success: function(res,fn) {
	 * 		console.log(res);
	 * 		fn(res);
	 * 	},	//success时对响应数据的容错处理，在数据正确时执行fn
	 * 	dataType: 'text' //非必要，默认为'JSON'
	 * })
	 */
	$.Ajax = function(o) {
		this.queue = [];
		this.settings = $.extend(o, {
			dataType: 'JSON',
			type: 'GET'
		})
	}

	$.Ajax.prototype = {
		/*
		 * @namespace: Ajax.prototype
		 * @description: 将对象转换成url地址
		 * @type: function
		 * @parm o: {Object} 参数对象
		 * @return: String 参数字符串
		 */
		parseParam: function(o) {
			var str = "";
			for(var i in o) {
				str += '&' + i + '=' + encodeURIComponent(o[i]);
			}
			return str;
		},
		/*
		 * @namesparc: Ajax.prototype
		 * @description: 发送Ajax请求
		 * @type: function
		 * @parm o: {Object} 请求参数
		 * @example:
		 * ajax.request({
		 * 		method: 'user.login',
		 * 		type: 'POST', //非必要，默认为'GET'
		 * 		data: {
		 * 			username: 'misa',
		 * 			password: '123456'
		 * 		},
		 * 		fn: function(data) {
		 * 			localStorage.setItem('token') = data.token;
		 * 		}	//返回数据正确时，渲染DOM的方法，
		 *  })
		 */
		request: function(xhr) {
			var _ = this,
			xhr = $.extend(xhr,_.settings);
			_.queue.push(xhr);
			while(_.queue.length) {
				_.start(_.queue.shift())
			}
		},
		start: function(xhr) {
			var _ = this,
			xmlHttp = new XMLHttpRequest();
			if (xmlHttp != null) {
				xmlHttp.onreadystatechange = state_Change;
				if(xhr.type == 'GET') {
					if(!xhr.url){
						xhr.url =  xhr.srv + 'method=' + xhr.method + _.parseParam(xhr.data);
					}
					console.log(xhr.url)
					xmlHttp.open('GET', xhr.url);
					xmlHttp.send(null);
				} 
				if(xhr.type == 'POST') {
					if(!xhr.url){
						xhr.url =  xhr.srv + 'method=' + xhr.method;
					}
					xmlHttp.open('POST', xhr.url);
					xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
					xmlHttp.send(_.parseParam(xhr.data));
				}
			}
			else {
				console.log("Your runtime does not support XMLHTTP.");
			}
			
			function state_Change() {
				if ( xmlHttp.readyState == 4 ) {
					if ( xmlHttp.status == 200 ) {
						//请求成功
						xhr.success(xmlHttp.responseText, xhr.fn)
					}
					else {
						console.log("Problem retrieving XML data");
					}
				} 
			}
		}
	}

})(Misa)