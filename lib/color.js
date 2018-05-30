'use strict'

exports.toStyle = (color) => {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a / 255})`
}
