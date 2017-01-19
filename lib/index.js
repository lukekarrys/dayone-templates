const path = require('path')
const processTemplate = require('./process-template')
const getTemplate = require('./get-template')
const getCommand = require('./get-command')
const runCommand = require('./run-command')
const openEntry = require('./open-uuid')

const combine = (res, newProp) => (val) => Object.assign({}, res, val ? { [newProp]: val } : {})

module.exports = (options) => {
  const {
    template = null,
    name = null,
    dir = path.join(process.env.HOME, '.config', require('../package.json').name),
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
