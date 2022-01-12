
const compile = require('./form')

const output = {}

let i = 0n
let term
while (i < 262144n) {
  [i, term] = compile(i, 131111n, 8)
  if (output[term]) {
    throw new Error(`Duplicate: ${term} originally at index ${output[term]}, now at index ${i}`)
  }
  console.log(term)
  output[term] = i
}
