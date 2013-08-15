exports.rule = {
    author: "远尘 <codedancerhua@gmail.com>",
    id: "html-tag-close",
    description: "标签必需闭合/配对",
    level: "error",
    tagName: "*",
    validator: function(reporter, nodes) {
        return true
    }
}
