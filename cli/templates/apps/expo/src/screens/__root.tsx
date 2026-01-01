import type { StaticParamList } from '@react-navigation/native'

import { createStaticNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { lazy } from 'react'

import IndexScreen from '@/screens/_index'

const RootStack = createNativeStackNavigator({
  initialRouteName: 'index',
  screens: {
    index: {
      screen: IndexScreen,
      options: { title: 'Home' },
    },
    notFound: {
      screen: lazy(() => import('@/screens/not-found')),
      options: { title: 'Oops!' },
    },
  },
})

export const Navigation = createStaticNavigation(RootStack)

declare global {
  type RootStackParamList = StaticParamList<typeof RootStack>

  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
