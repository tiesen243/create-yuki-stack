import { View } from 'react-native'

import { Text } from '@/components/ui/text'

export default function IndexScreen() {
  return (
    <View className='flex-1 bg-background'>
      <View className='container flex-1 items-center justify-center'>
        <Text>Index Screen</Text>
      </View>
    </View>
  )
}
