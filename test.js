
const compile = require('./form')

const output = {}

let i = 1n
let term
while (i < 100000n) {
  [i, term] = compile(i, 12)
  if (output[term]) {
    throw new Error(`${term} => ${output[term]}`)
  }
  output[term] = i
}
