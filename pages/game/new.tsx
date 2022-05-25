import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { Editor } from '@toast-ui/react-editor'
import GameForm from 'components/Game/Form'
import {
  GameFormContextProvider,
  GameFormContextType,
} from 'context/gameFormContext'
import type { NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { MutableRefObject, useState } from 'react'
import { DefaultValues, useForm } from 'react-hook-form'
import { GameEntity } from 'types'
import {
  Community,
  EditorMode,
  GameEngine,
  GameFileCharset,
  Genre,
  PaymentMode,
} from 'types/enum'
import { Game } from 'utils/validator'

const resolverGame = classValidatorResolver(Game)

const GameCreate: NextPage = () => {
  const [editorRef, setEditorRef] = useState<MutableRefObject<Editor>>()

  const [defaultValue] = useState<DefaultValues<Game>>({
    paymentMode: PaymentMode.DISABLE_PAYMENTS,
    community: Community.DISABLED,
    genre: Genre.ROLE_PLAYING,
    kind: GameEngine.RM2K3E,
    charset: GameFileCharset.UTF8,
    tags: [],
    appStoreLinks: [],
    screenshots: [],
    cover: '',
  })

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState,
    getValues,
    trigger,
  } = useForm<Game>({
    resolver: resolverGame,
    defaultValues: defaultValue,
  })

  return (
    <GameFormContextProvider
      value={
        {
          register,
          handleSubmit,
          setValue,
          control,
          watch,
          formState,
          getValues,
          trigger,
        } as GameFormContextType
      }
    >
      <GameForm
        gameProject={{} as GameEntity}
        editorMode={EditorMode.CREATE}
        editorRef={editorRef}
        setEditorRef={setEditorRef}
      ></GameForm>
    </GameFormContextProvider>
  )
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

export default GameCreate
