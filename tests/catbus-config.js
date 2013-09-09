var config = {
  options: {
    "html-tag-close": false, 
    "html-id-duplicate": false, 
    "html-meta-charset": false, 
    "html-unsafe-resource": false, 
    "html-https-warning": false, 
    "html-hard-code": false, 
    "html-doctype": false,
    "js-bitwise": false,
    "html-inline-script": false
  },
  ignore: [
    'tests\\/_\\w+'
  ],
  require: [
    'catbus-html-typos'
  ],
  rules: [
    {
      author: "远尘 <codedancerhua@gmail.com>",
      id: "html-form-table",
      description: "表单内的表格class必须包含table form-table well",
      level: "error",
      tagName: "form",
      validator: function(reporter, nodes) {
        var classes;
        for (var i = 0; i < nodes.length; i++) {
          if (nodes[i].childNodes[0].tagName == 'table') {
            classes = nodes[i].childNodes[0].getAttribute('class');
            if (!classes ||
                classes.indexOf('table') == -1 || 
                    classes.indexOf('form-table') == -1 ||
                      classes.indexOf('well') == -1) {
              reporter[this.level](this.description, nodes[i].line, null, this)
            }
          }
        }
      }

    }
  ]
};

exports.config = config;