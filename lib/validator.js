var JSHINT = require("jshint").JSHINT


// 规则执行
exports.validate = function(context, rules, reporter){
    var nodes
    var reRuleSet = new RegExp('^' + reporter.env.fileExt)

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
                } else {
                    cssValidator(context, rules, reporter)
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
    // make sure js validator only execution once
    if(JSHINT.errors) return

    var options = {
        "bitwise": true,
        "undef": true,
        "newcap": true,
        "unused": true,
        // "loopfunc": true,
        "asi": true, // suppresses warnings about missing semicolons
        "globalstrict": true,
        "proto": true, // suppresses warnings about the __proto__ property
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
    // console.log(errors)

    errors.forEach(function(error) {
        var rule = {}
        if (!error) return

        if (error.code === 'W117') {
            rule.id = 'js-undef'
            rule.level = 'warning'
        }
        else if (error.code === 'W064') {
            rule.id = 'js-newcap'
            rule.level = 'warning'
        }
        else if (error.code === 'W087') {
            rule.id = 'js-debug'
            rule.level = 'error'
        }
        else if (error.code === 'W098') {
            rule.id = 'js-unused'
            rule.level = 'warning'
        }
        else if (error.code === 'W016') {
            rule.id = 'js-bitwise'
            rule.level = 'warning'
        }
        else if (error.code === 'W083') {
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

function cssValidator(cssStr, rules, reporter) {
    // do general validate   
}