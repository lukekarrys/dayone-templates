const path = require('path')
const test = require('tape')
const outdent = require('outdent')
const d1 = require('../lib/index')

const noError = (t) => (err) => {
  t.ok(false, err)
  t.end()
}

test('supplied template string', (t) => {
  d1({
    run: false,
    open: false,
    data: { title: 'data', tags: 'test3' },
    template: outdent`
      ---
      title: overwritten
      journal: hey
      test: 1
      starred: true
      tags:
        - test
        - test2
      ---
      # {{title}}
      ## {{test}} hey
    `
  }).then((res) => {
    t.equal(res.entry, '# data\n## 1 hey')
    t.deepEqual(res.data, { title: 'data', journal: 'hey', test: 1, tags: [ 'test', 'test2', 'test3' ], starred: true })
    t.equal(res.command, 'echo \'# data\n## 1 hey\' | dayone2 --journal hey --tags test test2 test3 --starred -- new')
    t.end()
  })
  .catch(noError(t))
})

test('template file', (t) => {
  d1({
    run: false,
    open: false,
    data: { title: 'data', prop3: '3' },
    name: 'test',
    dir: path.join(__dirname, 'fixtures')
  }).then((res) => {
    t.equal(res.entry, '# data\n\n\'test\'\n\ntest1,test2\n\n3\n')
    t.deepEqual(res.data, { title: 'data', prop3: '3', prop1: 'test', prop2: ['test1', 'test2'] })
    t.equal(res.command, 'echo \'# data\n\n\'test\'\n\ntest1,test2\n\n3\n\' | dayone2 -- new')
    t.end()
  })
  .catch(noError(t))
})
