import { ButtonHTMLAttributes } from 'react'
import { ButtonContainer, ButtonVariant } from './styles'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

export function Button({ variant = 'primary', ...rest }: ButtonProps) {
  return (
    <ButtonContainer variant={variant} {...rest}>
      Button Component
    </ButtonContainer>
  )
}
