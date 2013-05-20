var utils = require('./utils').utils;
var path = process.cwd();
// console.log(path)

var rules = [];
var _rules = require(path + '/catbus-config.js').rules;

// 规则处理
for (var i = 0; i < _rules.length; i++) {
    if (!_rules[i]['author'] ||
            !_rules[i]['description'] || 
                !_rules[i]['validator']) continue;
    if (!_rules[i]['level']) _rules[i]['level'] = 'error';  
    if (!_rules[i]['selector']) _rules[i]['selector'] = '*';  

    // 规则分配 id，本地id，比如EL1
    _rules[i]['id'] = _rules[i]['level'].substring(0, 1).toUpperCase() + 'L' + (i + 1);
    rules.push(_rules[i]);
}

// 规则执行
function validate(nodetree){
    var nodes;
    for (var i = 0; i < rules.length; i++) {
        if (rules[i]['selector'] === '*') {
            console.log('selector *');
            nodes = utils.iteration(nodetree);
        }
    }
}

console.log(rules)

exports.rules = rules;