'use strict';

// tags include comments    
// var regTag=/<(?:\/([^\s>]+)\s*|!--([\s\S]*?)--|!([^>]*?)|([\w\-:]+)((?:\s+[\w\-:]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"']+))?)*?)\s*(\/?))>/g
var Parser, debug
var Node = require('./htmlnode').htmlnode
var reTag = /<(\/?)(\w+)(?:\s+[^>]*)?>/g
var reAttr = /([\w:-]+)(?:\s*=\s*(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+))?/g
var reComment = /<!--[\s\S]*?-->/g
var reDoctype = /<!doctype\s[^>]+>/i
var reLine = /\r?\n/g
var selfClosing = makeMap("area,base,basefont,br,col,command,embed,hr,img,input,link,meta,param,source")
// Attributes that have their values filled in disabled="disabled"
var fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected")
var specialTags = makeMap("script,style,textarea,xmp")
var regexp_special = makeRegExp("script,style,textarea,xmp")

exports.HtmlParser = Parser = function(html, options) {
    this.inputHtml = html;
    this.processHtml = '';
}

Parser.prototype = {
    preprocess: function(preprocessor) {
        var html;

        this.processHtml = normalize(this.inputHtml);
        if (preprocessor &&
                typeof preprocessor === 'function') {
            this.processHtml = preprocessor(this.processHtml);
        }
    },

    // TODO: 处理注释和IE条件注释
    // TODO: 处理多余结束标签
    // 状态栈stack：[node]
    parse: function(reporter, env, html) {
        var tagProp, tag, stack = [], notClose = 0;
        var curNode, retDom = {}, lineNo = 1;

        // mock window & document
        retDom.window = {};
        retDom.document = retDom.root = new Node({tagName: 'document'});
        retDom.window.document = retDom.document;

        debug = env.debug || false;
        html = html || this.processHtml || this.inputHtml;

        // tag: ['</html>', '/', 'html', index: 1092, input: '...raw string']
        while (tag = reTag.exec(html)) {

            lineNo += lineIncremental(html, tag.index)
            log('Line ' + lineNo + ' :' + html.substring(reLine.lastIndex, reTag.lastIndex))
            log('[HtmlParser]: Tag <' + tag[1] + tag[2] + '>')

            tagProp = {
                tag: tag[0],
                isEndTag: tag[1] === '/',
                tagName: lower(tag[2]),
                tagType: tag[2] in selfClosing ? 'self-closing' : 'normal' 
            }

            // end tag
            if (tagProp.isEndTag) {

                if (stack.length === 0) continue;

                // found matched start tag
                if (stack.last().tagName === tagProp.tagName) {
                    curNode = stack.last();
                    curNode.lastIndex = tag.index;

                    if (curNode.index !== curNode.lastIndex) {
                        curNode.innerHTML = html.substring(curNode.index, curNode.lastIndex);
                    }
                    stack.pop();

                    // TODO: do something for matched end tag
                    continue;
                }

                // in special tag
                if (stack.last().tagName in specialTags) {
                    continue;
                }

                // deal with non-close tag
                while (stack.last() && stack.last().tagName !== tagProp.tagName) {

                    reporter.error('Tag ' + stack.last().tag + ' not closed.', stack.last().line, null, {'id': 'Tag-closed', 'description':'标签应闭合'}, null);

                    notClose++ ;
                    stack.pop();
                }
            } 

            // start tag
            else {
                if (stack.last() && stack.last().tagName in specialTags) {
                    log('[Catbus HtmlParser]: Tag <' + tagProp.tagName + '> in special tag: <' + stack.last().tagName+ '>.')
                    continue;
                }

                curNode = new Node({
                    tag: tagProp.tag,
                    tagName: tagProp.tagName,
                    parentNode: null,
                    line: lineNo,
                    index: reTag.lastIndex,
                    lastIndex: reTag.lastIndex
                });

                // do something for starttag
                setAttributes(curNode, tagProp.tag);

                // 设置父元素节点
                if (stack.length > 0) {
                    stack.last().appendChild(curNode)
                } else {
                    retDom.root.appendChild(curNode)
                }

                if (tagProp.tagType === 'normal') {
                    stack.push(curNode);
                    // do something for normal tag
                } else if (tagProp.tagType === 'self-closing') {
                    // do something for self-closing tag
                }
            }

        }

        // special tag not closed
        if (stack.last() && stack.last().tagName in specialTags) {
            console.log('Fatal Error: Line ' + stack.last().line + '. Parsed Error, ' + stack.last().tagName + ' tag not closed.');
            // process.exit();
        }

        // print the node tree
        log('[Catbus HtmlParser]: DOM Tree');
        log(printDom(retDom.root));

        return retDom;
    }
}


// Helper
// ------

Array.prototype.last = function() {
    return this[this.length - 1];
}

function makeRegExp(tags) {
    var re = {};
    tags = tags.split(",");
    for(var i=0,l=tags.length; i<l; i++){
        re[tags[i]] = new RegExp("(.*)?<\/" + tags[i] + "[^>]*>", "i");
    }
    return re;
}

function makeMap(str) {
    var obj = {}, items = str.split(",");
    for (var i = 0; i < items.length; i++) {
        obj[items[i]] = true;
    }
    return obj;
}

function normalize(html) {
    var ret 

    // 统一自闭合标签为HTML5写法
    ret = html.replace('/br', 'br').replace('/hr', 'hr'); 
    // html = html.replace(reDoctype, ''); // 去除Doctype
    ret = ret.replace(reComment, function(substr){
        // console.log('match comments: ' + substr)
        return '';
    }); 

    return ret;
}

function lineIncremental(html, tagStart, lineNo) {
    var lastLineEnd = reLine.lastIndex;
    var currentLineEnd
    var retIncrement = 0;

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
            continue;
        }

        // 属性值可选，如<input type="checkbox" checked>
        if (attr[0] in fillAttrs) {
            node.setAttribute(attr[0], attr[0]);
        } else {
            node.setAttribute(attr[1], attr[2]);
            attr[1] === 'class' && (node.className = attr[2]);
            attr[1] === 'id' && (node.id = attr[2]);
        }
    }
}

function lower(str) {
    return str.toLowerCase()
}

function log(msg) {
    if (debug) {
        console.log(msg);
    }
}

function printDom(root) {
    var cache = [];
    var str = JSON.stringify(root, function(key, value) {
        if (key === 'innerHTML') return '';
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    })
    // Enable garbage collection
    cache = null; 

    return str
}