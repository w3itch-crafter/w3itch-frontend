import styled from '@emotion/styled'
import clsx from 'clsx'
import Link from 'next/link'
import { useState } from 'react'

import { IcoMoonIcon } from './icons'

export declare interface FilterGroupProps {
  label: string
  open?: boolean
  children: React.ReactNode
}

export default function FilterGroup({
  label,
  children,
  open = false,
}: FilterGroupProps) {
  const Container = styled.div`
    border: 1px solid transparent;
  `
  const Label = styled.div`
    color: #606060;
    font-size: 14px;
    display: flex;
    align-items: center;
  `
  const Toggle = styled.button`
    flex: 1;
    display: flex;
    align-items: center;
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    text-align: left;
    padding: 10px 0 10px 8px;
    &:hover {
      color: #222;
    }
    &:focus {
      outline-color: #361275;
    }
  `
  const Arrow = styled.span`
    color: #606060;
    width: 15px;
    text-align: center;
    margin-right: 10px;
    transition: rotate 0.2s ease;
    transform: rotate(-90deg);
    &.open {
      transform: rotate(0deg);
    }
    & > .icon {
      display: inline;
    }
  `
  const Items = styled.ul<Pick<FilterGroupProps, 'open'>>`
    list-style: none;
    margin: 0;
    padding: 0;
    & > li {
      transition: height 0.2s ease;
      height: ${(p) => (p.open ? '32px' : '0')};
    }
  `
  const [isOpen, setIsOpen] = useState<boolean>(open)
  const handleToggleOpen = () => {
    setIsOpen(!isOpen)
  }

  return (
    <Container>
      <Label>
        <Toggle onClick={handleToggleOpen}>
          <Arrow className={clsx({ open: isOpen })}>
            <IcoMoonIcon name="triangle-down" />
          </Arrow>
          {label}
        </Toggle>
      </Label>
      <Items open={isOpen}>{children}</Items>
    </Container>
  )
}

export declare interface FilterGroupItemProps {
  icon: string
  name: string
  href: string
}

export function FilterGroupItem({ icon, name, href }: FilterGroupItemProps) {
  const Container = styled.li`
    height: 0;
    overflow: hidden;
    display: flex;
    align-items: center;
    & > *:first-of-type {
      flex: 1;
      padding-left: 28px;
    }
  `
  const Item = styled.a`
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    display: flex;
    align-items: center;
    color: inherit;
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    &:hover {
      color: white;
      background-color: #666;
    }
    & > .icon {
      flex-shrink: 0;
      margin-right: 10px;
      opacity: 0.8;
    }
  `

  return (
    <Container>
      <Link href={href} passHref>
        <Item>
          <IcoMoonIcon name={icon} />
          {name}
        </Item>
      </Link>
    </Container>
  )
}
