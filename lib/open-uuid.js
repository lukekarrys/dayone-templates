const open = require('open')

module.exports = (uuid) => new Promise((resolve, reject) => {
  if (!uuid) return resolve()
  open(`dayone://edit?entryId=${uuid}`, (err) => {
    if (err) return reject(err)
    return resolve()
  })
})
