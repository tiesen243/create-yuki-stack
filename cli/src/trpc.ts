import type { TrpcCliMeta } from 'trpc-cli'
import { trpcServer } from 'trpc-cli'

const t = trpcServer.initTRPC.meta<TrpcCliMeta>().create()

export const createTRPCRouter = t.router
export const procedure = t.procedure
