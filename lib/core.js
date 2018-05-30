'use strict'

exports.getMeanColor = (image) => {
  const { data, width, height } = image

  let r = 0
  let g = 0
  let b = 0

  for (let i = 0; i < height; ++i) {
    for (let j = 0; j < width; ++j) {
      const index = (i * width + j) * 4
      r += data[index + 0]
      g += data[index + 1]
      b += data[index + 2]
    }
  }

  r = r / (width * height) | 0
  g = g / (width * height) | 0
  b = b / (width * height) | 0

  return { r, g, b, a: 255 }
}

exports.computeColor = (target, current, lines, alpha) => {
  const { width } = target
  const dataT = target.data
  const dataC = current.data

  const a = 255.0 / alpha

  let count = 0
  let r = 0
  let g = 0
  let b = 0

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i]

    for (let j = line.x1; j <= line.x2; ++j) {
      const index = (line.y * width + j) * 4

      const tr = dataT[index + 0]
      const tg = dataT[index + 1]
      const tb = dataT[index + 2]

      const cr = dataC[index + 0]
      const cg = dataC[index + 1]
      const cb = dataC[index + 2]

      r += (tr - cr) * a + cr
      g += (tg - cg) * a + cg
      b += (tb - cb) * a + cb

      ++count
    }
  }

  r = Math.max(0, Math.min(255, (r / count))) | 0
  g = Math.max(0, Math.min(255, (g / count))) | 0
  b = Math.max(0, Math.min(255, (b / count))) | 0

  return { r, g, b, a: alpha }
}

exports.difference = (imageA, imageB) => {
  const { width, height } = imageA
  const dataA = imageA.data
  const dataB = imageB.data
  let sum = 0

  if (dataA.length !== dataB.length) {
    throw new Error('image.difference incompatible images')
  }

  const inv = 1.0 / (width * height * 4)

  for (let i = 0; i < height; ++i) {
    for (let j = 0; j < width; ++j) {
      const o = (i * width + j) * 4

      const ar = dataA[o + 0]
      const ag = dataA[o + 1]
      const ab = dataA[o + 2]
      const aa = dataA[o + 3]

      const br = dataB[o + 0]
      const bg = dataB[o + 1]
      const bb = dataB[o + 2]
      const ba = dataB[o + 3]

      const dr = ar - br
      const dg = ag - bg
      const db = ab - bb
      const da = aa - ba

      sum += (dr * dr + dg * dg + db * db + da * da) * inv
    }
  }

  return sum
  // return Math.sqrt(sum / (width * height * 4)) / 255
}

exports.drawLines = (image, color, lines) => {
  const { data, width } = image

  const sr = color.r
  const sg = color.g
  const sb = color.b
  const sa = color.a

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i]
    const ma = line.alpha / 255
    const a = (1.0 - sa * ma / 255)

    for (let j = line.x1; j <= line.x2; ++j) {
      const o = (line.y * width + j) * 4

      const dr = data[o + 0]
      const dg = data[o + 1]
      const db = data[o + 2]
      const da = data[o + 3]

      data[o + 0] = (dr * a + sr * ma) | 0
      data[o + 1] = (dg * a + sg * ma) | 0
      data[o + 2] = (db * a + sb * ma) | 0
      data[o + 3] = (da * a + sa * ma) | 0
    }
  }
}
