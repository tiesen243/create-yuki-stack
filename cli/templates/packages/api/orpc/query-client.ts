import type { StandardRPCJsonSerializedMetaItem } from '@orpc/client/standard'
import { StandardRPCJsonSerializer } from '@orpc/client/standard'
import { QueryClient } from '@tanstack/react-query'

const serializer = new StandardRPCJsonSerializer({
  customJsonSerializers: [
    // put custom serializers here
  ]
})

export const createQueryClient = () => 
  new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn(queryKey) {
          const [json, meta] = serializer.serialize(queryKey)
          return JSON.stringify({ json, meta })
        },
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
      dehydrate: {
        serializeData(data) {
          const [json, meta] = serializer.serialize(data)
          return { json, meta }
        }
      },
      hydrate: {
        deserializeData(data: {
          json: unknown
          meta: StandardRPCJsonSerializedMetaItem[]
        }) {
          return serializer.deserialize(data.json, data.meta)
        },
      },
    }
  })
