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

var obj = {
    test: 'val1',
    test1: 'val2',
}