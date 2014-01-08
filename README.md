# Misa.js

## Developer Log
 - 2014.1.6
 	- 添加 `on`、`off` 事件
 - 2014.1.7
 	- 优化`event`
> 	/*
	 * $().on 绑定事件
	 * $('#btn').on('mousedown touchstart', callback)	//events可以为多个事件，用空格分隔 
	 * $('btn').on('click.first', callback)		//可为事件指定命名
	 * 
	 * $().off 解绑事件
	 * 只支持单个事件
	 * $('#btn').off('click.first')		//指定命名时，无需指定callback
	 */
	 
- 2014.1.8
	- 添加`zoomIn` 、`zoomOut` 事件支持
	