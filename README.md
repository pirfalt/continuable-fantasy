# Continuable-fantasy

Turn the awesome [continuable][cont] into a [fantasy land][fantasy] compliant functor and monad.

Since it is based of [continuable][cont] any error will short circuit the chain and propagate all the way to the end. The Fantasy-land spec lets you use the very familiar `.map()` function on any compliant type, and sometimes more.

    // -- List --
    var arr = Array('Hello world')
    // => array with one item ('Hello world')

    arr.map(function(s) { return s.toUpperCase() })
    // => new array with one item ('HELLO WORLD')


    // -- Async --
    var later = ContinuableFantasy.of('Hello world')
    // => function that will be called with (null, 'Hello world')

    later.map(function(s) { return s.toUpperCase() })
    // => new function that will be called with (null, 'HELLO WORLD')

## Example

    var buffer = ContinuableFantasy(fs.readFile.bind(null, './simple.js'))

    // Make the buffer a string
    buffer.map(String)
    
    // Take only first line
    .map(function(str) {
      return str.split('\n')[0]
    })
    
    // Consume the error or result
    .consume(handleError, console.log)
    
    
    // (function(err, data) { 
    //    if (err) return handleError(err);
    //    console.log(val)
    // })
    // Is ok too, if you prefer that. It's just callbacks under the hood


    function handleError(err) {
      console.log(err) // Not that handled, but you get the point
    }


## Docs

    // type Continuable<T>: (Error, Value) => void

### Extender/Decorator

#### ContinuableFantasy( Continuable\<T\> ) => contFantasy\<T\>

    var contBuffer = fs.readFile.bind(null, 'fileName')

    // Extends contBuffer with map, chain and consume
    ContinuableFantasy(contBuffer)

### Instanse methods
#### contFantasy\<A\>.map( func:(A) => B ) => contFantasy\<B\>

    contFantasy<Buffer>.map(function(buffer) {
      return buffer.toString()
    })
    // => contFantasy<String>

#### contFantasy\<A\>.chain( func:(A) => contFantasy\<B\> ) => contFanasy\<B\>

    contFantasy<String>.chain(function(str) {
      var json = JSON.parse(str)
      // The data from the old continuable is used to determine the new
      return ContinuableFantasy(fs.readFile.bind(null, json.property))
    })
    // => contFantasy<Buffer>

#### contFantasy\<A\>.consume( (Error) => void, (A) => void ) => void

    contFantasy<String>.consume(
      function(error) {
        console.log('There was an error')
        console.log(error)
      },
      function(string)
        // String ready for usage
        console.log(string)
      )

### Static methods

#### ContinuableFantasy.of( Value ) => contFantasy\<Value\>

    ContinuableFantasy.of( 'Hello' ).consume(null, function(s) {
      assert.equal(s, 'Hello')
    })

#### ContinuableFantasy.error( Error ) => contFantasy\<void\>

    var error = new Error('Bad bad thing, do not throw in node')
    ContinuableFantasy.error( err ).consume(function(err) {
      assert.equal(err, error)
    }) // Did not handle success

#### ContinuableFantasy.join( Continuable\<Continuable\<T\>\> ) => contFantasy\<T\>

    var contOfA = ContinuableFantasy.of('So nested')
    var contOfContOfA = ContinuableFantasy.of(contOfA)

    ContinuableFantasy.join(contOfContOfA)
    .consume(null, function(s) {
      assert.equal(s, 'So nested')
    })


## Fantasy Land Compatible

[![](https://raw.github.com/pufuwozu/fantasy-land/master/logo.png)
](https://github.com/pufuwozu/fantasy-land)


## License MIT

[cont]: https://npmjs.org/package/continuable
[fantasy]: https://github.com/puffnfresh/fantasy-land