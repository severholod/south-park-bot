import { BotFactory, CallbackHandler, Keyboards, PingHandler, RandomHandler, StartHandler } from '../bot'
import { loadConfig } from '../config'
import { ConsoleLogger, type Logger } from '../logger'
import { SouthParkService } from '../services/south-park.service'
import { Container } from './container'
import { TOKENS } from './tokens'

/**
 * Создаёт и настраивает DI-контейнер со всеми зависимостями приложения.
 */
export function createContainer(): Container {
  const baseLogger: Logger = new ConsoleLogger({ scope: 'south-park-bot' })
  const container = new Container(baseLogger)

  // Logger
  container.bindValue<Logger>(TOKENS.Logger, baseLogger)

  // Config
  const config = loadConfig(baseLogger)
  container.bindValue(TOKENS.Config, config)

  // Keyboards
  container.bind(TOKENS.Keyboards, () => new Keyboards())

  // SouthParkService
  container.bind(TOKENS.SouthParkService, (c) => {
    const cfg = c.resolve<ReturnType<typeof loadConfig>>(TOKENS.Config)
    const log = c.resolve<Logger>(TOKENS.Logger)
    return new SouthParkService(cfg.southParkApiUrl, log)
  })

  // Handlers
  container.bind(TOKENS.StartHandler, (c) => {
    const log = c.resolve<Logger>(TOKENS.Logger)
    const keyboards = c.resolve<Keyboards>(TOKENS.Keyboards)
    return new StartHandler(log, keyboards)
  })

  container.bind(TOKENS.PingHandler, (c) => {
    const log = c.resolve<Logger>(TOKENS.Logger)
    return new PingHandler(log)
  })

  container.bind(TOKENS.RandomHandler, (c) => {
    const log = c.resolve<Logger>(TOKENS.Logger)
    const southParkService = c.resolve<SouthParkService>(TOKENS.SouthParkService)
    const keyboards = c.resolve<Keyboards>(TOKENS.Keyboards)
    return new RandomHandler(log, southParkService, keyboards)
  })

  container.bind(TOKENS.CallbackHandler, (c) => {
    const log = c.resolve<Logger>(TOKENS.Logger)
    const keyboards = c.resolve<Keyboards>(TOKENS.Keyboards)
    return new CallbackHandler(log, keyboards)
  })

  // BotFactory
  container.bind(TOKENS.BotFactory, (c) => {
    const log = c.resolve<Logger>(TOKENS.Logger)
    const cfg = c.resolve<ReturnType<typeof loadConfig>>(TOKENS.Config)
    const handlers = [
      c.resolve<StartHandler>(TOKENS.StartHandler),
      c.resolve<PingHandler>(TOKENS.PingHandler),
      c.resolve<RandomHandler>(TOKENS.RandomHandler),
      c.resolve<CallbackHandler>(TOKENS.CallbackHandler),
    ]
    return new BotFactory(log, cfg, handlers)
  })

  baseLogger.info('DI-контейнер сконфигурирован')
  return container
}
