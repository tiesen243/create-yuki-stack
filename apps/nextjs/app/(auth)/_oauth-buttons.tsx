'use client'

import { useQueryStates } from 'nuqs'

import { useSession } from '@yuki/auth/react'
import { Button } from '@yuki/ui/button'
import { CardFooter } from '@yuki/ui/card'
import { DiscordIcon, GoogleIcon } from '@yuki/ui/icons'

import { redirect } from './_search-params'

export const OauthButtons: React.FC = () => {
  const [{ redirectTo }] = useQueryStates(redirect.parsers, redirect.configs)
  const { signIn } = useSession()

  return (
    <CardFooter className="grid gap-2">
      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-card text-muted-foreground relative z-10 px-2">
          Or continue with
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={() => signIn('discord', { redirectTo })}
        >
          <DiscordIcon /> Discord
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signIn('google', { redirectTo })}
        >
          <GoogleIcon /> Google
        </Button>
      </div>
    </CardFooter>
  )
}
