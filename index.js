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

ContinuableAlgebra.of = function(value) {
    return ContinuableAlgebra( continuable.of(value) )
}
ContinuableAlgebra.error = function(error) {
    return ContinuableAlgebra( continuable.error(error) )
}
ContinuableAlgebra.join = function(cont) {
    return ContinuableAlgebra( continuable.join(cont) )
}
