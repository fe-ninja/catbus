var compactTree = [
    '<p>content out side</p>\n', 
    [
        {
            type: 'if',
            condition: [Object]
        },
        '\n Content if 1\n    ', 
        [
            [Object],
            '\n Content if 1.1\n ',
            [Object],
            '\n Content elseif 1.1\n    '
        ],
        '\n', 
        {
            type: 'elseif',
            condition: [Object]
        },
        '  \n Content elseif 1\n', 
        {
            type: 'else'
        },
        '\n Content else 1\n'
    ],
    ' \n\n'
];

var vmTree = ["<p>content out side</p>\n", [{
            "type": "if",
            "condition": {
                "type": "references",
                "id": "stringUtil",
                "path": [{
                        "type": "method",
                        "id": "equals",
                        "args": [{
                                "type": "references",
                                "id": "result",
                                "leader": "$"
                            }, {
                                "type": "string",
                                "value": "success"
                            }
                        ]
                    }
                ],
                "leader": "$"
            }
        }, "\n    Content if 1\n    ", [{
                "type": "if",
                "condition": {
                    "type": "references",
                    "id": "stringUtil",
                    "path": [{
                            "type": "method",
                            "id": "equals",
                            "args": [{
                                    "type": "references",
                                    "id": "aaa",
                                    "leader": "$"
                                }, {
                                    "type": "string",
                                    "value": "aaa"
                                }
                            ]
                        }
                    ],
                    "leader": "$"
                }
            }, "\n        Content if 1.1\n    ", {
                "type": "elseif",
                "condition": {
                    "type": "references",
                    "id": "stringUtil",
                    "path": [{
                            "type": "method",
                            "id": "equals",
                            "args": [{
                                    "type": "references",
                                    "id": "aaa",
                                    "leader": "$"
                                }, {
                                    "type": "string",
                                    "value": "bbb"
                                }
                            ]
                        }
                    ],
                    "leader": "$"
                }
            }, "\n        Content elseif 1.1\n    "
        ], "\n", {
            "type": "elseif",
            "condition": {
                "type": "references",
                "id": "stringUtil",
                "path": [{
                        "type": "method",
                        "id": "equals",
                        "args": [{
                                "type": "references",
                                "id": "result",
                                "leader": "$"
                            }, {
                                "type": "string",
                                "value": "delay"
                            }
                        ]
                    }
                ],
                "leader": "$"
            }
        }, "  \n    Content elseif 1\n", 
{
            "type": "elsexxxif",
            "condition": {
                "type": "references",
                "id": "stringUtil",
                "path": [{
                        "type": "method",
                        "id": "equals",
                        "args": [{
                                "type": "references",
                                "id": "result",
                                "leader": "$"
                            }, {
                                "type": "string",
                                "value": "delay"
                            }
                        ]
                    }
                ],
                "leader": "$"
            }
        },
        "xxxxxxx",
        {
            "type": "else"
        }, "\n    Content else 1\n"
    ], "      \n\n\n"]

var conditionTrue = {type: 'bool', value: 'true'};
var conditionFalse = {type: 'bool', value: 'false'};
var conArr = [];
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
    permArr = permArr || [];
    usedChars = usedChars || [];

    var i, ch;
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

console.log(permutation([1,2,3,4,5,6,7,8,9,0,11]))

