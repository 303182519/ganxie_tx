/**
 * 地图轨迹运动抽奖.
 * User: xiejinlong@yy.com
 * Time: (2013-12-06 14:23)
 */
(function() {
    /**
     * Constructs Race objects
     * @class Race
     * @constructor
     * @example
     */
    function Race(){
        this.initialize.apply(this, arguments)
    }
    Race.prototype={
        /**
         * 赛跑初始化函数
         * @param {Object} obj 参数对象
         * @method initialize
         */
        initialize:function(obj){
            //跑动的物体元素
            this.run_obj=$(obj.selector);
            //物体地图坐标
            this.map_locat=obj.map_locat;
            //地图上标识的奖品顺时针(数组)
            this.prize_arr=obj.prize_arr;
            //总的奖品数量
            this.award_count = obj.prize_arr.length;
            //跑动的圈数
            this.round_count=obj.round_count || 4;
            //物体的正常速度
            this.normal_speed=obj.normal_speed || 2;
            //总步数
            this.total_step=0;
            //当前跑动的步数
            this.setp_index = 0;
            //中的奖品名称
            this.prize="";
            //中的奖品索引
            this.prize_index=0;
            //定时器
            this.timer=null;
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
            this.round_index = 0;
            this.setp_index = 0;
            this.normal_speed=2;
            var arr_index=this.find_prize_index(prize);
            if(arr_index!=-1){
                this.prize_index=this.random_index(arr_index)+1;
                this.total_step=this.prize_index+this.round_count*this.award_count;
                this.car_move(0);
            }
        },
        /**
         * 从选择到的奖品数组中，随机抽中一个
         * @param {Array} arr_index 中的奖品数组
         * @return {Number} 得到真正的奖品索引
         * @method random_index
         */
        random_index:function(arr_index){
            var index=Math.floor(Math.random()*arr_index.length);
            return arr_index[index];
        },
        /**
         * 寻找获得奖品在数组中的索引
         * @param {String} prize 奖品名称
         * @return {Array} 得到奖品的数组索引
         * @method find_prize_index
         */
        find_prize_index:function(prize){
            var arr=[];
            for(var i=0; i<this.award_count;i++) if(this.prize_arr[i]==prize) arr.push(i);
            return arr.length ? arr : -1;
        },
        /**
         * 物体每隔一段距离的速度（力的分解）
         * @param {Number} step, 当前步数
         * @return {Object} 得到物体的左，上速度
         * @method car_speed
         */
        car_speed:function(step){
            var obj={};
            //获取物体当前的位置
            var car_left=parseInt(this.run_obj.css("left"));
            var car_top=parseInt(this.run_obj.css("top"));
            //获取物体当目标点的距离
            var dis_left=this.map_locat[step].left-car_left;
            var dis_top=this.map_locat[step].top-car_top;
            var dis_line=Math.sqrt(Math.pow(dis_left,2)+Math.pow(dis_top,2));
            //求出速度
            var speed_l=dis_left/dis_line*this.normal_speed;
            var speed_t=dis_top/dis_line*this.normal_speed;
            obj.left_speed=speed_l > 0 ? Math.ceil(speed_l) : Math.floor(speed_l);
            obj.top_speed=speed_t > 0 ? Math.ceil(speed_t) : Math.floor(speed_t);
            return obj;
        },
        /**
         * 物体移动
         * @param {Number} step, 当前步数
         * @method car_move
         */
        car_move:function(step){
            var _this=this;
            var car=this.car_speed(step);
            //两个开关，判断是否都到达目的地
            var lbtn=false;
            var tbtn=false;
            //seajs.log("当前："+step+"左速度："+car.left_speed+"上速度"+car.top_speed);
            clearInterval(this.timer);
            this.timer=setInterval(function(){
                if(_this.move_locat(step,car,tbtn,lbtn)){
                    //索引切换
                    step++;
                    _this.setp_index++;
                    if(step==_this.award_count){
                        step=0;
                        _this.round_index++;
                    }
                    //速度切换
                    if( _this.setp_index<10){
                        _this.normal_speed++;
                    }else if(_this.setp_index>(_this.total_step-10)){
                        _this.normal_speed--;
                    }
                    clearInterval(_this.timer);
                    //是否要进入下一步
                    if(_this.round_index!=_this.round_count || step!=_this.prize_index){
                        _this.car_move(step);
                    }else{
                        _this.callback(_this.prize);
                    }

                }
            },13)
        },
        /**
         * 移动物体的方法
         * @param {Number} step, 当前步数
         * @param {Object} car, 里面有物体的左速度car.top_speed，上速度car.left_speed
         * @param {Bolearn} tbtn, 上方的开关
         * @param {Bolearn} lbtn, 下方的开关
         * @method car_move
         */
        move_locat:function(step,car,tbtn,lbtn){
            var car_left=parseInt(this.run_obj.css("left")),
                car_top=parseInt(this.run_obj.css("top")),
                cur_left=car_left+car.left_speed,
                cur_top=car_top+car.top_speed;
            if(Math.abs(this.map_locat[step].top-car_top)<=Math.abs(car.top_speed)){
                tbtn=true;
                this.run_obj.css({"top":this.map_locat[step].top})
            }else{
                this.run_obj.css({"top":cur_top})
            }
            if(Math.abs(this.map_locat[step].left-car_left)<=Math.abs(car.left_speed)){
                lbtn=true;
                this.run_obj.css({"left":this.map_locat[step].left})
            }else{
                this.run_obj.css({"left":cur_left})
            }
            if(lbtn && tbtn){
               return true;
            }
        }
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Race;
    } else if (typeof define === 'function' && define.cmd) {
        define(function(){return Race;});
    } else {
        (function(){ return this || (0,eval)('this'); }()).Race = Race;
    }
}());