
const rotate = (x, o) => {
  if (x >= o) {
    return x
  } else {
    const v = (x * x) % o
    return (x <= (o / 2n)) ? v : o - v
  }
}

const permute = (v, w, s, x, m) => rotate((rotate(v, w) + s) % m ^ x, w)

const startSyllables = `mi
ma
mo
ne
nu
di
da
do
be
bu
ti
te
ta
to
tu
ki
ke
ka
ko
ku
si
sa
so
ze
zu
fi
fa
fo
ve
vu
xe
xu`.split(/\n+/)

const endSyllables = `le
ru
mu
ne
du
be
te
tu
ke
ku
su
ze
fu
ve
xe
xu`.split(/\n+/)

const syllables = startSyllables.concat(endSyllables)

const incorrectSequencePattern = new RegExp(syllables.map(x => `${x}${x}${x}`).join('|'))

const MAX = size => BigInt(Math.pow(32 * 16, size / 4))

const MAP = {
  64: {
    E: 41223334444555556666667777777888888889999999997n,
    A: 272261127249452727280272961627319532734291n,
    O: 2030507011013017019023n,
    U: MAX(64),
  },
  32: {
    E: 3132343537383103113163n,
    A: 975319753197531975319n,
    O: 541613713n,
    U: MAX(32),
  },
  12: { // 134,217,728
    E: 134095867n,
    A: 118818811n,
    O: 7333n,
    U: MAX(12),
  }
}

module.exports = compile

function compile(i, size) {
  const { E, A, O, U } = MAP[size]

  while (true) {
    const x = permute(i++, E, A, O, U)
    const result = convertBigIntToSmallIntegerArray(x, i => i % 2 === 0 ? 32n : 16n)

    while (result.length !== (size / 2)) {
      result.push(0)
    }

    let chunks = result.map((x, i) => {
      if (i % 2 === 0) {
        return startSyllables[x]
      } else {
        return endSyllables[x]
      }
    }).join('')

    if (chunks.match(incorrectSequencePattern)) {
      continue
    }

    const chunked = chunkArray(chunks.split(''), 4).map(x => x.join('')).join(':')
    return [i, chunked]
  }
}

function convertBigIntToSmallIntegerArray(n, fn) {
  if (!n) return [0]
  let arr = []
  let i = 0
  while (n) {
    let mod = fn(i)
    arr.push(Number(n % mod))
    n /= mod
    i++
  }
  return arr
}

function chunkArray(arr, len) {
  const chunks = []

  let i = 0
  let n = arr.length

  while (i < n) {
    chunks.push(arr.slice(i, i += len))
  }

  return chunks
}

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
