import type { SendEmailParams } from '..'

import { Text } from '@react-email/components'

import { EmailLayout } from './_layout'

export default function Welcome({ data }: SendEmailParams) {
  const name = String(data?.name)

  return (
    <EmailLayout previewText='Welcome to my app!'>
      <Text>Welcome to my app, {name}!</Text>
    </EmailLayout>
  )
}
