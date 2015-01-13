var Scroller = function(selector, opts) {
    if (!selector && typeof selector != 'string') return;
    this.init(selector, opts || {});
}
Scroller.prototype = {
    _default_opts:{
        Scontainer: '.container',
        hScroll: false,
        vScroll: false,
        scrollBefore:function(){},
        onScroll:function(){},
        onTouchEnd:function(){},
        scrollEnd:function(){}

    },
    extend:function(target, source) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
        return target;
    },
    init: function(s, opts) {

        this.opts = this.extend(this._default_opts, opts);
        //this.opts = UTIL.extend({}, this._default_opts, opts);

        var $el = document.querySelector(s + ' ' + this.opts.Scontainer);
        var $parent = document.querySelector(s);

        this._initUi($el, $parent);

        this._mixH = $parent.offsetHeight - $el.offsetHeight;
        this._mixW = $parent.offsetWidth - $el.offsetWidth;

        this.$el.style.webkitTransform = 'translate3D(0, 0, 0)';

        if (this.opts.hScroll) {
            this.lock = 'lock_y';
        }
        if (this.opts.vScroll) {
            this.lock = 'lock_x';
        }

        this.initEvent();
    },
    /**
     * 重置每一个的li的宽度与高度
     * @param  {object} $el     ul
     * @param  {object} $parent section
     */
    _initUi: function($el, $parent) {

        this._clientW = $parent.clientWidth;
        this._clientH = $parent.clientHeight;

        var li = $el.querySelectorAll('#' + $el.id + ' > li');

        for (var i = 0, len = li.length; i < len; i++) {
            li[i].style.width = this._clientW + 'px';
            li[i].style.height = this._clientH + 'px';

            if (this.opts.hScroll) {
                li[i].style.float = 'left';
            }

        };
            

        if (this.opts.hScroll) {
            $el.style.width = (this._clientW*li.length) + 'px';
            $el.style.height = this._clientH + 'px';
        }
        if (this.opts.vScroll) {
            $el.style.height = $el.scrollHeight + 'px';
            $el.style.width = this._clientW + 'px';
        }

            
        this.$el = $el;
        this.$parent = $parent;
        this.$li = li;
    },
    /**
     * 绑定事件
     */
    initEvent: function() {

        this.fun = this._touchstart.bind(this);

        this.$el.addEventListener('touchstart', this.fun);

        //滚动完之后的处理
        this.$el.addEventListener(UTIL.transitionEnd().end, function(e) {
            this.$el.style.webkitTransitionDuration = '0ms';
            var num = this.currNum ? -1 * this.currNum : '0';
            this.opts.scrollEnd(num);
        }.bind(this), false);


    },
    _touchstart: function(evt) {
        if (this.drag) return;
        this.drag = true;
        target = evt.targetTouches[0];

        this._x = this._x || 0;
        this._y = this._y || 0;

        this.startX = target.pageX;
        this.startY = target.pageY;


        this._clientX = target.pageX - this._x;
        this._clientY = target.pageY - this._y;

        this.$el.style.webkitTransitionDuration = '0ms';

        this.$el.addEventListener('touchmove', this.update.bind(this));

        this.$el.addEventListener('touchend', this.clearEvent.bind(this));

        evt.preventDefault();

        this.opts.scrollBefore(evt);

    },
    clearEvent: function(evt) {
        if (!this.drag) return;
        this.drag = false;
        this.$el.removeEventListener("touchmove", this.update, false);
        this.$el.removeEventListener("touchend", this.clearEvent, false);
        var target = evt.changedTouches[0];

        var endX = target.pageX;
        var endY = target.pageY;

        var _x = this._x,
            _y = this._y;

        //上下    
        if ('lock_x' == this.lock) {
            var direction_y = endY - this.startY < 0 ? -1 : 1;
        }
        //左右
        if ('lock_y' == this.lock) {
            var direction_x = endX - this.startX < 0 ? -1 : 1;
        }


        this.$el.style.webkitTransitionDuration = '400ms';


        //向上取最大,正负，获取第几屏
        if (direction_y > 0 || direction_x > 0) {
            var math = Math.ceil;
        } else {
            var math = Math.floor;
        }

        var curr_num;
        curr_num = math(_y / this._clientH);

        _x = math(_x / this._clientW) * this._clientW;

        _y = curr_num * this._clientH;

        if ('lock_y' == this.lock) {
            curr_num = math(_x / this._clientW);
        }


        //限制范围
        if ('lock_x' == this.lock) {
            if (_y > 0) _y = 0;
            if (_y < this._mixH) _y = this._mixH;
        } else if ('lock_y' == this.lock) {
            if (_x > 0) _x = 0;
            if (_x < this._mixW) _x = this._mixW;
        }

        this._x = _x;
        this._y = _y;
        this.currNum = curr_num || 0;
        this.$el.style.webkitTransform = 'translate3d(' + _x + 'px, ' + _y + 'px, 0px)';

        this.opts.onTouchEnd({
            'x': this._x,
            'y': this._y
        });

    },
    update: function(evt) {
        if (!this.drag) return;
        var target = evt.targetTouches[0];
        var disY = target.pageY - this._clientY;
        var disX = target.pageX - this._clientX;
        if (disY == disX) {
            return;
        }
        
        var _direction = Math.abs(this._y - disY) > Math.abs(this._x - disX) ? 1 : -1;



        //反方向,阻止
        if (this.lock == 'lock_x' && _direction == -1) {
            evt.stopPropagation();
            return;
        } else if (this.lock == 'lock_y' && _direction == 1) {
            evt.stopPropagation();
            return;
        }



        //限制范围
        if ('lock_x' == this.lock) {
            if (disY > 0) disY = 0;
            if (disY < this._mixH) disY = this._mixH;          
            this._y = disY;
        }else if('lock_y' == this.lock){
            if (disX > 0) disX = 0;
            if (disX < this._mixW) disX = this._mixW;
            this._x = disX;
        }

        evt.preventDefault();
        this.opts.onScroll({
            'x': this._x,
            'y': this._y
        })

    },
    destory: function() {
        this.$el.removeEventListener("touchstart", this.fun);
        this.$parent.style.overflow = 'visible';
    }
};