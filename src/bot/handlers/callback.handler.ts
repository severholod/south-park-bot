import type { Bot } from '@maxhub/max-bot-api'
import type { Logger } from '../../logger'
import type { Keyboards } from '../keyboards'
import type { Handler } from './types'

/**
 * Обработчик команды `/callback` — показывает инлайн-кнопку.
 */
export class CallbackHandler implements Handler {
  private readonly logger: Logger

  constructor(
    logger: Logger,
    private readonly keyboards: Keyboards,
  ) {
    this.logger = logger.child('callback-handler')
  }

  register(bot: Bot): void {
    bot.command('callback', async (ctx) => {
      this.logger.debug('Команда /callback', { chatId: ctx.chatId })
      await ctx.reply('Click!', { attachments: [this.keyboards.randomize] })
    })
  }
}
