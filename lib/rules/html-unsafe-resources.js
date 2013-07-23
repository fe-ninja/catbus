exports.rule = {
    author: "远尘 <codedancerhua@gmail.com>",
    id: "html-unsafe-resources",
    description: "禁止引用站外，或者白名单（如cdn）之外资源",
    level: "error",
    tagName: "*",
    validator: function(reporter, nodes) {
        var whiteList = ['alipay.com', 'alipayobjects.com']
        var reHost = /http[s]?:\/\/[^/]*\.([^./]*\.[^/]*)\/.*/
        var src, host, r = this

        nodes.forEach(function(ele, index) {
            if (ele.tagName === 'link') {
                src = ele.getAttribute('href')
            } else {
                src = ele.getAttribute('src')
            }

            if (!src) return

            host = reHost.test(src) && reHost.exec(src)[1]

            if (host && whiteList.indexOf(host) === -1) {
                reporter[r.level](r.description, ele.line, null, r)
            }
            
        })
    }    
}