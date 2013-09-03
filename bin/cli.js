var scan = require('../lib/catbus').scan
var commander = {}

commander.args = process.argv.slice(2)
commander.recursive = true
console.log(commander)
scan(commander)