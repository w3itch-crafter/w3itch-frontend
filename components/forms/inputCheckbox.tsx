import styled from '@emotion/styled'

export declare interface InputCheckboxProps {
  label: string
  className?: string
}

const Container = styled.div`
  margin-bottom: 10px;
  font-size: 14px;
`
const Input = styled.input`
  &[type='checkbox'] {
    vertical-align: middle;
  }
`

export function InputCheckbox({
  label,
  className,
  ...inputProps
}: InputCheckboxProps & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Container className={className}>
      <label>
        <Input type="checkbox" {...inputProps} />
        {label}
      </label>
    </Container>
  )
}
