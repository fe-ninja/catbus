exports.rule = {
    author: "远尘 <codedancerhua@gmail.com>",
    id: "tag-closed",
    description: "配对标签需要闭合",
    level: "error",
    tagName: "*",
    validator: function(nodes) {
        return true;
    }
}
