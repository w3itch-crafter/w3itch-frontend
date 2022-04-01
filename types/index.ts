import { NextPage } from 'next'
import React from 'react'

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
export declare type NextPageWithLayout = NextPage & PerPageLayout

export declare type RegisterData = {
  address: string
  username: string
  gamer: boolean
  developer: boolean
}

export declare type PaginationMeta = {
  /** the amount of items on this specific page */
  itemCount: number
  /** the total amount of items */
  totalItems?: number
  /** the amount of items that were requested per page */
  itemsPerPage: number
  /** the total amount of pages in this paginator */
  totalPages?: number
  /** the current page this paginator "points" to */
  currentPage: number
}
export declare type PaginationLinks = {
  /** a link to the "first" page */
  first?: string
  /** a link to the "previous" page */
  previous?: string
  /** a link to the "next" page */
  next?: string
  /** a link to the "last" page */
  last?: string
}
export declare type Pagination<T> = {
  items: T[]
  /** associated meta information (e.g., counts) */
  meta: PaginationMeta
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
  readonly createdAt: Date
  readonly updatedAt: Date
}
export declare type UserEntity = BaseEntity & {
  username: string
  nickname: string
  bio: string
  avatar: string
}
export declare type GameEntity = BaseEntity & {
  /** Creator's user ID */
  userId: number
  /** Game title */
  title: string
  paymentMode: PaymentMode
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
  tags: string[]
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
}

export declare type GameInfo = GameEntity & {
  link: string
  platform?: Array<'windows' | 'macos' | 'linux' | 'android' | 'ios' | 'web'>
  user?: UserEntity
}
