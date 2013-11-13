var pages={};

pages.util=(function(){
    var distance;

    function constructor(totle,nowpage,id_dom){
        this.totle=totle;
        this.nowpage=nowpage;
        this.htmlStr=[];
        this.id_dom=document.getElementById(id_dom);
        this.createHtml();
        }

    constructor.prototype={
        createHtml:function(){
            //如果当前页数大于1的话，就出现上一页
            if(this.nowpage>1){
                this.htmlStr.push('<span href="#'+(this.nowpage-1)+'">上一页</span>');
            }

            //如果当前页数为4的话，前面就出现..
            if(this.nowpage>=4){
                this.htmlStr.push('<span>..</span>');

                if((this.totle-this.nowpage)<2){
                    var pages=this.totle-4;
                    for(var i=pages; i<=this.totle; i++){
                        if(i==this.nowpage){
                             this.htmlStr.push('<span href="#'+i+'" class="on">'+i+'</span>');
                        }else{
                            this.htmlStr.push('<span href="#'+i+'">'+i+'</span>');
                        }
                    }
                }else{
                    for(var i=1; i<=5; i++){
                        var pages=this.nowpage-3+i;
                        if(i==3){
                            this.htmlStr.push('<span href="#'+pages+'" class="on">'+pages+'</span>');
                        }else{
                            this.htmlStr.push('<span href="#'+pages+'">'+pages+'</span>');
                        }
                    }
                }
            }else{

                for(var i=1; i<=5; i++){
                    if(this.nowpage==i){
                        this.htmlStr.push('<span href="#'+i+'" class="on">'+i+'</span>');
                    }else{
                        this.htmlStr.push('<span href="#'+i+'">'+i+'</span>');
                    }
                }
            }
            //如果总页数大于6，就出现最后一页和..
            if(this.totle>6 && (this.totle-this.nowpage)>2){
                this.htmlStr.push('<span>..</span>');
                this.htmlStr.push('<span href="#'+this.totle+'">'+this.totle+'</span>')
            }

            //如果当前页数小于总页数的话，就出现下一页
            if(this.nowpage<this.totle){
                this.htmlStr.push('<span href="#'+(this.nowpage+1)+'">下一页</span>');
            }

            this.id_dom.innerHTML=this.htmlStr.join("");
        }
    }

    return {
        init:function(totle,nowpage,id_dom){
            if(!distance){
                distance=new constructor(totle,nowpage,id_dom);
            }

            return distance;
        }
    }

})();

pages.util.init(25,6,"page");