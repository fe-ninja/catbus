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

Class({"test":'val',}) // obj extra comma
Class({,}) // cannot detect
Class({test:1,bb:2,cc:3,})