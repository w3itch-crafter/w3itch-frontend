import dynamic from 'next/dynamic'

const Search = dynamic(() => import('components/Search'), {
  ssr: true,
})

const SearchPage = () => {
  return <Search />
}

export default SearchPage
