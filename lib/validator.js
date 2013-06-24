// 规则执行
exports.validate = function(context, rules, reporter){
    var nodes;
    var hasError;
    rules.forEach(function(rule, index){
        nodes = context.getElementsByTagName(rule.tagName);
        if (nodes.length == 0) return;
        var result = rule.validator(nodes, context);
        if (result === true) {
            // console.log('Rule "' + rules[i].id + '" Passed!')
        } else {
            reporter[rule.level](rule.description, result.line, null, rule);
        }
    })
}