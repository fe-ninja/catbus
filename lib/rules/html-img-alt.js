exports.rule = {
    author: "远尘 <codedancerhua@gmail.com>",
    id: "img-alt",
    description: "<img>标签应该有alt属性",
    level: "warning",
    tagName: "img",
    validator: function(reporter, nodes) {
        var ids = [];
        var duplicate = false;
        for (var i = 0; i < nodes.length; i++) {
            if (!nodes[i].hasAttribute('alt')) {
                reporter[this.level](this.description, nodes[i].line, null, this);
            }
        }
    }
}
