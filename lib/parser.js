'use strict';

var Node = require('./htmlnode').htmlnode;
var debug = false;
// var debug = true;

// Regular Expressions for parsing tags and attributes
var reTag = /<(\/?)(\w+)[^>]*>/g,
    // reStartTag = /^<(\w+)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
    // reEndTag = /^<\/(\w+)[^>]*>/,
    reAttr = /([\w:-]+)(?:\s*=\s*((?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g,
    reComment = /<!--(.*)-->/g,
    reDoctype = /^<!doctype\s[^>]+>/i;
    // reDoctypeSniffing = /^<!DOCTYPE\s+HTML\sPUBLIC\s+"\-\/\/W3C\/\/DTD\s+(X?HTML)\s+([\d.])+(?:\s+(\w+))?\/\/EN"\s+"[^"]+">/i,
    // reDoctypeHTML5 = /^<!DOCTYPE\s+HTML>/i,
    // reNewLine = /\r\n|\r|\n/;

// Self-closing Elements - HTML 4&5
// http://www.w3.org/TR/html4/index/elements.html
// http://dev.w3.org/html5/html-author/#index-of-elements
var selfClosing = makeMap("area,base,basefont,br,col,command,embed,hr,img,input,link,meta,param,source");

// Block Elements - HTML 4.01
// var block = makeMap("address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul");

// Inline Elements - HTML 4.01
// var inline = makeMap("a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var");

// Attributes that have their values filled in disabled="disabled"
var fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected");

// Special Elements (can contain anything)
// var special = makeMap("script,style,textarea,xmp");
// var regexp_special = makeRegExp("script,style,textarea,xmp");

// function makeRegExp(tags) {
//     var re = {};
//     tags = tags.split(",");
//     for(var i=0,l=tags.length; i<l; i++){
//         re[tags[i]] = new RegExp("(.*)?<\/" + tags[i] + "[^>]*>", "i");
//     }
//     return re;
// }

function makeMap(str) {
    var obj = {}, items = str.split(",");
    for (var i = 0; i < items.length; i++) {
        obj[items[i]] = true;
    }
    return obj;
}

// HTML标准化处理
function normalize(html) {

    // 统一自闭合标签为HTML5写法 
    html = html.replace('/br', 'br').replace('/hr', 'hr');

    // 去除Doctype
    html = html.replace(reDoctype, '');

    // 去除HTML注释
    html = html.replace(reComment, '');

    html = html.substring(html.indexOf('<'));
    return html;
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

function Parser(html, preprocessor, options) {
    debug && console.log('in parser');
    var tagProp;
    var stack = [];
    var tagResult;
    var currentNode;

    this.inputHtml = html; // 原始HTML串

    // 模拟window和document
    this.window = {};
    this.root = this.document = new Node();
    this.root.tagName = 'document';
    this.window.document = this.document;

    html = normalize(html);

    // HTML自定义预处理
    if (preprocessor &&
            typeof preprocessor === 'function') {
        html = preprocessor(html, options);
    }

    this.processHtml = html;

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
                console.log('ERROR: Tag not closed');
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
            // TODO:抽成独立的函数
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

            // 设置父元素节点
            if (stack.length > 0) {
                tagProp.parentNode = stack[stack.length - 1].node;
            } else {
                tagProp.parentNode = this.root;
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

    debug && console.log(stack);
    // console.log(stack.length);

    // 这种情况一般不会出现，此处留待测试
    if (stack.length > 0) {
        console.log('ERROR Conclusion: Tag not closed');
    }

    // print the node tree
    var cache = [];
    var str = JSON.stringify(this.root, function(key, value) {
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

    // console.log(this.root)
}

exports.parser = Parser;