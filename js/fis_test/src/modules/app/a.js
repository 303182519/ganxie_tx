/*seajs.use("http://new.yy.com/%E4%B8%BB%E6%92%AD%E5%B0%8F%E7%AB%99/build/lib/arale/base.js",function(Base){
	var index=Base.Base.extend({
        *
         * 初始化函数
         * @method initialize
         * 
        initialize:function(){
            seajs.log("页面入口");
        }
    });   
    new index();
});*/


require.async('./c',function(c){
    c();
})

var obj = {
	"a":1,
	"b":2
};
var o;
for(o in obj){
	if(obj.hasOwnProperty(o)){
		console.log(obj[o]);
	}
}
function Test(){
	console.log("111");
}
Test.prototype={
	"a":1
};
new Test();
module.exports=Test;