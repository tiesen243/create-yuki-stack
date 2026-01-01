import type { VariantProps } from '@{{ name }}/ui'
import type { Role } from 'react-native'

import { cn, cva } from '@{{ name }}/ui'
import * as React from 'react'
import { Platform, Text as RNText } from 'react-native'

const textVariants = cva(
  cn(
    'text-foreground text-base',
    Platform.select({
      web: 'select-text',
    }),
  ),
  {
    variants: {
      variant: {
        default: '',
        h1: cn(
          'text-4xl font-extrabold tracking-tight',
          Platform.select({ web: 'scroll-m-20 text-balance' }),
        ),
        h2: cn(
          'text-3xl font-semibold tracking-tight',
          Platform.select({ web: 'scroll-m-20 first:mt-0' }),
        ),
        h3: cn(
          'text-2xl font-semibold tracking-tight',
          Platform.select({ web: 'scroll-m-20' }),
        ),
        h4: cn(
          'text-xl font-semibold tracking-tight',
          Platform.select({ web: 'scroll-m-20' }),
        ),
        p: 'mt-3 leading-7 sm:mt-6',
        blockquote:
          'my-2 border-l-2 pl-6 italic before:content-["“"] after:content-["”"]',
        code: cn(
          'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
        ),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type TextVariantProps = VariantProps<typeof textVariants>

type TextVariant = NonNullable<TextVariantProps['variant']>

const ROLE: Partial<Record<TextVariant, Role>> = {
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
  h4: 'heading',
  blockquote: Platform.select({ web: 'blockquote' as Role }),
  code: Platform.select({ web: 'code' as Role }),
}

const ARIA_LEVEL: Partial<Record<TextVariant, string>> = {
  h1: '1',
  h2: '2',
  h3: '3',
  h4: '4',
}

const TextClassContext = React.createContext<string | undefined>(undefined)

function Text({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof RNText> &
  TextVariantProps &
  React.RefAttributes<RNText>) {
  const textClass = React.useContext(TextClassContext)
  return (
    <RNText
      className={cn(textVariants({ variant }), textClass, className)}
      role={variant ? ROLE[variant] : undefined}
      aria-level={variant ? ARIA_LEVEL[variant] : undefined}
      {...props}
    />
  )
}

export { Text, TextClassContext }
