var Parser
var HTMLNode = require('./htmlnode').HTMLNode
var reTag = /<([/!]?)(\w+)(?:\s+[^>]*)?>/g
var reAttr = /([\w:-]+)(?:\s*=\s*(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+))?/g
var reComment = /<!--[\s\S]*?-->/g
var reLine = /\r?\n/g
var selfClosing = makeMap("doctype,area,base,basefont,br,col,command,embed,hr,img,input,link,meta,param,source")
// Attributes that have their values filled in disabled="disabled"
var fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected")
var specialTags = makeMap("script,style,textarea,xmp")

exports.HtmlParser = Parser = function(html) {
    this.inputHtml = html
    this.processHtml = ''
}

Parser.prototype = {
    preprocess: function(preprocessor) {
        this.processHtml = normalize(this.inputHtml)
        if (preprocessor &&
                typeof preprocessor === 'function') {
            this.processHtml = preprocessor(this.processHtml)
        }
    },

    // TODO: 处理注释和IE条件注释
    // TODO: 处理多余结束标签
    // 状态栈stack：[HTMLNode]
    parse: function(reporter) {
        var tagProp, tag, curNode, openedNode
        var stack = []
        var retDom = {}
        var lineNo = 1
        var html = this.processHtml || this.inputHtml

        // mock window & document
        retDom.window = {}
        retDom.document = retDom.root = new HTMLNode({tagName: 'document'})
        retDom.window.document = retDom.document
        retDom.document.innerHTML = this.inputHtml

        // reset lastIndex in case value been 
        // cached by `lineIncremental` call in recursive scanning 
        reLine.lastIndex = 0

        // tag: ['</html>', '/', 'html', index: 1092, input: '...raw string']
        while (tag = reTag.exec(html)) {

            lineNo += lineIncremental(html, tag.index)
            reporter.log('Line ' + lineNo + ' :' + html.substring(reLine.lastIndex, reTag.lastIndex))
            reporter.log('[HtmlParser]: Tag <' + tag[1] + tag[2] + '>')

            tagProp = {
                tag: tag[0],
                isEndTag: tag[1] === '/',
                tagName: lower(tag[2]),
                tagType: tag[2] in selfClosing ? 'self-closing' : 'normal' 
            }

            // end tag
            if (tagProp.isEndTag) {
                if (stack.length === 0) continue
                openedNode = stack.last()

                // found matched tag
                if (openedNode.tagName === tagProp.tagName) {
                    this._setInnerHTML.call(openedNode, openedNode.index, tag.index, html)
                    stack.pop()

                    // TODO: do something for matched end tag
                    continue
                }

                // in special tag
                if (openedNode.tagName in specialTags) {
                    continue
                }
                
                while (openedNode = stack.last()) {

                    // found matched tag
                    if (openedNode.tagName === tagProp.tagName) {
                        this._setInnerHTML.call(openedNode, openedNode.index, tag.index, html)
                        stack.pop()
                        break
                    } 
                    
                    // deal with non-close tag
                    else {
                        reporter.error('缺少结束标签</' + openedNode.tagName + '>', lineNo, null, {'id': 'html-tag-close', 'description':'标签应闭合'})
                        stack.pop()
                    }
                }
            } 

            // start tag
            else {
                if (stack.last() && stack.last().tagName in specialTags) continue

                curNode = new HTMLNode({
                    tag: tagProp.tag,
                    tagName: tagProp.tagName,
                    parentNode: null,
                    line: lineNo,
                    index: tag.index,
                    lastIndex: reTag.lastIndex
                })

                setAttributes(curNode, tagProp.tag)

                // 设置父元素节点
                stack.length > 0 ? 
                    stack.last().appendChild(curNode) : 
                        retDom.root.appendChild(curNode)

                if (tagProp.tagType === 'normal') {
                    stack.push(curNode)
                }
            }
        }

        // special tag not closed
        if (stack.last() && stack.last().tagName in specialTags) {
            reporter.error('解析错误: ' + stack.last().tagName + ' 标签未闭合', stack.last().line, null, {id:''})
            // process.exit();
        }

        // print the node tree, 
        // Caution: code below has performance issue
        // reporter.log('[Catbus HtmlParser]: DOM Tree');
        // reporter.log(printDom(retDom.root));

        return retDom;
    }, 
    _setInnerHTML: function(start, end, html) {
        if (end > start) {
            this.innerHTML = html.substring(start, end)
        }
    }
}


// Helper
// ------

Array.prototype.last = function() {
    return this[this.length - 1]
}

function makeMap(str) {
    var obj = {}, items = str.split(",")
    for (var i = 0; i < items.length; i++) {
        obj[items[i]] = true
    }
    return obj
}

function normalize(html) {
    var ret 

    // 统一自闭合标签为HTML5写法
    ret = html.replace('/br', 'br').replace('/hr', 'hr');
    // html = html.replace(reDoctype, ''); // 去除Doctype
    ret = ret.replace(reComment, function(str) {
        // retain line breaks
        return str.replace(/[^\n\r]*/, '')
    })

    return ret
}

function lineIncremental(html, tagStart) {
    var lastLineEnd = reLine.lastIndex
    var currentLineEnd
    var retIncrement = 0

    while (currentLineEnd = reLine.exec(html)) {

        // 当查找换行的位置超过了当前标签的开始位置
        if (reLine.lastIndex > tagStart) {
            reLine.lastIndex = lastLineEnd
            break
        } else {
            retIncrement++
        }

        lastLineEnd = reLine.lastIndex
    }
    return retIncrement
}

function setAttributes(node, startTag) {
    var attr

    // attr: ['class="fn-clear list"', 'class', 'fn-clear list']
    while (attr = reAttr.exec(startTag)) {
        if (attr[0] === node.tagName) {
            continue
        }

        // 属性值可选，如<input type="checkbox" checked>
        if (attr[0] in fillAttrs) {
            node.setAttribute(attr[0], attr[0])
        } else {
            node.setAttribute(attr[1], attr[2])
            attr[1] === 'class' && (node.className = attr[2])
            attr[1] === 'id' && (node.id = attr[2])
        }
    }
}

function lower(str) {
    return str.toLowerCase()
}

function printDom(root) {
    var cache = [];
    var str = JSON.stringify(root, function(key, value) {
        if (key === 'innerHTML') return ''
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return
            }
            // Store value in our collection
            cache.push(value)
        }
        return value
    })
    // Enable garbage collection
    cache = null

    return str
}