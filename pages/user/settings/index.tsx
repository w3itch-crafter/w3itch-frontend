import styled from '@emotion/styled'
import { Alert, AlertColor, CircularProgress, Snackbar } from '@mui/material'
import { storagesUploadToAWS } from 'api'
import { updateMe } from 'api/users'
import { RedButton } from 'components/buttons'
import { InputCheckbox, InputRow } from 'components/forms'
import { AuthenticationContext } from 'context'
import { useAuthentication } from 'hooks'
import Image from 'next/image'
import { useRouter } from 'next/router'
import path from 'path'
import { Fragment, useContext, useEffect, useRef, useState } from 'react'
import {
  BackendErrorResponse,
  isBackendError,
  NextPageWithLayout,
  UserEntity,
} from 'types'
import { BackendError, userHostUrl } from 'utils'
import { v4 as uuid } from 'uuid'

import Layout from './_layout'

declare type PopoverState = {
  open: boolean
  color: AlertColor
  message: string
}

const Settings: NextPageWithLayout = () => {
  const UsernameRow = styled.div`
    font-size: 16px;
    padding: 8px 0;
  `
  const Checkbox = styled(InputCheckbox)`
    margin: 8px 10px;
    & input[type='checkbox'] {
      vertical-align: middle;
      margin: 0 5px 0 0;
    }
  `
  const Buttons = styled.div`
    margin-top: 20px;
    color: #858585;
  `
  const router = useRouter()
  const { user: userData, account } = useAuthentication()
  const { dispatch } = useContext(AuthenticationContext)
  const [user, setUser] = useState<Partial<UserEntity> | null>(userData)
  const [updateUser, setUpdateUser] = useState<Partial<UserEntity>>({})
  const [uploading, setUploading] = useState<boolean>(false)
  const submitButton = useRef<HTMLButtonElement>(null)
  const [popoverState, setPopoverState] = useState<PopoverState>({
    open: false,
    color: 'success',
    message: 'Profile updated',
  })
  const profileUrl = userHostUrl(user?.username?.toLowerCase())
  const handleChangeUserData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    setUser((u) => ({ ...u, [name]: value }))
    setUpdateUser((u) => ({ ...u, [name]: value }))
  }
  const handleChangeAvatar = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.stopPropagation()
    event.preventDefault()
    if (event.target.files !== null) {
      setUploading(true)
      const file = event.target.files[0]
      const { ext } = path.parse(file.name)
      const avatar = new FormData()
      avatar.append('file', file, `${uuid()}${ext}`)
      try {
        const res = await storagesUploadToAWS(avatar)
        const { publicUrl } = res.data
        setUser((u) => ({ ...u, avatar: publicUrl }))
        setUpdateUser((u) => ({ ...u, avatar: publicUrl }))
      } catch (error) {
        if (error instanceof BackendError) {
          return checkError(error)
        }
      }
    }
    setUploading(false)
  }
  const handleSubmitProfile = async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const state = await updateMe(updateUser)
    if (isBackendError(state)) {
      return checkError(state)
    } else {
      dispatch({ type: 'LOGIN', payload: { user: state, account } })
      setPopoverState((s) => ({ ...s, open: true }))
    }
  }
  const checkError = (error: BackendError | BackendErrorResponse) => {
    const { message, statusCode } = error
    setPopoverState((s) => ({
      ...s,
      open: true,
      color: 'error',
      message,
    }))
    if (statusCode === 401) return router.replace('/login')
  }

  useEffect(() => {
    setUser(userData)
  }, [userData])

  return (
    <Fragment>
      <h2>Profile</h2>
      <InputRow
        label="Username"
        subLabel=" — Used to log into your account and for your page URL"
      >
        <UsernameRow>
          <span>{user?.username}</span>
        </UsernameRow>
      </InputRow>
      <InputRow label="URL" subLabel=" — The public URL for your account">
        <UsernameRow>
          <span>{profileUrl}</span>
        </UsernameRow>
      </InputRow>
      <InputRow
        label="Profile image"
        subLabel=" — Shown next to your name when you take an action on the site (square dimensions)"
      >
        <AvatarUploader
          avatar={user?.avatar}
          uploading={uploading}
          onChangeFile={handleChangeAvatar}
        />
      </InputRow>
      <InputRow
        label="Display name"
        subLabel=" — Name to be shown in place of your username, leave blank to default to username"
        placeholder="optional"
        type="text"
        name="nickname"
        value={user?.nickname}
        onChange={handleChangeUserData}
      />
      <InputRow
        label="Account type"
        subLabel=" — How will you use your account"
      >
        <Checkbox
          label="Playing and downloading games"
          name="gamer"
          onChange={handleChangeUserData}
        />
        <Checkbox
          label="Developing and uploading games"
          name="developer"
          onChange={handleChangeUserData}
        />
      </InputRow>
      <Buttons>
        <RedButton ref={submitButton} onClick={handleSubmitProfile}>
          Save
        </RedButton>
        <Snackbar
          open={popoverState.open}
          autoHideDuration={5000}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity={popoverState.color}>{popoverState.message}</Alert>
        </Snackbar>
      </Buttons>
    </Fragment>
  )
}

Settings.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

declare interface AvatarUploaderProps {
  avatar?: string
  uploading?: boolean
  onChangeFile: React.ChangeEventHandler<HTMLInputElement>
}
function AvatarUploader({
  avatar,
  uploading,
  onChangeFile,
}: AvatarUploaderProps) {
  const Container = styled.div`
    display: flex;
    margin-top: 10px;
  `
  const PreviewAvatar = styled.div`
    position: relative;
    background-color: #f4f4f4;
    margin-right: 10px;
    width: 100px;
    height: 100px;
    & img {
      display: block;
      width: 100px;
      height: 100px;
    }
  `
  const Uploading = styled.div`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(255, 255, 255, 0.8);
    background-color: rgba(0, 0, 0, 0.1);
    width: 100%;
    height: 100%;
    z-index: 1;
  `
  const buttonText = avatar ? 'Replace image' : 'Upload image'
  const inputFile = useRef<HTMLInputElement>(null)
  const handleButtonClick = () => {
    if (inputFile.current !== null) {
      inputFile.current.click()
    }
  }

  return (
    <Container>
      <input
        type="file"
        id="avatar"
        name="avatar"
        accept="image/png, image/jpeg"
        ref={inputFile}
        style={{ display: 'none' }}
        onChange={onChangeFile}
      />
      {avatar && (
        <PreviewAvatar>
          {uploading && (
            <Uploading>
              <CircularProgress size={32} color="inherit" />
            </Uploading>
          )}
          <Image src={avatar} width="100px" height="100px" alt="Avatar" />
        </PreviewAvatar>
      )}
      <RedButton onClick={handleButtonClick}>{buttonText}</RedButton>
    </Container>
  )
}

export default Settings
