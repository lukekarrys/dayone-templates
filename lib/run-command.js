const exec = require('child-process-promise').exec

module.exports = (command) => exec(command)
  .then(({ stdout }) => stdout.trim().replace('Created new entry with uuid: ', ''))
