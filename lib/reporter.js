var colors = require('colors')

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
    print: function(timeSpent) {
        var reporter = this

        console.log()
        if (this.messages.length > 0) {
            this.messages.forEach(function(msg, index){
                console.log(('   [' + msg.type + ':' + msg.rule.id + '] ' + 
                    (msg.raw ? msg.raw.toString().substring(0, 20) + ': ' : '') + 
                    msg.message + 
                    ' (' + msg.file + ':' + msg.line + ')')[msg.type])
            })
            console.log('Catbus has found ' + this.messages.length + ' error/warning in ' + timeSpent + 'ms')
        } else {
            console.log('Catbus has found 0 error/warning in ' + timeSpent + 'ms')
        }
    },
    log: function(msg) {
        if (this.env.debug) {
            console.log(msg)
        }
    }
};

exports.reporter = new Reporter()
