var config = {
  rules: [
    {
      author: "玉伯 <lifesinger@gmail.com>",
      description: "表单内的表格class必须包含table form-table well",
      level: "error",
      // selector: "form table",
      tagName: "table",
      validator: function(nodes) {
         // dosomething
      }
    },
    {
      
    }
  ]
};

exports.config = config;