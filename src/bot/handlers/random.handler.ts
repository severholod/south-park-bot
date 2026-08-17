import type { Bot, Context } from '@maxhub/max-bot-api'
import type { Logger } from '../../logger'
import type { SouthParkService } from '../../services/south-park.service'
import type { Keyboards } from '../keyboards'
import type { Handler } from './types'

/**
 * Обработчик команды `/random` и action `randomize`.
 * Выбирает случайную серию South Park и отправляет пользователю.
 */
export class RandomHandler implements Handler {
  private readonly logger: Logger

  constructor(
    logger: Logger,
    private readonly southParkService: SouthParkService,
    private readonly keyboards: Keyboards,
  ) {
    this.logger = logger.child('random-handler')
  }

  register(bot: Bot): void {
    bot.command('random', (ctx) => this.handleRandom(ctx))
    bot.action('randomize', (ctx) => this.handleRandom(ctx))
  }

  private async handleRandom(ctx: Context): Promise<void> {
    const chatId = ctx.chatId
    this.logger.debug('Запрос случайной серии', { chatId })

    try {
      const url = this.southParkService.getRandomEpisode()
      this.logger.info('Отправлена случайная серия', { chatId, url })

      await ctx.reply(`Случайная серия: ${url}`)
      await ctx.reply('Еще', { attachments: [this.keyboards.randomize] })
    } catch (error) {
      this.logger.error('Ошибка при выборе случайной серии', { chatId, error })
      await ctx.reply('Упс! Не удалось выбрать серию. Попробуйте еще раз.')
    }
  }
}
