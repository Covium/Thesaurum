import { createBot, launchBot, setupGracefulShutdown } from './bot/index.ts'

const bot = createBot()
setupGracefulShutdown(bot)
launchBot(bot)

console.log('Bot is running...')
