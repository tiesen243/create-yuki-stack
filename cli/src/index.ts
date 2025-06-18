import { createCli } from 'trpc-cli'

import { initCommand } from '@/commands/init'
import { createTRPCRouter } from '@/trpc'
import packageJson from '../package.json'

const exit = () => process.exit(0)
process.on('SIGINT', exit)
process.on('SIGTERM', exit)

const router = createTRPCRouter({
  init: initCommand,
})

void createCli({
  router,
  name: packageJson.name,
  description: packageJson.description,
  version: packageJson.version,
}).run()
