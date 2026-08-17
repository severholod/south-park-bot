import 'dotenv/config'

import { Application } from './app'
import { createContainer } from './di'
import { TOKENS } from './di'
import type { BotFactory } from './bot'
import type { Logger } from './logger'

async function main(): Promise<void> {
  const container = createContainer()
  const logger = container.resolve<Logger>(TOKENS.Logger)

  try {
    const botFactory = container.resolve<BotFactory>(TOKENS.BotFactory)
    const bot = botFactory.create()

    const app = new Application(logger, bot)
    await app.start()
  } catch (error) {
    logger.error('Критическая ошибка при запуске приложения', { error })
    process.exit(1)
  }
}

void main()
