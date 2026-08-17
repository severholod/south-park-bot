import type { Bot } from '@maxhub/max-bot-api'
import type { Logger } from '../../logger'
import type { Keyboards } from '../keyboards'
import type { Handler } from './types'

/**
 * Обработчик события старта бота (`bot_started`).
 * Отправляет приветственное сообщение с кнопкой выбора серии.
 */
export class StartHandler implements Handler {
  private readonly logger: Logger

  constructor(
    logger: Logger,
    private readonly keyboards: Keyboards,
  ) {
    this.logger = logger.child('start-handler')
  }

  register(bot: Bot): void {
    bot.on('bot_started', async (ctx) => {
      this.logger.info('Бот запущен в чате', {
        chatId: ctx.chatId,
        userId: ctx.user?.user_id,
      })

      await ctx.reply(
        'Не можешь выбрать, какую серию посмотреть? Жми на кнопку или набирай команду /random',
        { attachments: [this.keyboards.randomize] },
      )
    })
  }
}
