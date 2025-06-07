'use client'

import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { useSubscription } from '@trpc/tanstack-react-query'

import type { RouterOutputs } from '@yuki/api'
import { Button } from '@yuki/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@yuki/ui/card'
import { useForm } from '@yuki/ui/form'
import { Loader2Icon, RotateCcwIcon, TrashIcon } from '@yuki/ui/icons'
import { Input } from '@yuki/ui/input'
import { toast } from '@yuki/ui/sonner'
import { createPostSchema } from '@yuki/validators/post'

import { useTRPC } from '@/lib/trpc/react'

export const CreatePost: React.FC = () => {
  const { trpc, trpcClient, queryClient } = useTRPC()

  const form = useForm({
    validator: createPostSchema,
    defaultValues: { title: '', content: '' },
    onSubmit: trpcClient.post.create.mutate,
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.post.all.queryFilter())
      form.reset()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <Card>
      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <form.Field
            name="title"
            render={({ field, meta }) => (
              <div id={meta.id} className="grid gap-2">
                <form.Label>Title</form.Label>
                <form.Control {...field}>
                  <Input placeholder="What's on your mind?" />
                </form.Control>
                <form.Message />
              </div>
            )}
          />

          <form.Field
            name="content"
            render={({ field, meta }) => (
              <div id={meta.id} className="grid gap-2">
                <form.Label>Content</form.Label>
                <form.Control {...field}>
                  <Input placeholder="What's on your mind?" />
                </form.Control>
                <form.Message />
              </div>
            )}
          />

          <Button disabled={form.state.isPending}>Create Post</Button>
        </form>
      </CardContent>
    </Card>
  )
}

export const PostList: React.FC = () => {
  const { trpc } = useTRPC()
  const { data } = useSuspenseQuery(trpc.post.all.queryOptions())

  return data.map((post) => <PostCard key={post.id} post={post} />)
}

export const SubscriptionStatus: React.FC = () => {
  const { trpc, queryClient } = useTRPC()
  const { status, reset } = useSubscription(
    trpc.post.onUpdate.subscriptionOptions(undefined, {
      onData: ({ action, data }) => {
        switch (action) {
          case 'create':
            queryClient.setQueryData(trpc.post.all.queryKey(), (oldData) => [
              data,
              ...(oldData ?? []),
            ])
            break
          case 'delete':
            queryClient.setQueryData(trpc.post.all.queryKey(), (oldData) => {
              if (!oldData) return oldData
              return oldData.filter((post) => post.id !== data.id)
            })
            break
        }
      },
    }),
  )

  return (
    <div className="flex items-center justify-end gap-2">
      <span>{status}</span>
      <Button size="icon" onClick={reset}>
        <RotateCcwIcon />
      </Button>
    </div>
  )
}

const PostCard: React.FC<{ post: RouterOutputs['post']['all'][number] }> = ({
  post,
}) => {
  const { trpc, queryClient } = useTRPC()
  const { mutate, isPending } = useMutation(
    trpc.post.delete.mutationOptions({
      onSuccess: () =>
        queryClient.invalidateQueries(trpc.post.all.queryFilter()),
      onError: (error) => {
        toast.error(error.message)
      },
    }),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>{post.createdAt.toDateString()}</CardDescription>
        <CardAction>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              mutate({ id: post.id })
            }}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <TrashIcon />
            )}
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <p>{post.content}</p>
      </CardContent>
    </Card>
  )
}

export const PostCardSkeleton: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="w-1/3 animate-pulse rounded-lg bg-current">
        &nbsp;
      </CardTitle>
      <CardDescription className="w-1/4 animate-pulse rounded-lg bg-current">
        &nbsp;
      </CardDescription>
    </CardHeader>

    <CardContent>
      <p className="h-20 animate-pulse rounded-lg bg-current">&nbsp;</p>
    </CardContent>
  </Card>
)
