import React from 'react'

export const Card: React.FC<
  React.PropsWithChildren<{
    accent?: string
  }>
> = ({ children, accent = 'tempo-bg-color--blue' }) => (
  <card accent={accent} iconSrc="https://www.reactivetrader.com/favicon.ico">
    {children}
  </card>
)
