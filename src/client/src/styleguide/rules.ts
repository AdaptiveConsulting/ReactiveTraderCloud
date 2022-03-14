import { css } from 'styled-components'

export const preventStutter = css`
  backface-visibility: hidden;
  transform-style: preserve-3d;
`

export const userSelectNone = css`
  -webkit-touch-callout: none;

  -webkit-user-drag: none;

  user-select: none;

  cursor: default;
`

export const userSelectButton = (props: { disabled?: boolean } | any) => css`
  -webkit-touch-callout: rgba(0, 0, 0, 0.05);

  -webkit-user-drag: none;

  user-select: none;

  cursor: pointer;

  ${props.disabled === true
    ? css`
        cursor: default;
      `
    : ''};
`

export const touchScroll = css`
  -webkit-overflow-scrolling: touch;
`

export const appRegionDrag = css`
  ${userSelectNone};
  -webkit-user-drag: none;
  -webkit-app-region: drag;
`

export const appRegionNoDrag = css`
  -webkit-user-drag: none;
  -webkit-app-region: no-drag;
`

export const rules = {
  preventStutter,
  userSelectNone,
  userSelectButton,
  touchScroll,
  appRegionDrag,
  appRegionNoDrag,
}
