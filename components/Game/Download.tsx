import styled from '@emotion/styled'
import Stack from '@mui/material/Stack'
import { gameDownloadUrl } from 'api'
import { PrimaryButton } from 'components/CustomizedButtons'
import { useHoldUnlock } from 'hooks/useHoldUnlock'
import { FC, useCallback } from 'react'
import styles from 'styles/game/id.module.scss'
import { GameEntity, TokenDetail } from 'types'
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
  const { handleUnlock } = useHoldUnlock({
    game: gameProject,
    token: pricesToken,
  })

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
    handleUnlock(() => {
      download()
    })
  }, [download, handleUnlock])

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
