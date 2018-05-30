'use strict'

module.exports = require('chromatism')

module.exports.cssrgba = (color) => {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a / 255})`
}
