import { db } from '@{{ name }}/db'
import Elysia from 'elysia'

export const dbPlugin = new Elysia({ name: 'db' }).derive(
  { as: 'global' },
  () => ({ db }),
)
