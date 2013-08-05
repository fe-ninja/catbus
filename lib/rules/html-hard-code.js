exports.rule = {
    author: "远尘 <codedancerhua@gmail.com>",
    id: "html-hard-code",
    description: "线上页面不能存在开发环境地址硬编码",
    level: "error",
    tagName: "document",
    validator: function(reporter, nodes, rawStr) {
        if (reporter.env.fileName.search(/^https?:.*?alipay\.net/) > -1) return

        var reLine = /\r?\n/g
        var reComment = /<!--[\s\S]*?-->/g
        var node = nodes[0], r = this
        var rawStr = rawStr.replace(reComment, '') // 忽略注释里的内容
        var hardCodes = ['alipay.net']

        hardCodes.forEach(function(ele, index) {
            var reHardCode = new RegExp(ele, 'g')

            reHardCode.lastIndex = 0
            while (reHardCode.exec(rawStr)) {
                reporter[r.level](r.description, getLineNo(rawStr, reHardCode.lastIndex), null, r)
            }
        })

        function getLineNo(str, end) {
            var lines = 1

            reLine.lastIndex = 0
            while(reLine.exec(str)) {
                if (reLine.lastIndex > end) break
                lines++
            }

            return lines
        }
    }    
}