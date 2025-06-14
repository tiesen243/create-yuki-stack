import { t } from '@/trpc'
import { sortPackageJson } from '@/utils/sort-package-json'

export const sortCommand = t.procedure
  .meta({ description: 'Sort package.json files in the workspace' })
  .mutation(sortPackageJson)
