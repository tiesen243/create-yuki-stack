import type { VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cva } from 'class-variance-authority'

import { cn } from '@yuki/ui'

const typographyVariants = cva(
  'mb-1 font-sans text-base leading-7 font-normal',
  {
    variants: {
      variant: {
        h1: 'mb-8 scroll-m-20 text-7xl font-extrabold tracking-tight text-balance lg:text-8xl',
        h2: 'mb-5 scroll-m-20 text-5xl font-bold tracking-tight text-balance first:mt-0 lg:text-6xl',
        h3: 'mb-4 scroll-m-20 text-4xl font-semibold tracking-tight text-balance lg:text-5xl',
        h4: 'mb-3 scroll-m-20 text-3xl font-semibold tracking-tight text-balance lg:text-4xl',
        h5: 'mb-2.5 scroll-m-20 text-xl font-semibold tracking-tight text-balance lg:text-2xl',
        h6: 'mb-2 scroll-m-20 text-lg font-semibold tracking-tight text-balance lg:text-xl',
        p: 'text-base text-pretty lg:text-lg',
        ul: 'my-4 ml-6 list-disc [&>li]:mt-2',
        ol: '"my-4 ml-6 list-decimal [&>li]:mt-2',
        blockquote:
          'mt-6 border-l-2 pl-6 italic before:content-["“"] after:content-["”"]',
        code: 'bg-muted relative w-fit rounded-md px-[0.3rem] py-[0.2rem] font-mono text-sm font-medium',
        caption: 'block text-sm tracking-wide',
      },
    },
    defaultVariants: {
      variant: 'p',
    },
  },
)

interface TypographyProps
  extends React.ComponentProps<'p'>,
    VariantProps<typeof typographyVariants> {
  component?: React.ElementType
}

function Typography({
  className,
  variant = 'p',
  component,
  ...props
}: TypographyProps) {
  const Comp = component ?? (variant as React.ElementType)

  return (
    <Comp
      data-slot="typography"
      className={cn(typographyVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Typography, typographyVariants }
