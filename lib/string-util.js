/**
 * StringUtil.js
 * 这份代码参考 SofaMVC 的相关实现要求，如果有错误的地方，
 * 请以 SofaMVC 为准。
 * TODO: 部分繁琐不实用的方法没有实现。
 */

var EMPTY_STRING = "";
var RE_EMPTY = /^\s*$/;
var RE_EMPTY_START = /^\s+/;
var RE_EMPTY_END = /\s+$/;

function isString(str){
    return "string"===typeof str || str instanceof String;
}

function isNull(obj){
    return "undefined"===typeof obj || null===obj;
}

function isArray(obj){
    var type = Object.prototype.toString.call(obj);
    return "[object Array]"===type ||
        "[object Arguments]"===type;
}

/**
 * 检查字符串是否为<code>null</code>或空字符串<code>""</code>。
 * @param {String} str.
 * @return {Boolean}
 */
function isEmpty(str){
    if(!isString(str)){return false;}
    return str===null || str.length===0;
}

function isNotEmpty(str){
  return !isEmpty(str);
}

/**
 * 检查字符串是否是空白：<code>null</code>、
 * 空字符串<code>""</code>或只有空白字符。
 * @param {String} str, 检查数据。
 * @return {Boolean}
 */
function isBlank(str){
    if(!isString(str)){return false;}
    return isEmpty(str) || RE_EMPTY.test(str);
}

function isNotBlank(str) {
    return !isBlank(str);
}

/**
 * 如果字符串是<code>null</code>，则返回指定默认字符串，否则返回字符串本身。
 * @param {String} str.
 * @return {String}
 */
function defaultIfNull(str){
    return isNull(str) ? EMPTY_STRING : String(str);
}

function defaultIfEmpty(str, def){
    if(arguments.length >= 2){
        return isEmpty(str) ? def : str;
    }else{
        return defaultIfNull(str); // Alipay sofaMVC for Java.
        //return isEmpty(str) ? EMPTY_STRING : String(str);
    }
}

/**
 * 如果字符串是空白：<code>null</code>、空字符串<code>""</code> 或只有空白字符，
 * 则返回空字符串<code>""</code>，否则返回字符串本身。
 * @param {String} str,
 * @param {String} def, default string if `str` is blank.
 * @return {String}
 */
function defaultIfBlank(str, def){
    return isBlank(str) ? (def || EMPTY_STRING) : str;
}

function trimStart(str){
    return String(str).replace(RE_EMPTY_START, "");
}

function trimEnd(str){
    return String(str).replace(RE_EMPTY_END, "");
}

function trim(str){
    return String(str).replace(RE_EMPTY_START, "")
        .replace(RE_EMPTY_END, "");
}

/**
 * 比较两个字符串（大小写敏感）。
 * @param {String} str.
 * @param {String} that.
 * @return {Boolean}
 */
function equals(str, that){
    return str === that;
}

/**
 * 比较两个字符串（大小写不敏感）。
 * @param {String} str.
 * @param {String} that.
 * @return {Boolean}
 */
function equalsIgnoreCase(str, that){
    return String(str).toUpperCase() === String(that).toUpperCase();
}

/**
 * 判断字符串是否只包含unicode字母。
 * @param {String} str.
 * @return {Boolean}
 */
var RE_WORD = /^[a-zA-Z]*$/;
function isAlpha(str){
    if(!isString(str)){return false;}
    return RE_WORD.test(str);
}

/**
 * 判断字符串是否只包含unicode数字。
 * @param {String}
 * @return {Boolean}
 */
var RE_NUMBERIC = /^[0-9]+$/;
function isNumberic(str){
    return RE_NUMBERIC.test(str);
}

/**
 * 将字符串转换成大写。
 * 如果字符串是<code>null</code>则返回<code>null</code>。
 * @param {String}
 * @return {String}
 */
function toUpperCase(str){
    return String(str).toUpperCase();
}

/**
 * 将字符串转换成小写。
 * 如果字符串是<code>null</code>则返回<code>null</code>。
 * @param {String}
 * @return {String}
 */
function toLowerCase(str){
    return String(str).toLowerCase();
}

/**
 * 将字符串的首字符转成大写，其它字符不变。
 * 如果字符串是<code>null</code>则返回<code>null</code>。
 * @param {String}
 * @return {String}
 */
function capitalize(str){
    if(isNull(str)){return null;}
    var s = String(str);
    return s.charAt(0).toUpperCase() + s.substr(1);
}

/**
 * 将字符串的首字符转成小写，其它字符不变。
 * 如果字符串是<code>null</code>则返回<code>null</code>。
 * @param {String} str.
 * @return {String}
 */
function uncapitalize(str){
    if(isNull(str)){return null;}
    var s = String(str);
    return s.charAt(0).toLowerCase() + s.substr(1);
}

