#!/usr/bin/env node

const path = require('path')
const yargs = require('yargs')
const Table = require('cli-table')
const run = require('./index')
const templateDir = require('./template-dir')

const pick = (o, ...keys) => Object.assign({}, ...keys.map(prop => ({ [prop]: o[prop] })))

const omit = (o, ...keys) => Object.keys(o)
  .filter((key) => keys.indexOf(key) < 0)
  .reduce((acc, key) => Object.assign(acc, { [key]: o[key] }), {})

const toDisplay = (val) => Array.isArray(val) ? val.map((v) => v.toString()).join(', ') : val.toString()

const toArr = (val) => Array.isArray(val) ? val : [val]

const argv = yargs
  .command('<command>', 'Which command to run')

  // d1 keys
  .normalize('dir')
  .describe('dir', 'The directory to read tempaltes from')
  .default('dir', templateDir)
  .coerce('dir', (arg) => path.resolve(process.cwd(), arg))
  .demandOption('dir')

  .describe('name', 'The directory to write to')
  .string('name')

  .boolean('run')
  .describe('run', 'Whether to really run the command')
  .default('run', true)

  .boolean('open')
  .describe('open', 'Whether to open the resulting entry')
  .default('open', true)

  // Data keys (passed to dayone2 executable)
  .coerce('data', JSON.parse)
  .boolean('starred')
  .array('photos')
  .array('tags')

  .wrap(yargs.terminalWidth())
  .help('help')
  .argv

const command = argv._[0] || 'default'
const d1Keys = ['dir', 'name', 'run', 'open']
const data = Object.assign(argv.data || {}, omit(argv, 'data', '_', '$0', 'help', ...d1Keys))
const options = Object.assign(pick(argv, ...d1Keys), { data })

switch (command) {
  case 'default':
    run(options)
    break
  case 'show':
    run.show(options).then((templates) => toArr(templates).map((t) => {
      const table = new Table()

      table.push(...Object.keys(t.data).map((d) => ({
        [d]: t.data[d] == null ? '' : toDisplay(t.data[d])
      })))

      return [
        '',
        t.name,
        '-'.repeat(40),
        ...table.toString().split('\n'),
        ''
      ]
    })).then((templates) => templates.forEach((t) => console.log(t.join('\n'))))
    break
  default:
    throw new Error(`${argv.command} does not exit`)
}
