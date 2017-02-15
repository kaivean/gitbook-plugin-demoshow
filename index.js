
var fs = require('fs');
var Q = require('q');
var htmlencode = require('htmlencode');
var path = require('path');
var ejs = require('ejs');
var less = require('less');

var ejsTpl = fs.readFileSync(__dirname + '/tpl.ejs', 'utf8');
var _counter = 1;
var _currentPage;
var guid = 2016;

var scripts = {};

function parseJs(htmlCont, namespace, ctx) {
    return parseContent({
        cont: htmlCont,
        ctx: ctx,
        type: 'javascript',
        namespace: namespace,
        reg: /<script>([\s\S]*?)<\/script>/
    })
}
function parseCss(htmlCont, namespace, ctx) {
    return parseContent({
        cont: htmlCont,
        ctx: ctx,
        type: 'css',
        namespace: namespace,
        reg: /<style>([\s\S]*?)<\/style>/
    })
}
function parseHtml(htmlCont, namespace, ctx) {
    return parseContent({
        cont: htmlCont,
        ctx: ctx,
        type: 'html',
        namespace: namespace,
        reg: /<template>([\s\S]*?)<\/template>/
    })
}
function parseContent(opt) {
    var defer = Q.defer();
    var res = opt.cont.match(opt.reg);
    if (res && res.length > 1) {
        var codeStr = res[1];
        codeStr = codeStr.replace(/NAMESPACE/g, opt.namespace);
        codeStr = codeStr.replace(/^\n?/g, '').trim();
        if (!codeStr) {
            defer.resolve({
                type: opt.type,
                data: '',
                precode: ''
            });
        }
        else {
            var newcodeStr;
            // css需要进行less处理
            if (opt.type === 'css') {
                less.render(codeStr).then(
                    function (output) {
                        if (output.css) {
                            newcodeStr = '```css\n' + output.css + '```';
                            opt.ctx.book.renderBlock('markdown', newcodeStr)
                                .then(function(str) {
                                    // console.log('precode', opt.type, str);
                                    defer.resolve({
                                        type: 'css',
                                        data: output.css,
                                        precode: str
                                    });
                                });
                        }
                        else {
                            defer.resolve({
                                type: 'css',
                                data: '',
                                precode: ''
                            });
                        }

                    },
                    function (error) {
                        console.warn('less编译失败', error);
                        defer.resolve({
                            type: 'css',
                            data: '',
                            precode: ''
                        });
                    }
                );
            }
            else {
                newcodeStr = '```' + opt.type + '\n' + codeStr + '\n```';
                opt.ctx.book.renderBlock('markdown', newcodeStr)
                    .then(function(str) {
                        // console.log('precode', opt.type, str);
                        defer.resolve({
                            type: opt.type,
                            data: codeStr,
                            precode: str
                        });
                    });
            }
        }
    }
    else {
        defer.resolve({
            type: opt.type,
            data: '',
            precode: ''
        });
    }
    return defer.promise;
}

module.exports = {
    website: {
        assets: './assets',
        js: [
            'http://cdn.bootcss.com/jquery/3.1.1/jquery.min.js',
            'jquery.qrcode.min.js',
            'demoshow.js'
        ],
        css: [
            'http://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css',
            'demoshow.css'
        ]
    },

    hooks: {
        'page:before': function(page) {
            _currentPage = page;
            // scripts['http://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css'] =
            //     '<link rel="stylesheet" href="http://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css"></link>';
            //
            // scripts['http://cdn.bootcss.com/jquery/3.1.1/jquery.min.js'] =
            //     '<script src="http://cdn.bootcss.com/jquery/3.1.1/jquery.min.js"></script>';
            return page;
        },
        'page': function(page) {
            var str = '';
            // 保证先后顺序， 先插入css ，在插入js
            for (var url in scripts) {
                console.log(scripts[url]);
                if (url.indexOf('.css') > -1) {
                    str += scripts[url];
                }
            }
            for (var url in scripts) {
                if (url.indexOf('.js') > -1) {
                    str += scripts[url];
                }
            }
            page.content = str + page.content;
            scripts = [];
            return page;
        }
    },

    blocks: {
        demoshow: {
            process: function (block) {
                var ctx = this;
                if (this.output.name !== 'website') {
                    return '';
                }

                var config = block.kwargs;
                var display = config.display || 'both';
                var separator = config.separator || '<hr>';
                var height = config.height || '300px';
                var style = config.runStyle || 'border:0';

                var data = {};
                var namespace = 'demoshow-block-ns' + guid++;
                data.namespace = namespace;

                data.onlyrun = parseInt(config.onlyrun, 10) || 0;
                data.codes = [];
                data.deps = [];
                if (config.dep) {
                    if (config.dep.indexOf('.js') > -1) {
                        data.deps.push({
                            type: 'js',
                            data: config.dep
                        });
                    }
                    if (config.dep.indexOf('.css') > -1) {
                        data.deps.push({
                            type: 'css',
                            data: config.dep
                        });
                    }
                }

                if (!config.src) {
                    return ejs.render(ejsTpl, data);
                }

                var fullPath = path.resolve(path.dirname(_currentPage.rawPath), config.src);
                console.log('fullPath',fullPath);

                var htmlCont = fs.readFileSync(fullPath, 'utf8');

                var queues = [];

                /****************************************************
                    javascript
                **************************************************/
                queues.push(module.exports,parseJs(htmlCont, namespace, ctx));

                /****************************************************
                    html
                **************************************************/
                queues.push(module.exports,parseHtml(htmlCont, namespace, ctx));

                /****************************************************
                    css
                **************************************************/
                queues.push(module.exports,parseCss(htmlCont, namespace, ctx));

                var scriptSrcMatches = htmlCont.match(/<\s?script\s+src=["'](.*?)["']\s?>.*?<\/script>/);
                if (scriptSrcMatches && scriptSrcMatches.length > 1) {
                    var scriptSrc = scriptSrcMatches[1];
                    scriptSrc = scriptSrc.trim();
                    if (scriptSrc) {
                        scripts[scriptSrc] = scriptSrcMatches[0];
                    }
                }

                var linkSrcMatches = htmlCont.match(/<\s+link\s+href="(.*?)"\s+>.*?<\/link>/);
                if (linkSrcMatches && linkSrcMatches.length > 1) {
                    var inkSrc = linkSrcMatches[1];
                    inkSrc = inkSrc.trim();
                    if (inkSrc) {
                        scripts[inkSrc] = linkSrcMatches[0];
                    }
                }

                // return ejs.render(ejsTpl, data);
                // Read the file
                return Q.all(queues)
                    .then(
                        function (res) {
                            // console.log('res', res, output);
                            var output = {};
                            for (var i = 0; i < res.length; i++) {
                                if (res[i].data) {
                                    data.codes.push(res[i]);
                                }
                            }
                            return ejs.render(ejsTpl, data);
                        },
                        function (error) {
                            console.warn('异步失败', error);
                        }
                    ).fail(function (error) {
                        console.warn('异步失败', error);
                        // We get here with either foo's error or bar's error
                    });
            }
        }
    }
};
