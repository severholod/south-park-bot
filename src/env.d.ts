export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN?: string
      BOT_API_URL?: string
      SOUTH_PARK_API_URL?: string
      NODE_ENV?: 'development' | 'production' | 'test'
    }
  }
}
