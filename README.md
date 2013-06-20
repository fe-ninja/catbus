# Catbus
A code analysis engine.

## HTML Parser
Html5规范中描述了这个解析算法，算法包括两个阶段——符号化及构建树。
符号化是词法分析的过程，将输入解析为符号，html的符号包括开始标签、结束标签、属性名及属性值。
注意document.write

### 符号识别
HTML标签状态机，初始状态为“Data State”，当遇到“<”字符，状态变为“Tag open state”，读取一个a－z的字符将产生一个开始标签符号，状态相应变为“Tag name state”，一直保持这个状态直到读取到“>”，每个字符都附加到这个符号名上，例子中创建的是一个html符号。

当读取到“>”，当前的符号就完成了，此时，状态回到“Data state”，“`<body>`”重复这一处理过程。到这里，html和body标签都识别出来了。现在，回到“Data state”，读取“Hello world”中的字符“H”将创建并识别出一个字符符号，这里会为“Hello world”中的每个字符生成一个字符符号。

这样直到遇到“`</body>`”中的“<”。现在，又回到了“Tag open state”，读取下一个字符“/”将创建一个闭合标签符号，并且状态转移到“Tag name state”，还是保持这一状态，直到遇到“>”。然后，产生一个新的标签符号并回到“Data state”。后面的“`</html>`”将和“`</body>`”一样处理。

![](http://markimage.bcs.duapp.com/2013/04/1367032389)



### HTML标签
[http://dev.w3.org/html5/html-author/#tags](http://dev.w3.org/html5/html-author/#tags)
- normal tag
In both HTML and XHTML, within each tag, whitespace is permitted after the tag name, but it is not permitted before the tag name.
    - start tag: `<tagname attlists>`
    - end tag: `</tagname>`
- self-closing tag: `<tagname>`

### HTML标签场景

```
嵌套错误
<div>
    <p>
</div>
    </p>
```

```
未闭合
<div>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit, aperiam, modi voluptatum possimus nemo facilis corporis quod error culpa dolor ipsa nostrum nesciunt commodi voluptate eum hic consequatur architecto optio.   
</div>
```

## Velocity Parser
基于velocityjs实现。主要扩展了对条件判断（if/elseif）的处理。
有几点 <del>潜规则</del> 需要注意：
- 对于传入的context，if中的逻辑会忽略，因为无论条件判断中的值是什么，都需要把所有分支走一遍。
- 默认加入了stringUtil工具栏类的支持


## 规则定义

每一个自定义规则应配置下列信息：
- 规则id ("id"), id由系统分配，分为全局id（例如：G00001）和局部id（L00001）
- 规则说明 ("description")
- 规则级别 ("Error"/"Warning")
- 规则作者 ("author")
- 规则应用对象Tag ("tagName")

整个扫描规则定义到一个配置文件里(比如catbus-config.js)，格式示例如下

```javascript
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
```
