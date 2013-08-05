exports.rule = {
    author: "远尘 <codedancerhua@gmail.com>",
    id: "html-quote-value",
    description: "HTML标签属性值应该在引号里",
    level: "warning",
    tagName: "*",
    validator: function(reporter, nodes) {
        var reUnquoteAttr = /\s+\w+\s*=\s*[^"'\s]+(\s|>)/, r = this

        nodes.forEach(function(ele, index) {
          if (reUnquoteAttr.test(ele.tag)) {
            // reporter.log(ele.tag.match(reUnquoteAttr))
            reporter[r.level](r.description, ele.line, null, r, ele.tag)
          }
        })
    }
}