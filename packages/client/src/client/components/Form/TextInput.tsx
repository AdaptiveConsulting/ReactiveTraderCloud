import React from "react"
import styled from "styled-components"

import { ChevronIcon } from "../icons"
import { Stack } from "../Stack"
import { TextInputStyled } from "./TextInput.styled"

interface Props {
  name?: string
  id?: string
  disabled?: boolean
  placeholder?: string
  value?: string
  comboBox?: boolean
  className?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}

const Container = styled(Stack)`
  position: relative;
`

const Icon = styled.div`
  position: absolute;
  right: 0;
  color: ${({ theme }) => theme.color["Colors/Text/text-tertiary (600)"]};
`

export const TextInput = React.forwardRef<HTMLInputElement, Props>(
  function InputInner({ value, comboBox, ...props }, ref) {
    return (
      <Container alignItems="center">
        <TextInputStyled value={value} ref={ref} {...props} />
        {comboBox && (
          <Icon>
            <ChevronIcon />
          </Icon>
        )}
      </Container>
    )
  },
)
