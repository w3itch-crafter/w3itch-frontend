import styled from '@emotion/styled'
import { formatUnits } from 'ethers/lib/utils'
import Link from 'next/link'
import { GameInfo } from 'types'
import { enumWord, userHostUrl } from 'utils'

import { IcoMoonIcon } from '../icons'

export declare interface GameCellProps {
  game: GameInfo
  width?: number
  height?: number
  small?: boolean
  collectionLink?: string
}

export function GameCell({
  game,
  width,
  height = 250,
  small = false,
  collectionLink,
}: GameCellProps) {
  const Container = styled.div<Pick<GameCellProps, 'width'>>`
    display: inline-block;
    position: relative;
    vertical-align: top;
    text-align: left;
    margin: 0 20px 40px 0;
    overflow: hidden;
    width: ${(p) => (p.width ? `${p.width}px` : '100%')};
    &:hover .game-cell-tools {
      opacity: 1;
    }
  `
  const GameThumbLink = styled.a`
    text-decoration: none;
  `
  const GameThumb = styled.div<
    Pick<GameCellProps, 'width' | 'height'> & { cover: string }
  >`
    background-image: ${(p) => (p.cover ? `url(${p.cover})` : 'none')};
    background-position: 50% 50%;
    background-size: cover;
    background-color: var(--w3itch-bg1);
    display: block;
    position: relative;
    width: 100%;
    height: ${(p) => `${p.height}px`};
    box-shadow: 0 0 2px rgb(0 0 0 / 15%);
    // @TODO need to be reused
    @media screen and (max-width: 600px) {
      height: 151px;
    }
  `
  const GameCellTools = styled.div`
    position: absolute;
    top: 5px;
    right: 10px;
    opacity: 0;
    transition: opacity 0.2s ease, top 0.2s ease;
  `
  const AddToCollection = styled.a`
    user-select: none;
    display: inline-flex;
    align-items: center;
    color: #eee;
    padding: 2px 4px;
    cursor: pointer;
    margin-bottom: 10px;
    text-decoration: none;
    text-align: left;
    border: 4px solid #da2c49;
    background-color: rgba(30, 30, 30, 0.8);
    font-size: 14px;
    font-weight: bold;
    box-shadow: none;
    border-radius: 3px;
  `
  const GameCellData = styled.div`
    margin-top: 6px;
    & > * {
      margin-bottom: 6px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  `
  const GameTitle = styled.div`
    font-size: 16px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  `
  const GameTitleLink = styled.a`
    font-weight: bold;
    color: inherit;
    text-decoration: none;
    margin-right: 6px;
    word-wrap: break-word;
    &:hover {
      text-decoration: underline;
    }
  `
  const GameMetaTag = styled.a`
    text-decoration: none;
    color: white !important;
    font-size: 0.7222222222em;
    vertical-align: 2px;
    display: inline-flex;
    line-height: normal;
    & > div {
      padding: 0.25em 0.5em;
      font-weight: bold;
      background-color: #737373;
      background-image: linear-gradient(to top right, gray 0%, #676767 100%);
      &:first-of-type:last-of-type {
        border-radius: 2px;
      }
      &:first-of-type {
        border-radius: 2px 0 0 2px;
      }
      &:last-of-type {
        border-radius: 0 2px 2px 0;
      }
    }
  `
  const GamePriceValue = styled.div``
  const GameSaleValue = styled.div`
    background-color: #34a0f2 !important;
    background-image: none !important;
    color: rgba(255, 255, 255, 0.8);
  `
  const GameText = styled.div<Pick<Required<GameCellProps>, 'small'>>`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--w3itch-text4);
    font-size: 14px;
    display: ${(p) => (p.small ? 'none' : 'block')};
  `
  const GameSubmitter = styled.div<Pick<Required<GameCellProps>, 'small'>>`
    display: flex;
    align-items: center;
    font-size: 14px;
    color: var(--w3itch-text4);
    display: ${(p) => (p.small ? 'none' : 'block')};
  `
  const GameSubmitterLink = styled.a`
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: inherit;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  `
  const GameGenre = styled.div<Pick<Required<GameCellProps>, 'small'>>`
    font-size: 14px;
    color: var(--w3itch-text3);
    display: ${(p) => (p.small ? 'none' : 'block')};
  `
  const GamePlatform = styled.div<Pick<Required<GameCellProps>, 'small'>>`
    font-size: 14px;
    color: var(--w3itch-text3);
    display: ${(p) => (p.small ? 'none' : 'block')};
  `
  const { title, subtitle, cover, link, genre, platform, user, prices } = game
  const profileUrl = userHostUrl(user?.username)
  const price = (Array.isArray(prices) && prices[0]) || null
  const gameSale = false

  return (
    <Container className="game-cell" width={width}>
      <Link href={link} passHref>
        <GameThumbLink>
          <GameThumb
            cover={cover}
            width={width}
            height={height}
            aria-label="Game Thumb"
          />
        </GameThumbLink>
      </Link>
      {collectionLink && (
        <GameCellTools className="game-cell-tools">
          <Link href={collectionLink} passHref>
            <AddToCollection>
              <IcoMoonIcon name="playlist_add" />
              Add to collection
            </AddToCollection>
          </Link>
        </GameCellTools>
      )}
      <GameCellData>
        <GameTitle>
          <Link href={link} passHref>
            <GameTitleLink>{title}</GameTitleLink>
          </Link>
          {price && (
            <Link href={link} passHref>
              <GameMetaTag>
                <GamePriceValue>
                  {formatUnits(price.amount, price.token.decimals)}{' '}
                  {price.token.symbol}
                </GamePriceValue>
                {gameSale && <GameSaleValue>-30%</GameSaleValue>}
              </GameMetaTag>
            </Link>
          )}
        </GameTitle>
        {subtitle && <GameText small={small}>{subtitle}</GameText>}
        {user && (
          <GameSubmitter small={small}>
            <Link href={profileUrl} passHref>
              <GameSubmitterLink>{user.username}</GameSubmitterLink>
            </Link>
          </GameSubmitter>
        )}
        {genre && <GameGenre small={small}>{enumWord(genre)}</GameGenre>}
        {platform && <GamePlatform small={small}></GamePlatform>}
      </GameCellData>
    </Container>
  )
}
