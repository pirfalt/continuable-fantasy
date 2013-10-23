var continuable = require('continuable')
var consume = require('consume')

module.exports = ContFantasy

function ContFantasy(source, decorate) {
    if (typeof source !== 'function')
        throw new Error('Continuable only works with functions')

    var continuable = decorate
        ? source
        : function (callback) {
            source(callback) // Do what source does
        }

    continuable.constructor = ContFantasy

    continuable.chain = chainer
    continuable.map = maper
    continuable.join = joiner
    continuable.consume = consumer

    return continuable
}

ContFantasy.of = function(value) {
    return ContFantasy( continuable.of(value) )
}
ContFantasy.error = function(error) {
    return ContFantasy( continuable.error(error) )
}
ContFantasy.join = function(cont) {
    return ContFantasy( continuable.join(cont) )
}


function chainer(lambda) {
    return ContFantasy( continuable.chain(this, lambda) )
}

function maper(lambda) {
    return ContFantasy( continuable.map(this, lambda) )
}

function consumer(onError, onValue) {
    this(consume(onError, onValue))
}

function joiner() {
    return ContFantasy( continuable.join(this) )
}
