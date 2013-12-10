/**
 * 抽奖组件（圆形）基于canvas
 * User: xiejinlong@yy.com
 * Time: (2013-12-03 10:19)
 */
(function() {
    var instance;
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
            this.id_dom=document.getElementById(obj.id_dom);
            //旋转的时间
            //this.duration=obj.duration || 3000;
            //旋转圈数
            this.round_count = (obj.round_count || 4)*360;
            //具体有那些奖品
            this.prize_arr=obj.prize_arr;
            //奖品数量
            this.award_count = obj.prize_arr.length;
            //平均多少度
            this.aver_degree=360/this.award_count;
            //元素宽度
            this.dom_width=this.id_dom.offsetWidth;
            //元素高度
            this.dom_height=this.id_dom.offsetHeight;


            //回调函数
            this.callback=obj.callback ||  function(){};
            //生成canvas元素
           this.create_canvas();
        },
        /**
         * 生成canvas元素替换线上的图片
         */
        create_canvas:function(){
            this.oImg=new Image(),
                _this=this;
            this.oImg.onload=function (){
                _this.oImg.onload = null;
                var oC=document.createElement('canvas');
                oC.setAttribute("width",_this.dom_width);
                oC.setAttribute("height",_this.dom_height);
                oC.style.cssText="position:absolute;top:"+_this.id_dom.offsetTop+"px;left:"+_this.id_dom.offsetLeft+"px";
                _this.gd=oC.getContext('2d');
                _this.gd.drawImage(_this.oImg,0,0);
                _this.id_dom.parentNode.replaceChild(oC, _this.id_dom);
            };
            this.oImg.src=this.id_dom.src;
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
         * 转动
         * @param {Number} random_degree 奖品的度数
         * @method rotate
         */
        rotate_fn:function(random_degree){
            var _this=this,
                iCur= 0,
                speed= 0,
                total_deg=this.round_count+random_degree;
            var timer=setInterval(function(){
                //当前的度数
                iCur+= speed;
                //速度
                speed=(total_deg-iCur)/10;
                speed=speed>0? Math.ceil(speed) : Math.floor(speed);

                _this.gd.clearRect(0, 0, _this.dom_width, _this.dom_height);
                _this.gd.save();
                _this.gd.translate(_this.dom_width/2,_this.dom_height/2);
                _this.gd.rotate(iCur*Math.PI/180);
                _this.gd.translate(-_this.dom_width/2,-_this.dom_height/2);
                _this.gd.drawImage(_this.oImg,0,0);
                _this.gd.restore();
                if(total_deg==iCur){
                    _this.callback(_this.prize);
                    clearInterval(timer);
                }

            },30)

        }
    }

    //主要是用于惰性实例化
    function RoundLottery(obj){
        if(!instance){
            instance=new RoundDraw(obj);
        }
        return instance
    }


    if (typeof module !== 'undefined' && module.exports) {
        module.exports = RoundLottery;
    } else if (typeof define === 'function' && define.cmd) {
        define(function(){return RoundLottery;});
    } else {
        (function(){ return this || (0,eval)('this'); }()).RoundLottery = RoundLottery;
    }

}());

