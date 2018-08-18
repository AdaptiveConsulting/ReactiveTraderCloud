import React from 'react'
import styled, { CreateStyled, StyledComponent } from 'react-emotion'
import { Theme } from './themes'

export interface StyledProps<Props = any> extends React.HTMLProps<React.Component<Props, any, any>> {}

export type StyledComponent<
  Props extends object = StyledProps,
  InnerProps extends object = any,
  T extends object = Theme
> = StyledComponent<Props, InnerProps, T>

export default styled as CreateStyled<Theme>
