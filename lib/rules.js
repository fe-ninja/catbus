var fs = require('fs')
var rules = []
var ruleStatus = {}

exports.Rules = Rules = function(config) {
    this.init(config)
}

Rules.prototype = {
    init: function(config) {
        var options

        if (config) {
            this.loadUserRules(config.rules)
            options = config.options
        } else {
            // console.log('rules config not found')
        }
        this.loadDefaultRules(options)

        this.rules = rules
        this.ruleStatus = ruleStatus
    },

    loadDefaultRules: function(options) {
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
    },

    loadUserRules: function(userRules) {
        if (!userRules) return

        userRules.forEach(function(rule, index) {
            if (!rule.id ||
                    !rule.author ||
                        !rule.description ||
                            !rule.validator) {
                return 
            } 
            if (!rule.level) rule.level = 'error'
            // if (!rule.tagName) rule.tagName = '*'

            // ID naming: `e-html-typos` or `w-css-empty-rule`
            rule.id = rule.level.substring(0, 1).toLowerCase() + '-' + rule.id

            rules.push(rule)
            rules[rule.id] = true
            ruleStatus[rule.id] = true
        })
        
    }
    
}
