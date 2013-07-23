exports.rule = {
    author: "远尘 <codedancerhua@gmail.com>",
    id: "html-https-warning",
    description: "https协议页面不能有http资源",
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

            if (reHttp.test(src) || 
                (ele.tagName === 'iframe' && src.search(/about\s*:\s*_blank/) > -1)) {
                reporter[r.level](r.description, ele.line, null, r)
            } 
        })
    }
}