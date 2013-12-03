基于canvas版的圆形抽奖转盘组件
=========

简介：
> RoundDraw.js兼容CMD模块化，此组件只负责转动的效果，其他的业务逻辑需自己写，只兼容高级浏览器

参数说明：

- id_dom：旋转元素(图片)
- round_count：旋转圈数，可以不写，默认4圈
- prize_arr：圆形转盘上“逆时针”方向的奖品数组
- callback：回调函数


----------



    var lottery=new RoundDraw({
	   "id_dom":"rotate_bg",
	   "round_count":4,
	   "prize_arr":['表情碎片X2','YY月费会员','表情成长值+30','抽奖机会+1','表情碎片X4','YY月票X10','表情成长值+100','YY年会会员','谢谢参与','表情成长值+50','表情碎片X2','iPad mini'],
	   "callback":function(prize){
	       console.log(prize);
	   }
	})


        $("#lotteryBtn").click(function() {
            lottery.set_prize("抽奖机会+1");
        })