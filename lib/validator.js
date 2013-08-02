var JSHINT = require("jshint").JSHINT
var jsHintExec


// 规则执行
exports.validate = function(context, rules, reporter){
    var nodes
    var reRuleSet = new RegExp('^(w\-|e\-)?' + reporter.env.fileExt)

    // each file will evoke validate() once
    jsHintExec = false

    rules.forEach(function(rule){
        if (rule.id.search(reRuleSet) > -1) {

            // apply js rules
            if (reporter.env.fileExt === 'js') {
                if (rule.validator) {
                    rule.validator(reporter, context)
                } else {
                    jsValidator(context, rules, reporter)
                }
            }

            // apply css rules
            else if(reporter.env.fileExt === 'css') {
                if (rule.validator) {
                    rule.validator(reporter, context);
                }
            }

            // apply html rules
            else {
                nodes = context.getElementsByTagName(rule.tagName);
                rule.validator(reporter, nodes, context);
            }
        } 
    })
}

function jsValidator(jsStr, rules, reporter) {
    // for each file, make sure js validator only be executed once
    if(jsHintExec) return

    var options = {
        "bitwise": true,
        "undef": true,
        "newcap": true,
        "unused": true,
        "globalstrict": true,
        "expr": true, 
        "boss": true,
        "eqnull": true,
        "evil": true,
        "browser": true,
        "node": true
    }
    var globals = {}
    var success = JSHINT(jsStr, options, globals)
    var errors = JSHINT.errors

    if(!errors.length) return
    jsHintExec = true
    // console.log(errors)

    errors.forEach(function(error) {
        var rule = {}
        if (!error) return

        if (error.code === 'W117' && rules['js-undef'] == true) {
            rule.id = 'js-undef'
            rule.level = 'warning'
        }
        else if (error.code === 'W064' && rules['js-newcap'] == true) {
            rule.id = 'js-newcap'
            rule.level = 'warning'
        }
        else if (error.code === 'W087' && rules['js-debug'] == true) {
            rule.id = 'js-debug'
            rule.level = 'error'
        }
        else if (error.code === 'W098' && rules['js-unused'] == true) {
            rule.id = 'js-unused'
            rule.level = 'warning'
        }
        else if (error.code === 'W016' && rules['js-bitwise'] == true) {
            rule.id = 'js-bitwise'
            rule.level = 'warning'
        }
        else if (error.code === 'W083' && rules['js-loopfunc'] == true) {
            rule.id = 'js-loopfunc'
            rule.level = 'warning'
        } 
        else {
            return
            // rule.id = error.code
            // rule.level = 'warning'
        }

        reporter[rule.level](error.reason, error.line, error.character, rule)
    })
}
