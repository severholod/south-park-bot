import type { Bot } from '@maxhub/max-bot-api'
import type { Logger } from './logger'

/**
 * Управляет жизненным циклом приложения:
 * запускает бота и обеспечивает корректное завершение (graceful shutdown)
 * по сигналам `SIGINT` / `SIGTERM`.
 */
export class Application {
  private readonly logger: Logger
  private readonly bot: Bot
  private shuttingDown = false

  constructor(logger: Logger, bot: Bot) {
    this.logger = logger.child('app')
    this.bot = bot
  }

  async start(): Promise<void> {
    this.logger.info('Запуск приложения...')

    process.on('SIGINT', () => this.shutdown('SIGINT'))
    process.on('SIGTERM', () => this.shutdown('SIGTERM'))

    try {
      await this.bot.start()
      this.logger.info('Бот запущен и готов к работе')
    } catch (error) {
      this.logger.error('Ошибка при запуске бота', { error })
      process.exit(1)
    }
  }

  private shutdown(signal: NodeJS.Signals): void {
    if (this.shuttingDown) {
      this.logger.warn('Завершение уже выполняется, принудительный выход', { signal })
      process.exit(1)
      return
    }

    this.shuttingDown = true
    this.logger.info('Получен сигнал завершения, останавливаю бота...', { signal })

    try {
      this.bot.stop()
      this.logger.info('Бот остановлен. Завершение процесса.')
      process.exit(0)
    } catch (error) {
      this.logger.error('Ошибка при остановке бота', { error })
      process.exit(1)
    }
  }
}
