import styled from 'styled-components/macro'
import { Theme } from 'rt-theme'
import { FormattedNumericInput } from './FormattedNumericInput'
import { ValidationMessage } from './types'
import { transparentize } from 'polished'

export const CurrencyPairSymbol = styled('span')`
  grid-area: Currency;
  opacity: 0.59;
  font-size: 0.625rem;
  line-height: 1.2rem;
`

const getValidationMessageStyles = ({
  theme,
  validationMessageType,
}: {
  theme: Theme
  validationMessageType: ValidationMessage['type']
}) => {
  switch (validationMessageType) {
    case 'error':
      return theme.accents.negative.base
    case 'warning':
      return theme.accents.aware.base
    case 'info':
    default:
      return theme.accents.primary.base
  }
}

const getInputBoxShadowStyles = ({
  validationMessage,
  theme,
}: {
  validationMessage?: ValidationMessage
  theme: Theme
}) =>
  validationMessage
    ? `
        box-shadow: 0px 1px 0px
          ${getValidationMessageStyles({ theme, validationMessageType: validationMessage.type })};
      `
    : `
    box-shadow: 0px 1px 0px ${transparentize(0.59, theme.core.textColor)};

  .spot-tile:hover &:focus, &:focus {
    box-shadow: 0px 1px 0px ${theme.accents.primary.base};
  }
`

export const MessagePlaceholder = styled.div<{ validationMessageType: ValidationMessage['type'] }>`
  color: ${getValidationMessageStyles};
  grid-area: Message;
  font-size: 0.6rem;
  line-height: normal;
  padding-top: 2px;
`

export const InputWrapper = styled.div<{ altLayout: boolean }>`
  display: grid;
  grid-template-columns: 30px auto 30px;
  grid-template-areas: 'Currency Input ResetInputValue' '. Message .';
  align-items: center;
  ${({ altLayout }) =>
    altLayout
      ? `
grid-template-rows: 23px 13px;
margin-bottom: -0.5rem;
`
      : `
grid-template-rows: 23px 0;
`};
`

export const Input = styled(FormattedNumericInput)`
  grid-area: Input;
  background: none;
  text-align: center;
  outline: none;
  border: none;
  font-size: 0.75rem;
  width: 80px;
  padding: 2px 0;
  caret-color: ${({ theme }) => theme.primary.base};
  ${({ disabled }) => disabled && 'opacity: 0.3;'};
  ${getInputBoxShadowStyles};
`

export const ResetInputValue = styled.button`
  background-color: ${({ theme }) => theme.core.lightBackground};
  border: 2px solid ${({ theme }) => theme.core.darkBackground};
  border-radius: 3px;
  margin-left: 8px;
  grid-area: ResetInputValue;
  font-size: 0.625rem;
  line-height: 1.2rem;
`
