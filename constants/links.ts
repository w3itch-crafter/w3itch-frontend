export const SortByItems = [
  {
    value: 'popular',
    name: 'Popular',
  },
  {
    value: 'new',
    name: 'New & Popular',
  },
  {
    value: 'sellers',
    name: 'Top sellers',
  },
  {
    value: 'rating',
    name: 'Top rated',
  },
  {
    value: 'updatedAt',
    name: 'Most Recent',
  },
]
// Hopefully the defaults are not affected by the array coordinates
const SortByItemDefaultValue = 'popular'
export const SortByItemDefault = SortByItems.find(
  (item) => item.value === SortByItemDefaultValue
) as {
  value: string
  name: string
}
