var test = require('tape')
var continuable = require('continuable')
var Cont = require('../index')

var value = {value: 'Hello'}

test('Cont()', function(t) {
  t.plan(5)

  var cont = Cont(contFn)
  
  t.notEqual(Cont(contFn), contFn, 'Returns a new function')
  t.equal(Cont(contFn, true), contFn, 'Returns the same function, if decorate == true')
 
  t.equal(cont.constructor, Cont, 'Returns something with a constructor')

  cont(function(err, val) {
    t.equal(val, value, 'cont(fn:(err,val)) to read err and val')
  })

  var newCont = new Cont(function(cb) {
    cb(null, value)
  })

  newCont(function(err, val) {
    t.equal(val, value, 'new Cont(cont<T>) does not break')
  })

  function contFn(callback) {
    callback(null, value)
  }
})

test('shares functions', function(t) {
  t.plan(2)

  var cont1 = Cont.of(1)
  var cont2 = Cont(function(cb) {
    cb(null, 2)
  })

  t.notEqual(cont1, cont2, 'Not the same object')
  t.equals(cont1.chain, cont2.chain, 'But the same "methods"')
})

test('#of', function(t) {
  t.plan(1)

  var ofVal = Cont.of(value)
  
  ofVal(function(err, val) {
    t.equal(val, value, '#of(val) -> cont<val>')
  })
})

test('#error', function(t) {
  t.plan(2)

  var error = new Error('Bad')

  Cont.error(error)(function(err) {
    t.equal(err, error, 'Gets back the passed error')
  })

  Cont.error('Im lazy')(function(err) {
    t.same(err, 'Im lazy', 'Does not change the passed value')
  })
})

test('.chain', function(t) {
  t.plan(2)

  var cont = Cont.of('hello')

  // Known base
  continuable.chain(cont, chainer)(function(err, val) {
    t.equals(val, 'hello world', 'continuable.chain(cont, fn) works when cont = ContFantasy')
  })

  // The extention
  cont.chain(chainer)(function(err, val) {
    t.equals(val, 'hello world', 'cont.chain(fn) works as continuable.chain(cont, fn)')
  })

  function chainer(input) {
    return function(callback) {
      callback(null, input + ' world')
    }
  }
})

test('.map', function(t) {
  t.plan(2)

  var cont = Cont.of(value)

  cont.map(function(o) {
    return o.value.toUpperCase() + ' world!!!'
  })(function(err, val) {
    t.equals(val, 'HELLO world!!!', 'cont.map(fn) works')
  })

  continuable.map(cont, function(o) {
    return o.value.toUpperCase() + ' world!!!'
  })(function(err, val) {
    t.equals(val, 'HELLO world!!!', 'continuable.map(cont, fn) works')
  })
})

test('.join', function(t) {
  t.plan(3)

  var cont1 = Cont.of(value)
  var cont2 = Cont.of(cont1)

  cont2(function(err, val) {
    t.equals(val, cont1, 'We have a nested thing')
  })

  cont2.join()(function(err, val) {
    t.equals(val, value, '.join() unnested one level')
  })

  continuable.join(cont2)(function(err, val) {
    t.equals(val, value, 'continuable.join(cont) works on contFantasy')
  })
})

test('.consume', function(t) {
  t.plan(2)

  var contVal = Cont.of(value)
  var contErr = Cont.error('Bad')

  contVal.consume(function(err) {
    t.fail('there should be no error')
  }, function(val) {
    t.equal(val, value, 'can read values')
  })

  contErr.consume(function(err) {
    t.equal(err, 'Bad', 'can read errors')
  }, function(val) {
    t.fail('there should be no value')
  })
})
