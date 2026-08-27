import { Bot } from '@maxhub/max-bot-api'
import type { AppConfig } from '../config'
import type { Logger } from '../logger'
import type { Handler } from './handlers'

/**
 * Команды бота, регистрируемые через `setMyCommands`.
 */
const BOT_COMMANDS = [
  { name: 'ping', description: 'Проверить доступность бота' },
  { name: 'random', description: 'Выбрать случайную серию' },
  { name: 'callback', description: 'Показать кнопку' },
] as const

/**
 * Фабрика для создания и настройки экземпляра бота.
 * Инкапсулирует конфигурацию, регистрацию команд и подключение хендлеров.
 */
export class BotFactory {
  private readonly logger: Logger

  constructor(
    logger: Logger,
    private readonly config: AppConfig,
    private readonly handlers: Handler[],
  ) {
    this.logger = logger.child('bot-factory')
  }

  create(): Bot {
    this.logger.info('Создание экземпляра бота...', {
      botApiUrl: this.config.botApiUrl ?? 'default',
    })

    const bot = new Bot(this.config.botToken, {
      clientOptions: {
        baseUrl: this.config.botApiUrl,
      },
    })

    // Регистрируем команды в меню бота
    bot.api.setMyCommands([...BOT_COMMANDS])

    // Глобальный обработчик ошибок
    bot.catch((err, ctx) => {
      this.logger.error('Необработанная ошибка в хендлере бота', {
        error: err,
        chatId: ctx.chatId,
        updateType: ctx.updateType,
      })
    })

    // Регистрируем все хендлеры
    for (const handler of this.handlers) {
      handler.register(bot)
      this.logger.debug(`Зарегистрирован хендлер: ${handler.constructor.name}`)
    }

    this.logger.info('Бот сконфигурирован', {
      handlers: this.handlers.length,
      commands: BOT_COMMANDS.length,
    })

    return bot
  }
}
