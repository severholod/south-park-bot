import { env } from 'node:process'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogMeta {
  [key: string]: unknown
}

const LEVELS: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
}

// ANSI-коды для цветного вывода
const COLORS = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
} as const

const LEVEL_STYLES: Record<LogLevel, { label: string; color: string }> = {
  debug: { label: 'DEBUG', color: COLORS.gray },
  info: { label: ' INFO', color: COLORS.cyan },
  warn: { label: ' WARN', color: COLORS.yellow },
  error: { label: 'ERROR', color: COLORS.red },
}

function timestamp(): string {
  const now = new Date()
  const pad = (n: number, len = 2): string => n.toString().padStart(len, '0')
  return (
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
    `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.` +
    `${pad(now.getMilliseconds(), 3)}`
  )
}

function formatMeta(meta?: LogMeta, useColors = true): string {
  if (!meta || Object.keys(meta).length === 0) return ''
  try {
    const json = JSON.stringify(meta)
    return useColors ? `${COLORS.dim} ${json}${COLORS.reset}` : ` ${json}`
  } catch {
    return ''
  }
}

function formatError(err: unknown): { message: string; meta?: LogMeta } {
  if (err instanceof Error) {
    return {
      message: err.message,
      meta: {
        name: err.name,
        ...(err.stack ? { stack: err.stack } : {}),
        ...(err.cause ? { cause: err.cause } : {}),
      },
    }
  }
  if (typeof err === 'string') return { message: err }
  return { message: String(err) }
}

export interface Logger {
  debug(message: string, meta?: LogMeta): void
  info(message: string, meta?: LogMeta): void
  warn(message: string, meta?: LogMeta): void
  error(message: string | Error, meta?: LogMeta): void
  child(scope: string): Logger
  readonly level: LogLevel
}

export interface LoggerOptions {
  level?: LogLevel
  scope?: string
  useColors?: boolean
}

export class ConsoleLogger implements Logger {
  readonly level: LogLevel
  private readonly scope: string
  private readonly useColors: boolean

  constructor(options?: LoggerOptions) {
    this.level = options?.level ?? (env.NODE_ENV === 'production' ? 'info' : 'debug')
    this.scope = options?.scope ?? 'app'
    this.useColors = options?.useColors ?? env.NODE_ENV !== 'production'
  }

  private shouldLog(level: LogLevel): boolean {
    return LEVELS[level] >= LEVELS[this.level]
  }

  private write(level: LogLevel, message: string, meta?: LogMeta): void {
    if (!this.shouldLog(level)) return

    const style = LEVEL_STYLES[level]
    const ts = timestamp()

    if (this.useColors) {
      const levelStr = `${style.color}${COLORS.bold}${style.label}${COLORS.reset}`
      const tsStr = `${COLORS.gray}${ts}${COLORS.reset}`
      const scopeStr = `${COLORS.magenta}[${this.scope}]${COLORS.reset}`
      const msgStr = level === 'error' ? `${COLORS.red}${message}${COLORS.reset}` : message
      process.stdout.write(`${tsStr} ${levelStr} ${scopeStr} ${msgStr}${formatMeta(meta, true)}\n`)
    } else {
      process.stdout.write(`${ts} ${style.label} [${this.scope}] ${message}${formatMeta(meta, false)}\n`)
    }
  }

  debug(message: string, meta?: LogMeta): void {
    this.write('debug', message, meta)
  }

  info(message: string, meta?: LogMeta): void {
    this.write('info', message, meta)
  }

  warn(message: string, meta?: LogMeta): void {
    this.write('warn', message, meta)
  }

  error(message: string | Error, meta?: LogMeta): void {
    const { message: msg, meta: errMeta } = formatError(message)
    this.write('error', msg, { ...meta, ...errMeta })
  }

  child(scope: string): Logger {
    return new ConsoleLogger({
      level: this.level,
      scope: `${this.scope}:${scope}`,
      useColors: this.useColors,
    })
  }
}

/** Глобальный экземпляр логгера по умолчанию. */
export const logger: Logger = new ConsoleLogger()
