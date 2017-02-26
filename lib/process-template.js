const gm = require('gray-matter')
const mustache = require('mustache')

const arr = (arr) => Array.isArray(arr) ? arr : (arr != null ? [arr] : [])

const combineTags = (obj1 = {}, obj2 = {}) => arr(obj1.tags).concat(arr(obj2.tags))

const uniq = (arr) => [...new Set(arr)]

module.exports = (data) => (template) => {
  const processed = gm(template)
  const templateData = Object.assign({}, processed.data, data)
  const templateVars = Object.keys(templateData)

  // Combine tags, dont overwrite
  const tags = combineTags(processed.data, data)
  if (tags.length) templateData.tags = tags

  // Get list of all variables in mustache template
  const mustacheVars = processed.content.match(/{{\s*[\w.]+\s*}}/g).map((v) => v.match(/[\w.]+/)[0])

  return {
    entry: mustache.render(processed.content, templateData),
    variables: uniq([...templateVars, ...mustacheVars]),
    data: templateData
  }
}
