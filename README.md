![catbus](https://f.cloud.github.com/assets/1229684/833986/8b8fe03a-f2b1-11e2-8948-0d0fc0d6a2b9.jpg)

# Catbus
A code analysis engine.

## 安装
```
$ npm install catbus -g
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
  options: [],
  rules: []
};
exports.config = config;

```

配置文件中，用户可以配置基础扫描规则的开启和关闭、自定义扫描规则


**基础规则配置**

在options数组中，设置开启的扫描规则，没列入的规则将不执行。如果没有配置options则默认执行所有基础扫描规则。

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
  rules: []
};
exports.config = config;
```

**编写自定义规则**

在rules数组中编写自定义规则，示例如下

```javascript
var config = {
  options: [],
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

自定义规则API说明：
- 规则id ("id"), id由系统分配，分为全局id（例如：G00001）和局部id（L00001）
- 规则说明 ("description")
- 规则级别 ("Error"/"Warning")
- 规则作者 ("author")
- 规则应用对象Tag ("tagName")
- 扫描器API：reporter用于记录扫描结果的错误/警告，nodes是匹配`tagName`的所有节点数组

完整的配置文件示例如下:

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

## 提BUG提建议
请提到这里：https://github.com/totorojs/catbus/issues
