import { useEffect } from 'react'
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { useTheme } from '@react-navigation/native'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  MessageCircleIcon,
  ShareIcon,
  ThumbsUpIcon,
  XIcon,
} from 'lucide-react-native'

import type { RouterOutputs } from '@yuki/api'
import { useForm } from '@yuki/ui/form'

import { trpc, trpcClient } from '@/lib/trpc'

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <CreatePost />
      <PostList />
    </SafeAreaView>
  )
}

const PostList: React.FC = () => {
  const { data = [], isLoading } = useQuery(trpc.post.all.queryOptions())

  return (
    <ScrollView>
      {isLoading &&
        Array.from({ length: 5 }).map((_, i) => <PostCardSkeleton key={i} />)}
      {!isLoading && data.map((post) => <PostCard key={post.id} post={post} />)}
    </ScrollView>
  )
}

const PostCard: React.FC<{
  post: RouterOutputs['post']['all'][number]
}> = ({ post }) => {
  const { colors, fonts } = useTheme()
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation(
    trpc.post.delete.mutationOptions({
      onSettled: () =>
        queryClient.invalidateQueries(trpc.post.all.queryFilter()),
    }),
  )

  return (
    <View style={{ ...styles.card, backgroundColor: colors.card }}>
      <View style={styles.card_header}>
        <Pressable
          style={styles.card_action}
          onPress={() => {
            mutate({ id: post.id })
          }}
          disabled={isPending}
        >
          <XIcon size={18} color={colors.text + '80'} />
        </Pressable>
      </View>

      <Text
        style={{
          ...styles.card_title,
          ...fonts.bold,
          color: colors.text,
          marginTop: 12,
        }}
      >
        {post.title}
      </Text>
      <Text
        style={{
          ...styles.card_content,
          ...fonts.regular,
          color: colors.text,
        }}
      >
        {post.content}
      </Text>

      <View
        style={{ ...styles.post_engagement_bar, borderColor: colors.border }}
      >
        <Pressable style={styles.post_engagement_button}>
          <ThumbsUpIcon size={18} color={colors.text + '80'} />
          <Text
            style={{
              ...fonts.medium,
              fontSize: 13,
              color: colors.text + '80',
              marginLeft: 4,
            }}
          >
            Like
          </Text>
        </Pressable>

        <Pressable style={styles.post_engagement_button}>
          <MessageCircleIcon size={18} color={colors.text + '80'} />
          <Text
            style={{
              ...fonts.medium,
              fontSize: 13,
              color: colors.text + '80',
              marginLeft: 4,
            }}
          >
            Comment
          </Text>
        </Pressable>

        <Pressable style={styles.post_engagement_button}>
          <ShareIcon size={18} color={colors.text + '80'} />
          <Text
            style={{
              ...fonts.medium,
              fontSize: 13,
              color: colors.text + '80',
              marginLeft: 4,
            }}
          >
            Share
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const PostCardSkeleton: React.FC = () => {
  const { colors } = useTheme()
  const opacity = useSharedValue(0.3)

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.8, { duration: 1000 }), -1, true)
  }, [opacity])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  return (
    <View style={{ ...styles.card, backgroundColor: colors.card }}>
      <View style={styles.card_header}>
        <Animated.View
          style={[
            styles.user_avatar,
            { backgroundColor: colors.border },
            animatedStyle,
          ]}
        />

        <View style={{ flex: 1 }}>
          <Animated.View
            style={[
              {
                height: 14,
                width: '40%',
                backgroundColor: colors.border,
                borderRadius: 4,
                marginBottom: 8,
              },
              animatedStyle,
            ]}
          />
          <Animated.View
            style={[
              {
                height: 10,
                width: '25%',
                backgroundColor: colors.border,
                borderRadius: 4,
              },
              animatedStyle,
            ]}
          />
        </View>
      </View>

      <Animated.View
        style={[
          {
            height: 18,
            width: '70%',
            backgroundColor: colors.border,
            borderRadius: 4,
            marginTop: 16,
            marginBottom: 8,
          },
          animatedStyle,
        ]}
      />
      <Animated.View
        style={[
          {
            height: 14,
            width: '90%',
            backgroundColor: colors.border,
            borderRadius: 4,
            marginBottom: 6,
          },
          animatedStyle,
        ]}
      />
      <Animated.View
        style={[
          {
            height: 14,
            width: '80%',
            backgroundColor: colors.border,
            borderRadius: 4,
          },
          animatedStyle,
        ]}
      />

      <View
        style={{
          ...styles.post_engagement_bar,
          borderTopColor: colors.border,
        }}
      >
        {[1, 2, 3].map((i) => (
          <Animated.View
            key={i}
            style={[
              {
                height: 20,
                width: '20%',
                backgroundColor: colors.border,
                borderRadius: 4,
                marginInline: 'auto',
              },
              animatedStyle,
            ]}
          />
        ))}
      </View>
    </View>
  )
}

const CreatePost: React.FC = () => {
  const { colors } = useTheme()

  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues: { title: '', content: '' },
    onSubmit: trpcClient.post.create.mutate,
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.post.all.queryFilter())
    },
  })

  return (
    <View
      style={{
        ...styles.form,
        backgroundColor: colors.card,
      }}
    >
      <form.Field
        name="title"
        render={({ field, meta }) => (
          <View id={meta.id}>
            <TextInput
              placeholder="Title"
              placeholderTextColor={colors.text + '50'}
              style={{
                ...styles.form_input,
                borderColor: colors.border,
                color: colors.text,
              }}
              value={field.value}
              onChangeText={field.onChange}
            />
          </View>
        )}
      />

      <form.Field
        name="content"
        render={({ field, meta }) => (
          <View id={meta.id}>
            <TextInput
              placeholder="Content"
              placeholderTextColor={colors.text + '50'}
              style={{
                ...styles.form_input,
                borderColor: colors.border,
                color: colors.text,
              }}
              value={field.value}
              onChangeText={field.onChange}
            />
          </View>
        )}
      />

      <Pressable
        style={{
          ...styles.form_button,
          backgroundColor: colors.primary,
          opacity: form.state.isPending ? 0.8 : 1,
        }}
      >
        <Text
          style={{
            ...styles.card_content,
            color: colors.background,
          }}
          onPress={form.handleSubmit}
        >
          Create Post
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 32,
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  card_header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card_title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  card_content: {
    fontSize: 16,
  },
  card_action: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  user_avatar: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  post_engagement_bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    marginTop: 16,
    paddingTop: 12,
  },
  post_engagement_button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    width: '33%',
  },
  form: {
    flexDirection: 'column',
    gap: 8,
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
  },
  form_input: {
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 16,
  },
  form_button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 6,
    fontSize: 12,
    height: 36,
  },
})
