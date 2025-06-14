import { zod as z } from 'trpc-cli'

import { t } from '@/trpc'
import { sortPackageJson } from '@/utils/sort-package-json'

export const sortCommand = t.procedure
  .meta({ description: 'Sort package.json files in the workspace' })
  .input(
    z.object({
      verbose: z.boolean().optional().default(true),
    }),
  )
  .mutation(({ input }) => sortPackageJson(input))
