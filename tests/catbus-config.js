var config = {
  rules: [
    {
      author: "远尘 <codedancerhua@gmail.com>",
      id: "form-table-className",
      description: "表单内的表格class必须包含table form-table well",
      level: "error",
      tagName: "form",
      validator: function(nodes) {
        // console.log(nodes[0].childNodes)
        var classes;
        for (var i = 0; i < nodes.length; i++) {
          // console.log(nodes[i])
          if (nodes[i].childNodes[0].tagName == 'table') {
            classes = nodes[i].childNodes[0].getAttribute('class');
            // console.log('classes are: ' + classes)
            if (!classes ||
                classes.indexOf('table') == -1 || 
                    classes.indexOf('form-table') == -1 ||
                      classes.indexOf('well') == -1) {
              return nodes[i];
            }
          }
        }
        return true;
      }
    }
  ]
};

exports.config = config;