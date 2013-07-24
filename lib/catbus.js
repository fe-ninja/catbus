var fs = require('fs')
var path = require('path')
var HtmlParser = require('./parser').HtmlParser
var Rules = require('./rules')
var Validator = require('./validator')
var velocityParser = require('./velocityParser').velocityParser
var Reporter = require('./reporter').Reporter
var JSHINT = require("jshint").JSHINT
var reFileExt = /\.([^.?/#]+)([?#].*)?$/

exports.scanner = function (cmds) {
    var input = cmds.args[0];
    var file, dirFiles, pageContent;

    // read url
    if (input.search(/^http(s)?:/i) > -1) {
        var request = require('request');
        request(input, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                pageContent = body;
                // normalize url file name as `http://example.com/index.htm`
                if (input.search(/https?:\/\/([^/]+|.*\/)$/) > -1) {
                    input = input + (input.search(/\/$/) > -1?'':'/') + 'index.htm'
                }
                env = {
                  file: input,
                  debug: cmds.verbose
                }
                requestHandler(error, pageContent, env);
            } else {
                console.log('Request error occured.')
            }
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
            fs.readFile(file, 'utf8', function(error, data){
                env = {
                    file: file,
                    debug: cmds.verbose
                }
                fileHandler(error, data, env);
            });
        } else if(inputStat.isDirectory()) {
            dirFiles = fs.readdirSync(input);
            dirFiles.forEach(function(file, index){
                if (file.search(/\.(vm|htm|html|js|css)$/i) > -1) {
                    file = path.resolve(input, file);
                    fs.readFile(file, 'utf8', function(error, data){
                        env = {
                            file: file,
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
        filePath: path.resolve(_env.file), // i.e. /User/xxx/test.htm
        fileDir: path.dirname(this.filePath),
        workingDir : path.resolve('.'),
        debug : _env.debug,
        timeStart: new Date().getTime(),
        https: false
    };
    var reporter = new Reporter(env);
    
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
        filePath: _env.file, // i.e. /User/xxx/test.htm
        fileDir: path.dirname(this.filePath),
        workingDir : path.resolve('.'),
        debug : _env.debug,
        timeStart: new Date().getTime(),
        https: _env.file.search('https') > -1
    };
    var reporter = new Reporter(env);
    console.log(env.fileExt)

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
    var options = {
        "bitwise": true,
        "undef": true,
        "newcap": true,
        "unused": true,
        // "loopfunc": true,
        "asi": true, // suppresses warnings about missing semicolons
        "globalstrict": true,
        "proto": true, // suppresses warnings about the __proto__ property
        "expr": true, 
        "boss": true,
        "eqnull": true,
        "evil": true,
        "browser": true,
        "node": true
    }
    var globals = {}
    var success = JSHINT(jsStr, options, globals)
    var errors = JSHINT.errors

    if(!errors.length) return
    // console.log(errors)

    errors.forEach(function(error) {
        var rule = {}
        if (!error) return

        if (error.code === 'W117') {
            rule.id = 'js-undef'
            rule.level = 'warning'
        }
        else if (error.code === 'W064') {
            rule.id = 'js-newcap'
            rule.level = 'warning'
        }
        else if (error.code === 'W087') {
            rule.id = 'js-debug'
            rule.level = 'error'
        }
        else if (error.code === 'W098') {
            rule.id = 'js-unused'
            rule.level = 'warning'
        }
        else if (error.code === 'W016') {
            rule.id = 'js-bitwise'
            rule.level = 'warning'
        }
        else if (error.code === 'W083') {
            rule.id = 'js-loopfunc'
            rule.level = 'warning'
        } 
        else {
            return
            // rule.id = error.code
            // rule.level = 'warning'
        }

        reporter[rule.level](error.reason, error.line, error.character, rule)
    })

    reporter.print()
}

function cssAnalyze(cssStr, reporter) {
    var reImg = /https?:\/\/[^/]+/g
    var img, imgUrl, lineNo

    while(img = reImg.exec(cssStr)) {
        imgUrl = img[0]
        if (imgUrl !== 'https://img.alipay.com' && imgUrl !== 'https://i.alipayobjects.com') {
            reporter.error('图片URL只能使用支付宝线上地址URL', getLineNo(cssStr, img.index), null, {id: 'css-image-url'})
        }
    }
    reporter.print()

    function getLineNo(str, start) {
        var reLine = /\r?\n/g
        var line = 1
        var br

        while (br = reLine.exec(str)) {
            if (br.index < start) {
                line++
            }
        }

        return line
    }
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

