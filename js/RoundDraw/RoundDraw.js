/**
 * 抽奖组件（圆形）
 * User: xiejinlong@yy.com
 * Time: (2013-12-03 10:19)
 */
(function() {
    /**
     * Constructs RoundDraw objects
     * @class RoundDraw
     * @constructor
     * @example

     */
    function RoundDraw(){
        this.initialize.apply(this, arguments)
    }

    RoundDraw.prototype={
        /**
         * 抽奖组件初始化函数
         * @method initialize
         * @param {Object} obj 参数
         */
        initialize:function(obj){
            //旋转的元素
            this.selector=obj.selector;
            //旋转的时间
            this.duration=obj.duration || 3000;
            //旋转圈数
            this.round_count = (obj.round_count || 4)*360;
            //具体有那些奖品
            this.prize_arr=obj.prize_arr;
            //奖品数量
            this.award_count = obj.prize_arr.length;
            //平均多少度
            this.aver_degree=360/this.award_count;
            //回调函数
            this.callback=obj.callback ||  function(){};
        },
        /**
         * 设置奖品
         * @param {String} prize 奖品名称
         * @method set_prize
         */
        set_prize:function(prize){
            this.prize=prize;
            var prize_index=this.find_prize_index(prize);
            prize_index!=-1 && this.degree_fn(++prize_index);
        },
        /**
         * 获取奖品在那个度数
         * @param {Number} prize_index 奖品的索引
         * @method degree_fn
         */
        degree_fn:function(prize_index){
             var end=prize_index*this.aver_degree,
                 start=end-this.aver_degree+5,
                 middle=end - start-10,
                 random_degree=start+Math.ceil(Math.random()*middle);

             this.rotate_fn(random_degree);
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
         * @param {Number} random_degree 奖品的度数
         * @method rotate
         */
        rotate_fn:function(random_degree){
            var _this=this;

            $(this.selector).rotate({
                duration:3000,
                angle: 0,
                animateTo:this.round_count+random_degree,
                callback: function(){
                   _this.callback(_this.prize);
                }
            });
        }
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = RoundDraw;
    } else if (typeof define === 'function' && define.cmd) {
        define(function(){return RoundDraw;});
    } else {
        (function(){ return this || (0,eval)('this'); }()).RoundDraw = RoundDraw;
    }

}());

