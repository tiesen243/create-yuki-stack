import { createLoader, parseAsString } from 'nuqs/server'

export const redirect = {
  parsers: { redirectTo: parseAsString.withDefault('/') },
  configs: { urlKeys: { redirectTo: 'redirect_to' } },
}

export const loader = createLoader(redirect.parsers, redirect.configs)
