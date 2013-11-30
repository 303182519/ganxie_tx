/**
 * 抽奖组件（正方形）
 * User: xiejinlong@yy.com
 */
(function() {
    "use strict";
    /**
     * Constructs squareDraw objects
     * @class squareDraw
     * @constructor
     * @example
     * var lottery=new squareDraw({
     *     "id_dom":"lottery_gift",
     *     "prize_arr":['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t'],
     *     "round_count":2,
     *     "normal_speed":400,
     *     "up_speed":100,
     *     "start_point":6,
     *     "end_point":38,
     *     "show_result":function(prize_name){
     *          console.log("恭喜你中了"+prize_name);
     *   }
     * })
     */
    function squareDraw(){
        this.initialize.apply(this, arguments)
    }

    squareDraw.prototype={
        /**
         * 抽奖组件初始化函数
         * @method initialize
         * @param {Object} obj 参数
         */
        initialize:function(obj){
            //整个转盘的ID节点
            this.id_dom=this.byId(obj.id_dom);
            //随机的点的class的名字
            this.suiji=this.byClass("suiji",this.id_dom)[0];
            //具体有那些奖品
            this.prize_arr=obj.prize_arr;
            //奖品数量
            this.award_count = obj.prize_arr.length;
            //旋转圈数
            this.round_count = obj.round_count || 2;
            //默认旋转速度
            this.normal_speed = obj.normal_speed || 400;
            //中途加速
            this.up_speed = obj.up_speed || 100;
            //起始点
            this.start_point=obj.start_point || 6;
            //结束点
            this.end_point=obj.end_point || 20,
            //展示结果的方法
            this.show_result=obj.show_result || function(){};

            //定时器_执行连接
            this.timer_link=null;

        },
        /**
         * 设置奖品
         * @param {String} prize 奖品名称
         * @method set_prize
         */
        set_prize:function(prize){
            this.award_index = 1;
            this.round_index = 0;
            this.prize=prize;
            this.suiji.style.display="block";
            var prize_index=this.find_prize_index(prize);
            prize_index!=-1 && this.run_fn(++prize_index);

        },
        /**
         * 寻找获得奖品在数组中的索引
         * @param {String} prize 奖品名称
         * @return {Number} 得到奖品的索引
         * @method find_prize_index
         */
        find_prize_index:function(prize){
            for(var i=0; i<this.award_count;i++) if(this.prize_arr[i]==prize) return i;
            return -1;
        },
        /**
         * 转动
         * @param {Number} prize_index 奖品索引
         * @method run_fn
         */
        run_fn:function(prize_index){
            this.suiji.className="suiji suiji_"+this.award_index;
            //达到旋转圈数，且当前指针是用户奖励时停止
            if(this.round_index >= this.round_count && this.award_index == prize_index){
                this.show_result(this.prize);
                return false;
            }
            //调整速度
            var k = parseInt(this.award_index+(this.round_index*this.award_count));
            var speed = (k < this.start_point || k > this.end_point) ? this.normal_speed : this.up_speed;

            //索引切换
            if(this.award_index < this.award_count){
                this.award_index++;
            }else{
                this.award_index = 1;
                this.round_index++;
            }

            //定时执行
            var _this = this;
            this.timer_link = setTimeout(function(){_this.run_fn(prize_index);}, speed);
        },
        /**
         * 选择ID
         * @method byId
         * @param {String,Object} id 元素节点
         * @return {Object} 得到元素节点对象
         */
        byId:function(id){
            return typeof id==="string"? document.getElementById(id):id;
        },
        /**
         * 选择TanName节点
         * @method byTagName
         * @param {String} elem  TanName节点
         * @param {Object} obj  元素节点对象
         * @return {Object} 得到元素节点对象
         */
        byTagName:function(elem,obj){
            return (obj || document).getElementsByTagName(elem);
        },
        /**
        *  选择class节点
        * @method byClass
        * @param {String} sClass, class的名称
        * @param {Object} oPrent, 父元素class的对象
        * @return {Object} 得到元素节点对象
        */
        byClass:function(sClass,oPrent){
            var aClass=[],
                reClass=new RegExp("(^|\\s)"+sClass+"(\\s|$)"),
                aElem=this.byTagName("*",oPrent),
                len=aElem.length;
            for (var i=0; i<len; i++) reClass.test(aElem[i].className) && aClass.push(aElem[i]);
            return aClass
        }
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = squareDraw;
    } else if (typeof define === 'function' && define.cmd) {
        define(function(){return squareDraw;});
    } else {
        (function(){ return this || (0,eval)('this'); }()).squareDraw = squareDraw;
    }
}());