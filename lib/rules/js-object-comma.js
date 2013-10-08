exports.rule = {
    author: "远尘 <codedancerhua@gmail.com>",
    id: "js-object-comma",
    description: "对象多了逗号",
    level: "error",
    validator: function(reporter, context, rawStr) {
        // var reObj = /\{([\s\n\r'""]*\w+['"]?\s*\:[\s'"\w]*\,[\s\n\r]*)+\}/g
        // the regexp above has serious perf issue when dealing with large obj sington
        // so I try to detect comma abusing instead
        var reObj = /\,\s*\}/g
        var obj, jsStr

        // filter regular expression, i.e. reg = /\.{2,}/g
        jsStr = rawStr.replace(/\/[^\/\n]+\//g, '')

        while (obj = reObj.exec(jsStr)) {
            reporter[this.level](this.description, getLineNo(jsStr, obj.index), null, this, obj)
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