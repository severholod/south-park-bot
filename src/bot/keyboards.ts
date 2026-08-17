import { Keyboard } from '@maxhub/max-bot-api'

/**
 * Фабрика клавиатур бота.
 * Вынесено в отдельный модуль для переиспользования и удобства тестирования.
 */
export class Keyboards {
  get randomize() {
    return Keyboard.inlineKeyboard([
      [Keyboard.button.callback('Поехали!', 'randomize')],
    ])
  }
}
