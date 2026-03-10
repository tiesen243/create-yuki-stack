import * as Command from '@effect/cli/Command'
import * as BunContext from '@effect/platform-bun/BunContext'
import * as BunRuntime from '@effect/platform-bun/BunRuntime'
import * as Effect from 'effect/Effect'

import { initCommand } from '@/init'

// oxlint-disable-next-line import/no-relative-parent-imports
import packageJson from '../package.json' with { type: 'json' }

const cli = Command.run(initCommand, {
  name: packageJson.name,
  version: packageJson.version,
})

cli(process.argv).pipe(Effect.provide(BunContext.layer), BunRuntime.runMain)

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))
