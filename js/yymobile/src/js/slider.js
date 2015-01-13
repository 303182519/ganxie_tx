//调试工具
__inline('./common/debug.min.js');

//zepto
__inline('./common/zepto.1.1.3.js');

//util
__inline('./common/util.js');

//Slider
__inline('./common/slider.js');






$(function(){
    var a=new Slider("slider",{
        width:320,
        touchmove:function(obj){
        	//console.log(obj);
        }
    });
})
