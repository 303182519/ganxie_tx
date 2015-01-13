/**
 * 手机图片轮播
 * slider 为ID元素
 * new Slider("slider",{
        width:320
    });
 */

function Slider(s,opts){
    if (!s && typeof s != 'string') return;
    this.init(s, opts || {});
}
Slider.prototype={
    //默认属性
    _default_opts:{
        width:320,
        distance:10,
        stopPropagation:true,
        touchmove:function(){}
    },
    extend:function(target, source) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
        return target;
    },
    //初始化
    init:function(s,opts){

        this.opts = this.extend(this._default_opts, opts);
        this.nowPage = 0;

        this.selector(s);
        this.layout();
        this.bindEvent();
    },
    //选择器
    selector:function(s){
        this.slider         =  document.querySelector('#'+s);
        this.slider_list    = this.slider.querySelectorAll('.slider_list')[0];
        this.slider_con     = this.slider.querySelectorAll('.slider_con')[0];
        this.slider_page    = this.slider.querySelectorAll('.slider_page')[0];
        this.slider_page_li = this.slider_page.querySelectorAll("li");
        this.maxPage        = this.slider_list.querySelectorAll('li').length;
    },
    //布局
    layout:function(){
        this.slider_list.style.width = this.opts.width * this.maxPage + 'px';
        this.slider_list.style.webkitTransform = 'translate3D(0, 0, 0)';
    },
    //页码
    page:function(){

        for(var i =0,len=this.slider_page_li.length; i<len; i++){
            this.slider_page_li[i].className='';
        }
        this.slider_page_li[this.nowPage].className = 'cur';
    },
    _touchstart:function(e){
        var target = e.targetTouches[0];
        this.startX = target.pageX;

        this.slider_con.style.webkitTransitionDuration = '0ms';

        this.moveFn = this._touchmove.bind(this);
        this.endFn  = this._touchend.bind(this);

        this.slider_con.addEventListener('touchmove', this.moveFn);
        this.slider_con.addEventListener('touchend', this.endFn);

        e.preventDefault();
    },
    _touchmove:function(e){
        var target = e.targetTouches[0];
        var disX = target.pageX - this.startX;
           
        this.opts.touchmove({
            'x': disX,
            'nowPage': this.nowPage
        })
        e.preventDefault();

    },
    _touchend:function(e){
        this.slider_con.removeEventListener("touchmove", this.moveFn, false);
        this.slider_con.removeEventListener("touchend", this.endFn, false);
        var target = e.changedTouches[0];
        var endX = target.pageX -this.startX;

        
        if( endX>0 && Math.abs(endX)>10){
            //右
            if(this.nowPage <= 0){
                return false;
            }
            this.nowPage--;       
        }else if(endX<0 && Math.abs(endX)>10){
            //左
            if(this.nowPage >= this.maxPage - 1){
                return false;
            }
            this.nowPage++;           
        }

        this.slider_list.style.webkitTransitionDuration = '400ms';
        this.slider_list.style.webkitTransform = 'translate3d(' + (-this.nowPage * this.opts.width) + 'px, 0px, 0px)';

        e.preventDefault();
    },
    _moveend:function(){
        this.slider_list.style.webkitTransitionDuration = '0ms';
        this.page();
    },
    //绑定事件
    bindEvent:function(){

        this.startFn = this._touchstart.bind(this);
        this.slider_con.addEventListener("touchstart", this.startFn, false)

        this.moveendFn = this._moveend.bind(this);
        this.slider_list.addEventListener(UTIL.transitionEnd().end,this.moveendFn,false);
        if(this.opts.stopPropagation){
            document.querySelector("body").addEventListener("touchmove", function(e){
                e.preventDefault();
            }, false)
        }     
    },
    //销毁
    destory:function(){
        this.slider_con.removeEventListener("touchstart", this.startFn, false);
        this.slider_list.removeEventListener(UTIL.transitionEnd().end,this.moveendFn,false);
    }

}

