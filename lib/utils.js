exports.iterate = function(node) {
    var nodeList = []
    nodeList.push(node)

    for (var i = 0; i < node.childNodes.length; i++) {
        // console.log('iteration, length: ' + node.childNodes.length)
        nodeList = nodeList.concat(this.iterate(node.childNodes[i]))
    }
    return nodeList
}

exports.mix = function(tarObj, srcObj) {
  var i

  for (i in srcObj) {
    if (srcObj.hasOwnProperty(i)) {
      tarObj[i] = srcObj[i]
    }
  }

  return tarObj 
}
