import { execSync } from 'node:child_process'
import type { PlopTypes } from '@turbo/gen'

interface PackageJson {
  name: string
  scripts: Record<string, string>
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
}

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('init', {
    description: 'Generate a new package for the Monorepo',
    prompts: [
      {
        type: 'input',
        name: 'packageName',
        message:
          'What is the name of the package? (You can skip the `@{{ name }}/` prefix)',
      },
      {
        type: 'input',
        name: 'deps',
        message:
          'Enter a space separated list of dependencies you would like to install',
      },
    ],
    actions: [
      (answers) => {
        if (
          'packageName' in answers &&
          typeof answers.packageName === 'string'
        ) {
          if (answers.packageName.startsWith('@{{ name }}/'))
            answers.packageName = answers.packageName.replace('@{{ name }}/', '')
        }
        return 'Config sanitized'
      },
      {
        type: 'add',
        path: 'packages/{{ packageName }}/eslint.config.js',
        templateFile: 'templates/eslint.config.js.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{ packageName }}/package.json',
        templateFile: 'templates/package.json.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{ packageName }}/tsconfig.json',
        templateFile: 'templates/tsconfig.json.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{ packageName }}/turbo.json',
        templateFile: 'templates/turbo.json.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{ packageName }}/src/index.ts',
        template: "export const name = '{{ packageName }}';",
      },
      {
        type: 'modify',
        path: 'packages/{{ packageName }}/package.json',
        async transform(content, answers) {
          if ('deps' in answers && typeof answers.deps === 'string') {
            const pkg = JSON.parse(content) as PackageJson
            for (const dep of answers.deps.split(' ').filter(Boolean)) {
              const version = await fetch(
                `https://registry.npmjs.org/-/package/${dep}/dist-tags`,
              )
                .then((res) => res.json() as Promise<{ latest: string }>)
                .then((json) => json.latest)
              if (!pkg.dependencies) pkg.dependencies = {}
              pkg.dependencies[dep] = `^${version}`
            }
            return JSON.stringify(pkg, null, 2)
          }
          return content
        },
      },
      async (answers) => {
        /**
         * Install deps and format everything
         */
        if (
          'packageName' in answers &&
          typeof answers.packageName === 'string'
        ) {
          execSync('{{ pkme }} sherif@latest --fix', { stdio: 'inherit' })
          execSync('{{ pkm }} install', { stdio: 'inherit' })
          execSync(
            `{{ pkm }} prettier --write packages/${answers.packageName}/** --list-different`,
          )
          return 'Package scaffolded'
        }
        return 'Package not scaffolded'
      },
    ],
  })
}