/**
 * 将字符串转换成camel case。
 * 如果字符串是<code>null</code>则返回<code>null</code>。
 * 此方法会保留除了下划线和空白以外的所有分隔符。
 * eg:
 *  aBc def_ghi -> aBcDefGhi
 * @param {String} str.
 * @return {String}
 */
function toCamelCase(str){
    if(isNull(str)){return null;}
    return String(str).replace(/[\s_]+([a-z])?/g, function($0, $1){
        return $1 ? $1.toUpperCase() : "";
    });
}

/**
 * 将字符串转换成pascal case。
 * 如果字符串是<code>null</code>则返回<code>null</code>。
 * 此方法会保留除了下划线和空白以外的所有分隔符。
 * eg:
 *  aBc def_ghi -> ABcDefGhi
 * @param {String} str.
 * @return {String}
 */
function toPascalCase(str){
    if(isNull(str)){return null;}
    return capitalize(toCamelCase(str));
}

/**
 * 将字符串转换成下划线分隔的大写字符串。
 * 如果字符串是<code>null</code>则返回<code>null</code>。
 * 此方法会保留除了空白以外的所有分隔符。
 * eg:
 *  "aBc" -> "A_BC"
 *  "aBc def_ghi 123" -> "A_BC_DEF_GHI_123"
 *  "__a__Bc__" -> "__A__BC__"
 * @param {String}
 * @return {String}
 */
function toUpperCaseWithUnderscores(str){
    if(isNull(str)){return null;}
    return String(str).replace(/([A-Z])/g, function($0, $1){
        return "_" + $1;
    }).replace(/[\s]+/g, "_");
}

/**
 * 将字符串按指定字符分割。
 * @param {String} str.
 * @param {String} sep.
 * @param {Number} maxLen, 指定返回数组的长度。
 *                         不指定或指定小于等于 0，则不限制长度。
 * @return {Array}
 */
function split(str, sep, maxLen){
    if(isNull(str)){return null;}
    var a = String(str).split(sep);
    return maxLen ? a.slice(0, maxLen-1) : a;
}

/**
 * 将数组中的元素连接成一个字符串。
 * @param {Array} arr.
 * @param {String} sep.
 * @return {String}
 */
function join(arr, sep){
    if(!isArray(arr)){throw new Error("missing param array.")}
    return arr.join(sep||"");
}

/**
 * 在字符串中查找指定字符串，并返回第一个匹配的索引值。
 * 如果字符串为<code>null</code>或未找到，则返回<code>-1</code>。
 * @param {String} str.
 * @param {String} ch.
 * @param {Number} start.
 * @return {Number}
 */
function indexOf(str, ch, start){
    if(!str){return -1;}
    return String(str).indexOf(ch, start);
}

/**
 * 在字符串中查找指定字符集合中的字符，并返回第一个匹配的起始索引。
 * 如果字符串为<code>null</code>，则返回<code>-1</code>。
 * 如果字符集合为<code>null</code>或空，也返回<code>-1</code>。
 * @param {String} str.
 * @param {Array} chs.
 * @param {Number} start.
 * @return {Array}
 */
function indexOfAny(str, chs, start){
    if(!str || !isArray(chs)){return -1;}
    var idxs = [];
    for(var i=0,idx,l=chs.length; i<l; i++){
        idx = str.indexOf(chs[i], start || 0);
        if(idx > -1){
            idxs.push(idx);
        }
    }
    return idxs.length===0 ? -1 : Math.min.apply(null, idxs);
}

function lastIndexOf(str, ch, start){
    if(!str){return -1;}
    return String(str).lastIndexOf(ch, start);
}

/**
 * 检查字符串中是否包含指定的字符。如果字符串为<code>null</code>，
 * 将返回<code>false</code>。
 * @param {String} str.
 * @return {String/Number/RegExp/Date/Function/Array/Object}
 */
function contains(str, ch){
    if(!str){return false;}
    return String(str).indexOf(ch) > -1;
}

/**
 * 取指定字符串的子串。
 * @param {String} str.
 * @param {Number} start.
 * @param {Number} end.
 * @return {String}
 */
function substring(str, start, end){
    return String(str).substring(start, end);
}

/**
 * 取得长度为指定字符数的最左边的子串。
 * @param {String} str.
 * @param {Number} len.
 * @return {String}
 */
function left(str, len){
    return String(str).substr(0, len);
}

/**
 * 取得长度为指定字符数的最右边的子串。
 * @param {String} str.
 * @param {Number} len.
 * @return {String}
 */
function right(str, len){
    return String(str).substr(Math.max(str.length-len, 0));
}


/**
 * 取指定字符串的子串。
 * @param {String} str.
 * @param {Number} start.
 * @param {Number} len.
 * @return {String}
 */
function substr(str, start, len){
    return String(str).substr(start, len);
}
function mid(str, start, len){
    return String(str).substr(start, len);
}

