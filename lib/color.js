import chromatism from 'chromatism'
export default chromatism

export const cssrgba = (color) => {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a / 255})`
}
