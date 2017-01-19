const gm = require('gray-matter')
const mustache = require('mustache')

const arr = (arr) => Array.isArray(arr) ? arr : (arr != null ? [arr] : [])

const combineTags = (obj1 = {}, obj2 = {}) => arr(obj1.tags).concat(arr(obj2.tags))

module.exports = (data) => (template) => {
  const processed = gm(template)
  const templateData = Object.assign({}, processed.data, data)
  // Combine tags, dont overwrite
  const tags = combineTags(processed.data, data)
  if (tags.length) templateData.tags = tags
  return {
    entry: mustache.render(processed.content, templateData),
    data: templateData
  }
}
