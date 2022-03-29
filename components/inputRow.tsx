import styled from '@emotion/styled'

declare type InputInvalid = {
  message: string
}
export declare interface InputRowProps {
  label: string
  center?: boolean
  disabled?: boolean
  preview?: boolean
  placeholder?: string
  invalid?: InputInvalid
}

export default function InputRow({
  label,
  center,
  disabled,
  preview,
  placeholder,
  invalid,
  ...inputProps
}: InputRowProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const Container = styled.div<Pick<InputRowProps, 'center'>>`
    margin-bottom: 20px;
    font-size: 14px;
    ${(p) => p.center && `text-align: center`};
  `
  const Label = styled.div`
    color: #434343;
    font-weight: bold;
  `
  const Validated = styled.div`
    position: relative;
  `
  const ErrorMessage = styled.span<Pick<InputRowProps, 'invalid' | 'disabled'>>`
    transition: all 0.2s ease;
    opacity: 0;
    position: absolute;
    top: 0;
    right: 0;
    color: #d14343;
    ${(p) =>
      p.invalid &&
      !p.disabled &&
      `
      top: -15px;
      opacity: 1;
    `}
  `
  const Input = styled.input<
    Pick<InputRowProps, 'invalid' | 'center' | 'disabled' | 'preview'>
  >`
    box-sizing: border-box;
    max-width: 526px;
    width: 100%;
    transition: border-color 0.2s;
    position: relative;
    padding: 8px;
    border: 2px solid;
    border-color: #cdcdcd;
    color: #222;
    background-color: white;
    border-radius: 2px;
    font-family: inherit;
    margin: 6px 0;
    &:disabled {
      background-color: #f4f4f4;
      opacity: 0.5;
    }
    ${(p) => p.invalid && !p.disabled && `border-color: #D14343;`}
    ${(p) => p.center && `text-align: center;`}
    ${(p) =>
      p.preview &&
      `
      border: none;
      font-size: 14px;
    `}
  `

  return (
    <Container center={center}>
      <label>
        <Label>{label}</Label>
        <Validated>
          {invalid && (
            <ErrorMessage disabled={disabled} invalid={invalid}>
              {invalid.message}
            </ErrorMessage>
          )}
          <Input
            center={center}
            disabled={disabled}
            preview={preview}
            placeholder={placeholder}
            invalid={invalid}
            {...inputProps}
          />
        </Validated>
      </label>
    </Container>
  )
}
