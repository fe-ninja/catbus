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
    warn: function(message, line, col, rule, raw){
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
                description: rule.description
            }
        });
    },
    print: function(env) {
        if (this.messages.length > 0) {
            console.log(('File: ' + env.fileDir + '/' + env.fileName).blue)
            this.messages.forEach(function(ele, index){
                console.log(('[' + ele.type + '] Line ' + ele.line + '. Message: ' + ele.message).red);
                console.log('rule id: ' + ele.rule.id);
                console.log('rule description: ' + ele.rule.description);
            })
        } else {
            console.log("Sir, It's All Clear Here!".green);
        }
    }
};

exports.Reporter = Reporter