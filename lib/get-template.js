const path = require('path')
const fs = require('fs-promise')

module.exports = ({ template, name, dir }) => {
  if (template) return Promise.resolve(template)
  return fs.readFile(path.join(dir, name)).then((file) => file.toString())
}
