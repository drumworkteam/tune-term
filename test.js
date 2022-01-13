
const compile = require('./form')

const output = {}

let i = 0n
while (i < 65536n) {
  let term = compile(i, 6500000000000650000000000065000000000006500000000000n, 64)
  if (output[term]) {
    throw new Error(`Duplicate: ${term} originally at index ${output[term]}, now at index ${i}`)
  }
  console.log(term)
  output[term] = i
  i++
}
