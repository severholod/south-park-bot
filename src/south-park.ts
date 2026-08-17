export interface Episode {
  season: number
  episode: number
}

// Карта: номер сезона -> количество серий в сезоне
const seasonsEpisodesCount: Map<number, number> = new Map<number, number>([
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

export class SouthPark {
  private readonly seasonsEpisodesCount: Map<number, number>

  constructor(private readonly apiUrl: string) {
    this.seasonsEpisodesCount = seasonsEpisodesCount
  }

  // Рандомный выбор серии: сначала сезон, затем серия в пределах сезона
  getRandomEpisode(): string {
    const seasons = Array.from(this.seasonsEpisodesCount.keys())
    const season = seasons[Math.floor(Math.random() * seasons.length)]
    const episodesCount = this.seasonsEpisodesCount.get(season) as number
    const episode = Math.floor(Math.random() * episodesCount) + 1
    return this.getEpisodeUrl({season, episode})
  }

  getEpisodeUrl({ season, episode }: Episode) {
    return `${this.apiUrl}/${season}${episode < 10 ? '0' : ''}${episode}/`
  }
}
