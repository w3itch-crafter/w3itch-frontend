import Link from '@mui/material/Link'
import { AuthenticationContext } from 'context'
import { FC, useContext } from 'react'
import { GameEntity } from 'types'

interface EditGameProps {
  gameProject: GameEntity
}

const EditGame: FC<EditGameProps> = ({ gameProject: { id, username: projectUsername } }) => {
  const {
    state: { user },
  } = useContext(AuthenticationContext)
  const editRef = `/game/edit/${id}`
  return user?.username === projectUsername ? <Link href={editRef}>Edit</Link> : null
}
export default EditGame
