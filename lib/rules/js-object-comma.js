exports.rule = {
    author: "远尘 <codedancerhua@gmail.com>",
    id: "js-object-comma",
    description: "对象多了逗号",
    level: "error",
    validator: function(reporter, context) {
        var reObj = /{([\s\S]+?\:[\s\S]+?\,)+?[\s\n\r]}/g
        var reObj = /\{([\s\n\r]*['"]?\w+['"]?\s*\:\s*['"]?\w*['"]?\s\,[\s\n\r]*)+\}/g
        var reObj = /\{([\s\n\r'""]*\w+['"]?\s*\:[\s'"\w]*\,[\s\n\r]*)+\}/g
        var obj

        while (obj = reObj.exec(context)) {
            console.log(obj)
            reporter[this.level](this.description, getLineNo(context, obj.index), null, this)
        }


        function getLineNo(str, start) {
            var reLine = /\r?\n/g
            var line = 1
            var br

            while (br = reLine.exec(str)) {
                if (br.index < start) {
                    line++
                }
            }

            return line
        }

    }    
}