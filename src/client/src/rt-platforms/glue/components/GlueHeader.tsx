import React, { useState, useEffect } from 'react'
import { waitForObject } from 'rt-util'
import { styled } from 'rt-theme'

const IconButton = styled.button`
  width: 2rem;
  height: 2rem;
  font-size: 1rem;
  line-height: 1rem;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  cursor: pointer;

  transition: background-color ${({ theme }) => theme.motion.duration}ms
    ${({ theme }) => theme.motion.easing};

  &:hover {
    background-color: ${({ theme }) => theme.button.secondary.active.backgroundColor};
    color: ${({ theme }) => theme.button.secondary.textColor};
  }
`

export const GlueHeader: React.FC<any> = () => {
  const [
    { isStackAllButtonVisible, isTabAllButtonVisible, isToggleCollapseButtonVisible },
    setButtonsVisibility,
  ] = useState({
    isStackAllButtonVisible: false,
    isTabAllButtonVisible: false,
    isToggleCollapseButtonVisible: false,
  })

  useEffect(() => {
    const waitForGlue = async () => {
      await waitForObject('glue')
      window.glue.interop.register(
        'toggleHeaderButtons',
        (args: { numberOfOpenedWindows: number }) => {
          setButtonsVisibility({
            isStackAllButtonVisible: args.numberOfOpenedWindows > 1,
            isTabAllButtonVisible: args.numberOfOpenedWindows > 1,
            isToggleCollapseButtonVisible: args.numberOfOpenedWindows > 0,
          })
        },
      )
    }
    waitForGlue()
  }, [])

  // TODO expose onClick on logo?

  const stackAll = () => window.glue.interop.invoke('stackAllWindows')

  const tabAll = () => window.glue.interop.invoke('tabAllWindows')

  const toggleCollapse = () => window.glue.interop.invoke('toggleCollapse')

  return (
    <>
      {isStackAllButtonVisible && (
        <IconButton onClick={stackAll} title="Stack All">
          <i className="fas fa-layer-group" />
        </IconButton>
      )}
      {isTabAllButtonVisible && (
        <IconButton onClick={tabAll} title="Tab All">
          <i className="fas fa-window-restore" />
        </IconButton>
      )}
      {isToggleCollapseButtonVisible && (
        <IconButton onClick={toggleCollapse} title="Toggle Collapse">
          <i className="fas fa-minus" />
        </IconButton>
      )}
    </>
  )
}
