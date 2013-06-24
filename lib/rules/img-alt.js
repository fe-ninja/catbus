exports.rule = {
    author: "远尘 <codedancerhua@gmail.com>",
    id: "img-alt",
    description: "<img>标签应该有alt属性",
    level: "warning",
    tagName: "img",
    validator: function(nodes) {
        var ids = [];
        var duplicate = false;
        for (var i = 0; i < nodes.length; i++) {
            if (!nodes[i].hasAttribute('alt')) {
                return nodes[i];
            }
        }
        return true;
    }
}
