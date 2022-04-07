import type { GamesListSortBy } from './enum'

declare namespace Api {
  type UploadToIPFS = {
    hash: string
    hashV0: string
    key: string
    bucket: string
    publicUrl: string
  }

  type GameProjectsParams = {
    username?: string
    limit?: number
    page?: number
    sortBy?: GamesListSortBy
    order?: 'ASC' | 'DESC'
  }

  type Tag = {
    id: number
    createdAt: Date
    updatedAt: Date
    name: string
    label: string
    description: string
  }

  type GameProjectsRatingResponse = {
    id: number
    createdAt: Date
    updatedAt: Date
    gameId: number
    username: string
    rating: number
  }
}
