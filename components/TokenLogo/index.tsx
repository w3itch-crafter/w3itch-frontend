import HelpIcon from '@mui/icons-material/Help'
import Avatar from '@mui/material/Avatar'
import { FC, useState } from 'react'
interface TokenLogoProps {
  symbol: string
}

const TokenLogo: FC<TokenLogoProps> = ({ symbol }) => {
  const logo = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${symbol.toLowerCase()}/logo.png`

  const [isBad, setIsBad] = useState(true)

  return (
    <>
      {isBad ? (
        <HelpIcon sx={{ width: 24, height: 24 }}></HelpIcon>
      ) : (
        <Avatar
          sx={{ width: 24, height: 24 }}
          src={logo}
          onError={() => setIsBad(true)}
        ></Avatar>
      )}
    </>
  )
}

export default TokenLogo
