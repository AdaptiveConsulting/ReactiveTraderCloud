import React from 'react'
import styled, { CreateStyled } from 'react-emotion'
import { Theme } from './themes'

export interface StyledProps<Props = any> extends React.HTMLProps<React.Component<Props, any, any>> {}

export default styled as CreateStyled<Theme>
