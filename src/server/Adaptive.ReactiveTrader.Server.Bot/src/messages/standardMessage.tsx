import React, { FC } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const Message: FC<{ text: string }> = ({ text }) => {
  return (
    <card accent="tempo-bg-color--blue">
      <header>{text}</header>
    </card>
  )
}

export const standardMessage = (text: string) => {
  return renderToStaticMarkup(<Message text={text} />)
}
