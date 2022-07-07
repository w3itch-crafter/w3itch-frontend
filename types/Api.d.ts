import type { GamesListSortBy, PancakeSwapSupportedChainId, UniswapSupportedChainId } from './enum'
import { AccountEntity, GameEntity, UserEntity } from './index'

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

  type GameProjectPricesDto = {
    chainId: UniswapSupportedChainId | PancakeSwapSupportedChainId
    amount: string
    token: string
  }

  type GameProjectDto = Partial<Pick<GameEntity, 'cover' | 'donationAddress' | 'screenshots'>> &
    Omit<
      GameEntity,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'username'
      | 'file'
      | 'rating'
      | 'cover'
      | 'donationAddress'
      | 'screenshots'
      | 'tags'
      | 'prices'
    > & {
      tags: string[]
      prices: GameProjectPricesDto[]
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

  type GameProjectDeleteResponse = Record<string, never>

  type AccountsMetamaskVerificationCodeResponse = {
    code: string
  }

  type AccountsMetamaskActionResponse = {
    user: UserEntity
    account: AccountEntity
  }

  type AccountsAuthSignupResponse = {
    user: UserEntity
    account: AccountEntity
  }

  type BlockchainsEvmTokensResponse = {
    id: number
    createdAt: Date
    updatedAt: Date
    address: string
    symbol: string
    chainId: number
    chainName: string
  }

  type ValidateUsernameResponse = {
    username?: string
    isExists?: boolean
  }

  type MinetestGamePortByGameNameResponse = {
    gameWorldName: string
    port: number
  }
}
