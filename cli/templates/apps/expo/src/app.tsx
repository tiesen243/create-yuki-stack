import '@/globals.css'

import { DarkTheme, DefaultTheme } from '@react-navigation/native'
import { QueryClientProvider } from '@tanstack/react-query'
import * as SplashScreen from 'expo-splash-screen'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useUniwind } from 'uniwind'

import { queryClient } from '@/lib/api'
import { Navigation } from '@/screens/__root'

SplashScreen.preventAutoHideAsync()

export default function App() {
  const { theme: colorscheme } = useUniwind()
  const theme = colorscheme === 'dark' ? DarkTheme : DefaultTheme

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Navigation theme={theme} onReady={() => SplashScreen.hideAsync()} />
      </QueryClientProvider>
    </SafeAreaProvider>
  )
}
