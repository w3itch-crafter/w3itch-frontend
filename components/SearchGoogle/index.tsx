import styled from '@emotion/styled'
import SearchIcon from '@mui/icons-material/Search'
import { Input } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { urlGoogleSearch } from 'utils'

const SearchBar = styled.form`
  display: flex;
  align-items: center;
`

const SearchGoogle = () => {
  return (
    <SearchBar
      method={'get'}
      autoComplete={'on'}
      action={'https://google.com/search'}
      onSubmit={(e) => {
        const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement))
        window.open(urlGoogleSearch(formData.q as string))
        e.preventDefault()
      }}
    >
      <Input type={'text'} name={'q'} placeholder="Search in this site" />
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </SearchBar>
  )
}

export default SearchGoogle
