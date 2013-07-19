var colors = require('colors');

colors.setTheme({
  warning: 'yellow',
  error: 'red'
});

var Reporter = function(env){
    this._init();
    this._env = env;
};

Reporter.prototype = {
    _init: function(){
        var self = this;
        self.messages = [];
    },
    error: function(message, line, col, rule, raw){
        this.report('error', message, line, col, rule, raw);
    },
    warning: function(message, line, col, rule, raw){
        this.report('warning', message, line, col, rule, raw);
    },
    info: function(message, line, col, rule, raw){
        this.report('info', message, line, col, rule, raw);
    },
    report: function(type, message, line, col, rule, raw){
        var self = this;
        self.messages.push({
            type: type,
            message: message,
            raw: raw,
            line: line,
            col: col,
            rule: {
                id: rule.id,
                description: rule.description,
                author: rule.author
            }
        });
    },
    print: function() {
        if (this.messages.length > 0) {
            this.messages.forEach(function(ele, index){
                console.log()
                console.log(('[' + ele.type + '] Line ' + ele.line + '. Message: ' + ele.message)[ele.type]);
                console.log('  Rule ID: ' + ele.rule.id);
                // console.log('  Rule Description: ' + ele.rule.description);
                ele.rule.author && console.log('  Rule Author: ' + ele.rule.author);
            })
            console.log(this._env.filePath + ' found ' + this.messages.length.toString().blue + ' error/warning.')
        } else {
            console.log(this._env.filePath + " passed all rules.");
        }
    },
    log: function(msg) {
        if (this._env.debug) {
            console.log(msg)
        }
    }
};

exports.Reporter = Reporter
