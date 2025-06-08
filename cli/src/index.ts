#!/usr/bin/env node
import { Command } from 'commander'

import { addCommand } from '@/commands/add'
import { createCommand } from '@/commands/create'
import packageJson from '../package.json'

const exit = () => process.exit(0)
process.on('SIGINT', exit)
process.on('SIGTERM', exit)
;(function main() {
  const program = new Command()
    .name(packageJson.name)
    .version(packageJson.version)
    .description(packageJson.description)

  program
    .argument('[name]', 'Directory to create the Yuki stack in')
    .option('-y, --yes', 'Skip prompts and use default values')
    .action(createCommand)

  program.addCommand(addCommand)

  program.parse(process.argv)
})()
