exports.rule = {
    author: "远尘 <codedancerhua@gmail.com>",
    id: "html-typos",
    description: "存在错别字",
    level: "warning",
    tagName: "document",
    validator: function(reporter, nodes, rawStr) {
        var arrTypos = ['登陆', '错别字']
        var reTypos = new RegExp(arrTypos.join('|'), 'g')
        var typo

        while (typo = reTypos.exec(rawStr)) {
            reporter[this.level](this.description + ':' + typo[0], getLineNo(rawStr, typo.index), null, this)
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