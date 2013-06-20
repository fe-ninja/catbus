'use strict';

var Node = require('./htmlnode').htmlnode;
var debug;

// Regular Expressions for parsing tags and attributes
var reTag = /<(\/?)(\w+)[^>]*>/g,
    reAttr = /([\w:-]+)(?:\s*=\s*((?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g,
    reComment = /<!--(.*)-->/g,
    reDoctype = /<!doctype\s[^>]+>/i,
    reLine = /\r?\n/g;

// tags include comments    
// var regTag=/<(?:\/([^\s>]+)\s*|!--([\s\S]*?)--|!([^>]*?)|([\w\-:]+)((?:\s+[\w\-:]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"']+))?)*?)\s*(\/?))>/g,

// Self-closing Elements - HTML 4&5
// http://www.w3.org/TR/html4/index/elements.html
// http://dev.w3.org/html5/html-author/#index-of-elements
var selfClosing = makeMap("area,base,basefont,br,col,command,embed,hr,img,input,link,meta,param,source");

// Attributes that have their values filled in disabled="disabled"
var fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected");

// Special Elements (can contain anything)
var special = makeMap("script,style,textarea,xmp");
var regexp_special = makeRegExp("script,style,textarea,xmp");

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

// HTML标准化处理
function normalize(html) {
    html = html.replace('/br', 'br').replace('/hr', 'hr'); // 统一自闭合标签为HTML5写法
    html = html.replace(reDoctype, ''); // 去除Doctype
    html = html.replace(reComment, ''); // 去除HTML注释
    return html;
}

function setAttributes(tagProp) {
    var attr = [];
    var _attr;
    while (true) {
        _attr = reAttr.exec(tagProp.startTag);
        if (!_attr) {
            break;
        }
        if (_attr[0] === tagProp.node.tagName) {
            continue;
        }

        // attr数据结构：
        // ['class="fn-clear bankAlphabet-list"', 'class', 'fn-clear bankAlphabet-list']
        attr[0] = _attr[0];

        // 属性值可选的情况
        if (attr[0] in fillAttrs) {
            tagProp.node.setAttribute(attr[0], attr[0]);
        } else {
            // key
            attr[1] = attr[0].split('=')[0];
            // value
            attr[2] = attr[0].split('=')[1].replace(/\'|\"/g, '');
            tagProp.node.setAttribute(attr[1], attr[2]);
            attr[1] === 'class' && (tagProp.node.className = attr[2]);
            attr[1] === 'id' && (tagProp.node.id = attr[2]);
        }

    }

}

function Parser(html, options) {
    log('in parser');
    this.inputHtml = html;
    this.processHtml = '';
}

Parser.prototype.preprocess = function(preprocessor) {
    var html;

    this.processHtml = normalize(this.inputHtml);
    if (preprocessor &&
            typeof preprocessor === 'function') {
        this.processHtml = preprocessor(this.processHtml);
    }
}

Parser.prototype.parse = function(reporter, env, html) {
    var tagProp;
    var stack = [];
    var tagResult;
    var currentNode;
    var htmlTree = {};
    var currentLine = 1;
    var currentCol = 1;
    var raw;

    // mock window & document
    htmlTree.window = {};
    htmlTree.root = htmlTree.document = new Node();
    htmlTree.root.tagName = 'document';
    htmlTree.window.document = htmlTree.document;

    debug = env.debug || false;
    html = html || this.processHtml || this.inputHtml;

    // 每匹配一次lastIndex自动置为本次匹配末尾
    // 匹配结果tagResult：[ '</html>', '/', 'html', index: 1092, input: '...raw string' ]
    while (tagResult = reTag.exec(html)) {
        var lastLinePos;
        var currentLineBreak;
        var currentLPos;

        // set line number 
        while (currentLineBreak = reLine.exec(html)) {
            currentLPos = currentLineBreak.index;

            // 当查找换行的位置超过了当前标签的开始位置
            if (reLine.lastIndex > tagResult.index) {
                reLine.lastIndex = lastLinePos;
                break;
            } else {
                log('[Catbus HtmlParser]: Line Number Info ')
                // console.log('lastLinePos: ' + lastLinePos)
                // console.log('currentLPos: ' + currentLPos)
                log('prevLine ' + currentLine + ' :' + html.substring(lastLinePos, currentLPos))
                currentLine++;
                log('Line ' + currentLine + ' :' + html.substring(reLine.lastIndex, reTag.lastIndex))
                log('')
            }
            lastLinePos = reLine.lastIndex;
        }

        log('Tag <' + tagResult[2] + '> Start Position:' + tagResult.index)
        log('Tag <' + tagResult[2] + '> End Position:' + reTag.lastIndex)

        tagProp = {};
        tagProp.startTag = tagResult[0];
        tagProp.isEndTag = (tagResult[1] === '/');
        tagProp.tagName = tagResult[2];
        tagProp.line = currentLine;
        tagProp.tagType = (tagResult[2] in selfClosing) ? 'self-closing' : 'normal';

        // 是结束标签
        if (tagProp.isEndTag) {

            // 标签未闭合的兼容处理
            while (stack.length > 0 &&
                    stack.last().node.tagName.toLowerCase() !== tagProp.tagName.toLowerCase()) {

                // 特殊标签未闭合，直接报解析错误
                if (stack.last().node.tagName.toLowerCase() in special) {
                    console.log('Fatal Error: Line ' + stack.last().line + '. Parsed Error, script tag not closed.');
                    process.exit();
                }

                reporter.error('Tag ' + stack.last().startTag + ' not closed.', stack.last().line, null, {'id': 'Tag-closed', 'description':'标签应闭合'}, null);
                stack.pop();
            }

            if (stack.length > 0) {
                currentNode = stack.last().node;
                currentNode.lastIndex = tagResult.index;

                // innerHTML不为空
                if (currentNode.index !== currentNode.lastIndex) {
                    currentNode.innerHTML = html.substring(currentNode.index, currentNode.lastIndex);
                }
                stack.pop(); // 配对标签出栈
            }
        } else {
            if (stack.last() && stack.last().node.tagName.toLowerCase() in special) {
                log('[Catbus HtmlParser]: start tag in special.');
                continue;
            }

            tagProp.node = new Node();
            tagProp.node.tagName = tagProp.tagName;
            tagProp.node.parentNode = tagProp.parentNode;
            tagProp.node.line = tagProp.line;
            // tagProp.node.selfClose = tagProp.tagType === 'self-closing' ? true : false;
            tagProp.node.index = tagProp.node.lastIndex = reTag.lastIndex;

            // do something for starttag
            setAttributes(tagProp);

            // 设置父元素节点
            if (stack.length > 0) {
                tagProp.parentNode = stack.last().node;
            } else {
                tagProp.parentNode = htmlTree.root;
            }

            tagProp.parentNode.appendChild(tagProp.node);

            if (tagProp.tagType === 'normal') {
                stack.push(tagProp);
                // do something for normal tag
            } else if (tagProp.tagType === 'self-closing') {
                // do something for self-closing tag
            }
        }

    }

    // stack 节点解析堆栈，格式：
    // [
    //     {
    //         startTag: '<div class="hide">',
    //         isEndTag: false,
    //         tagName: 'div',
    //         tagType: 'normal',
    //         node: Node
    //     }
    // ]
    log(stack);

    // print the node tree
    var cache = [];
    var str = JSON.stringify(htmlTree.root, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });
    cache = null; // Enable garbage collection

    log('[Catbus HtmlParser]: DOM Tree');
    log(str)

    // 理论上这种情况不会出现，仅留待观察
    if (stack.length > 0) {
        console.error('ERROR: Parse Stack Is Not Clean');
    } else {
        log('File Parsed OK.')
    }

    log('[Catbus HtmlParser]: File Parse Finished.');

    return htmlTree;
}

function log(msg) {
    if (debug) {
        console.log(msg);
    }
}

exports.HtmlParser = Parser;