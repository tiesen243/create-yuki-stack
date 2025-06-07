import type { TRPCRouterRecord } from '@trpc/server'
import { TRPCError } from '@trpc/server'

import { Password } from '@yuki/auth'
import { and, eq } from '@yuki/db'
import { accounts, users } from '@yuki/db/schema'
import { changePasswordSchema, signUpSchema } from '@yuki/validators/auth'

import { protectedProcedure, publicProcedure } from '../trpc'

const password = new Password()

export const authRouter = {
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, input.email),
      })

      if (user)
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User already exists',
        })

      const [newUser] = await ctx.db
        .insert(users)
        .values({
          name: input.name,
          email: input.email,
          image: '',
        })
        .returning({ id: users.id })

      await ctx.db
        .insert(accounts)
        .values({
          provider: 'credentials',
          accountId: newUser?.id ?? '',
          userId: newUser?.id ?? '',
          password: await password.hash(input.password),
        })
        .returning()

      return true
    }),

  changePassword: protectedProcedure
    .input(changePasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const { currentPassword, newPassword } = input
      const userId = ctx.session.user.id

      const account = await ctx.db.query.accounts.findFirst({
        where: (accounts, { and, eq }) =>
          and(
            eq(accounts.provider, 'credentials'),
            eq(accounts.accountId, userId),
          ),
      })

      if (!account) {
        await ctx.db.insert(accounts).values({
          provider: 'credentials',
          accountId: userId,
          userId: userId,
          password: await password.hash(newPassword),
        })
      } else {
        if (
          !(await password.verify(
            account.password ?? '',
            currentPassword ?? '',
          ))
        )
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Current password is incorrect',
          })

        await ctx.db
          .update(accounts)
          .set({ password: await password.hash(newPassword) })
          .where(
            and(
              eq(accounts.provider, 'credentials'),
              eq(accounts.accountId, account.accountId),
            ),
          )
      }

      return true
    }),
} satisfies TRPCRouterRecord
