import { useNavigation } from '@react-navigation/native'
import { View } from 'react-native'

import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'

export default function NotFoundScreen() {
  const navigation = useNavigation()

  return (
    <View className='flex-1 bg-background'>
      <View className='container flex-1 items-center justify-center gap-6'>
        <Text variant='h1'>404 - Not Found</Text>

        <Button onPress={() => navigation.navigate('index')}>
          <Text>Take me Home</Text>
        </Button>
      </View>
    </View>
  )
}
