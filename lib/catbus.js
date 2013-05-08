// Requiring files
var fs = require('fs');
var Parser = require('./parser').parser;
var fileStr;

console.log(process.argv[2])

// var htmlparser = require('htmlparser');
// var handler = new htmlparser.DefaultHandler(function (error, dom) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log(JSON.stringify(dom));
//     }
// });
// var parser = new htmlparser.Parser(handler);

fs.readFile(process.argv[2], 'utf8', function(err, data){
    if (err) {
        console.log('file open error')
        console.log(err)
    } else {
        // fileStr = data.toString();
        fileStr = data;
        console.log('readfile done.')
        // console.log('file string: ' + fileStr)
        new Parser(fileStr);
        // parser.parseComplete(fileStr);
    }
});

// var file = fs.readFileSync(process.argv[2], 'utf8');

// console.log(file)

// process.argv.forEach(function (val, index, array) {
//     console.log(index + ': ' + val);
// });