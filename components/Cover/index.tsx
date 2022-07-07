import styled from '@emotion/styled'
import Typography from '@mui/material/Typography'
import { FC } from 'react'

const CoverWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--w3itch-text1);
  background-color: var(--w3itch-bg1);
`
const CoverImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

interface CoverProps {
  src: string
  defaultAlt?: string
  defaultText?: string
}

const Cover: FC<CoverProps> = ({ src, defaultAlt = 'cover', defaultText = 'No Cover' }) => {
  return (
    <CoverWrapper>
      {src ? <CoverImg src={src} alt={defaultAlt} /> : <Typography variant="caption">{defaultText}</Typography>}
    </CoverWrapper>
  )
}

export default Cover
