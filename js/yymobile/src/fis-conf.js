//fis release -opwD -d ../build

//fis.config.set('roadmap.domain', 'http://lobby4.duowan.com/build');
fis.config.set('roadmap.domain', '.')
fis.config.set('settings.optimizer.uglify-js.mangle.except', [ 'require' ]);
fis.config.set('modules.postpackager', '');
//csssprite处理时图片之间的边距，默认是3px ，?__sprite
fis.config.set('modules.spriter', 'csssprites');
fis.config.set('settings.spriter.csssprites', {
    //开启模板内联css处理,默认关闭
    htmlUseSprite: true,
    //默认针对html原生<style></style>标签内的内容处理。
    //用户可以通过配置styleTag来扩展要识别的css片段
    //以下是默认<style></style>标签的匹配正则
    styleReg: /(<style(?:(?=\s)[\s\S]*?["'\s\w\/\-]>|>))([\s\S]*?)(<\/style\s*>|$)/ig,
    margin:10
});
fis.config.set('roadmap.path', [
    {
        reg: /^\/js\/(.*)\.(js)$/i,
        //是组件化的，会被jswrapper包装
        isMod: false,
        release: false
    },
    {
        //前端模板
        reg: '**.tmpl',
        //当做类html文件处理，可以识别<img src="xxx"/>等资源定位标识
        isJsLike:true,
        release: false
    },
    {
        reg: 'lib/**.js',
        release: false
    },
    {
        reg: 'css/**.css',
        release: false
    },
    {
        reg: /^\/css\/(calendarV3|dialog|nanoscroller|serverpop)\.css$/i,
        release: false
    },
    {
        reg: 'map.json',
        release: false
    }
]
);
fis.config.merge({
    modules: {//fis插件配置
        parser: {
            //.tmpl后缀的文件使用fis-parser-utc插件编译
            tmpl: 'utc',
            //.coffee后缀的文件使用fis-parser-coffee-script插件编译
            coffee: 'coffee-script',
            //.less后缀的文件使用fis-parser-less插件编译
            less: 'less'
        },
        optimizer: {
            js: 'uglify-js',
            css: 'clean-css',
            png: 'png-compressor'
        },
        lint: {
            js: 'jshint'
        },
        postprocessor : {
            js : 'jswrapper, require-async'
        }
    },
    settings: {
        parser: {
            'coffee-script': {
                //不用coffee-script包装作用域
                bare: true
            }
        },
        lint: {
            jshint: {
                //排除对lib和jquery、backbone、underscore的检查
                ignored: [ 'lib/**', /jquery|underscore/i ],
                //使用中文报错
                i18n: 'zh-CN'
            }
        },
        postprocessor : {
            jswrapper : {
                type : 'amd'
            }
        }
    }
});