var continuable = require('continuable')
var consume = require('consume')

module.exports = ContinuableAlgebra

function ContinuableAlgebra(cont) {

    cont.constructor = ContinuableAlgebra

    cont.map = function (lambda) {
        return ContinuableAlgebra( continuable.map(cont, lambda) )
    }
    cont.chain = function (lambda) {
        return ContinuableAlgebra( continuable.chain(cont, lambda) )
    }
    cont.consume = function(onError, onValue) {
        cont(consume(onError, onValue))
    }

    return cont
}

ContinuableAlgebra.of = continuable.of
ContinuableAlgebra.error = continuable.error
ContinuableAlgebra.join = continuable.join
