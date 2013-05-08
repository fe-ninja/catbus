'use strict';

var Node = require('./htmlnode').htmlnode;
var debug = false;
// var debug = true;

// Regular Expressions for parsing tags and attributes
var reTag = /<(\/?)(\w+)[^>]*>/,
    reStartTag = /^<(\w+)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
    reEndTag = /^<\/(\w+)[^>]*>/,
    reAttr = /([\w:-]+)(?:\s*=\s*((?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g,
    reComment = /<!--(.*)-->/g,
    reDoctype = /^<!doctype\s[^>]+>/i,
    reDoctypeSniffing = /^<!DOCTYPE\s+HTML\sPUBLIC\s+"\-\/\/W3C\/\/DTD\s+(X?HTML)\s+([\d.])+(?:\s+(\w+))?\/\/EN"\s+"[^"]+">/i,
    reDoctypeHTML5 = /^<!DOCTYPE\s+HTML>/i,
    reNewLine = /\r\n|\r|\n/;

// Self-closing Elements - HTML 4&5
// http://www.w3.org/TR/html4/index/elements.html
// http://dev.w3.org/html5/html-author/#index-of-elements
var selfClosing = makeMap("area,base, basefont,br,col,command,embed,hr,img,input,link,meta,param,source");

// Block Elements - HTML 4.01
var block = makeMap("address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul");

// Inline Elements - HTML 4.01
var inline = makeMap("a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var");

// Attributes that have their values filled in disabled="disabled"
var fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected");

// Special Elements (can contain anything)
var special = makeMap("script,style,textarea,xmp");
var regexp_special = makeRegExp("script,style,textarea,xmp");

function makeRegExp(tags){
    var re = {};
    tags = tags.split(",");
    for(var i=0,l=tags.length; i<l; i++){
        re[tags[i]] = new RegExp("(.*)?<\/" + tags[i] + "[^>]*>", "i");
    }
    return re;
}

function makeMap(str){
    var obj = {}, items = str.split(",");
    for ( var i = 0; i < items.length; i++ ) {
        obj[ items[i] ] = true;
    }
    return obj;
}

// HTML预处理
function normalize(html) {

    // 统一自闭合标签为HTML5写法 
    html = html.replace('/br', 'br').replace('/hr', 'hr');

    // 去除Doctype
    html = html.replace(reDoctype, '');

    // 去除HTML注释
    html = html.replace(reComment, '');

    return html;
}

function Parser(html) {
    debug && console.log('in parser');
    var tagProp;
    var stack = [];
    var tagResult;

    this.html = html;
    this.DOM = new Node();
    this.DOM.tagName = 'root';

    html = normalize(html);
    html = html.substring(html.indexOf('<'));

    while (html.match(reTag)) {

        // Format: ['TAG', 'ENDMARK', 'TAGNAME', index, input]
        // Example: [ '</html>', '/', 'html', index: 1092, input: '...raw string' ]
        tagResult = html.match(reTag);

        tagProp = {};
        tagProp.startTag = tagResult[0]
        tagProp.isEndTag = (tagResult[1] === '/');
        tagProp.tagName = tagResult[2];
        tagProp.tagType = (tagResult[2] in selfClosing) ? 'self-closing' : 'normal';

        // 是结束标签
        if (tagProp.isEndTag) {
            if (stack.length > 0 && stack[stack.length - 1].node.tagName === tagProp.tagName) {
                debug && console.log('pop')
                stack.pop();
            } else {
                console.log('Tag not closed');

                // 标签未闭合的兼容处理
                while (stack.length > 0 &&
                        stack[stack.length - 1].node.tagName !== tagProp.tagName) {
                    stack.pop();
                }
                stack.length > 0 && stack.pop(); // 配对标签出栈
            }
        } else {
            tagProp.node = new Node();
            tagProp.node.tagName = tagProp.tagName;
            tagProp.node.parentNode = tagProp.parentNode;

            // do something for starttag

            // 设置父元素节点
            if (stack.length > 0) {
                tagProp.parentNode = stack[stack.length - 1].node;
            } else {
                tagProp.parentNode = this.DOM;
            }

            tagProp.parentNode.appendChild(tagProp.node);

            if (tagProp.tagType === 'normal') {
                stack.push(tagProp);
                // do something for normal tag
            } else if (tagProp.tagType === 'self-closing') {
                // do something for self-closing tag
            }
        }

        html = html.replace(tagProp.startTag, '');
        html = html.substring(html.indexOf('<'));

        // console.log(stack.length)
        // console.log(html)
    }
    // console.log(html)

    debug && console.log(stack);
    // console.log(stack.length);

    if (stack.length > 0) {
        console.log('Tag not closed');
    }

    // print the node tree
    var cache = [];
    var str = JSON.stringify(this.DOM, function(key, value) {
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
    console.log(str)

    // console.log(this.DOM)
}

exports.parser = Parser;