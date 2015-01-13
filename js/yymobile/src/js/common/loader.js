/** 文件预加载器 **/
(function(exports){
    var images = {};

    var Loader = function(source){
        //图片路径
        this._source = [];
        this.fails   = [];
        this._index  = 0;
        this.failed  = 0;
        this.loaded  = 0;
        this.percent = '0%';
        this._init(source);
        this.total = this._source.length;
        this._load();
    }

    Loader.prototype = {
        _rsuffix: /\.(js|css|mp3)$/,
        _init: function (src) {
            if (typeof src === 'string') {
                this._source.push(src);
            } else if (Array.isArray(src)) {
                this._source = src;
            } else
                throw 'Loader Error: arguments must be String|Array.';
        },
        _get_load_method: function (src) {
            var type = (type = src.match(this._rsuffix)) ? type[1] : 'img';
            return '_' + type;
        },
        _js: function (url, ok) {
            var self = this;
            var script = document.createElement('script');
            script.onload = function () {
                ok && ok.call(self, true, url);
            };
            script.onerror = function () {
                ok && ok.call(self, false, url);
            };
            script.type = 'text/javascript';
            script.src = url;
            document.head.appendChild(script);
        },
        _css: function (url, ok) {
            var self = this;
            var link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = url;
            document.head.appendChild(link);
            ok && ok.call(self, true, url);
        },
        _img: function (url, ok) {
            var self = this;
            var img = new Image();
            img.onload = function () {
                img.onload=null;
                images[url] = img;
                ok && ok.call(self, true, url);
            };
            img.onerror = function () {
                img.onerror=null;
                ok && ok.call(self, false, url);
            };
            img.src = url;
        },
        _mp3: function(url, ok){

        },
        _load: function () {
            if (this._index == this._source.length)
                return this._onend();
            var src = this._source[this._index];
            if (!src) return;
            var method = this._get_load_method(src);
            this[method](src, this._loadend);
            this._onloadstart(src);
        },
        _loadend: function (done, src) {
            if (done)
                ++this.loaded;
            else {
                ++this.failed;
                this.fails.push(src);
            }
            ++this._index;
            this.percent = Math.ceil(this._index / this.total * 100) + '%';
            this._onloadend(done, src);
            this._load();
        },
        _onloadstart: function(){},
        _onloadend: function(){},
        _onend: function(){},
        loadstart: function (handler) {
            if (typeof handler === 'function')
                this._onloadstart = handler;
            return this;
        },
        loadend: function (handler) {
            if (typeof handler === 'function')
                this._onloadend = handler;
            return this;
        },
        complete: function (handler) {
            if (typeof handler === 'function')
                this._onend = handler;
            return this;
        },
        image: function (url, val) {
            if(arguments.length == 1){
                if(undefined == url) {
                    return images;
                }
                var img = images[url];
                if (img)
                    return img;
                img = new Image();
                img.src = url;
                return img;
            }
            if(arguments.length == 2){
                images[url] = val;
            }
        }
    }



    //封装的loader 加载器 UI
    var LoaderMsk = function(source, color,loadbgColor,callback){
        var style   = document.createElement('style'),
            loadbgColor = typeof loadbgColor == 'string' ? loadbgColor : '#E44B46';

        style.innerHTML = '@-webkit-keyframes loading{0%{-webkit-transform:rotate(0deg);}100%{-webkit-transform:rotate(360deg);}}@-moz-keyframes loading{0%{-moz-transform:rotate(0deg);}100%{-moz-transform:rotate(360deg);}}@-o-keyframes loading{0%{-o-transform:rotate(0deg);}100%{-o-transform:rotate(360deg);}}@-ms-keyframes loading{0%{-ms-transform:rotate(0deg);}100%{-ms-transform:rotate(360deg);}}@keyframes loading{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}' +
            '.mp_loading{position:absolute; width:100%; height:100%; overflow:hidden; background-color:'+loadbgColor+'; left:0; top:0; -webkit-transform-style:preserve-3d; z-index:1;}' +
            '.mp_loading_clip{position:absolute; left:50%; top:50%; width:60px; height:60px; margin:-30px 0 0 -30px; overflow:hidden;  -webkit-animation:loading 1.2s linear infinite; -moz-animation:loading 1.2s linear infinite; -o-animation:loading 1.2s linear infinite; -ms-animation:loading 1.2s linear infinite; animation:loading 1.2s linear infinite;}' +
            '.mp_loading_bar{position:absolute; left:0; top:0; width: 54px;height: 54px; border-radius:50px; overflow:hidden; clip: rect(0px,36px,70px,0); background:transparent; border:3px solid #fff; -webkit-mask:-webkit-gradient(linear,0 0,0 100%,from(rgba(255,255,255,1)),to(rgba(255,255,255,0)));}' +
            '.mp_loading_txt{width: 100px;height: 30px;line-height: 30px;position: absolute;left: 50%;top: 50%;margin-left: -50px;margin-top: -15px;text-align: center;color: #fff;}';
        document.getElementsByTagName('head')[0].appendChild(style);

        var doc = document,
            args = arguments,
            color = typeof color == 'string' ? color : '#E44B46';

         var _loadDom = doc.getElementById('MP_loading'),
            _txtDom = doc.getElementById('MP_precent');
            
        if(!_loadDom){
            _loadDom = doc.createElement('div');
            _loadDom.className = 'mp_loading';
            _loadDom.innerHTML = '<div class="mp_loading_clip"><div class="mp_loading_bar" style="border-color:'+color+'"></div></div>';

            _txtDom = doc.createElement('div');
            _txtDom.className = 'mp_loading_txt';
            _loadDom.calssName = 'mp_loading';
            _txtDom.innerHTML = "0%";
            _loadDom.appendChild(_txtDom);
            document.body.appendChild(_loadDom);
        }       
            
        this._loadDom = _loadDom;
        this._txtDom = _txtDom;        

        var _this = this;
        var ok = callback;
        ok = typeof ok == 'function' ? ok : function(){};

        new Loader(source).loadstart(function(){

        }).loadend(function(percent){
            _txtDom.innerHTML = this.percent;
        }).complete(function(){
            _loadDom.style.display = 'none';
            ok.apply(_this);
        });
    };

    //导出loader
    exports.loader = Loader;
    exports.loadermsk = LoaderMsk;

})(window);

