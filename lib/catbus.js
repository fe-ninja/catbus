var fs = require('fs')
var path = require('path')
var zlib = require('zlib')
var HtmlParser = require('./htmlparser').HtmlParser
var Rules = require('./rules')
var Validator = require('./validator')
var reporter = require('./reporter').reporter
var reFileExt = /\.([^.?/#]+)([?#].*)?$/
var timeStart = new Date()
var timeEnd, debug, logfile

exports.scan = function (cmds) {
    var target = cmds.args[0]
    var file, fileContent, ruleRequired

    // require rule module
    if (cmds.require) {
        try {
            ruleRequired = require(cmds.require).rule
            Rules.rules.push(ruleRequired)
        } 
        catch (e) {
            console.log('fail to require rule module: ' + cmds.require)
        }
    }

    debug = cmds.verbose
    logfile = cmds.logfile

    // read url
    if (target.search(/^http(s)?:/i) > -1) {
        request(target, function(error, data) {

            // normalize url: `http://example.com` to `http://example.com/index.htm`
            if (target.search(/https?:\/\/([^/]+|.*\/)$/) > -1) {
                target += (target.search(/\/$/) > -1?'':'/') + 'index.htm'
            }
            requestHandler(error, data, target)
        })
    }

    // read file/directory
    else {
        var fileExist = fs.existsSync(target)
        if (!fileExist) {
            console.log(target + ' file/directory does not exist!')
            process.exit()
        }

        var targetStat = fs.statSync(target)
        if (targetStat.isFile()) {
            fileContent = fs.readFileSync(target, 'binary')
            fileHandler(null, fileContent, target)
        } 
        else if (targetStat.isDirectory()) {
            readDir(target, cmds.recursive, function(fileName) {
                if (fileName.search(/\.(vm|htm|html|js|css)$/i) > -1) {
                    fileContent = fs.readFileSync(fileName, 'binary')
                    fileHandler(null, fileContent, fileName)
                }
            })
        }

        timeEnd = new Date()
        reporter.print(timeEnd.getTime() - timeStart.getTime(), logfile)
    }

}

function fileHandler(error, data, target) {
    var context
    var env = {
        fileName: path.basename(target), 
        fileExt: target.match(reFileExt)[1],
        filePath: path.resolve(target), // i.e. `/User/yourname/test.htm`
        fileDir: path.dirname(this.filePath),
        workingDir : path.resolve('.'),
        debug : debug
    }

    // console.log(target)
    
    reporter.init(env)
    data = autoEncoding(data, env.fileExt)

    if (error) {
        console.log('Fail to open: ' + error.path);
        return
    } 

    if (env.fileExt === 'js') {
        // remove velocity string
        data = data.replace(/(?=\n\r?)\s*(#.*)(?=\n\r?)/g, '')
        // remove script tag in uisvr js
        data = data.replace(/<\/?script.*>/g, '')
    } 
    else if (env.fileExt === 'css') {
        // dosomething for css parse
    } 
    else {
        htmlParser = new HtmlParser(data)
        htmlParser.preprocess()
        context = htmlParser.parse(reporter).document
    }

    if (Rules.rules && Rules.rules.length > 0) {
        Validator.validate(data, Rules.rules, reporter, context)
    }

}

function requestHandler(error, data, target) {
    var context
    var env = {
        fileName: target, 
        fileExt: target.match(reFileExt)[1],
        filePath: target, // i.e. `/User/yourname/test.htm`
        fileDir: path.dirname(this.filePath),
        workingDir: path.resolve('.'),
        debug: debug
    }

    reporter.init(env)
    data = autoEncoding(data, env.fileExt)

    if (error) {
        console.log('Fail to open: ' + error.path)
        return
    } 

    if (env.fileExt === 'js') {
        // dosomething for js parse
    } 
    else if (env.fileExt === 'css') {
        // dosomething for css parse
    } 
    else {
        htmlParser = new HtmlParser(data)
        htmlParser.preprocess()
        context = htmlParser.parse(reporter).document
    }

    if (Rules.rules && Rules.rules.length > 0) {
        Validator.validate(data, Rules.rules, reporter, context)
    }

    timeEnd = new Date()
    reporter.print(timeEnd.getTime() - timeStart.getTime(), logfile)
}


// helper
// ------

function request(url, callback) {
    var isHttps = url.search(/^https/) != -1
    var engine = isHttps ? require('https') : require('http')
    var Url = require('url')
    var info = Url.parse(url)
    var data = ''
    var options = {
        hostname: info.host,
        path: info.path,
        method: 'GET'
    }
    var req

    // 部分参数会导致请求返回的chunk异常
    // 比如：https://a.alipayobjects.com/build/css/lf/lf_new.css?t=20110701
    req = engine.request(options, function(res) {
        res.setEncoding('binary')
        res.on('data', function (chunk) {
            if (res.headers['content-encoding'] === 'gzip') {
                zlib.gunzip(chunk, function(err, output) {
                    if (!err) {
                        callback(null, output.toString())
                    } else {
                        // hide inevitable error
                        // callback(err)
                    }
                })
            } else {
                data += chunk
            }
        })

        res.on('end',function() {
            if (data) {
                callback(null, data)
            }
        })

        res.on('error', function(err) {
            callback(err)
        })
    })

    req.on('error', function(err) {
        callback(err)
    })
    req.end()
}

function autoEncoding(file, fileExt) {
    var iconv = require('iconv-lite')
    if (fileExt == 'js' || fileExt == 'css') {
        if (file.search(/\s*<(script|style)/) > -1) {
            return iconv.decode(new Buffer(file, 'binary'), 'GBK')
        } else {
            return iconv.decode(new Buffer(file, 'binary'), 'UTF-8')
        }
    } else if (fileExt == 'vm') {
        // console.log('vm encoding gbk')
        return iconv.decode(new Buffer(file, 'binary'), 'GBK')
    } else {
        if (file.search(/charset=[\s'"]*GBK/i) > -1) {
            // console.log('html encoding gbk')
            return iconv.decode(new Buffer(file, 'binary'), 'GBK')
        } else {
            // console.log('html encoding utf8')
            return iconv.decode(new Buffer(file, 'binary'), 'UTF-8')
        }
    }
}

// callback must be sync, because fs has reading limit up to 256 in Mac OSX
// http://tgriff3.com/post/44864365776/fixing-error-emfile-too-many-open-files-in-node-js 
function readDir(dirname, recursive, callback) {
    var files = fs.readdirSync(dirname)

    files.forEach(function(file) {
        if (file.search(/^\./) > -1) return
        var fileName = path.resolve(dirname, file)
        var fileStat = fs.statSync(fileName)

        if (fileStat.isFile()) {
            callback(fileName)
        }
        else if(fileStat.isDirectory()){
            if (recursive) {
                readDir(fileName, recursive, callback)
            }
        }
    })

    // fs.readdir(dirname, function(err, files) {
    //     files.forEach(function(file) {
    //         if (file.search(/^\./) > -1) return
    //         var fileName = path.resolve(dirname, file)
    //         var fileStat = fs.statSync(fileName)

    //         if (fileStat.isFile()) {
    //             callback(fileName)
    //         }
    //         else if(fileStat.isDirectory()){
    //             if (recursive) {
    //                 readDir(fileName, recursive, callback)
    //             }
    //         }
    //     })
    // })

}
