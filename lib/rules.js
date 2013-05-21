var utils = require('./utils').utils;
var path = process.cwd();
// console.log(path)

var rules = [];
var _rules = require(path + '/catbus-config.js').config.rules;

// 规则处理
for (var i = 0; i < _rules.length; i++) {
    if (!_rules[i]['author'] ||
            !_rules[i]['description'] || 
                !_rules[i]['validator']) continue;
    if (!_rules[i]['level']) _rules[i]['level'] = 'error';  
    if (!_rules[i]['tagName']) _rules[i]['tagName'] = '*';  

    // 规则分配 id，本地id，比如EL1
    _rules[i]['id'] = _rules[i]['level'].substring(0, 1).toUpperCase() + 'L' + (i + 1);
    rules.push(_rules[i]);
}
exports.rules = rules;
// console.log(rules)

// 规则执行
exports.validate = function(context){
    var nodes;
    var hasError;
    for (var i = 0; i < rules.length; i++) {
        nodes = context.getElementsByTagName(rules[i]['tagName']);
        var result = rules[i].validator(nodes);
        if (result) {
            // console.log('Rule "' + rules[i].id + '" Passed!')
        } else {
            hasError = true;
            console.log('Rule "' + rules[i].id + '" Failed!')
            console.log('Rule Description: ' + rules[i].description);
            console.log('Rule Author: ' + rules[i].author);
        }
    }
    if (!hasError) {
        console.log('All Rules Passed!')
    }
}