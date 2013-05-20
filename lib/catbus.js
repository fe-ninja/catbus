// Requiring files
var fs = require('fs');
var Node = require('./htmlnode').htmlnode;
var Parser = require('./parser').parser;
// var browser = require('jsdom/lib/jsdom/browser/index');
var jsdom = require('jsdom');

// console.log(browser)
require('./rules');
var nwmatcher = require('nwmatcher');
var Velocity = require('velocityjs');
var fileStr;
var parseResult;
var window = {};
var document = {};

console.log('------------------------catbus is running----------------------------');
// console.log(process.argv[2])
// console.log('dirname: ' + __dirname)

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
        parseResult = new Parser(fileStr, Velocity.render);
        // -------------------------------------

        // 适用JSDOM
        jsdom.env(fileStr, ["http://code.jquery.com/jquery.js"], function(err, window){
            var $ = window.$;
            // console.log(window)
            console.log($('.yui-ac-input').attr('name'))
        })

        //---------------------------------------
        // 引入JSDOM，就不用自己实现WINDOW的细节了
        // window = parseResult.window;
        // global.window = window;
        // document = window.document;
        // document.documentElement = {};
        // document.nodeType = 9;
        // document.createElement = function(tagName) {
        //     var n = new Node();
        //     n.tagName = tagName;
        //     return n;
        // }

        // console.log(parseResult.processHtml)

        // var matcher = nwmatcher({ document: document });
        // console.log(matcher.select('p', document))

        // console.log(document.getElementsByTagName('p'))
        // console.log('Nodes with tagName "p" found: ' + DOM.getElementsByTagName('p').length)
        // console.log('Nodes with id "bankPickerContainer" found: ' + DOM.getElementById('bankPickerContainer').length)
        // console.log('Nodes with class "fn-hide" found: ' + DOM.getElementsByClassName('fn-hide').length)

        // console.log(DOM.childNodes[0].childNodes[1].childNodes[0].getAttribute('class'))
        // console.log(DOM.childNodes[0].childNodes[1].childNodes[0].innerHTML)
    }

}
