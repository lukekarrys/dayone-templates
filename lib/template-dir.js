const path = require('path')
const pack = require('../package.json')

module.exports = path.join(process.env.HOME, '.config', pack.name)
