import styled from "styled-components"

import { FlexBox } from "@/client/components/FlexBox"
import { Typography } from "@/client/components/library/Typography"

interface Props {
  left: string
  right: string
  isToggled: boolean
  onChange: () => void
}

const Background = styled(FlexBox)`
  position: relative;
  box-sizing: border-box;
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-secondary"]};
  border-radius: ${({ theme }) => theme.newTheme.radius.full};
  height: 28px;
  justify-content: space-between;
  border: ${({ theme }) => theme.newTheme.spacing.xxs} solid
    ${({ theme }) => theme.newTheme.color["Colors/Background/bg-secondary"]};
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
      ? theme.newTheme.color["Colors/Background/bg-sell-primary"]
      : theme.newTheme.color["Colors/Background/bg-buy-primary"]};
  border-radius: ${({ theme }) => theme.newTheme.radius.full};
  left: ${({ isToggled }) => (isToggled ? "50%" : 0)};
  transition:
    left 0.5s ease,
    background-color 0.5s ease;
`

export const Toggle = ({ left, right, onChange, isToggled }: Props) => (
  <Background>
    <Button onClick={onChange}>
      <ButtonTypography
        variant="Text md/Semibold"
        color={
          isToggled
            ? "Colors/Text/text-quaternary (500)"
            : "Colors/Text/text-primary_alt"
        }
      >
        {left}
      </ButtonTypography>
    </Button>
    <Button onClick={onChange}>
      <ButtonTypography
        variant="Text md/Semibold"
        color={
          isToggled
            ? "Colors/Text/text-primary (900)"
            : "Colors/Text/text-quaternary (500)"
        }
      >
        {right}
      </ButtonTypography>
    </Button>
    <Indicator isToggled={isToggled} />
  </Background>
)
