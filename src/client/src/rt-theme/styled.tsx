import createEmotionStyled, { CreateStyled } from 'create-emotion-styled'
import React from 'react'
import * as emotion from './emotion'
import { Theme } from './themes'

const styled: CreateStyled<Theme> = createEmotionStyled(emotion, React)

export interface StyledProps<Props = any> extends React.HTMLProps<React.Component<Props, any, any>> {}

export default styled
