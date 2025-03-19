import styled from "styled-components"

import { Typography } from "@/client/components/Typography"
import { Stack } from "./Stack"

interface Props {
  left: string
  right: string
  isToggled: boolean
  onChange: () => void
}

const Background = styled(Stack)`
  position: relative;
  box-sizing: border-box;
  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-secondary"]};
  border-radius: ${({ theme }) => theme.radius.full};
  height: 28px;
  justify-content: space-between;
  border: ${({ theme }) => theme.spacing.xxs} solid
    ${({ theme }) => theme.color["Colors/Background/bg-secondary"]};
`

const Button = styled.button`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`

const ButtonTypography = styled(Typography)`
  transition: color 0.5s ease;
`

const Indicator = styled.div<{ isToggled: boolean }>`
  position: absolute;
  width: 50%;
  height: 100%;
  background-color: ${({ theme, isToggled }) =>
    isToggled
      ? theme.color["Colors/Background/bg-sell-primary"]
      : theme.color["Colors/Background/bg-buy-primary"]};
  border-radius: ${({ theme }) => theme.radius.full};
  left: ${({ isToggled }) => (isToggled ? "50%" : 0)};
  transition:
    left 0.5s ease,
    background-color 0.5s ease;
`

export const Toggle = ({ left, right, onChange, isToggled }: Props) => (
  <Background justifyContent="space-between">
    <Button onClick={onChange}>
      <ButtonTypography
        variant="Text md/Semibold"
        color={isToggled ? "Colors/Text/text-quaternary (500)" : "white"}
      >
        {left}
      </ButtonTypography>
    </Button>
    <Button onClick={onChange}>
      <ButtonTypography
        variant="Text md/Semibold"
        color={
          isToggled
            ? "Colors/Text/text-white"
            : "Colors/Text/text-quaternary (500)"
        }
      >
        {right}
      </ButtonTypography>
    </Button>
    <Indicator isToggled={isToggled} />
  </Background>
)
