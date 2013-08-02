var fs = require('fs')
var configPath = process.cwd() + '/catbus-config.js'
var configExist = fs.existsSync(configPath)
var rules = []
var ruleStatus = {}
var config, options

if (configExist) {
    config = require(configPath).config
    loadUserRules(config.rules)
    options = config.options
} else {
    // console.log('rules config not found')
}
loadDefaultRules(options)

exports.rules = rules
exports.ruleStatus = ruleStatus

function loadDefaultRules(options) {
    var ruleFiles = fs.readdirSync(__dirname + '/rules/')

    ruleFiles.forEach(function(file, index) {
        try {
            rule = require(__dirname + '/rules/' + file).rule
            if (options && options[rule.id] == false) {
                rules[rule.id] = false // will not appear in forEach iteration
                ruleStatus[rule.id] = false // also stored in a pure object
            } else {
                rules.push(rule)
                rules[rule.id] = true 
                ruleStatus[rule.id] = true
            }
        } catch (e) {
            console.log('fail loading rule: ' + rule.id)
        }
    })
}

function loadUserRules(_rules) {
    if (!_rules) return

    _rules.forEach(function(rule, index) {
        if (!rule.id ||
                !rule.author ||
                    !rule.description ||
                        !rule.validator) 
            return 
        if (!rule.level) rule.level = 'error'
        if (!rule.tagName) rule.tagName = '*'

        // ID naming: `e-html-typos` or `w-css-empty-rule`
        rule.id = rule.level.substring(0, 1).toLowerCase() + '-' + rule.id

        rules.push(rule)
        rules[rule.id] = true
        ruleStatus[rule.id] = true
    })
}