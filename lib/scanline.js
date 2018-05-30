export default class Scanline {
  constructor (y, x1, x2, alpha = 0xffff) {
    if (x1 > x2) {
      let t = x1
      x1 = x2
      x2 = t
    }

    this.y = y
    this.x1 = x1
    this.x2 = x2
    this.alpha = alpha
  }

  static filter (lines, width, height) {
    return lines.filter((line) => {
      if (line.y < 0 || line.y >= height) return false
      if (line.x1 >= width || line.x2 < 0) return false

      line.x1 = Math.max(0, Math.min(width - 1, line.x1 | 0))
      line.x2 = Math.max(0, Math.min(width - 1, line.x2 | 0))

      return (line.x1 < line.x2)
    })
  }
}
