import 'dotenv/config'
import {Bot, Keyboard, Context} from '@maxhub/max-bot-api'
import {SouthPark} from "./south-park";

const botToken = process.env.BOT_TOKEN
const botApiURL = process.env.BOT_API_URL
const southparkapiurl = process.env.SOUTH_PARK_API_URL ?? ''

if (!botToken) {
  throw new Error('Bot token is missing')
}

const bot = new Bot(botToken, {
  clientOptions: {
    baseUrl: botApiURL,
  }
})
const southPark = new SouthPark(southparkapiurl)

const callbackKeyboard = Keyboard.inlineKeyboard([
  [
    Keyboard.button.callback('Поехали!', 'randomize'),
  ],
]);

bot.api.setMyCommands([
  {
    name: 'ping',
    description: 'Проверить доступность бота',
  },
  {
    name: 'random',
    description: 'Выбрать случайную серию',
  },
  {
    name: 'callback',
    description: 'Показать кнопку'
  }
])
bot.on(
  'bot_started',
  (ctx) => {
    console.log('Бот запущен')
    ctx.reply(
      'Не можешь выбрать, какую серию посмотреть? Жми на кнопку или набирай команду /random',
      {
        attachments: [callbackKeyboard]
      }
    )
  }
);

bot.command('ping', (ctx) => ctx.reply('pong'));

function getRandomEpisode(ctx: Context) {
  const url = southPark.getRandomEpisode()
  ctx.reply(`Случайная серия: ${url}`)
  ctx.reply('Еще', { attachments: [callbackKeyboard] });
}

bot.command('random', getRandomEpisode)

bot.command('callback', (ctx) => {
  return ctx.reply('Click!', { attachments: [callbackKeyboard] });
});

bot.action('randomize', getRandomEpisode);

bot.start()
