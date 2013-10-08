exports.rule = {
    author: "远尘 <codedancerhua@gmail.com>",
    id: "js-reserved-words",
    description: "发现JS保留字",
    level: "error",
    validator: function(reporter, context, rawStr) {
        var reservedWords = [
            "break",
            "do",
            "instanceof",
            "typeof",
            "case",
            "else",
            "new",
            "var",
            "catch",
            "finally", 
            "return",
            "void",
            "continue", 
            "for",
            "switch", 
            "while",
            "debugger", 
            "function", 
            "this", 
            "with",
            "default", 
            "if", 
            "throw",
            "delete", 
            "in", 
            "try",

            "class", 
            "enum", 
            "extends", 
            "super",
            "const", 
            "export", 
            "import",

            // "implements", 
            // "let", 
            // "private", 
            // "public", 
            // "yield",
            // "interface",
            // "package", 
            // "protected", 
            // "static",

            // JScript
            "false",
            "null",
            "true"
            // "abstract",
            // "boolean",
            // "byte",
            // "char",
            // "decimal",
            // "double",
            // "float",
            // "get",
            // "int",
            // "internal",
            // "long",
            // "private",
            // "sbyte",
            // "set",
            // "short",
            // "uint",
            // "ulong",
            // "ushort",

            // future reserved
            // "assert",
            // "ensure",
            // "event",
            // "goto",
            // "invariant",
            // "namespace",
            // "native",
            // "require",
            // "synchronized",
            // "throws",
            // "transient",
            // "use",
            // "volatile"
        ]

        // TODO: detect situation like `var $keyword$`
        // find out object.$keyword$ abusing
        var reReservedWord = new RegExp('[.](' + reservedWords.join('|') + ')[^\\w]+?', 'g')
        var reservedWord, jsStr

        // remove multiline comments but keep line break 
        jsStr = rawStr.replace(/\/\*[\s\S]*\*\//g, function(str){
            return str.replace(/[^\n\r]*/g, '')
        })

        // remove single line comments
        jsStr = jsStr.replace(/\/\/.*/g, '')


        // remove string literal and keep line break 
        jsStr = jsStr.replace(/(['"])[\s\S]*\1/g, function(str){
            return str.replace(/[^\n\r]*/g, '')
        })


        while (reservedWord = reReservedWord.exec(jsStr)) {
            reporter[this.level](this.description, getLineNo(jsStr, reservedWord.index), null, this, reservedWord[1])
        }

        function getLineNo(str, start) {
            var reLine = /\r?\n/g
            var line = 1
            var br

            while (br = reLine.exec(str)) {
                if (br.index < start) {
                    line++
                }
            }

            return line
        }

    }    
}