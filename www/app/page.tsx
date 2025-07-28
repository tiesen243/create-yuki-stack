import { BenefitsSection } from '@/components/benefits-section'
import { CtaSection } from '@/components/cta-section'
import { FeaturesSection } from '@/components/features-section'
import { GettingStartedSection } from '@/components/getting-started-section'
import { HeroSection } from '@/components/hero-section'
import { OptionsShowcase } from '@/components/options-showcase'

export default function YukiStackLanding() {
  return (
    <main className='flex-1'>
      <HeroSection />

      <FeaturesSection />

      <OptionsShowcase />

      <GettingStartedSection />

      <BenefitsSection />

      <CtaSection />
    </main>
  )
}
