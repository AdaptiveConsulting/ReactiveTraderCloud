import createEmotionStyled, { CreateStyled } from 'create-emotion-styled'
import React from 'react'
import { StyledComponent } from 'react-emotion'

import * as emotion from './emotion'
import { Theme } from './themes'

export interface StyledProps<Props = any> extends React.HTMLProps<React.Component<Props, any, any>> {}

export type StyledComponent<
  Props extends object = StyledProps,
  InnerProps extends object = any,
  T extends object = Theme
> = StyledComponent<Props, InnerProps, T>

export type Styled<
  Props extends object = StyledProps,
  InnerProps extends object = any,
  T extends object = Theme
> = StyledComponent<Props, InnerProps, T>

export const styled: CreateStyled<Theme> = createEmotionStyled(emotion, React)

export default styled
