import type * as Option from 'effect/Option'

import { Prompt } from '@effect/cli'
import * as Args from '@effect/cli/Args'
import * as Options from '@effect/cli/Options'
import * as Effect from 'effect/Effect'
import * as Schema from 'effect/Schema'

import {
  EXTRA_FEATURES,
  APIS,
  BACKENDS,
  DATABASES,
  DEFAULT_NAME,
  FRONTENDS,
  PACKAGE_MANAGERS,
} from '@/lib/constants'
import { getPackageManager } from '@/lib/utils'

const nameSchema = Schema.String.pipe(
  Schema.filter(
    (s) => /^(?:\.|[a-z][a-z0-9-]*)$/.test(s) || 'Project name is invalid',
  ),
)

export const config = {
  name: Args.text({ name: 'name' }).pipe(
    Args.withDescription('The name of your new project directory'),
    Args.withSchema(nameSchema),

    Args.optional,
  ),

  frontends: Options.choice(
    'frontends',
    FRONTENDS.map((f) => f.value),
  ).pipe(
    Options.withAlias('f'),
    Options.withDescription('The frontend framework(s) to bootstrap'),

    Options.atMost(FRONTENDS.length),
  ),

  backend: Options.choice(
    'backend',
    BACKENDS.map((b) => b.value),
  ).pipe(
    Options.withAlias('b'),
    Options.withDescription('The backend framework to power your application'),

    Options.optional,
  ),

  api: Options.choice(
    'api',
    APIS.map((a) => a.value),
  ).pipe(
    Options.withAlias('a'),
    Options.withDescription('The API communications layer'),

    Options.optional,
  ),

  database: Options.choice(
    'database',
    DATABASES.map((d) => d.value),
  ).pipe(
    Options.withAlias('d'),
    Options.withDescription('The database integration to provision'),

    Options.optional,
  ),

  extraFeatures: Options.choice(
    'extra',
    EXTRA_FEATURES.map((f) => f.value),
  ).pipe(
    Options.withAlias('e'),
    Options.withDescription('Additional tooling and features to configure'),

    Options.atMost(EXTRA_FEATURES.length),
  ),

  packageManager: Options.choice(
    'package-manager',
    PACKAGE_MANAGERS.map((p) => p.value),
  ).pipe(
    Options.withAlias('p'),
    Options.withDescription(
      'The specific package manager to use for the project',
    ),
    Options.optional,
  ),
  install: Options.boolean('install').pipe(
    Options.withAlias('i'),
    Options.withDescription(
      'Automatically install dependencies after project creation',
    ),
  ),
  git: Options.boolean('git').pipe(
    Options.withAlias('g'),
    Options.withDescription(
      'Initialize a new git repository in the created directory',
    ),
  ),
}

interface Options {
  name: Option.Option<string>
  frontends: (typeof FRONTENDS)[number]['value'][]
  backend: Option.Option<(typeof BACKENDS)[number]['value']>
  api: Option.Option<(typeof APIS)[number]['value']>
  database: Option.Option<(typeof DATABASES)[number]['value']>
  extraFeatures: (typeof EXTRA_FEATURES)[number]['value'][]

  packageManager: Option.Option<(typeof PACKAGE_MANAGERS)[number]['value']>
  install: boolean
  git: boolean
}

export const validator = (opts: Options) =>
  Effect.gen(function* validate() {
    const projectName =
      opts.name._tag === 'None'
        ? yield* Prompt.text({
            message: 'What will your project be called?',
            default: DEFAULT_NAME,
            validate: (s) =>
              Schema.decode(nameSchema)(s).pipe(
                Effect.catchTag('ParseError', () =>
                  Effect.fail('Project name is invalid'),
                ),
              ),
          })
        : opts.name.value

    let projectDir = process.cwd()
    if (projectName !== '.') projectDir += `/${projectName}`

    const frontends = [
      ...new Set(
        opts.frontends.length > 0
          ? opts.frontends
          : yield* Prompt.multiSelect({
              message: 'Which frontend framework do you want to use?',
              choices: FRONTENDS,
              min: 1,
            }),
      ),
    ]

    const backend =
      opts.backend._tag === 'None'
        ? yield* Prompt.select({
            message: 'Which backend framework do you want to use?',
            choices: BACKENDS,
          })
        : opts.backend.value

    const api =
      opts.api._tag === 'None'
        ? yield* Prompt.select({
            message: 'Which API framework do you want to use?',
            choices: APIS,
          })
        : opts.api.value

    const database =
      opts.database._tag === 'None'
        ? yield* Prompt.select({
            message: 'Which database do you want to use?',
            choices: DATABASES,
          })
        : opts.database.value

    const extraFeatures = [
      ...new Set(
        opts.extraFeatures.length > 0
          ? opts.extraFeatures
          : yield* Prompt.multiSelect({
              message: 'Which additional features do you want to include?',
              choices: EXTRA_FEATURES,
            }),
      ),
    ]

    const packageManager =
      opts.packageManager._tag === 'None'
        ? yield* Prompt.select({
            message: 'Which package manager do you want to use?',
            choices: [...PACKAGE_MANAGERS].toSorted((a, b) => {
              const pm = getPackageManager()
              if (a.value === pm) return -1
              if (b.value === pm) return 1
              return 0
            }),
          })
        : opts.packageManager.value

    const install =
      opts.install === false
        ? yield* Prompt.toggle({
            message:
              'Do you want to install dependencies after creating the project?',
            initial: true,
          })
        : opts.install

    const git =
      opts.git === false
        ? yield* Prompt.toggle({
            message: 'Do you want to initialize a git repository?',
            initial: true,
          })
        : opts.git

    return {
      projectName,
      projectDir,

      frontends,
      backend,
      api,
      database,
      extraFeatures,

      packageManager: packageManager ?? getPackageManager(),
      install,
      git,
    }
  })

export type ValidatedOptions =
  ReturnType<typeof validator> extends Effect.Effect<
    infer R,
    infer _E,
    infer _A
  >
    ? R
    : never
