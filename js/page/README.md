分页组件
=========

> 简介：基于原生js开发，没有依赖JQ库，兼容CMD模块化

参数说明：

- id_dom：元素ID
- total：总页数
- per_page：每页分多少条
- nowpage：当前页数
- callback：回调函数


----------



    new page({
      "id_dom":"pagination",
      "total":10,
      "per_page":1,
      "nowpage":1,
      "callback":function(now){
          console.log('当前页:' + now);
       }
    });