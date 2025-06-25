import { Resend } from 'resend'

import { env } from '@{{ name }}/validators/env'

import * as email from './emails'

const resend = new Resend(env.RESEND_KEY)

export interface SendEmailParams {
  to: string
  subject: string
  email: keyof typeof email
  data?: Record<string, unknown>
}

async function sendEmail(params: SendEmailParams) {
  await resend.emails.send({
    from: 'noreply@{{ name }}.com',
    to: params.to,
    subject: params.subject,
    react: email[params.email](params),
  })
}

export { resend, sendEmail }
