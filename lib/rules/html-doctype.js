exports.rule = {
    author: "远尘 <codedancerhua@gmail.com>",
    id: "html-doctype",
    description: "文档声明前不允许出现任何非空字符",
    level: "error",
    tagName: "doctype",
    validator: function(reporter, nodes, context) {
        var node = nodes[0], r = this, strBeforeDoctype

        if (!node) return

        strBeforeDoctype = context.innerHTML.substring(0, node.index)

        if (strBeforeDoctype.search(/\S+/) > -1) {
            reporter[r.level](r.description, node.line, null, r)
        }
    }    
}