/**
 * 替换指定的子串，只替换第一个出现的子串。
 * 如果字符串为<code>null</code>则返回<code>null</code>，
 * 如果指定子串为<code>null</code>，则返回原字符串。
 * @param {String} str.
 * @param {String} sub, search sub-string to replace.
 * @param {String} to, replace matched sub-string to this one.
 * @return {String} replaced string.
 */
function replaceOnce(str, sub, to){
    if(isNull(str) || isNull(sub)){return null;}
    return String(str).replace(sub, to);
}

var ESCAPE_REG_EXP = "\\/.$*^()[]{}?+-|".split("");
function escapeRegExp(src){
    for(var i=0, l=ESCAPE_REG_EXP.length; i<l; i++){
        src = src.replace(new RegExp("\\"+ESCAPE_REG_EXP[i], "g"),
                "\\"+ESCAPE_REG_EXP[i]);
    }
    return src;
}

/**
 * 替换指定的子串，替换所有出现的子串。
 * 如果字符串为<code>null</code>则返回<code>null</code>，
 * 如果指定子串为<code>null</code>，则返回原字符串。
 * @param {String} str.
 * @param {String} rep.
 * @param {String} wiz.
 * @return {String} replaced string.
 */
function replace(str, rep, wiz){
    return String(str).replace(new RegExp(escapeRegExp(rep), "g"), wiz);
}

/**
 * 将指定字符串重复n遍。
 * @param {String} str.
 * @param {Number} count, int.
 * @return {String}
 */
function repeat(str, count){
    return new Array(count+1).join(str);
}

/**
 * 反转字符串中的字符顺序。
 * @param {String} str.
 * @return {String}
 */
function reverse(str){
    return String(str).split("").reverse().join("");
}

/**
 * 将字符串转换成指定长度的缩略，例如：
 * 将"Now is the time for all good men"
 * 转换成"Now is the time for..."。
 *
 * TODO: abbreviate(str, start, len);
 *      ...abc...
 *
 * @param {String} str.
 * @param {Number} len.
 * @return {String}
 */
function abbreviate(str, len){
    var strLen = str.length;
    if(strLen <= len){return str;}

    var abbr = "...";
    var abbrLen = abbr.length;
    return str.substr(0, len-abbrLen) + abbr;
}


/**
 * 截取 separator 之前的字符
 */
function substringBefore (str, separator) {
  if (str === null) return null;

  if (!separator) return str;

  var i = str.indexOf(separator);
  if (i > -1) {
    return str.substring(0,i);
  } else {
    return str;
  }
}

function notImplemented(){
    throw new Error("Not Implemented.");
}

module.exports = {
    isEmpty: isEmpty,
    isNotEmpty: isNotEmpty,
    isBlank: isBlank,
    isNotBlank: isNotBlank,
    defaultIfNull: defaultIfNull,
    defaultIfEmpty: defaultIfEmpty,
    defaultIfBlank: defaultIfBlank,
    trimStart: trimStart,
    trimEnd: trimEnd,
    trim: trim,
    equals: equals,
    equalsIgnoreCase: equalsIgnoreCase,
    isAlpha: isAlpha,
    isNumberic: isNumberic,
    toUpperCase: toUpperCase,
    toLowerCase: toLowerCase,
    capitalize: capitalize,
    uncapitalize: uncapitalize,
    toCamelCase: toCamelCase,
    toPascalCase: toPascalCase,
    toUpperCaseWithUnderscores: toUpperCaseWithUnderscores,
    split: split,
    join: join,
    indexOf: indexOf,
    indexOfAny: indexOfAny,
    lastIndexOf: lastIndexOf,
    contains: contains,
    substring: substring,
    left: left,
    right: right,
    substr: substr,
    mid: mid,
    replaceOnce: replaceOnce,
    escapeRegExp: escapeRegExp,
    replace: replace,
    trimToNull: notImplemented,
    trimToEmpty: notImplemented,
    isAlphaSpace: notImplemented,
    isAlphanumeric: notImplemented,
    isAlphanumericSpace: notImplemented,
    isNumericSpace: notImplemented,
    isWhitespace: notImplemented,
    repeat: repeat,
    reverse: reverse,
    abbreviate: abbreviate,

    swapCase: notImplemented,
    toLowerCaseWithUnderscores: notImplemented,
    parse: notImplemented,
    indexOfAnyBut: notImplemented,
    lastIndexOfAny: notImplemented,
    containsOnly: notImplemented,
    containsNone: notImplemented,
    countMatches: notImplemented,
    substringBefore: substringBefore,
    substringAfter: notImplemented,
    substringBeforeLast: notImplemented,
    substringAfterLast: notImplemented,
    substringBetween: notImplemented,
    deleteWhitespace: notImplemented,
    replaceChars: notImplemented,
    overlay: notImplemented,
    chomp: notImplemented,
    chop: notImplemented,
    alignLeft: notImplemented,
    alignRight: notImplemented,
    center: notImplemented,
    reverseDelimited: notImplemented,
    difference: notImplemented,
    indexOfDifference: notImplemented,
    getLevenshteinDistance: notImplemented
};