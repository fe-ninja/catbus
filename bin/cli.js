var scan = require('../lib/catbus').scan
var commander = {
    args: [],
    logfile: '',
    recursive: true
}
var args

args = process.argv.slice(2)
commander.args[0] = args[0]

args.forEach(function(item, index) {
    if (item.indexOf('--log-dir') > -1) {
        commander.logfile = item.split('=')[1] + '/report.json'
    }
})

// console.log(commander)
scan(commander)