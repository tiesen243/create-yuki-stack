import { Command } from 'commander'

export const addCommand = new Command()
  .name('add')
  .description('Add a new feature to the Yuki stack')
  .argument('[features...]', 'Features to add to the Yuki stack')
  .action((features: string[]) => {
    console.log(features)
  })
