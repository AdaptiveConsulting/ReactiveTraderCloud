import styled from "styled-components"

const TextInputText = styled.input(
  ({ theme }) => theme.newTheme.textStyles["Text md/Regular"],
)

const _TextInput = styled(TextInputText)<Partial<HTMLInputElement>>`
  ${({ theme, disabled }) => `
height: 28px;
width: 100%;
color: ${theme.newTheme.color["Colors/Text/text-primary (900)"]};
background-color: ${disabled ? theme.newTheme.color["Colors/Background/bg-secondary_subtle"] : theme.newTheme.color["Colors/Background/bg-secondary"]};
border: ${theme.newTheme.color["Colors/Border/border-secondary"]} solid 1px;
padding: 0 ${theme.newTheme.spacing.sm};
margin: 0;

${
  !disabled &&
  `
    &:hover{
        border-color: ${theme.newTheme.color["Colors/Border/border-hover"]};
    }

    &:active {
        border-color: ${theme.newTheme.color["Colors/Border/border-brand"]};
    }

    &:focus {
        outline: 2px solid ${theme.newTheme.color["Colors/Effects/Focus rings/focus-ring"]};
        outline-offset: 1px;
    }
    `
}

`}
`

interface Props {
  disabled?: boolean
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

export const TextInput = ({ onChange, value, ...props }: Props) => (
  <_TextInput
    onChange={({ target }) => onChange?.(target.value)}
    value={value}
    {...props}
  />
)
