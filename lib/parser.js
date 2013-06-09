'use strict';

var Node = require('./htmlnode').htmlnode;
var debug = false;
// var debug = true;

// Regular Expressions for parsing tags and attributes
var reTag = /<(\/?)(\w+)[^>]*>/g,
    reAttr = /([\w:-]+)(?:\s*=\s*((?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g,
    reComment = /<!--(.*)-->/g,
    reDoctype = /^<!doctype\s[^>]+>/i;

// Self-closing Elements - HTML 4&5
// http://www.w3.org/TR/html4/index/elements.html
// http://dev.w3.org/html5/html-author/#index-of-elements
var selfClosing = makeMap("area,base,basefont,br,col,command,embed,hr,img,input,link,meta,param,source");

// Attributes that have their values filled in disabled="disabled"
var fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected");

// Special Elements (can contain anything)
var special = makeMap("script,style,textarea,xmp");
var regexp_special = makeRegExp("script,style,textarea,xmp");

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
    html = html.substring(html.indexOf('<'));
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
        // console.log(attr[0])
        if (attr[0] in fillAttrs) {
            tagProp.node.setAttribute(attr[0], attr[0]);
        } else {
            // key
            attr[1] = attr[0].split('=')[0];
            // value
            attr[2] = attr[0].split('=')[1].replace(/\'|\"/g, '');
            tagProp.node.setAttribute(attr[1], attr[2]);
        }

    }
}

function Parser(html, options) {
    debug && console.log('in parser');
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

// TODO: 增强对script标签的处理，现在script标签里有尖括号，解析会有问题
Parser.prototype.parse = function(html) {
    var tagProp;
    var stack = [];
    var tagResult;
    var currentNode;
    var htmlTree = {};

    // 模拟window和document
    htmlTree.window = {};
    htmlTree.root = htmlTree.document = new Node();
    htmlTree.root.tagName = 'document';
    htmlTree.window.document = htmlTree.document;

    html = html || this.processHtml || this.inputHtml;

    while (html.length) {

        // 每匹配一次lastIndex自动置为本次匹配末尾
        // 匹配结果：[ '</html>', '/', 'html', index: 1092, input: '...raw string' ]
        tagResult = reTag.exec(html);
        // console.log(tagResult)

        if (!tagResult) {
            break;
        }

        debug && console.log('The Tag Start Position:' + tagResult.index)
        debug && console.log('The Tag End Position:' + reTag.lastIndex)

        tagProp = {};
        tagProp.startTag = tagResult[0]
        tagProp.isEndTag = (tagResult[1] === '/');
        tagProp.tagName = tagResult[2];
        tagProp.tagType = (tagResult[2] in selfClosing) ? 'self-closing' : 'normal';

        // 是结束标签
        if (tagProp.isEndTag) {

            // 标签未闭合的兼容处理
            while (stack.length > 0 &&
                    stack[stack.length - 1].node.tagName !== tagProp.tagName) {
                console.error('ERROR: Tag ' + stack[stack.length - 1].startTag + ' not closed');
                process.exit('ERROR: Tag not closed');
                stack.pop();
            }

            if (stack.length > 0) {
                currentNode = stack[stack.length - 1].node;
                currentNode.lastIndex = tagResult.index;

                // innerHTML不为空
                if (currentNode.index !== currentNode.lastIndex) {
                    currentNode.innerHTML = html.substring(currentNode.index, currentNode.lastIndex);
                }
                stack.pop(); // 配对标签出栈
            }
        } else {
            tagProp.node = new Node();
            tagProp.node.tagName = tagProp.tagName;
            tagProp.node.parentNode = tagProp.parentNode;
            tagProp.node.selfClose = tagProp.tagType === 'self-closing' ? true : false;
            tagProp.node.index = tagProp.node.lastIndex = reTag.lastIndex;

            // do something for starttag
            setAttributes(tagProp);

            // 设置父元素节点
            if (stack.length > 0) {
                tagProp.parentNode = stack[stack.length - 1].node;
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
    debug && console.log(stack);

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

    debug && console.log('--------------------------DOM TREE-------------------------')
    debug && console.log(str)
    debug && console.log('--------------------------DOM TREE-------------------------')

    // 这种情况一般不会出现，此处留待测试
    if (stack.length > 0) {
        console.error('ERROR: Parse Stack Is Not Clean');
    } else {
        debug && console.log('File Parsed OK.')
    }

    return htmlTree;
}

exports.HtmlParser = Parser;