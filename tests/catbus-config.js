var config = {
  rules: [
    {
      author: "远尘 <codedancerhua@gmail.com>",
      description: "表单内的表格class必须包含table form-table well",
      level: "error",
      // selector: "form table",
      tagName: "table",
      validator: function(nodes) {
        console.log('in rules, result nodes length: ' + nodes.length)
      }
    },
    {
      
    }
  ]
};

exports.config = config;