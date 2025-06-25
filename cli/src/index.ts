import { createCli } from 'trpc-cli'

import { addAuthCommand } from '@/commands/add-auth'
import { addGhActionsCommand } from '@/commands/add-gh-actions'
import { initCommand } from '@/commands/init'
import { createTRPCRouter } from '@/trpc'
import packageJson from '../package.json'

const exit = () => process.exit(0)
process.on('SIGINT', exit)
process.on('SIGTERM', exit)

const router = createTRPCRouter({
  init: initCommand,
  add: { auth: addAuthCommand, gh: addGhActionsCommand },
})

void createCli({
  router,
  name: packageJson.name,
  description: packageJson.description,
  version: packageJson.version,
}).run()
