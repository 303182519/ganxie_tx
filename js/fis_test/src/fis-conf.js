//fis release -opwD -d ../build

//fis.config.set('roadmap.domain', 'http://fis.duowan.com/build');
fis.config.set('roadmap.domain', 'http://test.yy.com')



fis.config.set('statics', 'test');


fis.config.merge({
    //项目过滤
    project: {
        exclude: [/node_modules\/|\.svn\/|\.git\//i, 'Gruntfile.js', 'package.json', 'docs/**', '**.cmd', '**.sh']
    },
    //fis插件配置
    modules: {
        //编译
        parser: {
            //.tmpl后缀的文件使用fis-parser-utc插件编译
            tmpl: 'utc',
            less: 'less',
            sass: 'sass',
            scss: 'sass'
        },
        //标准化处理阶段
        postprocessor : {
            js : 'jswrapper, require-async',
            css: 'autoprefixer',
            html: 'require-async'
        },
        //单文件编译过程中的代码检查插件 -l
        lint: {
            js: 'jshint'
        },
        //单文件编译过程中的最后阶段，对文件进行优化，默认值 -o
        optimizer: {
            js: 'uglify-js',
            css: 'clean-css',
            png: 'png-compressor'
        },
        postpackager: ['autoload', 'simple']
        //csssprite合并 ?__sprite
        //spriter:"csssprites"
    },
    roadmap: {
        ext: {
            less: 'css',
            sass: 'css',
            scss: 'css'
        },
        path:[{
            reg: /^\/js\/(.*)\.(js)$/i,
            //是组件化的，会被jswrapper包装
            isMod: true
        },
        {
            //css文件
            reg: /^\/css\/((.*)\.(css|less|scss|sass))$/i,
            //使用雪碧图
            useSprite: true,
            release: '${statics}/$&'
        },
        {
            //一级同名组件，可以引用短路径，比如modules/jquery/juqery.js
            //直接引用为var $ = require('jquery');
            reg: /^\/(modules\/([^\/]+)\/\2\.(js))$/i, //是组件化的，会被jswrapper包装
            isMod: true, //id为文件夹名
            id: '$2',
            release: '${statics}/$1'
        },
        {
            reg: 'components/**/*.js',
            isMod: true
        }, 
        {
            //modules目录下的其他脚本文件
            reg: /^\/(modules\/(.*)\.(js))$/i, //是组件化的，会被jswrapper包装
            isMod: true, //id是去掉modules和.js后缀中间的部分
            id: '$2',
            release: '${statics}/$1'
        },
        {
            //前端模板
            reg: '**.tmpl',
            //当做类html文件处理，可以识别<img src="xxx"/>等资源定位标识
            isJsLike:true,
            release: false
        },
        {
            reg: 'map.json',
            release: false
        },
        {
            reg: '**',
            release: '${statics}/$&'
        }]
    },
    //插件的配置信息
    settings: {
        lint: {
            //http://cweili.gitcafe.com/jshint-options/
            jshint: {
                //此选项允许您强制所有变量名以使用驼峰式或UPPER_CASE带下划线
                camelcase: true,
                //使用{}来明确代码块
                curly: true,
                //在for in循环中使用Object.prototype.hasOwnProperty()来过滤原型链中的属性
                forin: true,
                //匿名函数调用必须
                immed: true,
                //变量定义前禁止使用
                latedef: true,
                //构造函数名首字母必须大写
                newcap: true,
                //禁止使用arguments.caller和arguments.callee
                noarg: true,
                //禁止出现空的代码块
                noempty: true,
                node: true,
                //中文报错
                i18n : 'zh-CN',
                ignored: ['lib/**', /jquery|backbone|underscore/i]
            }
        },
        optimizer: {
            'uglify-js': {
                //不压缩变量名
                mangle: {
                    except: 'exports, module, require, define'
                },
                //自动去除console.log等调试信息
                /*compress : {
                    drop_console: true
                }*/
            },
            'png-compressor': {
                //pngquant会将所有 png24 的图片压缩为 png8，压缩率极高，但alpha通道信息会有损失。
                type: 'pngquant' //default is pngcrush
            }
        },
        postprocessor : {
            //模块化包装
            jswrapper: {
                template: 'dwfis.define("${id}", function(require, exports, module){\r\n${content}\r\n});'
            },
            autoprefixer: {
                // detail config (https://github.com/postcss/autoprefixer#browsers)
                // 这里copy了原来duya目录下的grunt配置，请根据项目需要自行修改
                browsers: ['> 1%', 'last 2 versions', 'ff 17', 'opera 12.1', 'ie 8'],
                cascade: true
            }
        },
        spriter:{
            csssprites:{
                //开启模板内联css处理,默认关闭
                //htmlUseSprite: true,
                //默认针对html原生<style></style>标签内的内容处理。
                //用户可以通过配置styleTag来扩展要识别的css片段
                //以下是默认<style></style>标签的匹配正则
                //styleReg: /(<style(?:(?=\s)[\s\S]*?["'\s\w\/\-]>|>))([\s\S]*?)(<\/style\s*>|$)/ig,
                //默认是3px
                //margin:10
            }
        },
        postpackager: {
            simple: {
                autoCombine: true
            }
        }
    }
});

//fis.config.set('modules.prepackager', 'css-image-set');