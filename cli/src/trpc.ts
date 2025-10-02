import type { TrpcCliMeta } from 'trpc-cli'
import { initTRPC } from '@trpc/server'

const t = initTRPC.meta<TrpcCliMeta>().create()

export const createTRPCRouter = t.router
export const procedure = t.procedure
