![catbus](https://f.cloud.github.com/assets/1229684/833986/8b8fe03a-f2b1-11e2-8948-0d0fc0d6a2b9.jpg)

# Catbus
A code analysis engine.

## 安装
```
$ npm install catbus -g
```

## 扫描规则自定义规则定义

每一个自定义规则应配置下列信息：
- 规则id ("id"), id由系统分配，分为全局id（例如：G00001）和局部id（L00001）
- 规则说明 ("description")
- 规则级别 ("Error"/"Warning")
- 规则作者 ("author")
- 规则应用对象Tag ("tagName")

整个扫描规则定义到一个配置文件里(比如catbus-config.js)，格式示例如下

```javascript
var config = {
  options: [
    'html-tag-close', 
    'html-id-duplicate', 
    'html-meta-charset', 
    'html-unsafe-resources', 
    'html-https-warning', 
    'html-hard-code', 
    'html-doctype'
  ],
  rules: [
    {
      author: "远尘 <codedancerhua@gmail.com>",
      id: "form-table-className",
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
```
