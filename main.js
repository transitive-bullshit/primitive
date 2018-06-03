'use strict'

// Set options as a parameter, environment variable, or rc file.
require = require('esm')(module) // eslint-disable-line
module.exports = require('./module.js').default
