
const permute = require('@lancejpollard/quadratic-residue-prng.js')

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
  64: { // 22,300,745,198,530,623,141,535,718,272,648,361,505,980,416
    // 44 length prime
    E: 20988936657440586486151264256610222593863921n,
    O: 5555555555555555555519n,
    U: MAX(64)
  },
  48: { // 324,518,553,658,426,726,783,156,020,576,256
    E: 314159265358979323846264338327950n,
    O: 30000006160000003n,
    U: MAX(48)
  },
  36: { // 2,417,851,639,229,258,349,412,352
    E: 2222222222222999999999999n,
    O: 1110111110111n,
    U: MAX(36)
  },
  32: { // 4,722,366,482,869,645,213,696
    E: 3895126220983308449519n,
    O: 66666666667n,
    U: MAX(32),
  },
  28: { // 9,223,372,036,854,776,000
    E: 9181531581341931811n,
    O: 4332221111n,
    U: MAX(28)
  },
  24: { // 18,014,398,509,481,984
    E: 17000000000000071n,
    O: 118818811n,
    U: MAX(24)
  },
  20: { // 35,184,372,088,832
    E: 34524689549219n,
    O: 96545899n,
    U: MAX(20)
  },
  16: { // 68,719,476,736
    E: 66870447331n,
    O: 264083n,
    U: MAX(16)
  },
  12: { // 134,217,728
    E: 134095867n,
    O: 7333n,
    U: MAX(12),
  },
  8: { // 262,144
    E: 253987n,
    O: 2069n,
    U: MAX(8),
  }
}

module.exports = compile

function compile(i, j, size) {
  const { E, O, U } = MAP[size]

  while (true) {
    const x = permute(i++, E, j, O, U)
    const result = convertBigIntToSmallIntegerArray(size, x, i => i % 2 === 0 ? 32n : 16n)
    const chunks = result.map((x, i) => i % 2 === 0 ? startSyllables[x] :  endSyllables[x]).join('')
    if (chunks.match(incorrectSequencePattern)) {
      continue
    }
    const chunked = chunkArray(chunks.split(''), 4).map(x => x.join('')).join(':')
    return [i, chunked]
  }
}

function convertBigIntToSmallIntegerArray(size, n, fn) {
  if (!n) return [0]
  let x = size / 2
  let arr = new Array(x).fill(0)
  let i = x - 1
  while (n) {
    let mod = fn(i)
    arr[i] = Number(n % mod)
    n /= mod
    i--
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
