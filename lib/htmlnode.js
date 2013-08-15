var utils = require('./utils')

function HTMLNode(config) {
    this._init(config)
}

HTMLNode.prototype = {
    _init: function(config) {
        this.tagName = null
        this.nodeType = 1
        this.attrs = {}
        // this.selfClose = false
        this.index = 0
        this.lastIndex = 0
        this.className = ''
        this.id = ''
        this.innerHTML = ''
        this.childNodes = []
        this.parentNode = null

        config && utils.mix(this, config)
    },
    hasAttribute: function(name){
        return this.attrs.hasOwnProperty(name)
    },
    setAttribute: function(name, value){
        this.attrs[name] = value
    },
    getAttribute: function(name){
        return this.hasAttribute(name) ? this.attrs[name] : null
    },
    removeAttribute: function(name){
        this.attrs[name] = null
        delete this.attrs[name]
    },
    attributes: function(){
        var a = []
        for(var k in this.attrs){
            if(this.attrs.hasOwnProperty(k)){
                a.push(k)
            }
        }
        return a
    },
    appendChild: function(node){
        if (!(node instanceof HTMLNode)) {
            throw new TypeError("required Node object.")
        }
        node.parentNode = this
        this.childNodes.push(node)
    },
    getElementsByTagName: function(tagName) {
        var elements = []
        var nodeList = utils.iterate(this)

        if (tagName === '*') {
            return nodeList
        }

        for (var i = 0; i < nodeList.length; i++) {
            if (nodeList[i].tagName === tagName) {
                elements.push(nodeList[i])
            }
        }
        return elements
    },
    getElementById: function(id) {
        var element
        var nodeList = utils.iterate(this)

        for (var i = 0; i < nodeList.length; i++) {
            if (nodeList[i].getAttribute('id') && 
                    nodeList[i].getAttribute('id') === id) {
                element = nodeList[i]
            }
        }

        return element ? element : null
    },
    getElementsByClassName: function(className) {
        var elements = []
        var nodeList = utils.iterate(this)

        for (var i = 0; i < nodeList.length; i++) {
            if (nodeList[i].getAttribute('class') && 
                    nodeList[i].getAttribute('class').indexOf(className) > -1) {
                elements.push(nodeList[i])
            }
        }
        return elements
    }
}

exports.HTMLNode = HTMLNode
