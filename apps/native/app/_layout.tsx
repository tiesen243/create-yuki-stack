import { useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_700Bold,
  Geist_900Black,
  useFonts,
} from '@expo-google-fonts/geist'
import { ThemeProvider } from '@react-navigation/native'
import { QueryClientProvider } from '@tanstack/react-query'
import { HomeIcon, UserIcon } from 'lucide-react-native'

import { SessionProvider } from '@/hooks/use-session'
import { DarkTheme, LightTheme } from '@/lib/theme'
import { queryClient } from '@/lib/trpc'

export default function RootLayout() {
  const colorScheme = useColorScheme()
  useFonts([Geist_400Regular, Geist_500Medium, Geist_700Bold, Geist_900Black])

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : LightTheme}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <SafeAreaProvider>
            <Tabs
              screenOptions={{
                tabBarActiveTintColor: '#78a9ff',
              }}
            >
              <Tabs.Screen
                name="index"
                options={{
                  title: 'Create Yuki Turbo',
                  tabBarIcon: ({ color }) => (
                    <HomeIcon size={28} color={color} />
                  ),
                }}
              />
              <Tabs.Screen
                name="profile"
                options={{
                  title: 'Profile',
                  tabBarIcon: ({ color }) => (
                    <UserIcon size={28} color={color} />
                  ),
                }}
              />
            </Tabs>
            <StatusBar />
          </SafeAreaProvider>
        </SessionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
