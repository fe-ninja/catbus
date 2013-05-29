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

vmTree = ["<p>content out side</p>\n", [{
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
        }, "  \n    Content elseif 1\n", {
            "type": "else"
        }, "\n    Content else 1\n"
    ], "      \n\n\n"]


    // console.log(JSON.stringify(iterationCondition(vmTree)));
    // console.log('isContinue: ' + isContinue)

// 是否继续循环（是否还有逻辑判断没有处理过）
var isContinue = true;
var conVmTree = [];

function iterationCondition(vmTree) {

    // 每一次逻辑分支if..elseif...else一次只处理一次，处理了if，elseif和else就不处理了
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
            vmTree[i] = iterationCondition(vmTree[i]);
            
        // 如果是逻辑判断节点(if ,else ,elseif...)
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
            if (vmTree[i].condition.type !== 'bool') {
                vmTree[i].condition = conditionTrue;
                isContinue = true;
                processed = true;

            // 如果是处理过的，condition设置为'true'的
            } else if (vmTree[i].condition.value === 'true') {
                vmTree[i].condition = conditionFalse;
                isContinue = false;
            }
        }
    }

    return vmTree;
}    

var result;
while(isContinue) {
    result = iterationCondition(vmTree);
    console.log(JSON.stringify(result));
    conVmTree.push(result);
}

console.log(conVmTree.length)
console.log(conVmTree[0] == conVmTree[1])
console.log(JSON.stringify(conVmTree[0]));
console.log(JSON.stringify(vmTree));

