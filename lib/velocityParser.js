var Velocity = require('velocityjs');
var Parser = Velocity.Parser;
var Compile = Velocity.Compile;

// 是否继续循环（是否还有逻辑判断没有处理过）
var isContinue = true;
var conVmTree = [];
function VelocityParser(){

}

VelocityParser.prototype.preprocess = function(rawVmStr, callback){
    var vmTree = Parser.parse(rawVmStr);
    if (callback &&
            typeof callback === 'function') {
        vmTree = callback(vmTree);
    }

    // console.log('---------------vm parsed tree: --------------------------')
    // console.log(JSON.stringify(vmTree));
    // console.log(vmTree);
    // console.log('---------------vm parsed tree: --------------------------')
    
    return vmTree;
}

VelocityParser.prototype.compile = function(vmTree, context) {
    var Compiler = new Compile(vmTree);
    return Compiler.render(context);
}

VelocityParser.prototype.conditionRender = function(rawVmStr, context, parseCallback) {
    var vmTreeParsed, vmCompiled;
    var htmlStrArry = [];

    vmTreeParsed = this.preprocess(rawVmStr, parseCallback)
        
    while(isContinue) {
        vmTreeParsed = iterationCondition(vmTreeParsed);
        // console.log('---------------vm parsed tree: --------------------------')
        // console.log(JSON.stringify(vmTreeParsed))
        // console.log('---------------vm parsed tree: --------------------------')
        vmCompiled = this.compile(vmTreeParsed, context);
        // console.log(vmCompiled)
        htmlStrArry.push(vmCompiled);
        // console.log('isContinue: ' + isContinue)
    }

    return htmlStrArry;
}

exports.velocityParser = new VelocityParser();

// 循环替换条件判断的判断值
// 返回一次替换后的结果
// TODO: 处理嵌套条件判断的所有情况
function iterationCondition(vmTree) {

    // 每一次逻辑分支if..elseif一次只处理一次，处理了if，elseif就不处理了
    var processed = false; 
    var _vmTree = vmTree.concat();
    var conditionTrue = {
        type: 'bool',
        value: 'true'
    }
    var conditionFalse = {
        type: 'bool',
        value: 'false'
    }

    for (var i = 0; i < vmTree.length; i++) {

        // 如果是逻辑分支
        if (Object.prototype.toString.call(vmTree[i]) === '[object Array]') {
            iterationCondition(vmTree[i]);
            
        // 如果是逻辑判断节点(if和elseif)
        } else if(typeof vmTree[i] === 'object' &&
            vmTree[i].condition &&
                !processed) {

            // 把循环遇到的第一个未处理过的判断条件设为'TRUE'
            // 一般的判断条件不会直接写TRUE/FALSE
            // 所以，未经处理的parse结果vmTree[i].condition值一般为：
            // {
            //  type: 'reference',
            //  id: 'stringUtil',
            //  path: [{type:'methond', id:'equals', args[Object]}],
            //  leader: '$'
            // }

            // 如果是处理过的，condition设置为'true'的
            if (vmTree[i].condition.type === 'bool' && 
                    vmTree[i].condition.value === 'true') {
                vmTree[i].condition = conditionFalse;
                isContinue = false;
            } else if (vmTree[i].condition.type !== 'bool') {
                vmTree[i].condition = conditionTrue;
                isContinue = true;
                processed = true;
                // console.log('first process true')
            }

            // if (vmTree[i].condition.type !== 'bool') {
            //     vmTree[i].condition = conditionTrue;

            // } else if (vmTree[i].condition.value === 'true') {
            //     vmTree[i].condition = conditionFalse;
            //     isContinue = false;
            // }
        }
    }

    return vmTree;
}