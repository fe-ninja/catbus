// Requiring files
var fs = require('fs');
var Parser = require('./parser').parser;
var Velocity = require('velocityjs');
var fileStr;
var htmlParsed;
var DOM;

// console.log(process.argv[2])

// 读文件
// TODO：获取环境变量，比如文件名，文件路径等
fs.readFile(process.argv[2], 'utf8', fileHandler);

// TODO：读URL

function fileHandler(error, data) {
    if (error) {
        console.log('file open error')
        console.log(error)
    } else {
        // fileStr = data.toString();
        fileStr = data;
        console.log('readfile done.')

        // TODO: Velocity.render不能处理$stringUtil.equal，需要预处理为 == 
        // TODO: options 通过读取配置文件然后parse成json格式传入 {"tradeResult": "Success"} 
        htmlParsed = new Parser(fileStr, Velocity.render);
        DOM = htmlParsed.DOM;

        console.log(htmlParsed.processHtml)

        // console.log(DOM.getElementsByTagName('p'))
        console.log('Nodes with tagName "p" found: ' + DOM.getElementsByTagName('p').length)
        console.log('Nodes with id "bankPickerContainer" found: ' + DOM.getElementById('bankPickerContainer').length)
        console.log('Nodes with class "fn-hide" found: ' + DOM.getElementsByClassName('fn-hide').length)

        // console.log(DOM.childNodes[0].childNodes[1].childNodes[0].getAttribute('class'))
        // console.log(DOM.childNodes[0].childNodes[1].childNodes[0].innerHTML)
        // parser.parseComplete(fileStr);
    }

}