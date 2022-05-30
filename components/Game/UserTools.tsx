import StarBorderIcon from '@mui/icons-material/StarBorder'
import Box from '@mui/material/Box'
import { AuthenticationContext } from 'context'
import { useRouter } from 'next/router'
import { Dispatch, FC, SetStateAction, useCallback, useContext } from 'react'
import styles from 'styles/game/userTools.module.scss'
import { Api } from 'types/Api'

interface Props {
  readonly gameRatingMine: Api.GameProjectsRatingResponse | undefined
  setGameRatingDialogOpen: Dispatch<SetStateAction<boolean>>
}

const UserTools: FC<Props> = ({ setGameRatingDialogOpen, gameRatingMine }) => {
  const {
    state: { user },
  } = useContext(AuthenticationContext)
  const router = useRouter()

  // Handle game rate
  const handleRate = useCallback(() => {
    if (user) {
      setGameRatingDialogOpen(true)
    } else {
      router.push('/login')
    }
  }, [user, setGameRatingDialogOpen, router])

  return (
    <ul id="user_tools" className={styles.user_tools}>
      <li>
        <span className={styles.action_btn} onClick={() => handleRate()}>
          <StarBorderIcon className={styles.action_icon} />
          <span className="on_edit">
            <Box component="span" className={styles.full_label}>
              {gameRatingMine ? 'Edit Your Rating' : 'Rate this game'}
            </Box>
            <Box component="span" className={styles.mobile_label}>
              {gameRatingMine ? 'Edit Rating' : 'Rate'}
            </Box>
          </span>
        </span>
      </li>
    </ul>
  )
}

export default UserTools
