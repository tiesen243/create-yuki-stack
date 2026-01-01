import type { TextInputProps } from 'react-native'

import { cn } from '@{{ name }}/ui'
import { Platform, TextInput } from 'react-native'
import { useUniwind } from 'uniwind'

function Input({
  className,
  placeholderTextColorClassName: _,
  placeholderTextColor: __,
  ...props
}: TextInputProps & React.RefAttributes<TextInput>) {
  const { theme } = useUniwind()
  return (
    <TextInput
      className={cn(
        'h-8 w-full min-w-0 rounded-lg border border-input bg-transparent text-foreground px-2.5 py-1 text-base transition-colors outline-none md:text-sm dark:bg-input/30',
        'file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
        props.editable === false &&
          cn(
            'opacity-50',
            Platform.select({
              web: 'disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50',
            }),
          ),
        Platform.select({
          web: cn(
            'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
            'aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
          ),
        }),
        className,
      )}
      placeholderTextColor={theme === 'dark' ? '#a4a4a4' : '#525252'}
      {...props}
    />
  )
}

export { Input }
