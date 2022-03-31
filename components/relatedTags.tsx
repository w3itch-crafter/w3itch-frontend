import styled from '@emotion/styled'
import Link from 'next/link'
import Select, { GroupBase, StylesConfig } from 'react-select'

export declare type TagOption = {
  label: string
  value: string
}

export declare interface RelatedTagsProps {
  tags: TagOption[]
  placeholder?: string
}

export default function RelatedTags({ tags, placeholder }: RelatedTagsProps) {
  const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 7px 10px;
    margin: 10px 20px;
  `
  const Icon = styled.span`
    font-size: 14px;
    color: #858585;
    white-space: nowrap;
    & > svg {
      display: inline-block;
      vertical-align: middle;
      color: #606060;
    }
  `
  const TagSelector = styled.div`
    min-width: 200px;
    max-width: 200px;
  `
  const TagsLabel = styled.div`
    font-size: 14px;
    color: #858585;
    white-space: nowrap;
  `
  const BrowseTopTags = styled.span``
  const AllTags = styled.a`
    color: #767676;
  `
  const selectStyle: StylesConfig<TagOption, false, GroupBase<TagOption>> = {
    control: () => ({
      display: 'flex',
      lineHeight: '16px',
      padding: '6px 8px',
      fontSize: '14px',
      backgroundColor: 'white',
      boxShadow: 'none',
      color: '#222',
      borderColor: '#cdcdcd',
      width: '100%',
      border: '1px solid #d0d0d0',
      borderRadius: '3px',
    }),
    input: (prev) => ({ ...prev, padding: '0', margin: '0 1px' }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (prev) => ({ ...prev, padding: '0' }),
  }

  return (
    <Container>
      <Icon>
        <svg
          className="svgicon icon_tag"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          role="img"
          version="1.1"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" x2="7" y1="7" y2="7" />
        </svg>
      </Icon>
      <TagSelector>
        <Select options={tags} placeholder={placeholder} styles={selectStyle} />
      </TagSelector>
      <TagsLabel>
        <BrowseTopTags>
          (
          <Link href="/tags" passHref>
            <AllTags>View all tags</AllTags>
          </Link>
          )
        </BrowseTopTags>
      </TagsLabel>
    </Container>
  )
}
