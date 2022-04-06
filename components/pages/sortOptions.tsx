import styled from '@emotion/styled'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { buildQuerySting } from 'utils'

export declare interface SortOptionsProps {
  sortKey: string
  className?: string
  children: React.ReactNode
}

const SortOptionsContext = React.createContext<
  Pick<SortOptionsProps, 'sortKey'>
>({ sortKey: '' })

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
    border-color: #f4f4f4;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  `
  const Label = styled.div`
    margin-right: 15px;
    font-size: 14px;
    color: #858585;
    padding-bottom: 7px;
    white-space: nowrap;
    display: flex;
  `
  const Icon = styled.span`
    & > svg {
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
      color: #606060;
    }
  `
  const Sorts = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
  `
  const context: Pick<SortOptionsProps, 'sortKey'> = { sortKey }

  return (
    <Container className={className}>
      <Label>
        <Icon>
          <svg
            className="svgicon icon_sort"
            width="16"
            height="17"
            fill="currentColor"
            role="img"
            version="1.1"
            viewBox="0 0 455 488"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m304 392v48c0 4.5-3.5 8-8 8h-64c-4.5 0-8-3.5-8-8v-48c0-4.5 3.5-8 8-8h64c4.5 0 8 3.5 8 8zm-120-32c0 2.25-1 4.25-2.5 6l-79.75 79.75c-1.75 1.5-3.75 2.25-5.75 2.25s-4-0.75-5.75-2.25l-80-80c-2.25-2.5-3-5.75-1.75-8.75s4.25-5 7.5-5h48v-344c0-4.5 3.5-8 8-8h48c4.5 0 8 3.5 8 8v344h48c4.5 0 8 3.5 8 8zm168-96v48c0 4.5-3.5 8-8 8h-112c-4.5 0-8-3.5-8-8v-48c0-4.5 3.5-8 8-8h112c4.5 0 8 3.5 8 8zm48-128v48c0 4.5-3.5 8-8 8h-160c-4.5 0-8-3.5-8-8v-48c0-4.5 3.5-8 8-8h160c4.5 0 8 3.5 8 8zm48-128v48c0 4.5-3.5 8-8 8h-208c-4.5 0-8-3.5-8-8v-48c0-4.5 3.5-8 8-8h208c4.5 0 8 3.5 8 8z" />
          </svg>
        </Icon>
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
    color: #434343;
    font-weight: bold;
    position: relative;
    &.active {
      color: var(--itchio_link_color, #da2c49);
    }
    &.active::after {
      content: '';
      position: absolute;
      height: 2px;
      background: #ff2449;
      bottom: -2px;
      left: 0;
      right: 0;
    }
  `
  const context = useContext(SortOptionsContext)
  const router = useRouter()
  const href = `${router.route}${buildQuerySting(
    context.sortKey,
    value,
    router.query as Record<string, string>
  )}`
  const isHref = router.asPath === href

  return (
    <Container>
      <Link href={href} passHref>
        <Item className={clsx({ active: isHref })}>{name}</Item>
      </Link>
    </Container>
  )
}
