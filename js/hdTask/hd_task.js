/**
 * 活动任务模块
 * User: xiejinlong@yy.com
 */
(function() {

    // Helpers
    // ------------

    /**
     * 内部ajax jsonp方法
     * @param  {String}   url       请求的地址
     * @param  {Object}   datas     josn数据
     * @param  {Function} callback  回调
     */
    function geturl(url,datas,callback){
        $.ajax({
            type : 'POST',
            dataType : "jsonp",
            jsonp:"callback",
            data: datas || "",
            url  : url,
            async : false,
            cache : false,
            success : function(data){
                callback && callback(data);
            },
            error:function(){
                alert("请求资源失败");
            }
        });
    }

    /**
     * 对任务系统返回的数据处理函数
     */
    var dataProcess={
        /**
         * 生成游戏id、服务器id的数组对象
         * @param  {Array} entrys 服务器返回来的数组对象
         * @return {Array}        返回生成游戏id、服务器id的数组对象
         */
        create_gs:function(entrys){
            var gs_cache=[];
            for(var i=0, entrys_len=entrys.length; i<entrys_len; i++){
                var obj={};
                obj.gameId=entrys[i]['gameId'];
                obj.serverId=entrys[i]['serverId'];
                gs_cache.push(obj);
            }
            return gs_cache;

        },
         /**
         * 生成游戏id、服务器id、游戏名字的数组对象
         * @param {Array} entrys  任务参数
         * @return {Array}  返回游戏id、服务器id、游戏名字的数组对象 
         */
        createGSN:function(entrys){
            var dataGS=this.create_gs(entrys);

            for (var i=0,entrys_len=entrys.length; i<entrys_len; i++){
                dataGS[i].game=entrys[i]['game'];
            }
            
            return dataGS;
        },
        /**
         * 一个游戏一个任务完成
         * @param  {Array} dataGSN 数组对象
         * @param  {Array} entrys  任务参数
         * @return {Array}         集gameId、serverId、gameName的数组对象
         */
        oneToOne:function(dataGSN,entrys){
            for(var i=0, dataGSN_len=dataGSN.length; i<dataGSN_len; i++){
                dataGSN[i]['serverId']=entrys[i]['tasks'][0]['joinGs'][0]['serverId'];
            }
            return dataGSN;
        },
        /**
         * 一个游戏多个任务完成
         * @param  {Array} dataGSN 数组对象
         * @param  {Array} first_task_joinGs  第一个任务参加的数组对象
         * @return {Array}         集gameId、serverId、gameName的数组对象
         */
        oneToMore:function(dataGSN,first_task_joinGs){
            for(var i=0, dataGSN_len=dataGSN.length; i<dataGSN_len; i++){
                dataGSN[i]['serverId']=first_task_joinGs[i]['serverId'];
            }
            return dataGSN;
        },
        /**
         * 格式化返回来的数据，生成合适的游戏列表数据
         * @param {Array} entrys  任务参数
         * @return {Array} 得到游戏的数组对象
         */
        formatGame:function(entrys){
            var dataGSN=this.createGSN(entrys),
                first_task=entrys[0]['tasks'][0];          
                
            //获得之前参加的任务joinGs
            if(first_task['taskStatus']!=0){
                if(first_task['joinGs'].length>1){
                    //一个游戏多个任务完成
                    dataGSN=this.oneToMore(dataGSN,first_task['joinGs']);
                }else if(first_task['joinGs'].length==1){
                    //一个游戏一个任务完成
                    dataGSN=this.oneToOne(dataGSN,entrys);
                }
            }
            
            return dataGSN;
        },
        /**
         * 格式化返回来的数据，生成合适的tasksId数组
         * @param {Array} dataObj  ajax返回的对象
         * @return {Array} 得到tasksId的数组
         */
        formatTasksId:function(entrys){
            var tasksArr=[],
                first_task=entrys[0]['tasks'];

            if(first_task.length>1){
                for(var i=0,first_task_len=first_task.length; i<first_task_len; i++){
                   tasksArr.push(first_task[i]['id']);  
                }
            }else if(first_task.length==1){
                for(var i=0, entrys_len=entrys.length; i<entrys_len; i++){
                    tasksArr.push(entrys[i]['tasks'][0]['id']);
                }
            }    
            
            return tasksArr;
        }
    }


    /**
     * 任务系统SDK
     * @param  {Number}   id     任务id
     * @module HdTask
     */

    function HdTask(id){
       if(id){
          this.actId=id;
       }else{
          alert("活动ID一定要设置");  
       } 
    }

    HdTask.prototype={
        version:"1.0.0",
        constructor:HdTask,
        //活动地址接口
        taskUrl:"http://task.game.duowan.com/",
        //处理json的地址
        jqueryJson:"http://sz.duowan.com/s/huodong/HDmodule/jqueryJson/jqueryJson.js",
        //轮询次数
        poll:1,
        /**
         * 任务初始化（活动配置）
         * @param  {Function} callback 回调
         */
        taskInit:function(callback){
            var _this=this;
            geturl(this.taskUrl+"act/commonConf.do",{"actId":this.actId},function(data){
                var datas=data.data;
                if(data['status']==200 && datas.entrys.length){

                    _this.taskInitCb(datas.entrys,callback);

                }else{
                    alert("任务初始化失败"+data.message);
                }
            })
        },
        /**
         * 任务初始化回调
         * @param  {Array}   entrys     返回来的数组对象
         * @param  {Function} callback      外面的回调
         */
        taskInitCb:function(entrys,callback){
            callback = callback || function () {};

            var gameArr=dataProcess.formatGame(entrys);
            var tasksArr=dataProcess.formatTasksId(entrys);

            //克隆一个出来，内部用的，防止外面的更改，影响到内部
            this.gameArr=$.map(gameArr,function(n){ return n});          

            callback(gameArr,tasksArr);

            //批量参加任务
            this.BatchToTask(entrys);
        },
        /**
         * 我的积分（按钮的状态--马上领取、可领取，已领取）
         * 返回的数据对象格式
         * {
                "pt_2":{ // 积分类型
                    "totalPoint":1, // 总积分数
                    "usedPoint":1 // 已用积分数
                },
                "pt_1":{
                    "totalPoint":1,
                    "usedPoint":1
                }
            }
         * @param  {Function} callback 回调
         */
        pointInfo:function(callback){
            geturl(this.taskUrl+"play/pointInfo.do",{"actId":this.actId},function(data){
                var datas=data.data;
                if(data['status']==200){
                    callback(datas);
                }else{
                    alert("拉取我的积分数据失败"+data.message);
                }
            })
        },
        /**
         * 查询任务状态,未领取，未完成或已完成。
         * 返回的数据格式   0 未领取任务  1 任务进行中  100任务已完成
         * [{
                "taskId":22,
                "status":0,
                "beginTime":null
            }]
         * @param {Array} dataArr   任务ID数组
         * @param  {Function} callback 回调
         */
        taskStatus:function(dataArr,callback){
            geturl(this.taskUrl+"task/taskStatus.do",{"taskIds":dataArr.join(",")},function(data){
                var datas=data.data;
                if(data['status']==200){
                    callback(datas);
                }else{
                    alert("拉取任务状态数据失败"+data.message);
                }
            })
        },
        /**
         * 抽奖动态
         * [{
                "passport":"d1***64",
                "awardType":0,
                "awardName":"3天年费会员"
            }]    
         * @param  {Function} callback 回调
         */
        dynamics:function(callback){
            geturl(this.taskUrl+"play/dynamics.do",{"actId":this.actId},function(data){
                var datas=data.data;
                if(data['status']==200){
                    callback(datas);
                }else{
                    alert("拉取抽奖动态数据失败"+data.message);
                }
            })
        },
        /**
         * 我的包裹   
         * @param  {Function} callback 回调
         */
        myPackage:function(callback){
            geturl(this.taskUrl+"play/myPackage.do",{"actId":this.actId},function(data){
                var datas=data.data;
                if(data['status']==200){
                    callback(datas);
                }else{
                    alert("拉取我的包裹数据失败"+data.message);
                }
            })
        },
        /**
         * 抽奖
         * @param {String} pointType  使用的积分类型(默认使用pt_0）
         * @param {Function} callback 回调
         */
        lottery:function(pointType,callback){
           var _this=this; 
           geturl(this.taskUrl+"play/lottery2.do",{"actId":this.actId,"pointType":pointType},function(data){
                var datas=data.data;
                if(data['status']==200){
                    if(datas.length==1){
                        _this.lotteryCb(datas[0],callback);
                    }else{
                       callback("other",datas);
                    }                
                }else{
                    alert("抽奖出错"+data.message);
                }
            }) 
        },
        /**
         * 抽奖回调
         * @param  {Object} dataObj 抽奖返回来的对象
         * {
                "orderId":1,                订单号
                "awardType":2,              奖品类型(1：为激活码、12：可变参数-游戏礼包)-
                "awardId":3,                奖品ID
                "awardName":"测试Y币3",
                "needVerify":null           是否需要验证后领取，可能配置：sms(UDB短信验证）
            }
            @param {Function} callback 回调 （code，hold，other）
         */
        lotteryCb:function(dataObj,callback){
            switch(dataObj['awardType']){
                case 1:
                    //为激活码礼包
                    this.codeGrant(dataObj['orderId'],function(prizeStyle,dispenseResult){
                       callback(prizeStyle,dataObj,dispenseResult); 
                    });                
                    break;
                case 12:
                    //可变参数礼包
                    this.holdAwardConf(dataObj,function(prizeStyle,dataArr){
                        callback(prizeStyle,dataObj,dataArr);
                    })
                    break;
                default:
                    //其他类型礼包
                    callback("other",dataObj);                     
            }
        },
        /**
         * 获取可变奖品配置
         * @param  {Object}   dataObj  抽奖返回来的对象
         * @param  {Function} callback 回调
         */
        holdAwardConf:function(dataObj,callback){
            geturl(this.taskUrl+"play/holdAwardConf.do",{"actId":this.actId,"awardId":dataObj['awardId']},function(data){
                var datas=data.data;
                if(data['status']==200){
                    callback("hold",datas);            
                }else{
                    alert("拉取可变奖品配置数据失败"+data.message);
                }
            }) 
        },
        /**
         * 设定可变奖品信息
         * @param  {Sting}   orderId    中奖产生的订单号
         * @param  {String}   holdConfId 可变奖品配置的id
         * @param  {Function} callback   回调
         */
        fillHoldAwardConf:function(orderId,holdConfId,callback){
            var _this=this;
            geturl(this.taskUrl+"play/fillHoldAwardConf.do",{"orderId":orderId,"holdConfId":holdConfId},function(data){
                var datas=data.data;
                if(data['status']==200){
                    callback(function(dataObj,callback){
                        //为激活码礼包
                        _this.codeGrant(dataObj['orderId'],function(prizeStyle,dispenseResult){
                           callback(prizeStyle,dataObj,dispenseResult); 
                        }); 
                    });            
                }else{
                    alert("设定可变奖品信息失败"+data.message);
                }
            }) 
        },
        /**
         * 筛选出可变奖品配置显示
         * @param  {Array} dataArr 可变奖品数组对象
         * @return {Array}         根据目前玩的游戏进行筛选的结果数组
         */
        selHoldAwardConf:function(dataArr){
            var selPrize=[];            
            for(var i=0; i<this.gameArr.length; i++){
                for(var j=0; j<dataArr.length; j++){
                    if(dataArr[j]['showAward']==this.gameArr[i]['game']){
                        selPrize.push(dataArr[j]);
                    }
                }
            }
            return selPrize;
        },
        /**
         * 激活码发放    
         * @param {String} orderId  抽奖产生的订单ID
         * @param {Function} callback 回调
         */
        codeGrant:function(orderId,callback){
            this.poll=1;
            this.poll_page(orderId,callback);    
        },
        /**
         * 由于服务器延时，每2秒请求一次，请求5次不成功，就联系客服
         * @param {String} orderId  抽奖产生的订单ID
         * @param {Function} callback 回调
         */
        poll_page:function(orderId,callback){
            var _this=this;
            setTimeout(function(){
                _this.lookCode(orderId,callback);
            },2000)
        },
        /**
         * 通过我的包裹查找激活码
         * @param orderId  {string} 中奖产生的订单号(查询激活码)
         * @param {Function} callback 回调
         */
        lookCode:function(orderId,callback){
            var _this=this;
            commonJs.geturl(commonJs.taskUrl+"play/myPackage.do",{"actId":commonJs.actId,"orderId":orderId},function(data){
                if(data['status']==200){

                   _this.lookCodeCb(data.data[0],orderId,callback); 
                }else{
                    alert("通过我的包裹查找激活码失败"+data.message);

                }
            })
        },
        /**
         * 查询激活码回调
         * @param  {Object}   dataObj        包裹回调数据对象
         * @param  {Number}   orderId        订单号
         * @param  {Function} callback       回调函数
         */
        lookCodeCb:function(dataObj,orderId,callback){
            if(dataObj.dispenseResult){
                callback("code",dataObj.dispenseResult);
            }else{
                this.poll++;
                if(this.poll<=5){
                    this.poll_page(orderId,callback);
                }else{
                    alert("激活码发放失败，请联系客服!");
                }
            }
        },
        /**
         * 批量参加任务
         * @param {Array} entrys    任务参数数组对象
         */
        BatchToTask:function(entrys){
            var first_task=entrys[0]['tasks'];

            if(first_task.length==1){
                //一个游戏一个任务完成
                this.batchSubmitTask(entrys);
            }else if(first_task.length>1){
                //一个游戏多个任务完成
                this.join4MulEntry(entrys);
            }
        },
        /**
         * 批量参加任务（一个游戏一个任务完成，task_single）
         * @param {array} entrys 任务参数
         */
        batchSubmitTask:function(entrys){
            var task_str="",
                _this=this,
                dataGS=dataProcess.create_gs(entrys);   
                           
            //添加活动ID    
            for(var i= 0, entrys_len=entrys.length; i<entrys_len; i++ ){
                dataGS[i].taskId=entrys[i]['tasks'][0]['id']
            }

            seajs.use(this.jqueryJson,function(){
                task_str=$.toJSON(dataGS);
                geturl(_this.taskUrl+"task/batchSubmitTask.do",{"actId":_this.actId,"taskParam":task_str},function(){
                })
            })
        },
        /**
         * 批量参加任务（一个游戏多个任务完成,task_more）
         * @param {array} entrys 任务参数
         */
        join4MulEntry:function(entrys){
            var task_arr=entrys[0]['tasks'],
                dataGS=dataProcess.create_gs(entrys),
                _this=this;

            seajs.use(this.jqueryJson,function(){
                var task_str=$.toJSON(dataGS);
                for(var i=0; i<task_arr.length; i++){
                    if(task_arr[i]['taskStatus']==0){
                        geturl(_this.taskUrl+"task/join4MulEntry.do",{"actId":_this.actId,"gs":task_str,"taskId":task_arr[i]['id']},function(){
                        })
                    }
                }
            })
        }
    
        
    }

   
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = HdTask;
    } else if (typeof define === 'function' && define.cmd) {
        define(function(){return HdTask;});
    } else {
        (function(){ return this || (0,eval)('this'); }()).HdTask = HdTask;
    }

}());