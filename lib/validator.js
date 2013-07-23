// 规则执行
exports.validate = function(context, rules, reporter){
    var nodes
    var reRuleSet = new RegExp('/^' + reporter.env.fileExt + '/')

    rules.forEach(function(rule){
        if (rule.id.search(reRuleSet)) {

            // apply js rules
            if (reporter.env.fileExt === 'js') {
                if (rule.validator) {
                    rule.validator(reporter, context);
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