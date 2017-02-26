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
    t.deepEqual(Object.keys(res), ['entry', 'variables', 'data', 'command'])
    t.equal(res.entry, '# data\n## 1 hey')
    t.deepEqual(res.data, { title: 'data', journal: 'hey', test: 1, tags: [ 'test', 'test2', 'test3' ], starred: true })
    t.equal(res.command, 'echo \'# data\n## 1 hey\' | dayone2 --journal hey --tags test test2 test3 --starred -- new')
    t.deepEqual(res.variables, ['title', 'journal', 'test', 'starred', 'tags'])
    t.end()
  })
  .catch(noError(t))
})

test('supplied template string should variables and values', (t) => {
  d1.show({
    name: 'wooo',
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
    t.equal(res.name, 'wooo')
    t.deepEqual(res.data, {
      title: 'data',
      journal: 'hey',
      test: 1,
      starred: true,
      tags: ['test', 'test2', 'test3']
    })
    t.end()
  })
  .catch(noError(t))
})

test('should variables and values for all templates', (t) => {
  d1.show({
    dir: path.join(__dirname, 'fixtures')
  }).then((res) => {
    t.deepEqual(res, [{
      name: 'run',
      data: {
        title: 'Run',
        tags: ['run', 'workout'],
        workout: undefined,
        result: undefined,
        notes: undefined
      }
    }, {
      name: 'test',
      data: {
        prop1: 'test',
        prop2: ['test1', 'test2'],
        title: 'test2',
        prop3: undefined
      }
    }])
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
    t.deepEqual(Object.keys(res), ['entry', 'variables', 'data', 'command'])
    t.equal(res.entry, '# data\n\n\'test\'\n\ntest1,test2\n\n3\n')
    t.deepEqual(res.data, { title: 'data', prop3: '3', prop1: 'test', prop2: ['test1', 'test2'] })
    t.equal(res.command, 'echo \'# data\n\n\'test\'\n\ntest1,test2\n\n3\n\' | dayone2 -- new')
    t.deepEqual(res.variables, ['prop1', 'prop2', 'title', 'prop3'])
    t.end()
  })
  .catch(noError(t))
})
