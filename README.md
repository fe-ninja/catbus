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

## 规则定义

每一个自定义规则应配置下列信息：
- 规则id ("id")
- 规则说明 ("description")
- 规则级别 ("Error"/"Warning")
- 规则作者 ("author")
- 规则校验详情 ("detail")

整个扫描规则定义到一个配置文件里(比如cbrules.json)，json格式如下
```
{
    "rule": {
        "id": "",
        "description": "",
        "level": "Error"
        "author": "远尘"
        "detail": {
            "selector": "#main .content div", // 类似css选择器，前期可以做简单一点，只允许tageName/id/className
            "validator": function(nodes){} // 自定义的校验函数，参数是选择器选中的结果节点数组
        }
    },
    "rule": {}
}
```
