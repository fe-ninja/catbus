var test; // unused
var sum;

sum = a; // undef
if (sum & a) { // bitwise
  ;
}

function Class(){}

var c = Class() // newcap


var nums = [];

for (var i = 0; i < 10; i++) {
  nums[i] = function (j) { // loopfunc
    return i + j;
  };
}


debugger; // debug

// redundant comma
Class({"test":'val',}) // obj extra comma
Class({,}) 
Class({test:1,bb:2,cc:3,})

// comments 
this.amount = new Amount({
    element: '#' + elId + ' .j-amount-element',
    amountText: data['amountText'],
    amount: this._getAmountForAjax(),
}).render()
// comments 

// should not be detected
var reg = /{ab:cd,}/
obj.value = obj.value.replace(/\.{2,}/g,".");

// normal comma usage
for (i = 0, j = 9; i < 9; i++, j--) {
    //do something
}
var arr = [1,2,3,3,4,5]
var obj = {a:1,b:2,c:3}
var obj = {"a":"1","b":"2","c":"3"}