//
var xjl={
    byId:function(id){
        return typeof id==="string"? document.getElementById(id):id;
    },
    byTagName:function(elem,obj){
        return (obj || document).getElementsByTagName(elem);
    },
    byClass:function(sClass,oPrent){
        var aClass=[],
            reClass=new RegExp("(^|\\s)"+sClass+"(\\s|$)"),
            aElem=this.byTagName("*",oPrent),
            len=aElem.length;
        for (var i=0; i<len; i++) reClass.test(aElem[i].className) && aClass.push(aElem[i]);
        return aClass
    },
    hasClass:function(elem,className){
        return new RegExp("(^|\\s)"+className+"(\\s|$)").test(elem.className);
    },
    addClass:function(elem,className){
        var arr=elem.className.split(/\s+/);
        this.hasClass(elem,className) || arr.push(className);
        elem.className=arr.join(" ").replace(/(^\s*)|(\s*$)/, "");
    },
    removeClass:function(element,className) {
        element.className = element.className.replace(new RegExp("(^|\\s)" + className + "(\\s|$)", "g"), "").split(/\s+/).join(" ");   
    },
    index: function(element) {
        var aChildren = element.parentNode.children, i;
        for(i = 0; i < aChildren.length; i++) if(aChildren[i] === element) return i;
        return -1;
    },
    attr: function(element, attr,value) {
        if( arguments.length ==2 ){
            return element.attributes[attr] ? element.attributes[attr].nodeValue : undefined
        }else if (  arguments.length ==3){
            element.setAttribute(attr,value);
        }
    },
    contains:function(element,oParent){
        if(oParent.contains) {
            return oParent.contains(element)    
        }
        else if(oParent.compareDocumentPosition) {
            return !!(oParent.compareDocumentPosition(element) & 16)
        }
    },
    isParent:function(element, tagName) {
        while(element != undefined && element != null && element.tagName.toUpperCase() !== "BODY") {
            if(element.tagName.toUpperCase() == tagName.toUpperCase())
                return element;
            element = element.parentNode;   
        }
        return false
    },
    //两个参数都是对象
    extend:function(destination,source){
        for (var property in source) destination[property]=source[property];
        return destination
    },
    //深拷贝
    //var Doctor = deepCopy(Chinese);
    deepCopy:function(p,c){
        var c= c || {};
        for(var i in p){
            if(typeof(p[i]) == 'object'){
                c[i] = (p[i].constructor === Array) ? [] : {};
                this.deepCopy(p[i],c[i]);
            }else{
                c[i]=p[i];
            }
        }
        return c;
    },
    /*
        两个参数的时候获取，三个参数为设置
        xjl.css(obj,"width");
        xjl.css(obj,{"top":20,"width":20})
        xjl.css(obj,"top",37);
    */
    css : function (oElement, attr, value){
        if (arguments.length == 2)
        {
            if (typeof arguments[1] === "string")
            {
                return parseFloat(oElement.currentStyle ? oElement.currentStyle[attr] : getComputedStyle(oElement, null)[attr]);    
            }
            else
            {
                for (var property in attr)
                {
                    property == "opacity" ?(oElement.style.filter = "alpha(opacity=" + attr[property] + ")", oElement.style.opacity = attr[property] / 100) :
                    oElement.style[property] = attr[property]
                }
            }

        }
        else if (arguments.length == 3)
        {
            switch (attr)
            {
                case "width":
                case "height":
                case "top":
                case "right":
                case "bottom":
                case "left":
                case "marginTop":
                case "marginRigth":
                case "marginBottom":
                case "marginLeft":
                    oElement.style[attr] = value + "px";
                    break;
                case "opacity" :
                    oElement.style.filter = "alpha(opacity=" + value + ")";
                    oElement.style.opacity = value / 100;
                    break;
                default :
                    oElement.style[attr] = value;
                    break
            }   
        }
    },

    /*
    高级加载事件
    xjl.addHandler(window,"load",test);
    */
    addHandler:function (element, type, handler){
        return element.addEventListener ? element.addEventListener(type, handler, false) : element.attachEvent("on" + type, handler)
    },
    removeHandler : function (oElement, sEventType, fnHandler){
        return oElement.removeEventListener ? oElement.removeEventListener(sEventType, fnHandler, false) : oElement.detachEvent("on" + sEventType, fnHandler)
    },
    /*
    动态加载JS，用法：
    loadScript("jquery/jquery-1.4.1.js", function () {  
        loadScript("js/hello.js", function () {  
            loadScript("js/world.js", function () { 
             });  
        });  
    });
    */
    
   loadScript:function (url, callback) {
        var script = document.createElement('script');
        script.type = 'text/javascript';

        if (callback)
            script.onload = script.onreadystatechange = function() {
                if (script.readyState && script.readyState != 'loaded' && script.readyState != 'complete')
                    return;
                script.onreadystatechange = script.onload = null;
            callback();
        };
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild (script);
   },

   /*
    设置首页
    xjl.setHomepage("http://www.baidu.com/");
   */
   setHomepage:function(url) { // 设置首页
        if (document.all) {
            document.body.style.behavior = 'url(#default#homepage)';
            document.body.setHomePage(url);
        }
        else if (window.sidebar) {
            if (window.netscape) {
                try {
                    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                }
                catch (e) {
                    alert("该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值该为true");
                }
            }
        }
    },
    /*
    三个参数，一个是cookie的名子，一个是值,一个是时间为天数
    xjl.setCookie('username','Darren',30);
    */
    setCookie:function(name,value,expiredays){
        var exp  = new Date();    //new Date("December 31, 9998");
        exp.setDate(exp.getDate() + expiredays);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    },
    /*
    取cookies函数
    */
    getCookie:function(name){
        var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
        if(arr != null) return unescape(arr[2]); return "";
    },
    /*
    删除cookie
    */
    delCookie:function(name){
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval=getCookie(name);
        if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    },
    /*
    去掉字符串空格
    */  
    trim:function(value){ 
        var res=String(value).replace(/^[\s]+|[\s]+$/g, ''); 
        return res; 
    },
    
    //功能描述：当前操作系统名称
    getOSName: function() {
        var str = navigator.userAgent.split(';')[2];
        var os = "未知";
        if (str.indexOf("NT 6.0") > 0) { os = "Windows 2008"; }
        else if (str.indexOf("NT 5.2") > 0) { os = "Windows 2003"; }
        else if (str.indexOf("NT 5.1") > 0) { os = "Windows XP"; }
        else if (str.indexOf("NT 5") > 0) { os = "Windows 2000"; }
        else if (str.indexOf("NT 4") > 0) { os = "Windows NT4"; }
        else if (str.indexOf("Mac") > 0) { os = "Mac"; }
        else if (str.indexOf("Unix") > 0) { os = "UNIX"; }
        else if (str.indexOf("Linux") > 0) { os = "Linux"; }
        else if (str.indexOf("Sun") > 0) { os = "SunOS"; }
        else if (str.indexOf("Me") > 0) { os = "Windows Me"; }
        else if (str.indexOf("98") > 0) { os = "Windows 98"; }
        else if (str.indexOf("95") > 0) { os = "Windows 95"; }
        return os;
    },
    
    //功能描述：当前浏览器简称名
    browserName: function() {
        var browser = '';
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("msie") > -1) { browser = 'IE'; }
        else if (ua.indexOf("gecko") > -1) { browser = 'GECKO'; }
        else if (ua.indexOf("opera") > -1) { browser = 'OPERA'; }
        return browser;
    },
    
    //功能描述：获取 url 的参数值
   parseQueryString:function(url) {
        var pos;
        var obj = {};
        if ((pos = url.indexOf("?")) != -1) {
            var param = url.substring(pos+1, url.length)
            var paramArr = param.split('&');
            var keyValue = [];
            for (var i = 0, l = paramArr.length; i < l; i++) {
                keyValue = paramArr[i].split('=');
                obj[keyValue[0]] = keyValue[1];
            }
        }   
        return obj;
    },
    
    //获取字符串长度,汉字算两个字符长度
    getLength: function(s) {
        s = s.toString();
        var len = 0;
        for (var i = 0; i < s.length; i++) { len++; if (s.charCodeAt(i) >= 255) { len++; } }
        return len;
    },
    
    //去掉前空格
    LTrim: function(str) { return str.replace(/^\s+/g, ''); },
    //去掉后空格
    RTrim: function(str) { return str.replace(/\s+$/g, ''); },
    
    //将选中的checkbox　拼成字符串    
    getCheckBoxValues: function(checkboxName, splitStr) {
        var append_str = "";
        if (splitStr == '') { splitStr = ','; }
        //bug this.$$(checkboxName)
        var chklist = this.$$(checkboxName);
        for (var i = 0; i < chklist.length; i++) {
            if (chklist[i].checked) {
                if (append_str == "") { append_str = chklist[i].value; }
                else { append_str += splitStr + chklist[i].value; }
            }
        }
        return append_str;
    },
    
    //加入收藏夹    
    addBookmark: function(title, url) {
        if (window.sidebar) { window.sidebar.addPanel(title, url, ""); }
        else if (document.all) { window.external.AddFavorite(url, title); }
        else if (window.opera && window.print) { return true; }
    },
    
    //用户名格式是否正确    
    isUserName: function(userName) {
        var re = /^[0-9a-zA-Z_]+$/;
        if (!re.test(userName)) { return false; }
        else { return true; }
    },
    
    //去除 script iframe link style  
    clearScript: function(str) {
        return str.replace(/<(script|link|style|iframe)(.|\n)*\/\1>\s*/ig, "");
    },
    
    /*获取客户端浏览器宽度*/
    getClientWidth: function() {
        var width;
        if (this.browserName == "IE") { width = this.getDocumentElement().offsetWidth - 2; }
        else { width = this.getDocumentElement().offsetWidth; }
        return width;
    },
    /*获取客户端浏览器高度*/
    getClientHeight: function() {
        var height;
        if (this.browserName == "IE") { height = this.getDocumentElement().offsetHeight - 4; }
        else { height = this.getDocumentElement().clientHeight; }
        return height;
    },
    
    //获取对象scrollLeft的值  
    getScrollLeft: function(doc) {
        doc = doc || document;
        return Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
    },
    //获取对象的scrollTop的值
    getScrollTop: function(doc) {
        doc = doc || document;
        return Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);
    },
    /**
    *HTML转换成文本 
    * @param string
    * @return 
    * 
    */
    escapeHTML: function(c) {
        c = c.replace(/<br>/ig, "");
        c = c.replace(/(\n)/ig, "");
        c = c.replace(/(\r|\n)/ig, "");
        c = c.replace(/</ig, "&lt;");
        c = c.replace(/>/ig, "&gt;");
        c = c.replace(/'/ig, "&#039;");
        c = c.replace(/"/ig, "&quot;");
        //  c = c.replace(/,/ig, "，");
        c = c.replace(/&/ig, "&amp;");
        return c;

    },
    /**
    *获取元素的位置
    * xjl.postTop("div1")
    * xjl.postLeft("div1")
    * 
    */
    postTop:function(obj){
        var top=0;
        while(obj){
            top+=obj.offsetTop;
            obj=obj.offsetParent;
        }
        return top;
    },
    postLeft:function(obj){
        var left=0;
        while(obj){
            left+=obj.offsetLeft;
            obj=obj.offsetParent;
        }
        return left;
    },
    /*
    *用新属性获取元素页面的位置getBoundingClientRect，不用循环判断他们的父级的定位
    */
    getPos: function(element) {
        var iScrollTop = document.documentElement.scrollTop || document.body.scrollTop,
            iScrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft,
            iPos = element.getBoundingClientRect();     
        return {top: iPos.top + iScrollTop, left: iPos.left + iScrollLeft, right: iPos.right + iScrollLeft, bottom: iPos.bottom + iScrollTop}
    },
    /*
    xjl.animate(oLayer,{"opacity":0},{
        callback:function(){
            xjl.css(this,)  
        }           
    })
    */
    animate:function(obj,json,opt){
        clearInterval(obj.timer);
        obj.iSpeed=0;
        opt=xjl.extend({
            type:"buffer",
            callback:function(){}
        },opt);
        obj.timer=setInterval(function(){
            var iCur=0,
                complete = !0,
                property = null,
                maxSpeed = 30;
                for (property in json){
                    iCur = xjl.css(obj, property);
                    property == "opacity" && (iCur = parseInt(iCur.toFixed(2) * 100));
                    switch(opt.type){
                        case "buffer" :
                            obj.iSpeed = (json[property] - iCur) / 5;
                            obj.iSpeed = obj.iSpeed > 0 ? Math.ceil(obj.iSpeed) : Math.floor(obj.iSpeed);
                            json[property] == iCur || (complete = !1, xjl.css(obj, property, property == "zIndex" ? iCur + obj.iSpeed || iCur * -1 : iCur + obj.iSpeed));
                        break;
                        case "flex":
                            obj.iSpeed += (json[property] - iCur) / 5;
                            obj.iSpeed *= 0.7;
                            obj.iSpeed = Math.abs(obj.iSpeed) > maxSpeed ? obj.iSpeed > 0 ? maxSpeed : -maxSpeed : obj.iSpeed;
                            Math.abs(json[property] - iCur) <=1 && Math.abs(obj.iSpeed) <= 1 || (complete = !1, xjl.css(obj, property, iCur + obj.iSpeed));
                            break;
                        break;
                    }
                }
                if(complete){
                    clearInterval(obj.timer);
                    if(opt.type == "flex") for(property in json) xjl.css(obj, property, json[property]);
                    opt.callback.apply(obj, arguments);         
                }
        },30)
    },
    
    /*模拟点击事件*/
    fireClick:function(element) {
        if (/(chrome)|(firefox)/i.test(navigator.userAgent)) {
            var oEvent = document.createEvent("MouseEvents");
            oEvent.initMouseEvent("click", true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            element.dispatchEvent(oEvent)
        } else if (/safari/i.test(navigator.userAgent)) {
            var oEvent = document.createEvent("UIEvents");
            oEvent.initEvent("click", true, true);
            element.dispatchEvent(oEvent)
        } else {
            element.click()
        }
    },
    /*鼠标滚轮事件
    var oWrap=xjl.byId("wrap");
    function moveScroll(obtn){
        if(obtn){
            console.log("下");
        }else{
            console.log("上");
        }
    }
    xjl.mouseScroll(oWrap,moveScroll);
    */
    mouseScroll:function(obj, fnCallBack){
        xjl.addHandler(obj,'mouseWheel',fnScroll);
        xjl.addHandler(obj,"DOMMouseScroll",fnScroll);
        function fnScroll(ev){
            var oEvent=ev||event;
            var bDown;  
            if(oEvent.wheelDelta){
                bDown=oEvent.wheelDelta<0;
            }else{
                bDown=oEvent.detail>0;
            }
            fnCallBack(bDown);
            if(oEvent.preventDefault)oEvent.preventDefault();
            return false;
        } 
    },
    /*
    创建CSS样式
    var cssText='#yy02-footer a b{ color:#86BF3A;}\
                 #yy02-footer p{ color:#707C83;}';
    */
    createStyleSheet:function(cssText){
        var stylesheet;
        if(document.createStyleSheet){
            stylesheet=document.createStyleSheet();
            stylesheet.cssText=cssText;
        }else{
            stylesheet=document.createElement("style");
            stylesheet.appendChild(document.createTextNode(cssText));
            document.getElementsByTagName("head")[0].appendChild(stylesheet);
        }
        return stylesheet;
    },
    /*产生一个范围的随机数*/
    randomRange: function(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1) + lower)  
    },
    /*生成一个随机颜色*/
    getRanColor: function() {
        var str = this.randomRange(0, 0xFFFFFF).toString(16);
        while(str.length < 6) str = "0" + str;
        return "#" + str    
    },
    /*原生ajax*/
    request:function(url, data, fnSucc, fnFaild,method){
        this.ajax(url, {
            data: data,
            method: method || "GET",
            fnSucc: function(str){
                var json=eval('('+str+')');
                if(json.error)
                    fnFaild&&fnFaild(json.desc);
                else
                    fnSucc&&fnSucc(json); 
            }, 
            fnFaild: function (str){ 
                fnFaild('网络错误：'+str+'|'+url); 
            } 
        }); 
    },
    ajax:function(url,opt){
        if(!opt)opt={};
        var oAjax=window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");
        if(opt.method=='post'){
            oAjax.open('POST', url, true);
            oAjax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            oAjax.send(opt.data?this.json2url(opt.data):null);
        }else{
            if(opt.data){
                opt.data.t=newDate().getTime();
                url+='?'+this.json2url(opt.data);
            }
            oAjax.open('GET', url, true);
            oAjax.send();
        }
        oAjax.onreadystatechange=function(){
            if(oAjax.readyState==4){
                if(oAjax.status==200){
                    if(opt.fnSucc)opt.fnSucc(oAjax.responseText);
                }else{
                    if(opt.fnFaild)opt.fnFaild(oAjax.status);
                }
            }
        }
    },
    /*表单对象序列化*/
    json2url:function(json){
        var a=[];
        for(var i in json){
            var v=json[i]+'';
            v=v.replace(/\n/g, '<br/>');
            v=encodeURIComponent(v);
            a.push(i+'='+v);
        }
        returna.join('&');
    },
    /*判断是否是函数*/
    isFunction:function(value) { 
        return ({}).toString.call(value) == "[object Function]" 
    },
    /*duff*/
    duffArr:function(arr,callback){
        var iterations=Math.ceil(arr.length/8),
            startAt=arr.length%8,
            i=0;

        do{
            switch(startAt){
                case 0:callback(arr[i++]);
                case 7:callback(arr[i++]);
                case 6:callback(arr[i++]);
                case 5:callback(arr[i++]);
                case 4:callback(arr[i++]);
                case 3:callback(arr[i++]);
                case 2:callback(arr[i++]);
                case 1:callback(arr[i++]);
            }
            startAt=0;
        }while(--iterations>0);
    }
    /*duff 更高级*/
    duffArrM:function(arr,callback){
        var iterations=Math.floor(arr.length/8),
            leftover=arr.length%8,
            i=0;
            if(leftover>0){
                do{
                    callback(arr[i++]);
                }while(--leftover>0)
            }
            do{
                callback(arr[i++]);
                callback(arr[i++]);
                callback(arr[i++]);
                callback(arr[i++]);
                callback(arr[i++]);
                callback(arr[i++]);
                callback(arr[i++]);
                callback(arr[i++]);
            }while{--iterations>0}
    }
}


/*数组元素扩展*/
Array.prototype.indexOf=function(w){
    for(var i=0; i<this.length;i++) if(this[i]==w) return i;
    return -1;
}

Array.prototype.remove=function(w){
    var n=this.indexOf(w);
    if(n!=-1) this.splice(n,1);
}








