export const TOKENS = {
  Logger: 'Logger',
  Config: 'Config',
  SouthParkService: 'SouthParkService',
  Bot: 'Bot',
  Keyboards: 'Keyboards',
  StartHandler: 'StartHandler',
  PingHandler: 'PingHandler',
  RandomHandler: 'RandomHandler',
  CallbackHandler: 'CallbackHandler',
  BotFactory: 'BotFactory',
} as const

export type Token = (typeof TOKENS)[keyof typeof TOKENS]
