import type { Logger } from '../logger'

export type Factory<T> = (container: Container) => T

export interface Binding<T> {
  factory: Factory<T>
  scope: 'singleton' | 'transient'
}

export class Container {
  private readonly bindings = new Map<string, Binding<unknown>>()
  private readonly instances = new Map<string, unknown>()
  private readonly logger: Logger

  constructor(logger: Logger) {
    this.logger = logger
  }

  /**
   * Регистрирует фабрику для токена.
   */
  bind<T>(token: string, factory: Factory<T>, scope: 'singleton' | 'transient' = 'singleton'): this {
    this.bindings.set(token, { factory, scope })
    this.logger.debug(`Зарегистрирован binding: ${token} (${scope})`)
    return this
  }

  /**
   * Регистрирует уже созданный экземпляр (например, значение конфигурации).
   */
  bindValue<T>(token: string, value: T): this {
    this.instances.set(token, value)
    this.logger.debug(`Зарегистрировано значение: ${token}`)
    return this
  }

  /**
   * Возвращает экземпляр по токену.
   */
  resolve<T>(token: string): T {
    // Если уже есть созданный singleton/value — возвращаем
    if (this.instances.has(token)) {
      return this.instances.get(token) as T
    }

    const binding = this.bindings.get(token)
    if (!binding) {
      throw new Error(`Нет binding для токена: ${token}`)
    }

    const instance = binding.factory(this) as T

    if (binding.scope === 'singleton') {
      this.instances.set(token, instance)
    }

    return instance
  }

  /**
   * Проверяет, зарегистрирован ли токен.
   */
  has(token: string): boolean {
    return this.bindings.has(token) || this.instances.has(token)
  }
}
