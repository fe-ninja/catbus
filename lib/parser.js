'use strict';

var Node = require('./htmlnode').htmlnode;

// Regular Expressions for parsing tags and attributes
var reTag = /<\/?(\w+).*>/,
    reStartTag = /^<(\w+)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
    reEndTag = /^<\/(\w+)[^>]*>/,
    reAttr = /([\w:-]+)(?:\s*=\s*((?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g,
    reDoctype = /^<!doctype\s[^>]+>/i,
    reDoctypeSniffing = /^<!DOCTYPE\s+HTML\sPUBLIC\s+"\-\/\/W3C\/\/DTD\s+(X?HTML)\s+([\d.])+(?:\s+(\w+))?\/\/EN"\s+"[^"]+">/i,
    reDoctypeHTML5 = /^<!DOCTYPE\s+HTML>/i,
    reNewLine = /\r\n|\r|\n/;

// Empty Elements - HTML 4.01
var empty = makeMap("area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed");

// Block Elements - HTML 4.01
var block = makeMap("address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul");

// Inline Elements - HTML 4.01
var inline = makeMap("a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var");

// Elements that you can, intentionally, leave open
// (and which close themselves)
var closeSelf = makeMap("colgroup,dd,dt,li,option,p,td,tfoot,th,thead,tr");

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
    for ( var i = 0; i < items.length; i++ )
        obj[ items[i] ] = true;
    return obj;
}

function Parser(html) {
    console.log('in parser');
    var _html = html;
    var _tagProp;
    var _currentNode;
    var _parentNode;
    var length;
    var tagResult;

    this.DOMRoot = new Node();
    this.DOMRoot.tagName = 'document';
    this.stack = [];

    html = html.replace(reDoctype, '');
    html = html.substring(html.indexOf('<'));

    while (html.match(reTag)) {

        console.log(html.match(reTag)[0])
        tagResult = html.match(reTag);
        // break;
        // length = this.stack.length;

        // // 初始化DOM根节点
        // if (!_parentNode ) {
        //     _parentNode = this.DOMRoot;
        // }

        // if (_parentNode.childNodes.length === 0) {

        // }

        // if (this.stack[length - 1] && !this.stack[length - 1].endTag) {
        //     // 结束标签
        //     // console.log('</' + this.stack[this.stack.length - 1].tagName + '>')
        //     tagResult = html.match(new RegExp(this.stack[length - 1].endTag));
        // } else {
        //     // 新开始标签
        //     // [ '<div class="oldcontent">','div',' class="oldcontent"','',index: 0,  input: '...']
        //     tagResult = html.match(reStartTag);
        //     _currentNode = new Node();
        // }
        
        // // console.log(tagResult)
        _tagProp = {};
        _tagProp.startTag = tagResult[0];
        // _tagProp.tagName = tagResult[1];

        // if (_tagProp.tagName in empty || _tagProp.startTag.indexOf('</') > -1) {
        //     // 自闭合标签 或 结束标签
        //     this.stack[length - 1].tagName !== _tagProp.tagName && (console.log('标签未闭合'));
        //     this.stack.pop();
        //     _tagProp.endTag = '';
        // } else {
        //     parentNode.appendChild(_currentNode);
        //     _tagProp.endTag = '</' + _tagProp.tagName + '>';
        //     this.stack.push(_tagProp);
        // }

        html = html.replace(_tagProp.startTag, '');
        html = html.substring(html.indexOf('<'));
        // console.log(JSON.stringify(this.stack));
    }

    console.log(JSON.stringify(this.stack));

}

exports.parser = Parser;
