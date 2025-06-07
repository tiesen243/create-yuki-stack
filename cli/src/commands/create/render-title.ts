import gradient from 'gradient-string'

import { APP_TITLE } from '@/utils/constants'

export const renderTitle = () => {
  console.log(
    gradient([
      '#ff0080',
      '#ff8c00',
      '#ffff00',
      '#00ff80',
      '#0080ff',
      '#8000ff',
    ])(APP_TITLE),
  )
}
