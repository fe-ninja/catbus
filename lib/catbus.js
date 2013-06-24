var fs = require('fs');
var path = require('path');
var HtmlParser = require('./parser').HtmlParser;
var Rules = require('./rules');
var Validator = require('./validator');
var velocityParser = require('./velocityParser').velocityParser;
var Reporter = require('./reporter').Reporter;

exports.scanner = function (cmds) {
    var input = cmds.args[0];
    var inputStat = fs.statSync(input);
    var file, dirFiles;

    if (inputStat.isFile()) {
        file = input;
        env = {
            file: file,
            debug: cmds.debug
        }
        fs.readFile(file, 'utf8', function(error, data){
            fileHandler(error, data, env);
        });
    } else if(inputStat.isDirectory()) {
        dirFiles = fs.readdirSync(input);
        dirFiles.forEach(function(file, index){
            env = {
                file: file,
                debug: cmds.debug
            }
            if (file.search(/\.(vm|htm|html)$/i) > -1) {
                file = input + file;
                fs.readFile(file, 'utf8', function(error, data){
                    fileHandler(error, data, env);
                });
            }
        })
    }
}

function fileHandler(error, data, _env) {
    var fileStr;
    var parseResult;
    var htmlParser;
    var window = {};
    var document = {};
    var reporter = new Reporter();

    var env = {
        fileName: path.basename(_env.file), 
        filePath: path.resolve(_env.file), // i.e. /User/xxx/test.htm
        fileDir: path.dirname(this.filePath),
        workingDir : path.resolve('.'),
        debug : _env.debug,
        vm : _env.file.search(/\.vm$/i) > -1,
        html : _env.file.search(/\.(html|htm)$/i) > -1
    };
    
    if (error) {
        console.log('Could Not Open File: ' + error.path);
    } else {
        fileStr = data;
        // TODO: options 通过读取配置文件然后parse成json格式传入 {"tradeResult": "Success"} 
        htmlParser = new HtmlParser(fileStr);
        // htmlParser.preprocess(function(html){
        //     vmPreprocessor(html, env);
        // })
        htmlParser.preprocess();
        parseResult = htmlParser.parse(reporter, env);

        window = parseResult.window;
        document = window.document;

        if (Rules.rules && Rules.rules.length > 0) {
            Validator.validate(document, Rules.rules, reporter);
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

