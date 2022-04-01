import styled from '@emotion/styled'

export declare interface InputCheckboxProps {
  label: string
  className?: string
}
export default function InputCheckbox({
  label,
  className,
  ...inputProps
}: InputCheckboxProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const Container = styled.div`
    margin-bottom: 10px;
    font-size: 14px;
  `
  const Input = styled.input`
    &[type='checkbox'] {
      vertical-align: middle;
    }
  `

  return (
    <Container className={className}>
      <label>
        <Input type="checkbox" {...inputProps} />
        {label}
      </label>
    </Container>
  )
}
