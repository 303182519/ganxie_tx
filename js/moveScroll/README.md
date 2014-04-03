模拟滚动条
=========

> 简介：依赖JQ库，mousewheel.js。兼容CMD模块化，提供以下方法：

参数说明：

- waterfall：固定的容器
- waterfall_list：自适应的高度容器
- scroll_bar：固定的滚动区域
- scroll_move_minH：滚动条柄的高度 ，默认20
- nextPage：下页的数据




----------

    	var moveScroll=new MoveScroll({
            "waterfall":$(".waterfall"),
            "waterfall_list":$(".waterfall_list"),
            "scroll_bar":$(".scroll_bar"),
            //不写也可以，默认20
            "scroll_move_minH":20,

            "nextPage":function(setFn,callback){
                setFn();
                ajax({},function(){

                    callback()
                })
            }
        });
        
        //重置
        moveScroll.setRealHeight(true);

    
   