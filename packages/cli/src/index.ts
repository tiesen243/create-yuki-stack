import { createCli } from 'trpc-cli'

import { initCommand } from '@/commands/create'
import { createTRPCRouter, t } from '@/trpc'
import packageJson from '../package.json'
import { sortCommand } from './commands/sort'

const exit = () => process.exit(0)
process.on('SIGINT', exit)
process.on('SIGTERM', exit)

const router = createTRPCRouter({
  init: initCommand,
  sort: sortCommand,
})

void createCli({
  router,
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
}).run()
