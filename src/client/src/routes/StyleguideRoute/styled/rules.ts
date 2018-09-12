import { css } from 'rt-theme'

export { mapMarginPaddingProps, MarginPaddingProps } from './mapMarginPaddingProps'

export const preventStutter = css`
  -webkit-backface-visibility: hidden;
  -webkit-transform-style: preserve-3d;
`

export const userSelectNone = css`
  -webkit-touch-callout: none;
  touch-callout: none;

  -webkit-user-drag: none;
  user-drag: none;

  -webkit-user-select: none;
  user-select: none;

  cursor: default;
`

export const userSelectButton = ({ disabled }: { disabled?: boolean }) => css`
  -webkit-touch-callout: rgba(0, 0, 0, 0.05);
  touch-callout: none;

  -webkit-user-drag: none;
  user-drag: none;

  -webkit-user-select: none;
  user-select: none;

  cursor: pointer;

  ${disabled === true
    ? css`
        cursor: default;
      `
    : ''};
`

export const touchScroll = css`
  -webkit-overflow-scrolling: touch;
`
