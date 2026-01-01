import { ExpoConfig, ConfigContext } from 'expo/config'

import pkg from './package.json'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name:
    pkg.name.match(/^@([^/]+)/)?.[1]?.replace(/^./, (c) => c.toUpperCase()) ??
    pkg.name,
  slug: pkg.name.replaceAll('@', '').replaceAll('/', '-').trim(),
  version: pkg.version,
  orientation: 'portrait',
  scheme: pkg.name.replaceAll('@', '').split('/').at(0),
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  updates: { fallbackToCacheTimeout: 0 },
  newArchEnabled: true,
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: `com.${pkg.name.replaceAll('@', '').replaceAll('/', '.')}`,
    associatedDomains: ['webcredentials:yukinu.vercel.app'],
    supportsTablet: true,
    icon: './assets/icon.png',
  },
  android: {
    package: `com.${pkg.name.replaceAll('@', '').replaceAll('/', '.')}`,
    adaptiveIcon: {
      foregroundImage: './assets/icon.png',
      backgroundColor: '#14185a',
    },
    edgeToEdgeEnabled: true,
  },
  experiments: {
    tsconfigPaths: true,
  },
  plugins: [
    [
      'expo-splash-screen',
      {
        backgroundColor: '#14185a',
        image: './assets/icon.png',
      },
    ],
  ],
})
