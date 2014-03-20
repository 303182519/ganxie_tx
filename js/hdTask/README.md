活动任务模块SDK
=========

> 简介：依赖JQ库，seajs。兼容CMD模块化，提供以下方法：

- taskInit：任务初始化
- pointInfo：我的积分
- myPackage：我的包裹
- lottery：抽奖
- dynamics：抽奖动态
- canExchange：可兑换的奖品
- exchange：兑换奖品
- finishTask：完成任务




----------

    test={
		init:function(){
			var _this=this;
			//生成一个活动对象
			var hdObject=new HdTask(32280);

			//任务初始化
			hdObject.taskInit(function(gameArr,tasksArr){

				//生成游戏
				_this.create_game(gameArr);

				//任务状态
				hdObject.taskStatus(tasksArr,function(dataArr){
					_this.taskStatus(dataArr);
				})	
			});

			//我的积分
			hdObject.pointInfo(function(dataObj){
				_this.btn_statue(dataObj);
			})

			//我的包裹
			hdObject.myPackage(function(dataArr){
				console.log(dataArr);
			})


			//抽奖
			hdObject.lottery("pt_0",function(prizeStyle,dataObj,orther){
				console.log("中奖信息");
				
				switch(prizeStyle){
	                case "code":
	                    //dataObj为激活码礼包信息
	                    console.log("激活码:"+orther);        
	                    break;
	                case "hold":
	                    //dataObj为可变参数礼包信息
	                    console.log("可变参数礼包:");                  
	                    //这里要根据业务是否对orther进行过滤(根据返回来的中奖名字)，比如游戏礼包经常需要过滤，game秀的话就不用
	                    //var orther=hdObject.selHoldAwardConf(orther);
	                    /*hdObject.fillHoldAwardConf(dataObj['orderId'],orther[0]['id'],function(callback){
	                    	//此处的callback是用来取激活码的。根据业务需要是否要调用
	                    	callback(dataObj,function(prizeStyle,dataObj,orther){

	                    	});
	                    })*/
	                    console.log(orther);



	                    break;
	                default:
	                    //dataObj为其他礼包信息
	                    console.log("其他礼包信息:");                    
	            }

				console.log(dataObj); 
	            
			})

			//抽奖动态
			/*hdObject.dynamics(function(dataArr){
				_this.dynamics(dataArr);
			})*/
		},
		/**
		 * 抽奖动态
		 * @param  {Array} dataArr 任务ID数组
		 */
		dynamics:function(dataArr){
			console.log("抽奖动态");
			console.log(dataArr);
		},
		/**
		 * 任务状态
		 * @param  {Array} dataArr 任务ID数组
		 */
		taskStatus:function(dataArr){
			console.log("任务状态");
			console.log(dataArr);
		},
		/**
         * 生成游戏
         * @param {Array} gameArr  ajax返回的数组对象
         * @method create_game
         */
        create_game:function(gameArr){
        	console.log("游戏数组");
            console.log(gameArr)
        },
        /**
         * 按钮状态
         * @param {Object} dataObj  ajax返回的对象
         */
        btn_statue:function(dataObj){
        	console.log("我的积分");
        	console.log(dataObj);
        	for(var i=1; i<=6; i++){
                var current=dataObj['pt_'+i];
                if(current!=null){
                    if(current['totalPoint']>0 && current['totalPoint']<=current['usedPoint']){
                    	console.log("第"+i+"个按钮的状态：已领取");                        
                    }else if(current['totalPoint']>0 && current['totalPoint']>current['usedPoint']){
                    	console.log("第"+i+"个按钮的状态：可领取");
                    }
                }
            }
        }
	}

	test.init();
    
   