import { Resend } from 'resend'

import { env } from '@{{ name }}/validators/env'

import * as Templates from '@/templates'

const resend = new Resend(env.RESEND_TOKEN)

interface SendEmailOptions<T extends keyof typeof Templates> {
  to: string
  subject: string
  template: T
  data: React.ComponentProps<(typeof Templates)[T]>
}

export async function sendEmail<T extends keyof typeof Templates>(
  opts: SendEmailOptions<T>,
) {
  const res = await resend.emails.send({
    from: 'Yukinu <no-reply@tiesen.id.vn>',
    to: opts.to,
    subject: opts.subject,
    react: Templates[opts.template](opts.data as never),
  })

  if (res.error) throw new Error(res.error.message)
  return res.data
}
