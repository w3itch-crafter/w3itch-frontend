import styled from '@emotion/styled'
import { Alert, AlertColor, CircularProgress, Popover } from '@mui/material'
import { storagesUploadToIPFS } from 'api'
import { updateMe } from 'api/users'
import { RedButton } from 'components/buttons'
import InputCheckbox from 'components/inputCheckbox'
import InputRow from 'components/inputRow'
import useUser from 'hooks/useUser'
import Image from 'next/image'
import path from 'path'
import { Fragment, useEffect, useRef, useState } from 'react'
import { isBackendError, NextPageWithLayout, UserEntity } from 'types'
import { v4 as uuid } from 'uuid'

import Layout from './_layout'

declare type PopoverState = {
  anchor: HTMLButtonElement | null
  open: boolean
  color: AlertColor
  message: string
  id: string
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
  const userData = useUser()
  const [user, setUser] = useState<Partial<UserEntity> | undefined>({})
  const [uploading, setUploading] = useState<boolean>(false)
  const submitButton = useRef<HTMLButtonElement>(null)
  const [popoverState, setPopoverState] = useState<PopoverState>({
    anchor: null,
    open: false,
    id: 'state-popover',
    color: 'success',
    message: 'Profile updated',
  })
  const handleChangeUserData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    setUser((u) => ({ ...u, [name]: value }))
  }
  const handleChangeFile = async (
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
      const res = await storagesUploadToIPFS(avatar)
      const { publicUrl } = res.data
      setUser((u) => ({ ...u, avatar: publicUrl }))
    }
    setUploading(false)
  }
  const handleSubmitProfile = async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const state = await updateMe(user!)
    if (isBackendError(state)) {
      return setPopoverState((s) => ({
        ...s,
        anchor: submitButton.current,
        open: true,
        color: 'error',
        message: state.message,
      }))
    } else {
      setPopoverState((s) => ({
        ...s,
        anchor: submitButton.current,
        open: true,
      }))
    }
  }
  const handlePopoverClose = () => {
    setPopoverState((s) => ({ ...s, anchor: null, open: false }))
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
          <span>https://{user?.username?.toLowerCase()}.w3itch.io</span>
        </UsernameRow>
      </InputRow>
      <InputRow
        label="Profile image"
        subLabel=" — Shown next to your name when you take an action on the site (square dimensions)"
      >
        <AvatarUploader
          avatar={user?.avatar}
          uploading={uploading}
          onChangeFile={handleChangeFile}
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
        <Popover
          id={popoverState.id}
          open={popoverState.open}
          anchorEl={popoverState.anchor}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Alert severity={popoverState.color}>{popoverState.message}</Alert>
        </Popover>
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
