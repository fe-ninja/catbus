function Node() {
    this.tagName = null;
    this.startTag = null;
    this.endTag = null;
    this.attrs = {};
    this.selfClose = false;
    this.startLine = 0;
    this.endLine = 0;
    this.childNodes = [];
    this.parentNode = null;
}

Node.prototype.hasAttribute = function(name){
    return this.attrs.hasOwnProperty(name);
};
Node.prototype.setAttribute = function(name, value){
    this.attrs[name] = value;
};
Node.prototype.getAttribute = function(name){
    return this.hasAttribute(name) ? this.attrs[name] : null;
};
Node.prototype.removeAttribute = function(name){
    this.attrs[name] = null;
    delete this.attrs[name];
};
Node.prototype.attributes = function(){
    var a = [];
    for(var k in this.attrs){
        if(this.attrs.hasOwnProperty(k)){
            a.push(k);
        }
    }
    return a;
};
Node.prototype.appendChild = function(node){
    if(!(node instanceof Node)){throw new TypeError("required Node object.");}
    node.parentNode = this;
    this.childNodes.push(node);
};

exports.htmlnode = Node;
