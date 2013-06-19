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
    }
};

exports.Reporter = Reporter