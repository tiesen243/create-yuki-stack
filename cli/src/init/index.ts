import * as Command from '@effect/cli/Command'
import * as Console from 'effect/Console'
import * as Effect from 'effect/Effect'
import gradient from 'gradient-string'
import ora from 'ora'

import { COLORS, LOGO } from '@/lib/constants'
import { config, validator } from '@/lib/options'

// oxlint-disable-next-line import/no-relative-parent-imports
import { version } from '../../package.json' with { type: 'json' }

export const initCommand = Command.make('init', config).pipe(
  Command.withDescription('Initialize a new project'),
  Command.withHandler((opts) =>
    Effect.gen(function* init() {
      yield* Console.log(gradient(COLORS)(LOGO))
      yield* Console.log(` Version: ${version}`)
      yield* Console.log(
        ` Documentation: https://yuki-ui.vercel.app/docs/lib/create-yuki-stack\n`,
      )

      const validatedOpts = yield* validator(opts)

      const { projectName, projectDir, packageManager } = validatedOpts
      const spinner = ora(`Creating project in ${projectDir}...`).start()

      yield* Effect.promise<string>(
        // oxlint-disable-next-line promise/avoid-new, no-promise-executor-return
        () => new Promise((resolve) => setTimeout(resolve, 2000)),
      )

      if (validatedOpts.install) {
        spinner.text = `Installing dependencies using ${packageManager}...`
        yield* Effect.promise(
          // oxlint-disable-next-line promise/avoid-new, no-promise-executor-return
          () => new Promise((resolve) => setTimeout(resolve, 2000)),
        )
      }

      if (validatedOpts.git) {
        spinner.text = 'Initializing git repository...'
        yield* Effect.promise(
          // oxlint-disable-next-line promise/avoid-new, no-promise-executor-return
          () => new Promise((resolve) => setTimeout(resolve, 2000)),
        )
      }

      spinner.succeed(`Project created successfully in ${projectDir}`)
      yield* Console.log(
        `  Next steps:\n\n    cd ${projectName}\n    ${packageManager} run dev\n`,
      )
    }),
  ),
)
