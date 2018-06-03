import ow from 'ow'

import color from './color'

export const PARTIALS = true
export const platform = 'browser'

export const loadImage = async (input) => {
  ow(input, ow.any(
    ow.string.nonEmpty.label('input'),
    ow.object.instanceOf(global.ImageData).label('input'),
    ow.object.instanceOf(global.Image).label('input')
  ))

  if (typeof input === 'string') {
    const img = new global.Image()

    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = img.onabort = () => reject(new Error('image failed to load'))
      img.src = input
    })

    return loadImage(img)
  } else if (input instanceof global.ImageData) {
    return input
  } else if (input instanceof global.Image) {
    const canvas = document.createElement('canvas')
    canvas.width = input.naturalWidth
    canvas.height = input.naturalHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(input, 0, 0)
    return ctx.getImageData(0, 0, canvas.width, canvas.height)
  } else {
    throw new Error('invalid input image')
  }
}

export const loadCanvas = async (value, label = 'canvas') => {
  ow(value, ow.any(
    ow.string.nonEmpty.label(label),
    ow.object.instanceOf(global.HTMLCanvasElement).label(label)
  ))

  if (typeof value === 'string') {
    const canvas = document.querySelector(value)

    if (!canvas) {
      throw new Error(`invalid ${label} selector "${value}" not found`)
    }

    if (!(canvas instanceof global.HTMLCanvasElement)) {
      throw new Error(`invalid ${label} selector "${value}" is not a canvas element`)
    }

    return canvas
  } else {
    return value
  }
}

export const enableContextAntialiasing = (ctx) => {
  ctx.mozImageSmoothingQuality = 'high'
  ctx.webkitImageSmoothingQuality = 'high'
  ctx.msImageSmoothingQuality = 'high'
  ctx.imageSmoothingQuality = 'high'

  ctx.mozImageSmoothingEnabled = true
  ctx.webkitImageSmoothingEnabled = true
  ctx.msImageSmoothingEnabled = true
  ctx.imageSmoothingEnabled = true
}

export const createImage = (width, height, fillColor = undefined) => {
  ow(width, ow.number.label('width').positive.integer)
  ow(height, ow.number.label('height').positive.integer)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (fillColor) {
    ctx.fillStyle = color.cssrgba(fillColor)
    ctx.fillRect(0, 0, width, height)
  }
  return ctx.getImageData(0, 0, width, height)
}

export default {
  PARTIALS,
  platform,
  loadImage,
  loadCanvas,
  enableContextAntialiasing,
  createImage
}
