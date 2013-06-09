var EventEmitter = require('events').EventEmitter;
var Reporter = Object.create(EventEmitter.prototype, {
    constructor:{
        value:Parser,
        enumerable:false
    }
});



