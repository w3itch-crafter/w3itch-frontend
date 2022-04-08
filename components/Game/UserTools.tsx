import StarBorderIcon from '@mui/icons-material/StarBorder'
import { Dispatch, FC, SetStateAction } from 'react'
import styles from 'styles/game/userTools.module.scss'
import { Api } from 'types/Api'

interface Props {
  readonly gameRatingMine: Api.GameProjectsRatingResponse | undefined
  setGameRatingDialogOpen: Dispatch<SetStateAction<boolean>>
}

const UserTools: FC<Props> = ({ setGameRatingDialogOpen, gameRatingMine }) => {
  return (
    <ul id="user_tools" className={styles.user_tools}>
      <li>
        <span
          className={styles.action_btn}
          onClick={() => setGameRatingDialogOpen(true)}
        >
          <StarBorderIcon />

          {gameRatingMine ? (
            <span className="on_edit">
              <span className="full_label">Edit Your Rating</span>
              {/* <span className="mobile_label">Edit Rating</span> */}
            </span>
          ) : (
            <span className="on_create">
              <span className="full_label">Rate this game</span>
              {/* <span className="mobile_label">Rate</span> */}
            </span>
          )}
        </span>
      </li>
    </ul>
  )
}

export default UserTools
