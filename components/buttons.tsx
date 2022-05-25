import styled from '@emotion/styled'

export const RedButton = styled.button`
  user-select: none;
  box-sizing: border-box;
  display: inline-block;
  text-decoration: none;
  padding: 0 10px;
  font-size: 14px;
  background-color: var(--itchio_button_color, #ff2449);
  color: var(--itchio_button_fg_color, white);
  text-shadow: 0 1px 0 var(--itchio_button_shadow_color, #c3223e);
  cursor: pointer;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 0 1px rgb(255 255 255 / 21%);
  text-align: center;
  line-height: 33px;
  font-weight: bold;
  height: 35px;
  &:disabled {
    background-color: #ccc;
    text-shadow: none;
    box-shadow: none;
  }
`

declare type Size = 'small' | 'medium'
declare interface ChooseButtonProps {
  color: string
  outline?: boolean
  size?: Size
}
const sizes: Record<Size, string> = {
  small: '8px 16px',
  medium: '16px 30px',
}
export const LoginChooseButton = styled.button<ChooseButtonProps>`
  user-select: none;
  box-sizing: border-box;
  text-decoration: none;
  cursor: pointer;
  display: inline-flex;
  gap: 10px;
  border-radius: 3px;
  border: 2px solid;
  border-color: ${(p) => p.color};
  background-color: ${(p) => (p.outline ? '#fff' : p.color)};
  color: ${(p) => (p.outline ? p.color : '#fff')};
  align-items: center;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  padding: ${(p) => sizes[p.size || 'medium']};
  &:hover {
    background-color: ${(p) => (p.outline ? p.color : '#fff')};
    color: ${(p) => (p.outline ? '#fff' : p.color)};
  }
`
