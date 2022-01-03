

var argv = require('minimist')(process.argv.slice(2), {
    string: [ 'input' ]
});

const web3 = require('./web3');



console.log(argv)
console.log(argv.input)

console.log(web3.utils.hexToAscii(argv.input));