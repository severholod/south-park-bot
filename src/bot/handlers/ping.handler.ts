import type { Bot } from '@maxhub/max-bot-api'
import type { Logger } from '../../logger'
import type { Handler } from './types'

/**
 * Обработчик команды `/ping` — проверка доступности бота.
 */
export class PingHandler implements Handler {
  private readonly logger: Logger

  constructor(logger: Logger) {
    this.logger = logger.child('ping-handler')
  }

  register(bot: Bot): void {
    bot.command('ping', async (ctx) => {
      this.logger.debug('Команда /ping', { chatId: ctx.chatId })
      await ctx.reply('pong')
    })
  }
}
