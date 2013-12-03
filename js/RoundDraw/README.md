圆形抽奖转盘组件
=========

简介：
> 基于JQ库，RoundDraw.js兼容CMD模块化，此组件只负责转动的效果，其他的业务逻辑需自己写，jQueryRotate.2.2.js必须用script标签引用，不然在IE7-8会发生bug

参数说明：

- selector：JQ选择元素(选择图片)
- duration：转动时间，可以不写，默认3秒
- round_count：旋转圈数，可以不写，默认4圈
- prize_arr：圆形转盘上“逆时针”方向的奖品数组
- callback：回调函数


----------



    var lottery=new RoundDraw({
	    "selector":"#rotate_bg",
	        "duration":3000,
	        "round_count":4,
	        "prize_arr":['表情碎片X2','YY月费会员','表情成长值+30','抽奖机会+1','表情碎片X4','YY月票X10','表情成长值+100','YY年会会员','谢谢参与','表情成长值+50','表情碎片X2','iPad mini'],
	        "callback":function(prize){
	
	            _this.resule_pop(prize);
	        }
	    });


        $("#lotteryBtn").click(function() {
            lottery.set_prize("抽奖机会+1");
        })