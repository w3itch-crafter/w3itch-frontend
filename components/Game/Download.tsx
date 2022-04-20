import styled from '@emotion/styled'
import { Box } from '@mui/material'
import Stack from '@mui/material/Stack'
import { gameDownloadUrl } from 'api'
import { PrimaryButton } from 'components/CustomizedButtons'
import { FC } from 'react'
import styles from 'styles/game/id.module.scss'
import { GameEntity } from 'types'
import { downloadFile } from 'utils'

interface PurchaseProps {
  readonly gameProject: GameEntity
}

const GameInfo = styled.div`
  display: flex;
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

const Donation: FC<PurchaseProps> = ({ gameProject }) => {
  return (
    <Box>
      <h2 className={styles.row_title}>Download</h2>
      <Stack direction="row" spacing={2} mt="10px">
        <PrimaryButton
          sx={{
            textTransform: 'capitalize',
          }}
          onClick={() => {
            const downloadUrl = gameDownloadUrl({
              gameName: gameProject.gameName,
              file: gameProject.file,
            })
            downloadFile(downloadUrl)
          }}
        >
          Download
        </PrimaryButton>
        <GameInfo>
          <strong>{gameProject.file}</strong>
          {/* <span>148 MB</span> */}
        </GameInfo>
      </Stack>
    </Box>
  )
}

export default Donation
