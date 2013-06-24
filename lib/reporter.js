require('colors');

var Reporter = function(){
    this._init();
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
    print: function(env) {
        if (this.messages.length > 0) {
            console.log(env.filePath.blue + ' found ' + this.messages.length.toString().blue + ' error/warning: ')
            this.messages.forEach(function(ele, index){
                console.log(('[' + ele.type + '] Line ' + ele.line + '. Message: ' + ele.message).red);
                console.log('  Rule ID: ' + ele.rule.id);
                // console.log('  Rule Description: ' + ele.rule.description);
                ele.rule.author && console.log('  Rule Author: ' + ele.rule.author);
                console.log()
            })
        } else {
            console.log(env.filePath.blue + " passed all rules.");
        }
    }
};

exports.Reporter = Reporter