/**
 * 我的javascript应用程序
 *
 * @module MYAPP
 */
var MYAPP={};

/**
 * 一个数字的工具
 * @namespace MYAPP
 * @class math_stuff
 */
MYAPP.math_stuff={
   /**
    * 两个数相加
    *
    * @method sum
    * @param {Number} a 是第一个数
    * @param {Number} b 是第二个数
    * @return {Number} 两个输入的总和
    */
   sum:function(a, b){
        return a + b;
   }
}

/**
 * Constructs Person objects
 * @class Person
 * @constructor
 * @namespace MYAPP
 * @param {String} first 是名字
 * @param {String} last 是姓氏
 */
MYAPP.Person=function(first , last){
    /**
     * 人的姓名
     * @property first_name     
     * @type String
     */
    this.first_name=first;
}

/**
 * 方法描述
 *
 * @method getName
 * @return {String} 人的姓名
 */
MYAPP.Person.prototype.getName = function(){
    return this.first_name
}



try{
    throw{
        name:"ddd",
        message:"ddd",
        remedy:genericErrorHandler //这定应该处理该错误的函数
    }
}catch(e){
    alert(e.message);
    e.remedy();
}





Curry化：使函数理解并处理部分应用的过程

function add(x,y){
    var oldx=x,oldy=y;
    if(typeof oldy==="undefined"){
        return function(newy){
            return oldx+newy
        }
    }

    //完全应用
    return x+y
}

var ss=add(2);

console.log(ss(3));


function add(x,y){
    if(typeof y === "undefined"){
        return function(y){
            return x+y;
        }
    }
    //完全应用
    return x+y   
}

//通用curry
function schonfinkelize(fn){
    var slice=Array.prototype.slice,
        stored_args=slice.call(arguments,1);
    return function(){
        var new_args=slice.call(arguments),
            args=stored_args.concat(new_args);
        return  fn.apply(null,args);     
    }
}

function add(x,y){
    return x+y;
}

schonfinkelize(add,6)(7)


//命名空间
var MYAPP= MYAPP || {};

MYAPP.namespace=function(ns_string){
    var parts=ns_string.split("."),
        parent=MYAPP,
        i;
    //剥离最前面的全局变量    
    if(parts[0]==='MYAPP'){
        parts=parts.slice(1);
    }

    for(var i=0; i<parts.length;i++){
        if(typeof parent[parts[i]] ==='undefined'){
            parent[parts[i]]={};        
        }
        parent=parent[parts[i]]
    }
    return parent;  
}


//常量设置
var constant=(function(){
    var constants={},
        ownProp=Object.prototype.hasOwnProperty,
        allowed={
            "string":1,
            "number":1,
            "boolean":1
        },
        prefix=(Math.random()+"_").slice(2);
    return {
        set:function(name,value){
            if(this.isDefinded(name)){
                return false;
            }
            if(!ownProp.call(allowed,typeof value)){
                return false;
            }
            constants[prefix+name]=value;
            return true;
        },
        isDefinded:function(name){
            return ownProp.call(constants,prefix+name)
        },
        get:function(name){
            if(this.isDefinded(name)){
                return constants[prefix+name];
            }
            return null
        }
    }    
})();

//装饰者模式:可以运行时，动态添加附加功能到对象中
var sale=new Sale(100);
sale=sale.decorate('fedtx');
sale.price();


function Sale(price){
    this.price=price || 100;
}
Sale.prototype.getPrice=function(){
    return this.price;
}


Sale.decorates={};

Sale.decorates.fedtx={
    var price=this.uber.getPrice();
    price=price+100;
    return price 
}


Scale.prototype.decorate=function(decorate){
   var F=function(){},
       newObj,
       overrides=this.constructor.decorates[decorate];

       F.prototype=this
       newObj=new F();
       newObj.uber=this;

       for(var p in overrides){
            if(overrides.hasOwnProperty(p)){
               newObj[p]=overrides[p] 
            }
       }

   return newObj;      
}

//或者
function Sale(price){
    this.price=price || 100;
    this.decorates_list=[];
}

Sale.prototype.decorate=function(decorate){
   this.decorates_list.push(decorate); 
}

Sale.prototype.getPrice=function(){
    var price=this.price,
        i,
        max=this.decorates_list.length,
        name;
        for(i=0; i<max;i++){
            name=this.decorates_list[i];
            price=Sale.decorates[name].getPrice(price);
        }
        return price;
}


//策略模式：运行时选择算法
var data={
    first_name:"dddd",
    age:"man"
}

validator.validata(data);
if(validator.hasErrors()){
    console.log(validator.messgae.join(" "));
}

validator.types.isNumber={
    validata:function(value){
        return !isNaN(value)
    },
    instructions:"请输入有效的数字"
}

validator.config={
   first_name:"dddd",
   age:"isNumber" 
}

var validator={
    types={},

    messgae=[],

    config:{},

    validata:function(data){
        
    }

}