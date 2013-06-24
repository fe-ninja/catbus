exports.rule = {
    author: "远尘 <codedancerhua@gmail.com>",
    id: "id-duplicated",
    description: "HTML标签ID不能重复",
    level: "error",
    tagName: "*",
    validator: function(nodes, context) {
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
                    return nodes[i]
                } else {
                    ids.push(nodes[i].id);
                }
            } else {
                continue;
            }
        }
        return true;
    }
}
