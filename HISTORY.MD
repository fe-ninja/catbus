## 0.1.3 `2013-9-9`
- catbus-config.js添加require，ignore配置
- 模块处理优化，--list功能放到catbus.js中处理，读取配置文件从rule.js中剥离，放到catbus.js处理



## 0.1.2 `2013-9-5`
- 增加reporter输出json/txt格式
- 支持hudson ci
- 优化js-object-comma正则表达式



## 0.1.0
- 大幅提升html解析器性能
- 实现了18个基础规则中的16个
- 引入JSHint作为js规则扫描引擎
- 优化日志信息显示，添加扫描耗时信息
- 优化了通过url进行扫描的文件名处理
- 重构parser、reportor、rules模块，api有部分调整
