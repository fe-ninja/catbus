var fs = require('fs')
var path = require('path')
var HtmlParser = require('./htmlparser').HtmlParser
var Rules = require('./rules')
var Validator = require('./validator')
var velocityParser = require('./velocityParser').velocityParser
var Reporter = require('./reporter').Reporter
var zlib = require('zlib')
var reFileExt = /\.([^.?/#]+)([?#].*)?$/

exports.scanner = function (cmds) {
    var input = cmds.args[0]
    var file, dirFiles

    // read url
    if (input.search(/^http(s)?:/i) > -1) {
        request(input, function(error, data) {

            // normalize url: `http://example.com` to `http://example.com/index.htm`
            if (input.search(/https?:\/\/([^/]+|.*\/)$/) > -1) {
                input = input + (input.search(/\/$/) > -1?'':'/') + 'index.htm'
            }
            env = {
              file: input,
              debug: cmds.verbose
            }
            requestHandler(error, data, env)
        })
    }

    // read file/directory
    else {
        var fileExist = fs.existsSync(input);
        if (!fileExist) {
            console.log(input + ' File or Directory Not Exists!');
            process.exit();
        }

        var inputStat = fs.statSync(input);
        if (inputStat.isFile()) {
            file = input;
            fs.readFile(file, 'binary', function(error, data){
                env = {
                    file: file,
                    debug: cmds.verbose
                }
                fileHandler(error, data, env);
            });
        } 
        else if(inputStat.isDirectory()) {
            readDir(input, cmds.recursive, function(fileName) {
                if (fileName.search(/\.(vm|htm|html|js|css)$/i) > -1) {
                    fs.readFile(fileName, 'binary', function(error, data){
                        env = {
                            file: fileName,
                            debug: cmds.verbose
                        }
                        fileHandler(error, data, env);
                    });
                }
            })

        }
    }
}

function fileHandler(error, data, _env) {
    var env = {
        fileName: path.basename(_env.file), 
        fileExt: _env.file.match(reFileExt)[1],
        filePath: path.resolve(_env.file), // i.e. `/User/yourname/test.htm`
        fileDir: path.dirname(this.filePath),
        workingDir : path.resolve('.'),
        debug : _env.debug,
        timeStart: new Date().getTime(),
        https: false
    };
    var reporter = new Reporter(env);

    data = autoEncoding(data, env.fileExt)
    if (error) {
        console.log('Could Not Open File: ' + error.path);
    } else if (env.fileExt === 'js') {
        jsAnalyze(data, reporter)
    } else if (env.fileExt === 'css') {
        cssAnalyze(data, reporter)
    } else {
        htmlAnalyze(data, reporter)
    }

}

function requestHandler(error, data, _env) {
    var env = {
        fileName: _env.file, 
        fileExt: _env.file.match(reFileExt)[1],
        filePath: _env.file, // i.e. `/User/yourname/test.htm`
        fileDir: path.dirname(this.filePath),
        workingDir : path.resolve('.'),
        debug : _env.debug,
        timeStart: new Date().getTime(),
        https: _env.file.search('https') > -1
    };
    var reporter = new Reporter(env);

    data = autoEncoding(data, env.fileExt)
    if (error) {
        console.log(error);
    } else if (env.fileExt === 'js') {
        jsAnalyze(data, reporter)
    } else if (env.fileExt === 'css') {
        cssAnalyze(data, reporter)
    } else {
        htmlAnalyze(data, reporter)
    }

}

function htmlAnalyze(html, reporter) {
    var window = {};
    var document = {};
    var parseResult;
    var htmlParser;

    // console.time('parse: ')
    // TODO: options 通过读取配置文件然后parse成json格式传入 {"tradeResult": "Success"} 
    htmlParser = new HtmlParser(html);
    // htmlParser.preprocess(function(html){
    //     vmPreprocessor(html, env);
    // })
    htmlParser.preprocess();
    parseResult = htmlParser.parse(reporter);
    // console.timeEnd('parse: ')

    window = parseResult.window;
    document = window.document;

    // console.time('validate: ')
    if (Rules.rules && Rules.rules.length > 0) {
        Validator.validate(document, Rules.rules, reporter);
    }
    // console.timeEnd('validate: ')

    reporter.print();

}

function jsAnalyze(jsStr, reporter) {
    if (Rules.rules && Rules.rules.length > 0) {
        Validator.validate(jsStr, Rules.rules, reporter);
    } 

    reporter.print()
}

function cssAnalyze(cssStr, reporter) {
    if (Rules.rules && Rules.rules.length > 0) {
        Validator.validate(cssStr, Rules.rules, reporter);
    } 

    reporter.print()
}

function vmPreprocessor(html, env) {
    if (env.fileExt === 'vm') {
        var htmlArray = velocityParser.conditionRender(html);
        console.log('htmlArray length: ' + htmlArray.length)
        return htmlArray[0];
    } else if (env.fileExt.indexOf('htm')) {
        return html;
    } else {
        console.log('File Not Support!')
    }
}

function request(url, callback) {
    var isHttps = url.search(/^https/) != -1
    var engine = isHttps ? require('https') : require('http')
    var Url = require('url')
    var info = Url.parse(url)
    var data = ''
    var options = {
        hostname: info.host,
        path: info.path,
        method: 'GET'
    }
    var req

    // 部分参数会导致请求返回的chunk异常
    // 比如：https://a.alipayobjects.com/build/css/lf/lf_new.css?t=20110701
    req = engine.request(options, function(res) {
        res.setEncoding('binary')
        res.on('data', function (chunk) {
            if (res.headers['content-encoding'] === 'gzip') {
                zlib.gunzip(chunk, function(err, output) {
                    if (!err) {
                        callback(null, output.toString())
                    } else {
                        // hide inevitable error
                        // callback(err)
                    }
                })
            } else {
                data += chunk
            }
        })

        res.on('end',function() {
            if (data) {
                callback(null, data)
            }
        })

        res.on('error', function(err) {
            callback(err)
        })
    })

    req.end()
}

function autoEncoding(file, fileExt) {
    var iconv = require('iconv-lite')
    if (fileExt == 'js' || fileExt == 'css') {
        // console.log('js, css encoding utf8')
        return iconv.decode(new Buffer(file, 'binary'), 'UTF-8')
    } else if (fileExt == 'vm') {
        // console.log('vm encoding gbk')
        return iconv.decode(new Buffer(file, 'binary'), 'GBK')
    } else {
        if (file.search(/charset=[\s'"]*GBK/i) > -1) {
            // console.log('html encoding gbk')
            return iconv.decode(new Buffer(file, 'binary'), 'GBK')
        } else {
            // console.log('html encoding utf8')
            return iconv.decode(new Buffer(file, 'binary'), 'UTF-8')
        }
    }
}

function readDir(dirname, recursive, callback) {
    var files = fs.readdirSync(dirname)

    files.forEach(function(file) {
        var fileName = path.resolve(dirname, file)
        var fileStat = fs.statSync(fileName)

        if (fileStat.isFile()) {
            callback(fileName)
        } 
        else if(fileStat.isDirectory()){
            if (recursive) {
                readDir(fileName, recursive, callback)
            }
        }
    })
}
