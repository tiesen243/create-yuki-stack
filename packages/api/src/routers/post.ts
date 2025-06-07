import { EventEmitter, on } from 'events'
import type { TRPCRouterRecord } from '@trpc/server'

import { desc, eq } from '@yuki/db'
import { posts } from '@yuki/db/schema'
import { byIdSchema, createPostSchema } from '@yuki/validators/post'

import { protectedProcedure, publicProcedure } from '../trpc'

const ee = new EventEmitter()

export const postRouter = {
  all: publicProcedure.query(({ ctx }) =>
    ctx.db.query.posts.findMany({
      orderBy: desc(posts.createdAt),
    }),
  ),

  byId: publicProcedure.input(byIdSchema).query(({ ctx, input }) =>
    ctx.db.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, input.id),
    }),
  ),

  create: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      const [post] = await ctx.db
        .insert(posts)
        .values({
          ...input,
          authorId: ctx.session.user.id,
        })
        .returning()

      ee.emit('post', 'create', post)

      return post
    }),

  delete: protectedProcedure
    .input(byIdSchema)
    .mutation(async ({ ctx, input }) => {
      const [post] = await ctx.db
        .delete(posts)
        .where(eq(posts.id, input.id))
        .returning()
      ee.emit('post', 'delete', post)
    }),

  onUpdate: publicProcedure.subscription(async function* ({ signal }) {
    for await (const [a, d] of on(ee, 'post', { signal })) {
      const action = a as 'create' | 'delete'
      const data = d as typeof posts.$inferSelect

      yield { action, data }
    }
  }),
} satisfies TRPCRouterRecord
