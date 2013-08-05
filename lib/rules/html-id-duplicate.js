exports.rule = {
    author: "远尘 <codedancerhua@gmail.com>",
    id: "html-id-duplicate",
    description: "HTML标签ID不能重复",
    level: "error",
    tagName: "*",
    validator: function(reporter, nodes) {
        var ids = [];
        var duplicate = false;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].id) {
                for (var j = 0; j < ids.length; j++) {
                    if (nodes[i].id === ids[j]) {
                        duplicate = true;
                    }
                }

                if (duplicate) {
                    reporter[this.level](this.description, nodes[i].line, null, this, nodes[i].id);
                } else {
                    ids.push(nodes[i].id);
                }
            } else {
                continue;
            }
        }
    }
}
