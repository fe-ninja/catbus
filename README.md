![catbus](https://f.cloud.github.com/assets/1229684/833986/8b8fe03a-f2b1-11e2-8948-0d0fc0d6a2b9.jpg)

# Catbus

[![Build Status](https://travis-ci.org/totorojs/catbus.png?branch=master)](https://travis-ci.org/totorojs/catbus)

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

- require导入扫描规则

```
$ catbus --require catbus-rule
```

其中`catbus-rule`是外部规则模块，通过npm安装`$ npm install catbus-rule -g`，示例: [cabut-html-typos](https://github.com/noahlu/catbus-html-typos)

- logfile设置日志输出文件(支持txt/json两种格式)

保存扫描日志为 `txt` 文件

```
$ catbus -L log.txt html-hard-code.htm 
```

保存扫描结果日志为 `json` 格式

```
$ catbus -L log.json html-hard-code.htm 
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

**配置忽略列表**
如果项目中有一部分文件demo不希望扫描，可以设置 `ignore`：

```
var config = {
  options: {
    "js-unused": false
  }, 
  ignore: [
    'static\\/js/\\w+\\/resources\\/.*\\.html',
    'static\\/fastpay\\/examples'
  ]
}
exports.config = config;

```
接受数组，数组项是表示正则pattern的`字符串`，所以注意反斜杠要用两次


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
    - 对于html规则，传入三个参数：function(reporter, nodes, rawStr)
    - 对于js、css规则，传入两个参数：function(reporter, rawStr)
    - `reporter`为报告器，有reporter.error和reporter.warning两个方法
    - `nodes`为匹配到tagName的节点数组
    - `rawStr`为扫描文件的原始内容字符串
- `level`：规则等级，可选，默认为`error`
- `tagName`：html匹配节点标签名，可选，未设置时，`validator`的参数nodes为null


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
  ignore: ['path\\/to\\/'],
  rules: [
    {
      author: "远尘 <codedancerhua@gmail.com>",
      id: "form-table-className",
      description: "表单内的表格class必须包含table form-table well",
      level: "error",
      tagName: "form",
      validator: function(reporter, nodes, rawStr) {
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
