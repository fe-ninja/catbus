var fs = require('fs');
var configPath = process.cwd() + '/catbus-config.js';
var configExist = fs.existsSync(configPath);
var options = ['tag-closed', 'id-duplicated', 'img-alt'];
var rules = [], config;

if (configExist) {
    config = require(configPath).config;
    loadUserRules(config);
    options = config.options || options;
} else {
    // console.log('Rules Config Not Found!');
}

loadDefaultRules(options);

// console.log(rules)
exports.rules = rules;

function loadDefaultRules(options) {
    options.forEach(function(file ,index) {
        var rule = require('./rules/' + file).rule;
        rules.push(rule);

        // 设置查询规则状态快捷方式: rules.tag-closed = true
        // TODO: 需要考虑两类规则，解析时扫描（标签闭合）和解析后扫描
        rules[rule.id] = true;
    })
}

function loadUserRules(config) {
    var _rules = config.rules;

    // 规则处理
    for (var i = 0; i < _rules.length; i++) {
        if (!_rules[i]['author'] ||
                !_rules[i]['description'] || 
                    !_rules[i]['validator']) continue;
        if (!_rules[i]['level']) _rules[i]['level'] = 'error';  
        if (!_rules[i]['tagName']) _rules[i]['tagName'] = '*';  

        // ID规则: 自动分配id + 自定义ID ，比如'EL1-Tag-closed'
        _rules[i]['id'] = _rules[i]['level'].substring(0, 1).toUpperCase() + 'L0000' + (i + 1) + '-' +  _rules[i]['id'];

        rules.push(_rules[i]);
    }
}