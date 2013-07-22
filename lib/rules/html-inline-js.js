exports.rule = {
    author: "远尘 <codedancerhua@gmail.com>",
    id: "html-inline-js",
    description: "不应该写行内js",
    level: "warning",
    tagName: "*",
    validator: function(reporter, nodes) {
        var r = this, attr
        var inlineEvents = ['onabort', 'onblur', 'onchange', 'onclick', 'ondblclick', 'onerror', 'onfocus', 'onkeydown', 'onkeypress', 'onkeyup', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onreset', 'onresize', 'onselect', 'onsubmit']

        nodes.forEach(function(ele, index) {
            for (attr in ele.attrs) {
                if (inlineEvents.indexOf(attr.toLowerCase()) > -1) {
                    reporter[r.level](r.description, ele.line, null, r)
                }
            }
        })

    }
}