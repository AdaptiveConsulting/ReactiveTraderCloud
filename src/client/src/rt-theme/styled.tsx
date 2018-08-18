import styled, { CreateStyled, StyledComponent } from 'react-emotion'
import { Theme } from './themes'

export type StyledComponent<
  Props extends object,
  InnerProps extends object = any,
  Theme extends object = Theme
> = StyledComponent<Props, InnerProps, Theme>

export default styled as CreateStyled<Theme>
