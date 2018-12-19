import { darken } from 'polished'
import React, { FunctionComponent } from 'react'
import { styled } from 'rt-theme'
import Icon from './Icon'

const headerHeight = '2rem'

export const Header = styled.div`
  display: flex;
  align-items: center;
  height: 2rem;
  cursor: pointer;
  padding: 0 1rem;
`

const expandedHeight = `calc(-100% + ${headerHeight})`
export const Content = styled.div<{ expand?: boolean }>`
  transform-origin: center left;
  transition: transform ${({ theme }) => theme.motion.duration}ms ease;
  transform: translateY(${props => (props.expand ? expandedHeight : 0)});
  background-color: ${props => props.theme.backgroundColor};
`

export const Root = styled.div`
  width: 100%;
  min-height: ${headerHeight};
  max-height: ${headerHeight};
  z-index: 20;

  font-size: 0.75rem;

  color: ${props => props.theme.textColor};

  ${Icon} {
    margin-right: 0.5rem;
  }
`

export const ChevronIcon: FunctionComponent<{ expand: boolean }> = ({ expand, ...props }) => (
  <Icon name="chevron" {...props} />
)

export const ExpandToggle = styled(ChevronIcon)`
  transform: rotate(${(props: { expand: boolean }) => (props.expand ? 180 : 0)}deg);
  transition: transform ${({ theme }) => theme.motion.duration}ms ease;
`

export const Fill = styled.div<{ size?: number }>`
  flex: ${({ size = 1 }) => size};
`

export const ServiceList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  grid-auto-flow: dense;
  box-shadow: 0 0 1rem 0rem rgba(0, 0, 0, 0.1) inset;
`

export const ServiceName = styled.div`
  min-width: 5rem;
  text-transform: capitalize;
  font-size: 1rem;
  line-height: 1rem;
`

export const NodeCount = styled.div`
  display: block;
  margin-bottom: -0.5rem;
  min-height: 1rem;
  max-height: 1rem;
  line-height: 1rem;
  font-size: 0.5rem;
  opacity: 0.6;
`

export const ServiceRoot = styled.div<{ index: number }>`
  min-height: 4.5rem;
  max-height: 4.5rem;
  padding: 0.5rem 1rem;

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0.25rem 0 0.5rem -0.5rem rgba(0, 0, 0, 0.5) inset;
  color: ${props => props.theme.textColor};
  background-color: ${({ index = 0, theme }) =>
    // it'd be nice if this were selected from the original palette …
    darken(index / 50, theme.backgroundColor)};

  ${Icon} {
    /* We're using important here. 	
         But you should see what happens with Emotion when you don't!  */
    margin-right: 1rem !important;
  }
`
