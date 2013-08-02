![catbus](https://f.cloud.github.com/assets/1229684/833986/8b8fe03a-f2b1-11e2-8948-0d0fc0d6a2b9.jpg)

# Catbus
A code analysis engine.

## 安装
```
$ npm install catbus -g
```
安装如有报错，请尝试强制安装：
```
$ npm install catbus -gf
```

## 使用
catbus支持三种类型的文档:html、js、css。
- 扫描文件
```
$ catbus /path/to/file.htm
$ catbus /path/to/file.js
$ catbus /path/to/file.css
```

- 扫描目录
```
$ catbus /path/to/directory/
```

- 扫描URL
```
$ catbus https://financeprod.alipay.com/financing/dcbApp.htm
$ catbus https://www.alipay.com/
$ catbus http://php.net/downloads.php
```

## 高级用法

**配置文件**

在当前扫描目录下，新增文件`catbus-config.js`，配置文件代码示例如下：

```javascript
var config = {
  options: {},
  rules: []
};
exports.config = config;

```

配置文件中，用户可以配置基础扫描规则的开启和关闭、自定义扫描规则


**基础规则配置**

在options对象中，设置规则开启/关闭，`true`为开启，`false`为关闭。

```javascript
var config = {
  options: {
    "html-tag-close": true, 
    "html-id-duplicate": false, 
    "html-meta-charset": false, 
    "html-unsafe-resource": false, 
    "html-https-warning": false, 
    "html-hard-code": false, 
    "html-doctype": false
  },
  rules: []
};
exports.config = config;
```

**编写自定义规则**

在rules数组中编写自定义规则，示例如下

```javascript
var config = {
  options: {},
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

**自定义规则API说明：**
- `id`：规则标识，命名必须以扫描文档对象类型开头，如`html-`、`css-`或`js-`，必选
- `author`：规则作者，必选
- `description`：规则描述，必选
- `validator`：规则处理函数，必选
    - 对于html规则，传入三个参数：function(reporter, nodes, context)
    - 对于js、css规则，传入两个参数：function(reporter, context)
    - `reporter`为报告器，有reporter.error和reporter.warning两个方法
    - `nodes`为匹配到tagName的节点数组
    - `context`为扫描文件上下文，css、js为文件全文字符串，html为节点树对象
- `level`：规则等级，可选，默认为`error`
- `tagName`：html匹配节点标签名，默认为`*`


**完整的配置文件示例如下:**

```javascript
var config = {
  options: {
    "html-tag-close": true, 
    "html-id-duplicate": false, 
    "html-meta-charset": false, 
    "html-unsafe-resource": false, 
    "html-https-warning": false, 
    "html-hard-code": false, 
    "html-doctype": false
  },
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

## 提BUG提建议
请提到这里：https://github.com/totorojs/catbus/issues
