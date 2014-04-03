/**
 * 模拟滚动条
 * User: xiejinlong@yy.com
 */
(function() {

    /**
     * 模拟滚动条
     * @module MoveScroll
     * @example
        var moveScroll=new MoveScroll({
            "waterfall":$(".waterfall"),
            "waterfall_list":$(".waterfall_list"),
            "scroll_bar":$(".scroll_bar"),
            //不写也可以，默认20
            "scroll_move_minH":20,

            "nextPage":function(setFn,callback){
                setFn();
                ajax({},function(){

                    callback()
                })
            }
        });
        
        //重置
        moveScroll.setRealHeight(true);
     */

    function MoveScroll(){
       this.initialize.apply(this, arguments);
    }

    MoveScroll.prototype={
        version:"1.0.0",
        constructor:MoveScroll,
        /**
         * 滚动条初始化函数
         * @param {Object} obj 参数
         */
        initialize:function(obj){
            this.waterfall=obj.waterfall;
            this.waterfall_list=obj.waterfall_list;
            this.scroll_bar=obj.scroll_bar;
            this.scroll_move=obj.scroll_move;
            //滚动条的最小高度
            this.scroll_move_minH=obj.scroll_move_minH || 20;
            //获取下一页的数据
            this.nextPage=obj.nextPage;

            //页码
            this.scroll_page=1;

            //设置滚动条的高度与位置
            this.setRealHeight();

        },
        /**
         * 重置初始位置
         * @param  {Bollean} flag 是否
         */
        resetToZero:function(flag){
            //重置初始位置
            if(flag==true){
                this.scroll_page=1;
                this.waterfall.scrollTop(0);
                this.scroll_move.css({"top":0});
            }
        },
        /**
         * 滚动条随着页码的增加，移动的距离越小
         * 已10为末尾
         */
        setScrollMove:function(){
            if(10-this.scroll_page<=2){
                this.scrollMove=2;
            }else{
                this.scrollMove=10-this.scroll_page;
            }
        },
        /**
         * 设置滚动条的高度与位置
         */
        setRealHeight:function(flag){

            this.resetToZero(flag);    

            var waterfall_h=this.waterfall.height(),
                waterfall_list_h=this.waterfall_list.height(),
                scrollTop=this.waterfall.scrollTop(),
                //距离顶部比例
                top_scale=scrollTop/waterfall_list_h,
                //高度比例
                height_scale=waterfall_h/waterfall_list_h;

            if(height_scale<1){
                var scroll_move_h=parseInt(height_scale*waterfall_h)<=this.scroll_move_minH ? this.scroll_move_minH : parseInt(height_scale*waterfall_h);

                this.setScrollMove();

                this.scroll_move.height(scroll_move_h);

                this.maxL=this.scroll_bar.height()-this.scroll_move.height();

                this.scroll_bar.show()

                this.scroll_move.css({
                    "top": top_scale* this.maxL
                });
                //手动拖动
                this.moveBar();
                //鼠标滚动
                this.mouseScroll();
            }

        },
        /**
         * 手动拖动
         */
        moveBar:function(){
            var _this=this,
                y,
                cy;
            $(".scroll_move").off("mousedown").on("mousedown",function(e){
                y=e.pageY-parseInt($(this).css("top"));
                $(document).on("mousemove",function(e){
                    cy=e.pageY-y;
                    cy<0 && (cy=0);
                    cy>_this.maxL && (cy=_this.maxL);
                    _this.setPosition(cy);
                })
                $(document).on("mouseup",function(){
                    $(document).off("mousemove").off("mouseup");

                })
                return false;
            })
        },
        /**
         * 鼠标滚动
         */
        mouseScroll:function(){
            var _this=this;
            _this.waterfall.off('mousewheel').on('mousewheel', function(event, delta){
                var scroll_Top=_this.scroll_move.position().top;
                /*
                 **  delta == -1   往下
                 **  delta == 1    往上
                 */
                if(delta < 0){
                    scroll_Top=scroll_Top+_this.scrollMove > _this.maxL? _this.maxL : scroll_Top+_this.scrollMove;
                }else{
                    scroll_Top=scroll_Top-_this.scrollMove<_this.scrollMove ? 0 : scroll_Top-_this.scrollMove;
                }
                _this.setPosition(scroll_Top);
                return false;
            })
        },
        /**
         * 设置位置
         * @param {Number} cy 比例
         */
        setPosition:function(cy){
            var yscale=parseInt(cy/this.maxL*(this.waterfall_list.height()-this.waterfall.height()));
            this.waterfall.scrollTop(yscale);
            this.scroll_move.css({"top":cy});

            this.nextPage && this.getDate(cy);
        },
        getDate:function(cy){
            //如果滚动到数据的末尾就发请求获取下一页的数据
            if(cy==this.maxL && this.inEnd){
                var _this=this;
                this.nextPage(function(){
                    _this.inEnd=false;
                },function(pageNum){
                    _this.inEnd=true;
                    _this.scroll_page=pageNum;
                    _this.setRealHeight();
                })

            }
        }
    }

   
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = MoveScroll;
    } else if (typeof define === 'function' && define.cmd) {
        define(function(){return MoveScroll;});
    } else {
        (function(){ return this || (0,eval)('this'); }()).MoveScroll = MoveScroll;
    }

}());