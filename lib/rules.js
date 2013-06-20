var utils = require('./utils').utils;
var path = process.cwd();
var fs = require('fs');
var rules = [];

fs.exists(path + '/catbus-config.js', function(exists) {

    if (exists) {
        var _rules = require(path + '/catbus-config.js').config.rules;

        // 规则处理
        for (var i = 0; i < _rules.length; i++) {
            if (!_rules[i]['author'] ||
                    !_rules[i]['description'] || 
                        !_rules[i]['validator']) continue;
            if (!_rules[i]['level']) _rules[i]['level'] = 'error';  
            if (!_rules[i]['tagName']) _rules[i]['tagName'] = '*';  

            // ID规则: 自动分配id + 自定义ID ，比如'EL1-Tag-closed'
            _rules[i]['id'] = _rules[i]['level'].substring(0, 1).toUpperCase() + 'L' + (i + 1) + '-' +  _rules[i]['id'];
            rules.push(_rules[i]);
        }
        exports.rules = rules;
        // console.log(rules)
    } else {
        console.log('Rule Config not Found');
        exports.rules = false;
    }
});

// 规则执行
exports.validate = function(context, reporter){
    var nodes;
    var hasError;
    for (var i = 0; i < rules.length; i++) {
        nodes = context.getElementsByTagName(rules[i]['tagName']);
        if (nodes.length == 0) continue;
        var result = rules[i].validator(nodes);
        if (result === true) {
            // console.log('Rule "' + rules[i].id + '" Passed!')
        } else {
            reporter[rules[i].level](rules[i].description, result.line, null, rules[i]);
        }
    }
}