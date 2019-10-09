import React from 'react'
import Logo from '../../../apps/MainRoute/components/app-header/Logo'

const onLogoClick = () =>
  window.glue.windows.open('adaptiveName', 'https://weareadaptive.com/', {
    title: 'Adaptive Title',
  })

export const GlueLogoLink = () => (
  <Logo size={1.75} onClick={onLogoClick} data-qa="header__root-logo" />
)
