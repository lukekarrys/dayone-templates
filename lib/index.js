const fs = require('fs-promise')
const templateDir = require('./template-dir')
const processTemplate = require('./process-template')
const getTemplate = require('./get-template')
const getCommand = require('./get-command')
const runCommand = require('./run-command')
const openEntry = require('./open-uuid')

const combine = (res, newProp) => (val) => Object.assign({}, res, val ? { [newProp]: val } : {})

module.exports = (options = {}) => {
  const {
    template = null,
    name = null,
    dir = templateDir,
    data = {},
    run = true,
    open = true
  } = options

  return getTemplate({ template, name, dir })
    .then(processTemplate(data))
    .then((res) => combine(res, 'command')(getCommand(res)))
    .then((res) => run
      ? runCommand(res.command).then(combine(res, 'uuid'))
      : res
    )
    .then((res) => open && res.uuid
      ? openEntry(res.uuid).then(combine(res))
      : res
    )
}

module.exports.show = (options = {}) => {
  const {
    template = null,
    name = null,
    dir = templateDir,
    data = {}
  } = options

  const getTemplateData = (getOpts) => getTemplate(Object.assign({ dir }, getOpts))
    .then(processTemplate(data))
    .then((template) => ({
      name: getOpts.name,
      // eslint-disable-next-line no-return-assign
      data: template.variables.reduce((acc, v) => ((acc[v] = template.data[v], acc)), {})
    }))

  return (name || template)
    ? getTemplateData({ name, template })
    : fs.readdir(dir).then((templates) => Promise.all(templates.map((t) => getTemplateData({ name: t }))))
}
