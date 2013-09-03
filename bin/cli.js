var scan = require('../lib/catbus').scan
var commander = {
    args: [],
    logFile: '',
    logType: 'json',
    recursive: true
}
var args

args = process.argv.slice(2)
commander.args[0] = args[0]

args.forEach(function(item, index) {
    if (item.indexOf('--log-dir') > -1) {
        commander.logFile = item.split('=')[1] + '/result.json'
    }
})

// console.log(commander)
scan(commander)