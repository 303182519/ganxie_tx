(function(exports){
	exports.UTIL={
		/**
		 * 判断是否是微信
		 * @return {Boolean} [description]
		 */
		isWeiXin:function(){
			var ua = window.navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                return true;
            }else{
                return false;
            }
		},
		Android: function() {
        	return navigator.userAgent.match(/Android/i) ? true : false;
	    },
	    iOS: function() {
	        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
	    },
		transitionEnd:function(){
			var el = document.createElement('div')
	        var transEndEventNames = {
	            'WebkitTransition': 'webkitTransitionEnd',
	            'MozTransition': 'transitionend',
	            'OTransition': 'oTransitionEnd otransitionend',
	            'transition': 'transitionend'
	        }
	        for (var name in transEndEventNames) {
	            if (el.style[name] !== undefined) {
	                return {
	                    end: transEndEventNames[name]
	                }
	            }
	        }
	        return false;
		},
		/**
		 * 扩展属性
		 * @return {[type]} [description]
		 */
		extend:function(){
			var args = Array.prototype.slice.call(arguments, 0),
            	attr;
	        var o = args[0];
	        var deep = false;
	        if (typeof args[args.length - 1] == 'boolean') {
	            deep = args[args.length - 1];
	            args.pop();
	        }
	        for (var i = 1; i < args.length; i++) {
	            for (attr in args[i]) {
	                if (deep && typeof args[i][attr] == 'object') {
	                    o[attr] = {};
	                    extend(o[attr], args[i][attr], true);
	                } else
	                    o[attr] = args[i][attr];
	            }
	        }
	        return o;
		}	
	}
})(window)