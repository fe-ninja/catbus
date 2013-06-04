var fs = require('fs');
var path = require('path');
var Node = require('./htmlnode').htmlnode;
var HtmlParser = require('./parser').HtmlParser;
var Rules = require('./rules');
var Velocity = require('velocityjs');
var velocityParser = require('./velocityParser').velocityParser;

function scanner(cmds) {
    // console.log(cmds)
    config = {};
    config.fileName = cmds.args[0];
    config.fileDir = path.resolve(config.fileName);
    config.workingDir = path.resolve('.');
    config.debug = cmds.args[1] == 'debug';
    config.vm = config.fileName.search(/\.vm$/i) > -1;
    config.html = config.fileName.search(/\.(html|htm)$/i) > -1;

    // TODO：读URL
    fs.readFile(config.fileName, 'utf8', function(error, data){
        fileHandler(error, data, config);
    });
}

function fileHandler(error, data, config) {
    var fileStr;
    var parseResult;
    var window = {};
    var document = {};
    
    if (error) {
        console.log('file open error')
        console.log(error)
    } else {
        fileStr = data;
        // console.log('readfile done.')

        // TODO: options 通过读取配置文件然后parse成json格式传入 {"tradeResult": "Success"} 
        htmlParser = new HtmlParser(fileStr);
        htmlParser.preprocess(function(html){
            vmPreprocessor(html, config);
        })
        parseResult = htmlParser.parse();

        window = parseResult.window;
        document = window.document;

        if (Rules.rules) {
            Rules.validate(document);
        }
    }

}

function vmPreprocessor(html, config) {
    if (config.vm) {
        var htmlArray = velocityParser.conditionRender(html);
        console.log('htmlArray length: ' + htmlArray.length)
        return htmlArray[0];
    } else if (config.html) {
        return html;
    } else {
        console.log('File Not Support!')
    }
}

exports.scanner = scanner;
