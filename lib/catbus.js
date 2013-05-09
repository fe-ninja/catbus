// Requiring files
var fs = require('fs');
var Parser = require('./parser').parser;
var Velocity = require('velocityjs');
var fileStr;
var htmlParsed;
var DOM;

// console.log(process.argv[2])

fs.readFile(process.argv[2], 'utf8', fileHandler);

function fileHandler(error, data) {
    if (error) {
        console.log('file open error')
        console.log(error)
    } else {
        // fileStr = data.toString();
        fileStr = data;
        console.log('readfile done.')

        // parse vm
        // htmlParsed = Velocity.render(data);
        // console.log(htmlParsed)

        // console.log('file string: ' + fileStr)
        htmlParsed = new Parser(fileStr, Velocity.render);
        DOM = htmlParsed.DOM;

        console.log(DOM.getElementsByTagName('p'))
        console.log('Nodes with id "bankPickerContainer" found: ' + DOM.getElementById('bankPickerContainer').length)
        console.log('Nodes with class "fn-hide" found: ' + DOM.getElementsByClassName('fn-hide').length)

        // console.log(DOM.childNodes[0].childNodes[1].childNodes[0].getAttribute('class'))
        // console.log(DOM.childNodes[0].childNodes[1].childNodes[0].innerHTML)
        // parser.parseComplete(fileStr);
    }

}