import createEmotionStyled from 'create-emotion-styled'
import React from 'react'
import { CreateStyled, StyledComponent } from 'react-emotion'
import * as emotion from './emotion'
import { Theme } from './themes'

const styled: CreateStyled<Theme> = createEmotionStyled(emotion, React)

export interface StyledProps<Props = any> extends React.HTMLProps<React.Component<Props, any, any>> {}

export type StyledComponent<
  Props extends object = StyledProps,
  InnerProps extends object = any,
  T extends object = Theme
> = StyledComponent<Props, InnerProps, T>

export default styled
