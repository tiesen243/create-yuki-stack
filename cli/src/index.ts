import { createCli } from 'trpc-cli'

import { initCommand } from '@/commands/create'
import { createTRPCRouter, t } from '@/trpc'
import { sortPackageJson } from '@/utils/sort-package-json'
import packageJson from '../package.json'

const exit = () => process.exit(0)
process.on('SIGINT', exit)
process.on('SIGTERM', exit)

const router = createTRPCRouter({
  init: initCommand,
  sort: t.procedure
    .meta({ description: 'Sort package.json files in the workspace' })
    .mutation(sortPackageJson),
})

void createCli({
  router,
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
}).run()
