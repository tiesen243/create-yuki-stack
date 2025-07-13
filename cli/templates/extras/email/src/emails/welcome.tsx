import { Text } from '@react-email/components'

import type { SendEmailParams } from '..'
import { EmailLayout } from './_layout'

export default function Welcome({ data }: SendEmailParams) {
  const name = data?.name ?? 'Yuki'

  return (
    <EmailLayout previewText='Welcome to my app!'>
      <Text>Welcome to my app, {name}!</Text>
    </EmailLayout>
  )
}
