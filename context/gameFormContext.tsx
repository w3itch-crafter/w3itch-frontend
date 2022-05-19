import { createContext } from 'react'
import {
  Control,
  FormState,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form'
import { GameEntity } from 'types'
import { Game } from 'utils/validator'

export type GameFormContextType = {
  readonly gameProject: GameEntity
  readonly register: UseFormRegister<Game>
  readonly handleSubmit: UseFormHandleSubmit<Game>
  readonly setValue: UseFormSetValue<Game>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly control: Control<Game, any>
  readonly watch: UseFormWatch<Game>
  readonly formState: FormState<Game>
  readonly getValues: UseFormGetValues<Game>
  readonly trigger: UseFormTrigger<Game>
}

const defaultValue = {} as GameFormContextType
export const GameFormContext = createContext<GameFormContextType>(defaultValue)

export const GameFormContextProvider = GameFormContext.Provider
