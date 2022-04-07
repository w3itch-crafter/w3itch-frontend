import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Rating from '@mui/material/Rating'
import { gameProjectByID, UpdateGameRating } from 'api'
import { useSnackbar } from 'notistack'
import { FC, useCallback, useEffect, useState } from 'react'
import { GameEntity } from 'types'
import { calcRating } from 'utils'

interface Props {
  gameProject: GameEntity
}

const GameRating: FC<Props> = ({ gameProject }) => {
  const { enqueueSnackbar } = useSnackbar()

  const [toggleRate, setToggleRate] = useState(false)
  const [rateValue, setRateValue] = useState(0)

  useEffect(() => {
    if (gameProject.rating) {
      setRateValue(calcRating(gameProject.rating))
    } else {
      setRateValue(0)
    }
  }, [gameProject])

  // handle rating
  const handleRatingChange = useCallback(
    async (value: number) => {
      try {
        const gameRatingResult = await UpdateGameRating(gameProject.id, {
          rating: value * 100,
        })

        if (gameRatingResult.status !== 200) {
          console.error(gameRatingResult)
          throw new Error('UpdateGameRating error')
        }

        const gameProjectResult = await gameProjectByID(gameProject.id)
        if (gameProjectResult.status === 200) {
          enqueueSnackbar('Game rating success', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
            variant: 'success',
          })

          setRateValue(calcRating(gameProjectResult.data.rating || 0))
          setToggleRate(false)
        } else {
          console.error(gameProjectResult)
          throw new Error('gameProjectResult error')
        }
      } catch (err) {
        console.log(err)
        enqueueSnackbar('Game rating failed', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          variant: 'warning',
        })
      }
    },
    [enqueueSnackbar, gameProject]
  )

  return (
    <>
      <Rating name="read-only" value={rateValue} readOnly />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Button
          variant="outlined"
          size="small"
          onClick={() => setToggleRate(!toggleRate)}
        >
          Rate now
        </Button>
        {toggleRate && (
          <Rating
            name="read-only"
            onChange={(event, newValue) => {
              console.log(newValue)
              handleRatingChange(newValue || 0)
            }}
            sx={{
              marginLeft: '10px',
            }}
          />
        )}
      </Box>
    </>
  )
}

export default GameRating
