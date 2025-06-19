import Elysia from 'elysia'

import { db } from '@{{ name }}/db'

export const dbPlugin = new Elysia({ name: 'db' }).derive(
  { as: 'global' },
  () => ({ db }),
)
