import { SupportedChainId } from 'constants/index'
import { ethers } from 'ethers'
import { NextPage } from 'next'
import React from 'react'
import { Wallet } from 'use-wallet/dist/cjs/types'

import {
  Community,
  GameEngine,
  GameFileCharset,
  Genre,
  PaymentMode,
  ProjectClassification,
  ReleaseStatus,
} from './enum'

export declare type PerPageLayout = {
  getLayout(page: React.ReactElement): React.ReactNode
}
export declare type NextPageWithLayout<
  P = Record<string, unknown>,
  IP = P
> = NextPage<P, IP> & PerPageLayout

export declare type RegisterData = {
  address: string
  username: string
  gamer: boolean
  developer: boolean
}

type Join<K, P> = K extends string
  ? P extends string
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...0[]]
export type Column<T, D extends number = 2> = [D] extends [never]
  ? never
  : T extends Record<string, unknown>
  ? {
      [K in keyof T]-?: K extends string
        ? T[K] extends Date
          ? `${K}`
          : T[K] extends Array<infer U>
          ? `${K}` | Join<K, Column<U, Prev[D]>>
          : `${K}` | Join<K, Column<T[K], Prev[D]>>
        : never
    }[keyof T]
  : ''
export type Order<T> = [Column<T>, 'ASC' | 'DESC']
export type SortBy<T> = Order<T>[]
export declare type PaginationMeta<T> = {
  itemsPerPage: number
  totalItems: number
  currentPage: number
  totalPages: number
  sortBy: SortBy<T>
  searchBy: Column<T>[]
  search: string
  filter?: { [column: string]: string | string[] }
}
export declare type PaginationLinks = {
  first?: string
  previous?: string
  current: string
  next?: string
  last?: string
}
export declare type Pagination<T> = {
  data: T[]
  /** associated meta information (e.g., counts) */
  meta: PaginationMeta<T>
  /** associated links */
  links?: PaginationLinks
}

export declare type BackendErrorResponse = {
  message: string
  statusCode: number
}
export function isBackendError(obj: unknown): obj is BackendErrorResponse {
  if (
    (obj as BackendErrorResponse).message &&
    (obj as BackendErrorResponse).statusCode
  )
    return true
  return false
}

declare type BaseEntity = {
  /** Primary key */
  readonly id: number
  readonly createdAt: Date | string
  readonly updatedAt: Date | string
}
export declare type AccountEntity = BaseEntity & {
  userId: number
  accountId: string
  platform: LoginMethod
}
export declare type GameEntity = BaseEntity & {
  /** Creator's username */
  username: string
  /** Game title */
  title: string
  paymentMode: PaymentMode
  /** Short description or tagline */
  subtitle: string
  /** For player */
  gameName: string
  /** Original name */
  file: string
  /** Project classification */
  classification: ProjectClassification
  /** Kind of the project (game engine) */
  kind: GameEngine
  /** Release status */
  releaseStatus: ReleaseStatus
  /** Game screenshots */
  screenshots: string[]
  /** Cover URL */
  cover: string
  /** Game tags */
  tags: TagEntity[]
  /** Calculated average rating of the game */
  rating: number
  /** Tokens to be held/paid to play this game */
  prices: PriceEntity[]
  /** Donate wallet address of the creator */
  donationAddress?: string
  /** Links to other app stores */
  appStoreLinks: string[]
  /** Game description (markdown) */
  description: string
  /** The community type of this game */
  community: Community
  /** The category that best describes this game */
  genre: Genre
  /** Game charset */
  charset: GameFileCharset
}
export declare type PriceEntity = BaseEntity & {
  chainId: number
  amount: string
  token: TokenEntity
}
export declare type RatingEntity = BaseEntity & {
  gameId: number
  username: string
  rating: number
}
export declare type TagEntity = BaseEntity & {
  name: string
  label: string
  description: string
}
export declare type TokenEntity = BaseEntity & {
  address: string
  name: string
  decimals: number
  symbol: string
  chainId: number
}
export declare type UserEntity = BaseEntity & {
  username: string
  nickname: string
  bio: string
  avatar: string
  accounts: AccountEntity[]
}

export declare type GameInfo = GameEntity & {
  link: string
  platform?: Array<'windows' | 'macos' | 'linux' | 'android' | 'ios' | 'web'>
  user?: UserEntity
}

export declare type TagOption = Omit<TagEntity, 'createdAt' | 'updatedAt'>

export declare type NavLink = { href: string; name: string }
export declare type NavLinks = NavLink[]

export declare type LoginMethod = 'metamask' | 'github' | 'discord'

export declare type AccountServiceAction =
  | 'login'
  | 'signup'
  | 'bind'
  | 'unbind'

interface Keyboard {
  lock(keyCodes?: Iterable<string>): Promise<void>
  unlock(): void
}

declare global {
  interface Navigator {
    // See https://wicg.github.io/keyboard-lock/
    readonly keyboard: Keyboard
    readonly standalone: unknown
  }

  interface Window {
    MINETEST_METAMASK: {
      wallet: Wallet
      sendTransaction: (username: string, amount: string) => Promise<void>
    }
  }
}

export type Token = {
  chainId: SupportedChainId
  address: string
  name: string
  symbol: string
  decimals: number
  logoURI: string
}

export type Tokens = {
  name: string
  timestamp: Date
  version: {
    major: 3
    minor: 1
    patch: 0
  }
  tags: object
  logoURI: string
  keywords: ['uniswap', 'default']
  tokens: Token[]
}

export type TokenDetail = Token & {
  readonly amount: string
  readonly totalSupply: ethers.BigNumber
  readonly balanceOf: ethers.BigNumber
}
