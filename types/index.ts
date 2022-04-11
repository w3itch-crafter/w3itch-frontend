import { NextPage } from 'next'
import React from 'react'
import { Api } from 'types/Api'

import {
  Community,
  GameEngine,
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
  if ((obj as BackendErrorResponse).message) return true
  return false
}

declare type BaseEntity = {
  /** Primary key */
  readonly id: number
  readonly createdAt: Date | string
  readonly updatedAt: Date | string
}
export declare type UserEntity = BaseEntity & {
  username: string
  nickname: string
  bio: string
  avatar: string
}
export declare type AccountEntity = BaseEntity & {
  userId: number
  accountId: string
  platform: 'metamask' | string
}
export declare type GameEntity = BaseEntity & {
  /** Creator's user ID */
  userId: number
  /** Game title */
  title: string
  paymentMode: PaymentMode
  /** Creator's username */
  username: string
  /** Short description or tagline */
  subtitle: string
  /** For player */
  gameName: string
  /** Original name */
  file: string
  /** Classification */
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
  tags: Api.Tag[]
  /** Tokens to be held/paid to play this game */
  tokenId: number
  /** Links to other app stores */
  appStoreLinks: string[]
  /** Game description (markdown) */
  description: string
  /** The community type of this game */
  community: Community
  /** The category that best describes this game */
  genre: Genre
  /** game rating */
  rating: number | null
}
export declare type TagEntity = BaseEntity & {
  name: string
  label: string
  description: string
}

export declare type GameInfo = GameEntity & {
  link: string
  platform?: Array<'windows' | 'macos' | 'linux' | 'android' | 'ios' | 'web'>
  user?: UserEntity
}

export declare type TagOption = Omit<TagEntity, 'createdAt' | 'updatedAt'>

export declare type NavLink = { href: string; name: string }
export declare type NavLinks = NavLink[]

interface Keyboard {
  lock(keyCodes?: Iterable<string>): Promise<void>
  unlock(): void
}

declare global {
  interface Navigator {
    // See https://wicg.github.io/keyboard-lock/
    readonly keyboard: Keyboard
  }
}

export type Token = {
  chainId: number
  address: string
  name: string
  symbol: string
  decimals: number
  logoURI: string
}
