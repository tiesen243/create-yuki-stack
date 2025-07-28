import { ApiSelector } from '@/app/builder/components/api-selector'
import { AuthSelector } from '@/app/builder/components/auth-selector'
import { BackendSelector } from '@/app/builder/components/backend-selector'
import { BuildPrompt, PageProvider } from '@/app/builder/components/context'
import { DatabaseSelector } from '@/app/builder/components/database-selector'
import { ExtrasSelector } from '@/app/builder/components/extras-selector'
import { FrontendSelector } from '@/app/builder/components/frontend-selector'
import { PackageManagerSelector } from '@/app/builder/components/package-manager-selector'
import { ProjectNameInput } from '@/app/builder/components/project-name-input'
import { ProjectOptions } from '@/app/builder/components/project-options'

export default function BuilderPage() {
  return (
    <PageProvider>
      <main className='grid max-h-[calc(100dvh-8rem)] grid-cols-4'>
        <h1 className='sr-only'>Yuki Stack Builder</h1>

        <aside className='space-y-4 border-r p-4'>
          <ProjectNameInput />

          <ProjectOptions />

          <BuildPrompt />
        </aside>

        <section className='col-span-3 container grid gap-6 overflow-y-auto py-4'>
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
