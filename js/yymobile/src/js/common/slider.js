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
        width:320
    },
    //初始化
    init:function(s,opts){

        this.opts = $.extend(this._default_opts, opts);
        this.nowPage = 0;

        this.selector(s);
        this.layout();
        this.bindEvent();


    },
    //选择器
    selector:function(s){
        this.slider      = $("#"+s);
        this.slider_list = this.slider.find(".slider_list").eq(0);
        this.slider_con  = this.slider.find(".slider_con").eq(0);
        this.slider_page = this.slider.find(".slider_page").eq(0);
        this.maxPage     = this.slider_list.find("li").length;
    },
    //布局
    layout:function(){
        this.slider_list.width(this.opts.width * this.maxPage);
        this.slider_list[0].style.webkitTransform = 'translate3D(0, 0, 0)';
    },
    //页码
    page:function(){
        this.slider_page.find("li").removeClass('cur').eq(this.nowPage).addClass('cur');
    },
    //绑定数据
    bindEvent:function(){
        var _this = this;

        this.slider_con.on("swipeLeft",function(e){
            _this.slider_list[0].style.webkitTransitionDuration = '400ms';
            if(_this.nowPage >= _this.maxPage - 1){
                return false;
            }
            _this.nowPage++;

            _this.slider_list[0].style.webkitTransform = 'translate3d(' + (-_this.nowPage * _this.opts.width) + 'px, 0px, 0px)';


            e.preventDefault();
        }).on("swipeRight",function(e){
            _this.slider_list[0].style.webkitTransitionDuration = '400ms';

            if(_this.nowPage <= 0){
                return false;
            }

            _this.nowPage--;

            _this.slider_list[0].style.webkitTransform = 'translate3d(' + (-_this.nowPage * _this.opts.width) + 'px, 0px, 0px)';


            e.preventDefault();
        })


        document.querySelector("body").addEventListener("touchmove", function(e){
            e.preventDefault();
        }, false)


        //滚动完之后的处理
        this.slider_list[0].addEventListener(UTIL.transitionEnd().end, function(e) {
            this.slider_list[0].style.webkitTransitionDuration = '0ms';
            this.page();
        }.bind(this), false);

    }
}

