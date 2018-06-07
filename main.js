'use strict'

// node commonjs entrypoint

const _require = require('esm')(module) // eslint-disable-line
module.exports = _require('./module').default
