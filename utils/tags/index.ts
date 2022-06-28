import { TagOption } from 'types'

export function findTags(
  name: string | string[],
  tags: TagOption[]
): TagOption[] | undefined {
  if (typeof name === 'string') return tags.filter((t) => t.name === name)
  if (Array.isArray(name))
    return name.flatMap((n) => tags.filter((t) => t.name === n))
}
