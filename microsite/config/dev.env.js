'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  apiUrl: 'http://scheduler/api/',
  NODE_ENV: '"development"'
})
