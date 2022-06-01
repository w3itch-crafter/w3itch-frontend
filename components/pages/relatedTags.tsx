import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Select, {
  ActionMeta,
  GroupBase,
  SingleValue,
  StylesConfig,
} from 'react-select'
import { TagOption } from 'types'

export declare interface RelatedTagsProps {
  tags: TagOption[]
  placeholder?: string
}

export function RelatedTags({ tags, placeholder }: RelatedTagsProps) {
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
    color: var(--w3itch-text5);
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
    indicatorSeparator: (prev) => ({ ...prev, margin: '0 4px 0 0' }),
    dropdownIndicator: (prev) => ({ ...prev, padding: '0' }),
  }
  const router = useRouter()
  const { pathname } = router
  const { tags: queryTags } = router.query
  const firstFiveTags = tags.slice(0, 5)
  const selectedTags = new Set<string>([])
  if (typeof queryTags === 'string') selectedTags.add(queryTags)
  if (Array.isArray(queryTags)) queryTags.forEach((t) => selectedTags.add(t))
  const pushNewRoute = () => {
    const query = { ...router.query, tags: [...selectedTags] }
    router.push({ pathname, query })
  }
  const handleSelectChange = (
    newValue: SingleValue<TagOption>,
    actionMeta: ActionMeta<TagOption>
  ) => {
    if (newValue && actionMeta.action === 'select-option') {
      selectedTags.add(newValue.name)
      pushNewRoute()
    }
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
        <Select
          id="tag-select"
          instanceId="tag-select-instance"
          inputId="tag-select-input"
          isOptionSelected={() => false}
          options={tags}
          placeholder={placeholder}
          styles={selectStyle}
          onChange={handleSelectChange}
        />
      </TagSelector>
      {firstFiveTags.map((tag) => (
        <TagSegmented tag={tag} key={tag.id} />
      ))}
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

declare interface TagSegmentedProps {
  tag: TagOption
}
function TagSegmented({ tag }: TagSegmentedProps) {
  const Container = styled.div`
    color: var(--w3itch-text4);
    font-size: 14px;
    display: flex;
    height: 30px;
    box-sizing: border-box;
    & a {
      border: 1px solid;
      border-color: var(--w3itch-border1);
      text-decoration: none;
      font-weight: bold;
      color: inherit;
      display: flex;
      padding: 0 8px;
      align-items: center;
      &:first-of-type {
        border-radius: 3px;
      }
      &:first-of-type:not(:last-of-type) {
        border-radius: 3px 0 0 3px;
      }
      &:last-of-type:not(:first-of-type) {
        border-left: 0;
        border-radius: 0 3px 3px 0;
      }
    }
  `
  const href = `?tags=${tag.name}`

  return (
    <Container>
      <Link href={href}>{tag.label}</Link>
    </Container>
  )
}
