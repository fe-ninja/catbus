var colors = require('colors')
var fs = require('fs')
var path = require('path')

colors.setTheme({
  warning: 'yellow',
  error: 'red'
})

var Reporter = function(){
    this.messages = []
}

Reporter.prototype = {
    init: function(env){
        var self = this
        self.env = env
    },
    error: function(message, line, col, rule, raw){
        this.report('error', message, line, col, rule, raw)
    },
    warning: function(message, line, col, rule, raw){
        this.report('warning', message, line, col, rule, raw)
    },
    info: function(message, line, col, rule, raw){
        this.report('info', message, line, col, rule, raw)
    },
    report: function(type, message, line, col, rule, raw){
        var self = this
        self.messages.push({
            type: type,
            message: message,
            raw: raw,
            line: line,
            col: col,
            file: self.env.filePath,
            rule: {
                id: rule.id,
                description: rule.description,
                author: rule.author
            }
        })
    },
    print: function(timeSpent, file) {
        var self = this
        var data = ''
        var lineBreak = '\n'

        if (!file) {
            console.log()
            if (self.messages.length > 0) {
                self.messages.forEach(function(msg, index){
                    console.log(('   [' + msg.type + ':' + msg.rule.id + '] ' + 
                        (msg.raw ? msg.raw.toString().substring(0, 20) + ': ' : '') + 
                        msg.message + 
                        ' (' + msg.file + ':' + msg.line + ')')[msg.type])
                })
                console.log('Catbus has found ' + self.messages.length + ' error/warning in ' + timeSpent + 'ms')
            } else {
                console.log('Catbus has found 0 error/warning in ' + timeSpent + 'ms')
            }
        } 

        // 输出json文件
        else if (file.search(/\.json$/) > -1){
            data += '{' + lineBreak
            if (self.messages.length > 0) {
                self.messages.forEach(function(msg, index) {
                    data += '[' + lineBreak
                    data += '  "type":"' + msg.type + '",' + lineBreak
                    data += '  "ruleId":"' + msg.rule.id + '",' + lineBreak
                    data += '  "ruleDesc":"' + encodeURI(msg.rule.description) + '",' + lineBreak
                    data += '  "file":"' + msg.file + '",' + lineBreak
                    data += '  "line":"' + msg.line + '",' + lineBreak
                    data += '  "raw":"' + (msg.raw ? encodeURI(msg.raw.toString()) : '') + '"' + lineBreak
                    data += (index === self.messages.length - 1 ? ']' : '],') + lineBreak
                })
            }
            data += '}' + lineBreak

            fs.writeFileSync(file, data)
        } 

        // 输出txt文件
        else {
            if (self.messages.length > 0) {
                self.messages.forEach(function(msg, index){
                    data += '   [' + msg.type + ':' + msg.rule.id + '] ' + 
                        (msg.raw ? msg.raw.toString().substring(0, 20) + ': ' : '') + 
                        msg.message +  
                        ' (' + msg.file + ':' + msg.line + ')' + lineBreak
                })
                data += 'Catbus has found ' + self.messages.length + ' error/warning in ' + timeSpent + 'ms' + lineBreak
            } else {
                data += 'Catbus has found 0 error/warning in ' + timeSpent + 'ms' + lineBreak
            }

            fs.writeFileSync(file, data)
        }
    },
    log: function(msg) {
        if (this.env.debug) {
            console.log(msg)
        }
    }
};

exports.reporter = new Reporter()
