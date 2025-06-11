import type { TrpcCliMeta } from 'trpc-cli'
import { createCli, trpcServer, zod as z } from 'trpc-cli'

import { createCommand } from '@/commands/create'
import packageJson from '../package.json'
import { sortPackageJson } from './utils/sort-package-json'
import { projectNameSchema } from './utils/validators'

const exit = () => process.exit(0)
process.on('SIGINT', exit)
process.on('SIGTERM', exit)

const t = trpcServer.initTRPC.meta<TrpcCliMeta>().create()

const router = t.router({
  init: t.procedure
    .meta({
      description: 'Initialize a new Yuki stack project',
      aliases: { options: { yes: 'y' } },
      default: true,
    })
    .input(
      z.tuple([
        projectNameSchema.optional(),
        z.object({
          yes: z
            .boolean()
            .describe('Skip prompts and use default values')
            .default(false),
        }),
      ]),
    )
    .mutation(async ({ input }) => createCommand(input[0], input[1])),
  sort: t.procedure
    .meta({
      description: 'Sort package.json files in the workspace',
    })
    .mutation(sortPackageJson),
})

void createCli({
  router,
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
}).run()
