import type { Logger } from '../logger'

export interface AppConfig {
  botToken: string
  botApiUrl?: string
  southParkApiUrl: string
  nodeEnv: string
  isProduction: boolean
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConfigError'
  }
}

function assertDefined<T>(value: T | undefined, name: string): asserts value is T {
  if (value === undefined) {
    throw new ConfigError(`Отсутствует обязательная переменная окружения: ${name}`)
  }
}

/**
 * Загружает и валидирует конфигурацию приложения из переменных окружения.
 * Бросает ConfigError, если обязательные переменные отсутствуют.
 */
export function loadConfig(logger?: Logger): AppConfig {
  const botToken = process.env.BOT_TOKEN
  const botApiUrl = process.env.BOT_API_URL
  const southParkApiUrl = process.env.SOUTH_PARK_API_URL
  const nodeEnv = process.env.NODE_ENV ?? 'development'

  const missing: string[] = []
  if (!botToken) missing.push('BOT_TOKEN')
  if (!southParkApiUrl) missing.push('SOUTH_PARK_API_URL')

  if (missing.length > 0) {
    const message = `Отсутствуют обязательные переменные окружения: ${missing.join(', ')}`
    logger?.error(message)
    throw new ConfigError(message)
  }

  assertDefined(botToken, 'BOT_TOKEN')
  assertDefined(southParkApiUrl, 'SOUTH_PARK_API_URL')

  const config: AppConfig = {
    botToken,
    botApiUrl,
    southParkApiUrl,
    nodeEnv,
    isProduction: nodeEnv === 'production',
  }

  logger?.debug('Конфигурация загружена', {
    botApiUrl,
    southParkApiUrl,
    nodeEnv,
  })

  return config
}
