// 规则执行
exports.validate = function(context, rules, reporter){
    var nodes;
    var hasError;
    rules.forEach(function(rule, index){
        nodes = context.getElementsByTagName(rule.tagName);
        rule.validator(reporter, nodes, context);
    })
}