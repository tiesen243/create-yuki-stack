import { Text } from '@react-email/components'

import type { SendEmailParams } from '..'
import { EmailLayout } from './_layout'

export default function Welcome(_: SendEmailParams) {
  return (
    <EmailLayout previewText="Welcome to my app!">
      <Text>Welcome to my app!</Text>
    </EmailLayout>
  )
}
