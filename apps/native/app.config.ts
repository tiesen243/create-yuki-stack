import type { ConfigContext, ExpoConfig } from 'expo/config'

const configs = ({ config }: ConfigContext) =>
  ({
    ...config,
    name: 'native',
    slug: 'native',
    scheme: 'native',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    userInterfaceStyle: 'automatic',
    updates: { fallbackToCacheTimeout: 0 },
    assetBundlePatterns: ['**/*'],
    newArchEnabled: true,
    ios: {
      bundleIdentifier: 'com.yuki.nativeapp',
      supportsTablet: true,
      icon: './assets/images/icon.png',
    },
    android: {
      package: 'com.yuki.nativeapp',
      adaptiveIcon: {
        foregroundImage: './assets/images/icon.png',
        backgroundColor: '#0a0a0a',
      },
    },
    // extra: { eas: { projectId: '' } },
    experiments: {
      tsconfigPaths: true,
      typedRoutes: true,
    },
    plugins: [
      'expo-router',
      'expo-secure-store',
      'expo-web-browser',
      [
        'expo-splash-screen',
        { backgroundColor: '#0a0a0a', image: './assets/images/icon.png' },
      ],
    ],
  }) satisfies ExpoConfig

export default configs