// 组合算法
function combination(length, initVal, subVal) {
    var arr = [];
    var resultArr = [];
    var len = length;
    var checklength = Math.pow(2, length);

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
console.log(combination(1,2,3,4,5,6,7,8,9,0,1).length);

function combinationCondition(conArr, vmTree) {
    var combinations = combination(conArr.length, 1, 0);
    var resultArr = [];
    console.log(combinations)

    for (var i = 0; i < combinations.length; i++) {
        combinations[i];
        for (var j = 0; j < conArr.length; j++) {
            if (combinations[i][j] === 0 ) {
                conArr[j] = conditionFalse;
            } else {
                conArr[j] = conditionTrue;
            }
        }
        console.log(conArr)
        resultArr.push(vmTree);
    }
    return resultArr;
}

console.log('----------------------------以下废弃--------------------------')

function getCacheIndex(conArr) {
    var tmp = [];
    for (var i = 0; i < conArr.length; i++) {
        tmp.push(conArr[i].condition.value)
    }
    return tmp.join('-');
}

function iterationCondition(conArr, vmTree) {
    var resultArr = [];
    var _conArr = conArr;
    var conCache = {};

    for (var i = 0;i < conArr.length; i++) {
        // switchCondition(conArr[i]);
        conArr[i].condition = conditionTrue;

        for (var j = 0; j < _conArr.length; j++) {
            if (j == i) continue;
            // switchCondition(_conArr[j]);
            _conArr[j].condition = conditionTrue;
            cacheIndex = getCacheIndex(conArr);

            if (cacheIndex in conCache) continue;

            console.log('----------------------------------------------------')
            console.log('i: '+ i +  " j: " + j);
            console.log(conArr)
            conCache[cacheIndex] = true;
            resultArr.push(vmTree.concat());
        }

        // switchCondition(conArr[i]);
        conArr[i].condition = conditionFalse;

        for (var j = 0; j < _conArr.length; j++) {
            if (j == i) continue;
            // switchCondition(_conArr[j]);
            _conArr[j].condition = conditionFalse;
            cacheIndex = getCacheIndex(conArr);

            if (cacheIndex in conCache) continue;
            console.log('----------------------------------------------------')
            console.log('i: '+ i +  " j: " + j);
            console.log(conArr)
            conCache[cacheIndex] = true;
            resultArr.push(vmTree.concat());
        }

    }

    console.log(conCache)

    return resultArr;
}

function switchCondition(con) {
    if (con.condition === conditionTrue) {
        con.condition = conditionFalse;
    } else {
        con.condition = conditionTrue;
    }
}

console.log('-----------------------------------------------')


// var COND_ARR_FLAG = '__condArr';
// var unCondTree = parseCondition(vmTree);
// // console.log(JSON.stringify(unCondTree));
// console.log(unCondTree)
// var result = [];
// stringifyArr(unCondTree, unCondTree, result);
// // console.log(result.length)
// // console.log(JSON.stringify(result));
// console.log('------------------result arr-----------------------')
// console.log(result)

function parseCondition(vmTree) {
    var condArr = [];

    // 遍历数组，如果发现子条件，进入子条件
    for (var i = 0; i < vmTree.length; i++) {
        if (Object.prototype.toString.call(vmTree[i]) === '[object Array]' &&
                vmTree[i][0].type === 'if') {
            condArr.push(parseCondition(vmTree[i]));
        } else if(vmTree[i].type && 
                (vmTree[i].type === 'if' || 
                    vmTree[i].type === 'elseif' || 
                        vmTree[i].type === 'else')){
            // console.log('found condition')
            condArr._type = COND_ARR_FLAG;
            continue;
        } else {
            // console.log('fount string')
            condArr.push(vmTree[i]);
        }
    }

    return condArr;
}    

// arrRoot 传入的初始根数组，整个循环中不对它进行操作
// arrChild 传入初始数组的当前操作子数组
// _arrRoot 初始数组的备份，循环中的操作对象
// _arrChild 操作数组的当前循环子数组
function stringifyArr(arrRoot, arrChild, resultArr,  _arrRoot, _arrChild) {
    arrChild = arrChild || arrRoot;
    _arrRoot = _arrRoot || arrRoot.concat();
    _arrChild = _arrChild || _arrRoot;

    var isSeperate = arrChild._type === COND_ARR_FLAG;

    for (var i = 0; i < arrChild.length; i++) {
        // #end在vmjs的compile后会多一个换行
        // 另外，如果内容只有换行，可以直接无视
        if (arrChild[i] === '\n') continue;

        // 如果是子条件分支
        if (arrChild[i]._type === COND_ARR_FLAG) {
            // stringifyArr(_arrRoot[i], resultArr, _arrRoot);
            stringifyArr(arrRoot, arrRoot[i], resultArr, _arrRoot, _arrRoot[i]);

        // 如果本身是条件分支，主要为了区分根数组
        } else if (isSeperate) {
            _arrChild = arrChild[i];
            // 对分支数组进行拆分
            resultArr.push(_arrRoot.concat());
        }
    }

    return resultArr;
}
