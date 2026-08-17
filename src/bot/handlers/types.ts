import type { Bot, Context } from '@maxhub/max-bot-api'

/**
 * Базовый интерфейс обработчика команд бота.
 * Каждый обработчик инкапсулирует логику одной команды/action'а
 * и регистрирует себя на переданном экземпляре бота.
 */
export interface Handler {
  register(bot: Bot): void
}

/**
 * Тип функции-обработчика контекста.
 */
export type HandlerFn = (ctx: Context) => Promise<void> | void
