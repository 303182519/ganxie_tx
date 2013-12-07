地图轨迹运动抽奖组件
=========

> 简介：依赖JQ库，兼容CMD模块化，此组件只负责跑动的效果，其他的业务逻辑需自己写

参数说明：

- selector：JQ选择元素
- round_count：跑道圈数，可以不写，默认为4
- normal_speed：起始速度 ，可以不写，默认为2
- map_locat：地图数组坐标
- prize_arr：奖品数组（顺时针）
- callback：回调函数


----------



    //创建汽车跑道轨迹
    var car_race=new Race({
        "selector":".b_car",
        "round_count":4,
        "normal_speed":2,
        "map_locat":[
            {"left":426,"top":356},
            {"left":339,"top":346},
            {"left":246,"top":321},
            {"left":134,"top":333},
            {"left":30,"top":333},
            {"left":92,"top":280},
            {"left":138,"top":239},
            {"left":190,"top":189},
            {"left":315,"top":189},
            {"left":446,"top":189},
            {"left":418,"top":236},
            {"left":456,"top":277}
        ],
        "prize_arr":["金熊卡x1","24YY积分","3YY积分","8YY积分","3YY积分","8YY积分","3YY积分","24YY积分","银熊卡x2","8YY积分","3YY积分","3YY积分"],
        "callback":function(prize){
            console.log(prize);
        }
    });

    //启动按钮
    $(".start").on("click",".start_race",function(){
        $(".b_car").animate({"width":115,"height":55,"left":632,top:275},1000,function(){
           $(this).animate({"left":446,"top":298},500,function(){
               //_this.car_race.car_move(0)
               car_race.set_prize("银熊卡x2");
           })
        })
    })