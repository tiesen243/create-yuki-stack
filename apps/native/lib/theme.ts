import type { DefaultTheme } from '@react-navigation/native'

const fonts = {
  regular: { fontFamily: 'Geist_400Regular', fontWeight: '400' },
  medium: { fontFamily: 'Geist_500Medium', fontWeight: '500' },
  bold: { fontFamily: 'Geist_700Bold', fontWeight: '700' },
  heavy: { fontFamily: ' Geist_900Black', fontWeight: '900' },
} satisfies (typeof DefaultTheme)['fonts']

export const LightTheme = {
  fonts,
  dark: false,
  colors: {
    primary: '#171717',
    background: '#ffffff',
    card: '#ffffff',
    text: '#0a0a0a',
    border: '#e5e5e5',
    notification: '#030303',
  },
} satisfies typeof DefaultTheme

export const DarkTheme = {
  fonts,
  dark: true,
  colors: {
    primary: '#e5e5e5',
    background: '#0a0a0a',
    card: '#171717',
    text: '#fafafa',
    border: '#ffffff1a',
    notification: '#171717',
  },
} as typeof DefaultTheme
