exports.rule = {
    author: "远尘 <codedancerhua@gmail.com>",
    id: "html-meta-charset",
    description: "必须存在申明文档编码的META标签",
    level: "error",
    tagName: "head",
    validator: function(reporter, nodes) {
        var r = this, hasCharset = false

        if (nodes.length === 0) return

        nodes.forEach(function(ele, index) {
            var metas = ele.getElementsByTagName('meta')

            metas.forEach(function(e, i) {
                if (e.hasAttribute('charset') || 
                    (e.hasAttribute('content') && e.getAttribute('content').indexOf('charset=') > -1)) {
                    hasCharset = true
                }
            })

            if (!hasCharset) {
                reporter[r.level](r.description, nodes[index].line, null, r)
            }
        })
    }
}