const pickBy = (obj, iterator) => {
  const keys = Object.keys(obj)
  return keys.filter((key) => iterator(obj[key], key)).reduce((acc, key) => {
    acc[key] = obj[key]
    return acc
  }, {})
}

const arr = (arr) => {
  arr = Array.isArray(arr) ? arr : (arr == null ? [arr] : [])
  return arr.join(' ')
}

const bool = (val) => Boolean(val)

const args = (data) => {
  // http://help.dayoneapp.com/command-line-interface-cli/
  const argsMap = {
    journal: data.journal,
    tags: arr(data.tags),
    photos: arr(data.photos),
    'time-zone': data.tz || data['time-zone'],
    starred: bool(data.starred),
    date: data.date,
    coordinate: data.coordinate,
    isoDate: data.isoDate
  }

  const filtered = pickBy(argsMap, (value, key) => {
    return !(value == null || value === '' || value === false)
  })

  const cli = Object.keys(filtered).map((key) => {
    const value = filtered[key]
    let arg = `--${key}`

    if (value === true) {
      return arg
    }

    if (Array.isArray(value)) {
      arg += ` ${value.join(' ')}`
    } else {
      arg += ` ${value}`
    }

    return arg
  }).join(' ')

  return cli ? cli + ' ' : ''
}

const escapeEntry = (entry) => entry.replace(/'/g, '\'')

module.exports = (res) => `echo '${escapeEntry(res.entry)}' | dayone2 ${args(res.data)}-- new`
