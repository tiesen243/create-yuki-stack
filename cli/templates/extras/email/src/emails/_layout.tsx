import {
  Body,
  Font,
  Head,
  Html,
  Preview,
  Tailwind,
} from '@react-email/components'

interface EmailLayoutProps {
  previewText: string
  children: React.ReactNode
}

export function EmailLayout(props: Readonly<EmailLayoutProps>) {
  const { previewText, children } = props

  return (
    <Tailwind>
      <Html lang='en'>
        <Head>
          <Font
            fontFamily='Geist'
            fallbackFontFamily="Verdana"
            webFont={{
              url: 'https://fonts.gstatic.com/s/geist/v1/gyByhwUxId8gMEwcGFU.woff2',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle='normal'
          />
          <Preview>{previewText}</Preview>
        </Head>

        <Body className='h-full w-full bg-white'>{children}</Body>
      </Html>
    </Tailwind>
  )
}
