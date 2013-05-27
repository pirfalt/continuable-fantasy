var cont = require('../index.js')
var fs = require('fs')


// Simple
var buffer = cont(fs.readFile.bind(null, './simple.js'))

// Make the buffer a string
buffer.map(String)
// Take only first line
.map(function(str) {
	return str.split('\n')[0]
})
// Consume the error or result
.consume(console.log, console.log)


// Un-nested
var buffer = cont( fs.readFile.bind(null, '../package.json') )
buffer.map(String)
.map(asJSON)
.chain(function(json) {
	return cont( fs.readFile.bind(null, '../' + json.main) )
})
.map(String)
.consume(console.log, function(main) {
	console.log('\nMain:')
	console.log(main)
})


function asJSON(str) {
	return JSON.parse(str)
}
