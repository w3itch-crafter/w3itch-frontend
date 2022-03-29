import styled from '@emotion/styled'
import Link from 'next/link'

export default function UserPanel() {
  return (
    <UserPanelWidget>
      <Link href="/login" passHref>
        <PanelButton>Log in</PanelButton>
      </Link>
      <Link href="/register" passHref>
        <PanelButton>Register</PanelButton>
      </Link>
    </UserPanelWidget>
  )
}

const UserPanelWidget = styled.div`
  font-size: 16px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  z-index: 102;
  flex: 1;
`

const PanelButton = styled.a`
  box-sizing: border-box;
  transition: all 0.1s ease;
  white-space: nowrap;
  height: 30px;
  line-height: 26px;
  color: inherit;
  padding: 0 15px;
  border: 2px solid;
  border-color: #dadada;
  text-decoration: none;
  font-size: 14px;
  font-weight: bold;
  border-radius: 3px;
  margin-left: 10px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
    color: #ff2449;
  }
`
