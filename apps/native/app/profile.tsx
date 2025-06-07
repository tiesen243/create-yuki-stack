import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useTheme } from '@react-navigation/native'
import { Loader2Icon } from 'lucide-react-native'

import { useSession } from '@/hooks/use-session'

export default function ProfileScreen() {
  const { fonts, colors } = useTheme()
  const { session, status, signIn, signOut } = useSession()

  if (status === 'loading') {
    return (
      <SafeAreaView style={styles.container}>
        <Loader2Icon size={32} color="#78a9ff" />
      </SafeAreaView>
    )
  }

  if (!session.user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ ...fonts.bold, color: colors.text }}>
          No session found
        </Text>

        <View>
          <Pressable
            style={{
              ...styles.actionButton,
              width: 100,
              marginTop: 20,
              backgroundColor: colors.primary,
            }}
            onPress={signIn}
          >
            <Text
              style={{
                ...fonts.bold,
                color: colors.background,
              }}
            >
              Login
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.scrollContainer}>
      <View style={styles.coverContainer}>
        <View
          style={{ ...styles.coverImage, backgroundColor: colors.primary }}
        />
        <View
          style={{
            ...styles.profileImageContainer,
            borderColor: colors.primary,
          }}
        >
          <Image
            source={{ uri: session.user.image, cache: 'force-cache' }}
            style={styles.profileImage}
          />
        </View>
      </View>

      <View style={styles.userInfoContainer}>
        <Text style={{ ...styles.userName, ...fonts.bold, color: colors.text }}>
          {session.user.name}
        </Text>
        <Text
          style={{
            ...styles.userEmail,
            ...fonts.regular,
            color: colors.text + '50',
          }}
        >
          {session.user.email}
        </Text>
      </View>

      <Pressable
        style={{
          ...styles.actionButton,
          backgroundColor: colors.card,
          marginTop: 20,
        }}
        onPress={signOut}
      >
        <Text
          style={{
            ...fonts.bold,
            color: colors.text,
          }}
        >
          Sign out
        </Text>
      </Pressable>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  coverContainer: {
    height: 150,
    position: 'relative',
  },
  coverImage: {
    height: '100%',
    opacity: 0.7,
  },
  profileImageContainer: {
    position: 'absolute',
    bottom: -50,
    left: 20,
    borderWidth: 2,
    borderRadius: 75,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userInfoContainer: {
    marginTop: 60,
    paddingHorizontal: 20,
  },
  userName: {
    fontSize: 24,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  actionButton: {
    height: 36,
    borderRadius: 6,
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
