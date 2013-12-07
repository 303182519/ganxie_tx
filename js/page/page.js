/**
 * 分页组件
 * User: xiejinlong@yy.com
 */
(function() {
    "use strict";
    /**
     * Constructs page objects
     * @class page
     * @constructor
     * @example
     * new page({
     *       "id_dom":"pagination",
     *       "total":60,
     *       "per_page":5,
     *       "nowpage":2,
     *       "callback":function(now){
     *               console.log('当前页:' + now);
     *           }
     *   });
     */
    function page(){
        this.initialize.apply(this, arguments)
    }

    page.prototype={
        /**
         * 分页组件初始化函数
         * @method initialize
         * @param {Object} 参数
         */
        initialize:function(obj){
            this.totle=Math.ceil(obj.total/obj.per_page);
            this.nowpage=obj.nowpage;
            this.id_dom=document.getElementById(obj.id_dom);
            this.htmlStr=[];
            this.callback=obj.callback || function(){};
            this.createHtml();
            this.bindEvent();
        },
        /**
         * 创建html
         * @method createHtml
         * @return {boolean}
         */
        createHtml:function(){
             this.htmlStr.length=0;
             if(this.totle<1 || this.nowpage> this.totle ){ return false;}

            //如果当前页数>1的话
            this.nowpage>1 ? this.htmlStr.push('<a href="#" class="prev">上一页</a>') : this.htmlStr.push('<span class="current prev">上一页</span>');

            if(this.totle<=7){
                //如果总页数<=7的话
                this.for_page(1,this.totle);

            }else{
                //如果总页数>8的话
                //如果当前页数<5
                if(this.nowpage<5){
                    this.nowpage<4 ? this.for_page(1,4) : this.for_page(1,5);
                    this.htmlStr.push('<span>...</span>');
                    this.htmlStr.push('<a href="#">'+this.totle+'</a>');
                }else{
                    this.htmlStr.push('<a href="#">1</a>');
                    this.htmlStr.push('<span>...</span>');

                    if(this.totle-this.nowpage>2){

                        this.for_page(this.nowpage-2,this.nowpage+1);

                        this.htmlStr.push('<span>...</span>');
                        this.htmlStr.push('<a href="#">'+this.totle+'</a>');
                    }else{
                        this.for_page(this.nowpage-2,this.totle);
                    }
                }
            }
            //如果当前页数<总页数的话
            this.nowpage<this.totle ? this.htmlStr.push('<a href="#" class="next">下一页</a>') : this.htmlStr.push('<span class="current next">下一页</span>');
            //设置html的值
            this.id_dom.innerHTML=this.htmlStr.join("");
        },
        /**
         * 循环函数
         * @method for_page
         * @param {number} start  开始点
         * @param {number} end  结束点
        */
        for_page:function(start,end){

            for(var i=start; i<=end; i++){
                if(i==this.nowpage){
                    this.htmlStr.push('<span class="current">'+i+'</span>');
                }else{
                    this.htmlStr.push('<a href="#">'+i+'</a>');
                }
            }
        },
        /**
         * 点击事件
         * @method bindEvent
         */
        bindEvent:function(){
            var _this=this;
            this.id_dom.onclick=function(e){
                var e = e || event,
                    oTarget = e.target || e.srcElement;
                if(_this.contains(oTarget, this) && _this.isParent(oTarget, "a")) {
                    if(oTarget.innerHTML=="上一页"){
                        _this.nowpage=_this.nowpage-1;
                    }else if(oTarget.innerHTML=="下一页"){
                        _this.nowpage=_this.nowpage+1;
                    }else {
                        _this.nowpage=parseInt(oTarget.innerHTML);
                    }

                    _this.createHtml();
                    _this.callback(_this.nowpage);
                }
            }

        },
        /**
         * 包含函数
         * @method contains
         * @param element 目标
         * @param oParent 父亲元素
         * @return {boolean}
         */
        contains:function(element,oParent){
            if(oParent.contains) {
                return oParent.contains(element)
            }
            else if(oParent.compareDocumentPosition) {
                return !!(oParent.compareDocumentPosition(element) & 16)
            }
        },
        /**
         * 判断子元素是否在包含的元素
         * @method isParent
         * @param element
         * @param tagName
         * @return {boolean}
         */
        isParent:function(element, tagName) {
            while(element != undefined && element != null && element.tagName.toUpperCase() !== "BODY") {
                if(element.tagName.toUpperCase() == tagName.toUpperCase())
                    return element;
                element = element.parentNode;
            }
            return false
        }

    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = page;
    } else if (typeof define === 'function' && define.cmd) {
        define(function(){return page;});
    } else {
        (function(){ return this || (0,eval)('this'); }()).page = page;
    }
}());
