// Requiring files
var fs = require('fs');
var Node = require('./htmlnode').htmlnode;
var Parser = require('./parser').parser;
var Rules = require('./rules');
var velocityParser = require('./velocityParser').velocityParser;

console.log('------------------------catbus is running----------------------------');
// console.log(process.argv[2])
// console.log('dirname: ' + __dirname)

// 读文件
// TODO：获取环境变量，比如文件名，文件路径等
fs.readFile(process.argv[2], 'utf8', fileHandler);
// TODO：读URL

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
        // console.log(parseResult.processHtml)

        window = parseResult.window;
        document = window.document;

        // console.log(document)
        Rules.validate(document);

        // 实现DOCUMENT的一些方法属性
        // document.documentElement = {};
        // document.nodeType = 9;
        // document.createElement = function(tagName) {
        //     var n = new Node();
        //     n.tagName = tagName;
        //     return n;
        // }

        // console.log(parseResult.processHtml)

        // console.log(document.getElementsByTagName('p'))
        // console.log('Nodes with tagName "p" found: ' + DOM.getElementsByTagName('p').length)
        // console.log('Nodes with id "bankPickerContainer" found: ' + DOM.getElementById('bankPickerContainer').length)
        // console.log('Nodes with class "fn-hide" found: ' + DOM.getElementsByClassName('fn-hide').length)
    }

}
