var JSHINT = require("jshint").JSHINT
var jsHintExec


// 规则执行
exports.validate = function(rawStr, rules, reporter, context){
    var fileType = reporter.env.fileExt + (reporter.env.fileExt === 'vm' ? '|html' :'') 
    var reRuleSet = new RegExp('^(w\-|e\-)?' + fileType)

    // each file will evoke validate() once
    jsHintExec = false

    rules.forEach(function(rule){
        var nodes
        if (rule.id.search(reRuleSet) > -1) {
            reporter.log('[Validator]: executing rule ' + rule.id)

            // apply js rules
            if (reporter.env.fileExt === 'js') {
                if (rule.validator) {
                    rule.validator(reporter, context, rawStr)
                } else {
                    jsValidator(rawStr, rules, reporter)
                }
            }

            // apply css rules
            else if(reporter.env.fileExt === 'css') {
                if (rule.validator) {
                    rule.validator(reporter, context, rawStr);
                }
            }

            // apply html rules
            else {
                nodes = rule.tagName ? context.getElementsByTagName(rule.tagName) : null
                rule.validator(reporter, nodes, rawStr)
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
    var globals = {
        "JQuery": false,
        "seajs": false,
        "$": false,
        "$$": false,
        "E": false,
        "D": false,
        "Loader": false,
        "AP": false,
        "alipay": false,
        "arale": false,
        "aralex": false
    }

    try {
        var success = JSHINT(jsStr, options, globals)
    }
    catch(e) {
        console.log(e.message)
        return
    }
    
    var errors = JSHINT.errors

    if(!errors.length) return
    jsHintExec = true
    // console.log(errors)

    var ruleMap = {}

    rules.forEach(function(rule, index) {
        ruleMap[rule.id] = rule
    })

    errors.forEach(function(error) {
        var rule = {}
        if (!error) return

        if (error.code === 'W117' && rules['js-undef'] == true) {
            rule.id = 'js-undef'
        }
        else if (error.code === 'W064' && rules['js-newcap'] == true) {
            rule.id = 'js-newcap'
        }
        else if (error.code === 'W087' && rules['js-debug'] == true) {
            rule.id = 'js-debug'
        }
        else if (error.code === 'W098' && rules['js-unused'] == true) {
            rule.id = 'js-unused'
        }
        else if (error.code === 'W016' && rules['js-bitwise'] == true) {
            rule.id = 'js-bitwise'
        }
        else if (error.code === 'W083' && rules['js-loopfunc'] == true) {
            rule.id = 'js-loopfunc'
        } 
        else {
            return
            // rule.id = error.code
            // rule.level = 'warning'
        }

        rule.level = ruleMap[rule.id].level
        rule.description = ruleMap[rule.id].description

        reporter[rule.level](rule.description, error.line, error.character, rule)
    })
}
