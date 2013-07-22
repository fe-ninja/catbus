exports.rule = {
    author: "远尘 <codedancerhua@gmail.com>",
    id: "html-http-resources",
    description: "禁止引用站外，或者白名单（如cdn）之外资源",
    level: "error",
    tagName: "*",
    validator: function(reporter, nodes) {
        var r = this, isHttps = reporter.env.https
        var reHttp = /^http:\/\//

        if (!isHttps) return

        nodes.forEach(function(ele, index) {
            if (ele.tagName === 'link') {
                src = ele.getAttribute('href')
            } else {
                src = ele.getAttribute('src')
            }

            if (!src) return

            if (reHttp.test(src)) {
                reporter[r.level](r.description, nodes[index].line, null, r)
            }
            
        })
    }
}