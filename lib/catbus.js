var fs = require('fs');
var path = require('path');
var Node = require('./htmlnode').htmlnode;
var Parser = require('./parser').parser;
var Rules = require('./rules');
var Velocity = require('velocityjs');
var velocityParser = require('./velocityParser').velocityParser;
var stringUtil = require('./stringUtil');

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
        // parseResult = new Parser(fileStr, Velocity.render, {'stringUtil': stringUtil,'tradeResult': 'Success'});

        parseResult = new Parser(fileStr, function(html){
            if (config.vm) {
                var htmlArray = velocityParser.conditionRender(html);
                console.log(htmlArray.length)
                return htmlArray[0];
            } else if (config.html) {
                return html;
            } else {
                console.log('File Not Support!')
            }
        }, {
           'stringUtil': stringUtil
        });

        // parseResult = new Parser(fileStr, Velocity.render)
        // console.log(parseResult.processHtml)

        window = parseResult.window;
        document = window.document;

        // console.log(document)
        // console.log(Rules.rules)
        if (Rules.rules) {
            Rules.validate(document);
        }

    }

}

exports.scanner = scanner;
