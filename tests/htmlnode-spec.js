var expect = require('expect.js');
var mocha = require('mocha');
var HtmlNode = require('../lib/htmlnode').htmlnode;
var node = new HtmlNode();
node.tagName = 'div';
var childNode0 = new HtmlNode();
var childNode1 = new HtmlNode();
var childNode2 = new HtmlNode();

node.attrs['foo'] = 'bar';

describe('HTMLNode', function(){
    describe('node attribute operations', function(){
        it('has attribute foo', function(){
            expect(node.hasAttribute('foo')).to.be(true);
        });

        it('get attribute foo', function(){
            expect(node.getAttribute('foo')).to.be('bar');
        });

        it('attributes', function(){
            expect(node.attributes()).to.eql(['foo']);
        });

        it('removeAttribute', function(){
            node.removeAttribute('foo');
            expect(node.getAttribute('foo')).to.eql(null);
        });

        it('setAttribute', function(){
            node.setAttribute('hello', 'world');
            expect(node.getAttribute('hello')).to.eql('world');
        });
    })

    describe('nodes operations', function(){
        it('appendChild', function(){
            expect(node.childNodes.length).to.be(0);
            node.appendChild(childNode0);
            expect(node.childNodes[0]).to.be(childNode0);
            expect(childNode0.parentNode).to.be(node);
        })
    })

    describe('get elements', function(){
        it('getElementById', function(){
            childNode0.setAttribute('id', 'id1');
            expect(node.getElementById('id1')).to.be(childNode0);
        })

        it('getElementsByTagName', function(){
            childNode1.tagName = 'p';
            childNode2.tagName = 'p';
            node.appendChild(childNode1);
            node.appendChild(childNode2);
            expect(node.getElementsByTagName('p')).to.eql([childNode1, childNode2]);
        });

        it('getElementsByClassName', function(){
            childNode1.setAttribute('class', 'testClass');
            childNode2.setAttribute('class', 'testClass');
            expect(node.getElementsByClassName('testClass')).to.eql([childNode1, childNode2]);
        });

    })
})
