import React from 'react'

import { AdaptiveLoader, Flex } from 'rt-components'
import { styled } from 'rt-theme'

const appVersion: string = process.env.REACT_APP_VERSION
const LOADER_SIZE = 400

const Background = styled(Flex)`
  background-color: ${({ theme }) => theme.shell.backgroundColor};
`

const AdaptiveText = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  font-size: 4rem;
  font-family: Lato;
  font-weight: 600;
  color: ${({ theme }) => theme.shell.backgroundColor};
`

const Version = styled('p')`
  margin-top: 3rem;
  line-height: 1rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.shell.textColor};
`

const LoaderContainer = styled('div')`
  width: ${LOADER_SIZE}px;
  height: ${LOADER_SIZE}px;
  position: relative;
`

const SplashScreen = () => (
  <Background width="100%" height="100%" alignItems="center" direction="column" justifyContent="center">
    <LoaderContainer>
      <AdaptiveLoader size="400" type="secondary" seperation={2} />
      <AdaptiveText>Adaptive</AdaptiveText>
    </LoaderContainer>
    <Version>{appVersion}</Version>
  </Background>
)

export default SplashScreen
