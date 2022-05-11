import styled from '@emotion/styled'
import Stack from '@mui/material/Stack'
import { gameDownloadUrl } from 'api'
import BigNumber from 'bignumber.js'
import { PrimaryButton } from 'components/CustomizedButtons'
import { AuthenticationContext } from 'context'
import { utils } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import { useBuyNow } from 'hooks/useBuyNow'
import { isEmpty } from 'lodash'
import { useSnackbar } from 'notistack'
import { FC, useCallback, useContext, useEffect, useState } from 'react'
import styles from 'styles/game/id.module.scss'
import { GameEntity, TokenDetail } from 'types'
import { PaymentMode } from 'types/enum'
import { downloadFile } from 'utils'

interface DownloadProps {
  readonly gameProject: GameEntity
  readonly pricesToken?: TokenDetail
}

const GameInfo = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 16px;
  storage {
    font-weight: 700;
    color: #333;
  }
  span {
    margin-left: 10px;
    color: #838383;
  }
`

const Download: FC<DownloadProps> = ({ gameProject, pricesToken }) => {
  const {
    state: { user },
  } = useContext(AuthenticationContext)
  const { buyNow } = useBuyNow()
  const { enqueueSnackbar } = useSnackbar()

  // hold unlock
  // false can download
  // true can't download
  const [holdUnlock, setHoldUnlock] = useState<boolean>(true)

  // download game file
  const download = useCallback(() => {
    const downloadUrl = gameDownloadUrl({
      gameName: gameProject.gameName,
      file: gameProject.file,
    })
    downloadFile(downloadUrl)
  }, [gameProject])

  // handle download
  const handleDownload = useCallback(() => {
    if (gameProject.paymentMode === PaymentMode.PAID) {
      if (holdUnlock && pricesToken) {
        if (user) {
          buyNow({
            chainId: pricesToken.chainId,
            inputCurrency: '',
            outputCurrency: getAddress(pricesToken.address),
          })
        } else {
          enqueueSnackbar('please sign in!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
            variant: 'info',
          })
        }
      } else {
        download()
      }
    } else {
      download()
    }
  }, [
    buyNow,
    download,
    enqueueSnackbar,
    gameProject,
    holdUnlock,
    pricesToken,
    user,
  ])

  // process hold unlock
  const processHoldUnlock = useCallback(() => {
    if (gameProject.paymentMode === PaymentMode.PAID) {
      if (!pricesToken || isEmpty(pricesToken)) {
        return
      }

      const isUnlock = new BigNumber(
        utils.formatUnits(pricesToken.balanceOf, pricesToken.decimals)
      ).gte(utils.formatUnits(pricesToken.amount, pricesToken.decimals))

      if (isUnlock) {
        setHoldUnlock(false)
      }
    } else {
      setHoldUnlock(false)
    }
  }, [gameProject, pricesToken])

  useEffect(() => {
    processHoldUnlock()
  }, [processHoldUnlock])

  return (
    <Stack spacing={1}>
      <h2 className={styles.row_title}>Download</h2>
      <Stack direction="row" spacing={2}>
        <PrimaryButton
          sx={{
            textTransform: 'capitalize',
          }}
          onClick={handleDownload}
        >
          Download
        </PrimaryButton>
        <GameInfo>
          <strong>{gameProject.file}</strong>
          {/* <span>148 MB</span> */}
        </GameInfo>
      </Stack>
    </Stack>
  )
}

export default Download
