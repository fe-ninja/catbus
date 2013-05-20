Utils = function(){

};

Utils.prototype.iteration = function(node) {
    var nodeList = [];
    nodeList.push(node);

    for (var i = 0; i < node.childNodes.length; i++) {
        // console.log('iteration, length: ' + node.childNodes.length)
        nodeList = nodeList.concat(this.iteration(node.childNodes[i]))
    }
    return nodeList;
}

exports.utils = new Utils();