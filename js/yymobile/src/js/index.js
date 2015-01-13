//调试工具
__inline('./common/debug.min.js');

//zepto
__inline('./common/zepto.1.1.3.js');

//util
__inline('./common/util.js');

//scroller
__inline('./common/scroller.js');

//文件预加载器
__inline('./common/loader.js');

$(function(){
	var imgList = ["http://img.hb.aicdn.com/4301d8d16ea0e669d7610b3d042ed151079384f51cc71-l1XyS4_fw658", "http://img.hb.aicdn.com/2811b8548ab70a6009a020f134d7b0e6b487890d29a88-RZLlxG_fw658", "http://img.hb.aicdn.com/a7618589e591d074f1594690152b67086e60f3db1f037-WeGd08_fw658", "http://img.hb.aicdn.com/e70c2bd2db9fb9fc93e5c20d8d9044812758f36612f75-haSgSF_fw658", "http://img.hb.aicdn.com/d2a0bfc35c50175c52d285b2618aca3f9ad4143c44047-aCwUDv_fw658"];
	
	//border颜色，背景样式
	var ld = new loadermsk(imgList, "#000000", "",function() {
	   
		var wrapper_scroll = new Scroller('#wp', {
            Scontainer: '.screen-all',
            hScroll: false,
            vScroll: true,
            bounce: false,
            //手势滑动之前
            scrollBefore: function(ev) {
                //console.log($(window).height());
            },
            //手势滑动过程
            onScroll: function(obj) {
                console.log(obj);
            },
            //手势滑动之后
            onTouchEnd: function(obj) {},
            //板块滑动结束
            scrollEnd: function(index) {
                console.log(index);

                var $screen = $("#screen-all").find(".screen");
                var node = $screen.filter("[id='screen" + index + "']");
                for (var i = 0; i < $screen.length; i++) {
                    var $sc = $($screen[i]);
                    $sc.find(".main").addClass("hide");
                };
                node.find(".main").removeClass("hide");
                
            }
        });


	});
})
