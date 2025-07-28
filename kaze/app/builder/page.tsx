import { ApiSelector } from '@/app/builder/_components/api-selector'
import { AuthSelector } from '@/app/builder/_components/auth-selector'
import { BackendSelector } from '@/app/builder/_components/backend-selector'
import { BuildPrompt, PageProvider } from '@/app/builder/_components/context'
import { DatabaseSelector } from '@/app/builder/_components/database-selector'
import { ExtrasSelector } from '@/app/builder/_components/extras-selector'
import { FrontendSelector } from '@/app/builder/_components/frontend-selector'
import { PackageManagerSelector } from '@/app/builder/_components/package-manager-selector'
import { PresetSelect } from '@/app/builder/_components/preset-select'
import { ProjectNameInput } from '@/app/builder/_components/project-name-input'
import { ProjectOptions } from '@/app/builder/_components/project-options'
import { Typography } from '@/components/ui/typography'

export default function BuilderPage() {
  return (
    <PageProvider>
      <main className='grid max-h-[calc(100dvh-8rem)] grid-cols-4'>
        <h1 className='sr-only'>Yuki Stack Builder</h1>

        <aside className='flex flex-col justify-between gap-4 border-r p-4'>
          <h2 className='sr-only'>Options section</h2>

          <ProjectNameInput />

          <ProjectOptions />

          <BuildPrompt />

          <Typography variant='h6' component='h3' className='mb-0'>
            Existing Presets
          </Typography>
          <PresetSelect />
        </aside>

        <section className='container col-span-3 grid gap-6 overflow-y-auto py-4'>
          <h2 className='sr-only'>Selector section</h2>

          <FrontendSelector />

          <DatabaseSelector />

          <BackendSelector />

          <ApiSelector />

          <AuthSelector />

          <ExtrasSelector />

          <PackageManagerSelector />
        </section>
      </main>
    </PageProvider>
  )
}
