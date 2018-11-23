import React from 'react'
import { styled } from 'rt-theme'

interface LogoProps {
  source: any
  size?: number
  alt: string
}

const Logo: React.SFC<LogoProps> = ({ size = 2, source, alt, ...props }) => {
  const style = {
    width: size * 3 + 'rem',
  }
  return <img alt={alt} src={source} style={style} {...props} />
}

export default styled(Logo)`
  filter: grayscale(1);
  margin-right: 1rem;
`
