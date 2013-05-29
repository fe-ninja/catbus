var fs = require('fs');
var Velocity = require('velocityjs');
var Parser = Velocity.Parser;
var Compile = Velocity.Compile;


fs.readFile(process.argv[2], 'utf8', fileHandler);
// TODO：读URL

function fileHandler(error, data) {
    if (data) {
        var vmTree = Parser.parse(data);
        console.log(JSON.stringify(vmTree))
        var Compiler = new Compile(vmTree);
        console.log(Compiler.render());
    }
}