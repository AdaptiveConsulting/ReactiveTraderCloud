import React from 'react'

import { AdaptiveLoader, Flex } from 'rt-components'
import { styled } from 'rt-util'

const appVersion: string = process.env.REACT_APP_VERSION
const LOADER_SIZE = 400

const Background = styled(Flex)`
  background-color: ${({ theme }) => theme.background.primary};
`

const AdaptiveText = styled('h1')`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px;
  font-size: ${({ theme }) => theme.fontSize.h1};
  color: ${({ theme }) => theme.text.secondary};
  text-shadow: -1px -1px 0 ${({ theme }) => theme.text.primary}, 1px -1px 0 ${({ theme }) => theme.text.primary},
    -1px 1px 0 ${({ theme }) => theme.text.primary}, 1px 1px 0 ${({ theme }) => theme.text.primary};
`

const Version = styled('p')`
  margin-top: 20px;
  font-size: ${({ theme }) => theme.fontSize.body};
  color: ${({ theme }) => theme.text.primary};
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
