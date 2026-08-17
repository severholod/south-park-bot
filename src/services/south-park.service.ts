import type { Logger } from '../logger'

export interface Episode {
  season: number
  episode: number
}

/**
 * Карта: номер сезона -> количество серий в сезоне.
 * Источник данных о структуре сериала South Park.
 */
const SEASONS_EPISODES_COUNT: ReadonlyMap<number, number> = new Map<number, number>([
  [1, 13],
  [2, 18],
  [3, 17],
  [4, 17],
  [5, 14],
  [6, 17],
  [7, 15],
  [8, 14],
  [9, 14],
  [10, 14],
  [11, 14],
  [12, 14],
  [13, 14],
  [14, 14],
  [15, 14],
  [16, 14],
  [17, 10],
  [18, 10],
  [19, 10],
  [20, 10],
  [21, 10],
  [22, 10],
  [23, 10],
  [24, 4],
  [25, 6],
  [26, 6],
])

export class SouthParkService {
  private readonly logger: Logger
  private readonly seasons: readonly number[]

  constructor(
    private readonly apiUrl: string,
    logger: Logger,
  ) {
    this.logger = logger.child('south-park')
    this.seasons = Array.from(SEASONS_EPISODES_COUNT.keys())
    this.logger.debug('SouthParkService инициализирован', {
      seasons: this.seasons.length,
      apiUrl,
    })
  }

  getRandomEpisode(): string {
    const season = this.seasons[Math.floor(Math.random() * this.seasons.length)]!
    const episodesCount = SEASONS_EPISODES_COUNT.get(season)

    if (!episodesCount) {
      this.logger.error('Не удалось определить количество серий для сезона', { season })
      throw new Error(`Нет данных о сезоне ${season}`)
    }

    const episode = Math.floor(Math.random() * episodesCount) + 1
    this.logger.debug('Выбрана случайная серия', { season, episode })
    return this.getEpisodeUrl({ season, episode })
  }

  getEpisodeUrl({ season, episode }: Episode): string {
    const episodePadded = episode < 10 ? `0${episode}` : `${episode}`
    return `${this.apiUrl}/${season}${episodePadded}/`
  }
}
