// Requiring files
var fs = require('fs');
var Node = require('./htmlnode').htmlnode;
var Parser = require('./parser').parser;
var Rules = require('./rules');
var Velocity = require('velocityjs');
var velocityParser = require('./velocityParser').velocityParser;

console.log('------------------------catbus is running----------------------------');
// console.log(process.argv[2])
// console.log('dirname: ' + __dirname)

function scan(file) {
    // 读文件
    // TODO：获取环境变量，比如文件名，文件路径等
    fs.readFile(process.argv[2], 'utf8', fileHandler);
    // TODO：读URL
}

function fileHandler(error, data) {
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

        // TODO: Velocity.render不能处理$stringUtil.equal 
        // TODO: options 通过读取配置文件然后parse成json格式传入 {"tradeResult": "Success"} 
        // parseResult = new Parser(fileStr, Velocity.render);

        // 其实不用VELOCITYJS，直接把VM的语法当做字符对待即可
        parseResult = new Parser(fileStr, function(html, options){
            var htmlArray = velocityParser.conditionRender(html);
            // console.log('htmlArray length: ' + htmlArray.length)
            return htmlArray[0];
        });

        // parseResult = new Parser(fileStr, Velocity.render)
        console.log(parseResult.processHtml)

        window = parseResult.window;
        document = window.document;

        // console.log(document)
        // console.log(Rules.rules)
        if (Rules.rules) {
            Rules.validate(document);
        }

    }

}

exports.scan = scan;
