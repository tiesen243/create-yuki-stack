import type { VariantProps } from '@{{ name }}/ui'

import { cn, cva } from '@{{ name }}/ui'
import { Platform, Pressable } from 'react-native'

import { TextClassContext } from '@/components/ui/text'

const buttonVariants = cva(
  cn(
    'group/button rounded-md border border-transparent bg-clip-padding inline-flex items-center justify-center whitespace-nowrap transition-all outline-none',
    Platform.select({
      web: 'focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 focus-visible:ring-[3px] aria-invalid:ring-[3px] select-none',
    }),
  ),
  {
    variants: {
      variant: {
        default: cn(
          'bg-primary shadow-sm shadow-black/5',
          Platform.select({ web: '[a]:hover:bg-primary/90' }),
        ),
        destructive: cn(
          'bg-destructive/10 dark:bg-destructive/20 active:bg-destructive/20 dark:active:bg-destructive/30',
          Platform.select({
            web: 'hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 focus-visible:border-destructive/40 dark:hover:bg-destructive/30',
          }),
        ),
        outline: cn(
          'border-border bg-background dark:bg-input/30 dark:border-input active:bg-muted dark:active:bg-input/50',
          Platform.select({
            web: 'hover:bg-muted dark:hover:bg-input/50 aria-expanded:bg-muted aria-expanded:text-foreground',
          }),
        ),
        secondary: cn(
          'bg-secondary active:bg-secondary/80',
          Platform.select({
            web: 'hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
          }),
        ),
        ghost: cn(
          'active:bg-muted dark:active:bg-muted/50',
          Platform.select({
            web: 'hover:bg-muted dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground',
          }),
        ),
        link: '',
      },
      size: {
        default: cn(
          'h-8 gap-1.5 px-2.5',
          Platform.select({
            web: 'has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
          }),
        ),
        xs: cn(
          'h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs',
          Platform.select({
            web: "has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
          }),
        ),
        sm: cn(
          'h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem]',
          Platform.select({
            web: "has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
          }),
        ),
        lg: cn(
          'h-9 gap-1.5 px-2.5',
          Platform.select({
            web: 'has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
          }),
        ),
        icon: 'size-8',
        'icon-xs': cn(
          'size-6 rounded-[min(var(--radius-md),10px)]',
          Platform.select({
            web: "[&_svg:not([class*='size-'])]:size-3",
          }),
        ),
        'icon-sm': 'size-7 rounded-[min(var(--radius-md),12px)]',
        'icon-lg': 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

const buttonTextVariants = cva(
  cn(
    'text-foreground text-sm font-medium',
    Platform.select({ web: 'pointer-events-none transition-colors' }),
  ),
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        destructive: 'text-destructive',
        outline: cn(
          'group-active/button:text-foreground',
          Platform.select({ web: 'group-hover/button:text-foreground' }),
        ),
        secondary: 'text-secondary-foreground',
        ghost: cn(
          'group-active/button:text-foreground',
          Platform.select({
            web: 'group-hover/button:text-foreground',
          }),
        ),
        link: cn(
          'text-primary group-active/button:underline',
          Platform.select({
            web: 'underline-offset-4 hover:underline group-hover/button:underline',
          }),
        ),
      },
      size: {
        default: '',
        xs: '',
        sm: '',
        lg: '',
        icon: '',
        'icon-xs': '',
        'icon-sm': '',
        'icon-lg': '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ButtonProps = React.ComponentProps<typeof Pressable> &
  React.RefAttributes<typeof Pressable> &
  VariantProps<typeof buttonVariants>

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <Pressable
        className={cn(
          props.disabled && 'opacity-50',
          buttonVariants({ variant, size }),
          className,
        )}
        role='button'
        {...props}
      />
    </TextClassContext.Provider>
  )
}

export { Button, buttonTextVariants, buttonVariants }
export type { ButtonProps }
