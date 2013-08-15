var Velocity = require('velocityjs');
var stringUtil = require('./string-util');
var Parser = Velocity.Parser;
var Compile = Velocity.Compile;
var conditionTrue = {type: 'bool', value: 'true'};
var conditionFalse = {type: 'bool', value: 'false'};

function VelocityParser(){}

VelocityParser.prototype.preprocess = function(rawVmStr, callback){
    var vmTree = Parser.parse(rawVmStr);
    if (callback &&
            typeof callback === 'function') {
        vmTree = callback(vmTree);
    }
    
    return vmTree;
}

VelocityParser.prototype.compile = function(vmTree, context) {
    var Compiler = new Compile(vmTree);
    return Compiler.render(context);
}

VelocityParser.prototype.render = function(rawVmStr, context, parseCallback) {
    var vmTree = this.preprocess(rawVmStr, parseCallback);
    return this.compile(vmTree, context);
}

VelocityParser.prototype.conditionRender = function(rawVmStr, context, parseCallback) {
    var vmTree, vmCompiled;
    var htmlStrArry = [];
    var conArr = [];
    var conTree = [];

    context = context || {};
    context.stringUtil = stringUtil;

    vmTree = this.preprocess(rawVmStr, parseCallback)
    getConditionArray(vmTree, conArr);
    // console.log(conArr)
    // console.log('conArr length: ' + conArr.length)

    // 性能考虑，条件超过6个的不处理了
    if (conArr.length > 0 && conArr.length < 7) {
        conTree = combinationCondition(conArr, vmTree);
        for (var i = 0; i < conTree.length; i++) {
            // console.log('iteration')
            vmCompiled = this.compile(conTree[i], context);
            htmlStrArry.push(vmCompiled)
        }
    } else {
        vmCompiled = this.compile(vmTree, context);
        htmlStrArry.push(vmCompiled);
    }
        
    return htmlStrArry;
}

exports.velocityParser = new VelocityParser();
// var conArr = [];
// getConditionArray(vmTree, conArr);
// console.log(conArr)
// var resultArr = combinationCondition(conArr, vmTree)
// console.log(resultArr.length);

function getConditionArray(vmTree, conArr) {
    for (var i = 0; i < vmTree.length; i++) {
        if (Object.prototype.toString.call(vmTree[i]) === '[object Array]') {
            getConditionArray(vmTree[i], conArr);
        } else if(vmTree[i].type === 'if' ||
                vmTree[i].type === 'elseif') {
            // 初始化
            vmTree[i].condition = conditionTrue;
            conArr.push(vmTree[i]);
        }
    }
}

// 排列算法，返回一个包含所有排列结果的数组
function permutation(input, permArr, usedChars) {
    var i, ch;
    permArr = permArr || [];
    usedChars = usedChars || [];
    // console.log('in permutation')

    for (i = 0; i < input.length; i++) {
        ch = input.splice(i, 1)[0];
        usedChars.push(ch);
        if (input.length == 0 && 
                permArr.join('-').indexOf(usedChars.join(',')) == -1) { // 去重
            permArr.push(usedChars.slice());
        }
        permutation(input, permArr, usedChars);
        input.splice(i, 0, ch);
        usedChars.pop();
    }
    return permArr
}

// console.log(permutation([0,0,1]))

// 组合算法
function combination(length, initVal, subVal) {
    var arr = [];
    var resultArr = [];
    var len = length;
    var checklength = Math.pow(2, length);

    // console.log('in combination')

    // 初始化
    while (len--) {
        arr[len] = initVal;
    }
    resultArr.push(arr.concat());

    // 包含0到length个subVal的组合
    for(var i = 0; i < length; i++) {
        arr[i] = initVal;
        for(var j = 0; j <= i; j++) {
            arr[j] = subVal;
        }
        resultArr = resultArr.concat(permutation(arr));
    }

    // 校验是否全覆盖，为了可用性，暂时注释
    // if (resultArr.length === checklength) {
    //     return resultArr;
    // } else {
    //     return false;
    // }
    return resultArr;
}
// console.log(combination(5,1,0).length);

function combinationCondition(conArr, vmTree) {
    var combinations = combination(conArr.length, 1, 0);
    var resultArr = [];
    // console.log(combinations)

    for (var i = 0; i < combinations.length; i++) {
        combinations[i];
        for (var j = 0; j < conArr.length; j++) {
            if (combinations[i][j] === 0 ) {
                conArr[j] = conditionFalse;
            } else {
                conArr[j] = conditionTrue;
            }
        }
        // console.log(conArr)
        resultArr.push(vmTree);
    }
    return resultArr;
}