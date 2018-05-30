'use strict'

const context = require('./lib/context')
const primitive = require('./lib/primitive')

module.exports = async (opts) => {
  return primitive({
    context,
    ...opts
  })
}
