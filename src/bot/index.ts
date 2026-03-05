import { Telegraf } from 'telegraf'
import { getBotToken } from '../config/env.ts'
import { handleInlineQuery } from './handlers.ts'

export const createBot = (): Telegraf => {
  const token = getBotToken()
  const bot = new Telegraf(token)

  bot.on('inline_query', async (ctx) => {
    const result = await handleInlineQuery(ctx.inlineQuery.query)
    await ctx.answerInlineQuery(result, { cache_time: 86400 })
  })

  return bot
}

export const launchBot = (bot: Telegraf): void => {
  bot.launch()
}

export const setupGracefulShutdown = (bot: Telegraf): void => {
  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))
}
