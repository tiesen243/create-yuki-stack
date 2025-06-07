#!/usr/bin/env node
import { Command } from 'commander'

import { addCommand } from '@/commands/add'
import { createCommand } from '@/commands/create'
import packageJson from '../package.json'

;(function main() {
  const program = new Command()
    .name(packageJson.name)
    .version(packageJson.version)
    .description(packageJson.description)

  program
    .argument('[name]', 'Directory to create the Yuki stack in')
    .action(createCommand)

  program.addCommand(addCommand)

  program.parse(process.argv)
})()
