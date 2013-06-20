var fs = require('fs');
var path = require('path');
var Node = require('./htmlnode').htmlnode;
var HtmlParser = require('./parser').HtmlParser;
var Rules = require('./rules');
var Velocity = require('velocityjs');
var velocityParser = require('./velocityParser').velocityParser;
var Reporter = require('./reporter').Reporter;

function scanner(cmds) {
    // console.log(cmds)
    env = {};

    // TODO: 考虑多文件扫描的情况
    env.fileName = cmds.args[0];
    env.fileDir = path.dirname(path.resolve(env.fileName));
    env.workingDir = path.resolve('.');
    env.debug = cmds.debug;
    env.vm = env.fileName.search(/\.vm$/i) > -1;
    env.html = env.fileName.search(/\.(html|htm)$/i) > -1;

    fs.readFile(env.fileName, 'utf8', function(error, data){
        fileHandler(error, data, env);
    });
}

function fileHandler(error, data, env) {
    var fileStr;
    var parseResult;
    var window = {};
    var document = {};
    var reporter = new Reporter();
    
    if (error) {
        console.log('file open error')
        console.log(error)
    } else {
        fileStr = data;
        // console.log('readfile done.')

        // TODO: options 通过读取配置文件然后parse成json格式传入 {"tradeResult": "Success"} 
        htmlParser = new HtmlParser(fileStr);
        // htmlParser.preprocess(function(html){
        //     vmPreprocessor(html, env);
        // })
        htmlParser.preprocess();
        parseResult = htmlParser.parse(reporter, env);

        window = parseResult.window;
        document = window.document;

        if (Rules.rules) {
            Rules.validate(document, reporter);
        }


        reporter.print(env);
    }

}

function vmPreprocessor(html, env) {
    if (env.vm) {
        var htmlArray = velocityParser.conditionRender(html);
        console.log('htmlArray length: ' + htmlArray.length)
        return htmlArray[0];
    } else if (env.html) {
        return html;
    } else {
        console.log('File Not Support!')
    }
}

exports.scanner = scanner;
