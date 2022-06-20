import HelpIcon from '@mui/icons-material/Help'
import Avatar from '@mui/material/Avatar'
import { FC, useMemo, useState } from 'react'

interface TokenLogoProps {
  readonly src?: string
  readonly symbol: string
}

const TokenLogo: FC<TokenLogoProps> = ({ src, symbol }) => {
  // https://developer.trustwallet.com/assets/new-asset
  const logo = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${symbol.toLowerCase()}/logo.png`

  const [isBad, setIsBad] = useState(false)
  const logoSrc = useMemo(() => {
    return isBad ? logo : src
  }, [isBad, src, logo])

  return (
    <>
      {isBad ? (
        <HelpIcon sx={{ width: 24, height: 24 }}></HelpIcon>
      ) : (
        <Avatar
          sx={{ width: 24, height: 24 }}
          src={logoSrc}
          onError={() => setIsBad(true)}
        ></Avatar>
      )}
    </>
  )
}

export default TokenLogo
