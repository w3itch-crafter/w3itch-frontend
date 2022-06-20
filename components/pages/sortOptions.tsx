import styled from '@emotion/styled'
import clsx from 'clsx'
import { SortIcon } from 'components/icons'
import { SortOptionsContext } from 'context'
import { useBuildHref } from 'hooks'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'

export declare interface SortOptionsProps {
  sortKey: string
  className?: string
  children: React.ReactNode
}

export function SortOptions({
  sortKey,
  className,
  children,
}: SortOptionsProps) {
  const Container = styled.div`
    padding-right: 25px;
    padding-left: 20px;
    font-size: 16px;
    border-bottom: 2px solid;
    border-color: var(--w3itch-border2);
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  `
  const Label = styled.div`
    margin-right: 15px;
    font-size: 14px;
    color: var(--w3itch-text3);
    padding-bottom: 7px;
    white-space: nowrap;
    display: flex;
    align-items: center;
  `
  const StyledSortIcon = styled(SortIcon)`
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
    color: var(--w3itch-text3);
    font-size: 16px;
  `
  const Sorts = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
  `
  const context: Pick<SortOptionsProps, 'sortKey'> = { sortKey }

  return (
    <Container className={className}>
      <Label>
        <StyledSortIcon className="svgicon icon_sort" />
        <div>Sort by</div>
      </Label>
      <Sorts>
        <SortOptionsContext.Provider value={context}>
          {children}
        </SortOptionsContext.Provider>
      </Sorts>
    </Container>
  )
}

export declare interface SortOptionItemProps {
  name: string
  value?: string
}

export function SortOptionItem({ name, value }: SortOptionItemProps) {
  const Container = styled.li`
    margin-right: 15px;
  `
  const Item = styled.a`
    display: block;
    padding-bottom: 10px;
    text-decoration: none;
    color: var(--w3itch-text2);
    font-weight: bold;
    position: relative;
    &.active {
      color: var(--w3itch-primary1);
    }
    &.active::after {
      content: '';
      position: absolute;
      height: 2px;
      background: var(--w3itch-primary1);
      bottom: -2px;
      left: 0;
      right: 0;
    }
  `
  const context = useContext(SortOptionsContext)
  const router = useRouter()
  const { buildHref } = useBuildHref()
  const href = buildHref(context.sortKey, value)
  const isHref = router.asPath === href

  return (
    <Container>
      <Link href={href} passHref>
        <Item className={clsx({ active: isHref })}>{name}</Item>
      </Link>
    </Container>
  )
}
