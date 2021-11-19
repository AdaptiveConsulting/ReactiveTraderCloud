import React, { FC } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Card } from '../components/Card'

const Message: FC<{ text: string }> = ({ text }) => {
  return (
    <Card>
      <header>{text}</header>
    </Card>
  )
}

export const standardMessage = (text: string) => {
  return renderToStaticMarkup(<Message text={text} />)
}
