# South Park Bot

Бот для платформы **MAX**, который помогает выбрать случайную серию South Park.

## Возможности

- `/start` — приветственное сообщение с inline-кнопкой
- `/random` — выбрать случайную серию
- `/callback` — показать inline-кнопку
- `/ping` — проверить доступность бота
- Inline-кнопка «Поехали!» для быстрого выбора серии

## Архитектура

Проект построен по принципам **чистой архитектуры** с **Dependency Injection (DI)**:

```
src/
├── index.ts              # Точка входа (композиция зависимостей)
├── app.ts                # Управление жизненным циклом (graceful shutdown)
├── config/               # Конфигурация и валидация env-переменных
│   └── index.ts
├── logger/               # Цветной логгер для консоли
│   └── index.ts
├── di/                   # DI-контейнер и регистрация зависимостей
│   ├── container.ts      # Лёгкий IoC-контейнер (singleton/transient)
│   ├── tokens.ts         # Токены зависимостей
│   └── register.ts       # Конфигурация контейнера
├── services/             # Бизнес-логика
│   └── south-park.service.ts
└── bot/                  # Слой бота
    ├── bot.factory.ts    # Фабрика создания и настройки бота
    ├── keyboards.ts      # Фабрика клавиатур
    └── handlers/         # Обработчики команд (декомпозиция)
        ├── types.ts      # Интерфейс Handler
        ├── start.handler.ts
        ├── ping.handler.ts
        ├── random.handler.ts
        └── callback.handler.ts
```

### Ключевые паттерны

- **Dependency Injection** — все зависимости передаются через конструктор, регистрируются в IoC-контейнере
- **Декомпозиция** — каждый обработчик команды в отдельном классе, реализующем интерфейс `Handler`
- **Factory** — `BotFactory` инкапсулирует создание и конфигурацию бота
- **Type Safety** — strict-режим TypeScript, type guards для валидации конфигурации
- **Graceful Shutdown** — обработка `SIGINT`/`SIGTERM` для корректной остановки
- **Structured Logging** — цветной вывод с timestamp, scope, уровнем и метаданными в JSON

### Логгер

Логгер поддерживает уровни `debug`, `info`, `warn`, `error` и автоматически:
- Добавляет timestamp с миллисекундами
- Раскрашивает уровни и scope (отключается в production)
- Сериализует метаданные в JSON
- Разворачивает ошибки (name, stack, cause)
- Создаёт дочерние логгеры через `logger.child('scope')`

## Установка

```bash
npm install
```

## Конфигурация

Создайте `.env` файл:

```env
BOT_TOKEN=your_bot_token
BOT_API_URL=https://botapi.max.ru
SOUTH_PARK_API_URL=https://southpark.cc.com
NODE_ENV=development
```

## Запуск

```bash
# Разовая сборка и запуск
npm run build
npm start

# Разработка без сборки
npm run dev

# Разработка с авто-перезагрузкой
npm run dev:watch

# Проверка типов
npm run type-check
