import styled from "styled-components"

import OpenFinBrowserLink from "../components/OpenFinBrowserLink"

const OpenFinLogoLink = styled.a`
  .svg-fill {
    fill: ${({ theme }) => theme.newTheme.color["Colors/Text/text-primary (900)"]}};
  }
`

const LogoWrapper = styled.div`
  margin-right: 0.75rem;
`

export const OpenFinLogo = () => (
  <LogoWrapper>
    <OpenFinLogoLink
      href="http://www.openfin.co"
      as={OpenFinBrowserLink}
      data-qa="logo__openfin-logo-link"
    >
      <svg
        height="20px"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 490.43 90.22"
      >
        <title>openfin</title>
        <g id="Layer_2" data-name="Layer 2">
          <g id="Artwork">
            <g opacity="0.6">
              <path
                d="M13.09,52.14a6.91,6.91,0,0,1-5,1.83H0V34H8a6.71,6.71,0,0,1,4.88,1.83,4.69,4.69,0,0,1,1.3,3.33,4.57,4.57,0,0,1-2.88,4.43,5,5,0,0,1,3.33,4.83A5.32,5.32,0,0,1,13.09,52.14ZM8,36.19H2.45v6.29H8.07c2.09,0,3.53-.93,3.53-3.16S9.9,36.19,8,36.19Zm.14,8.49H2.45v7H8.07c2.2,0,4-1.07,4-3.44S10.24,44.69,8.13,44.69Z"
                className="svg-fill"
              />
              <path
                d="M28.41,54.34c-4.49,0-7.31-2.71-7.31-7.7V34h2.51V46.69c0,3.19,1.33,5.3,4.8,5.3s4.8-2.12,4.8-5.3V34h2.51V46.63C35.72,51.63,32.9,54.34,28.41,54.34Z"
                className="svg-fill"
              />
              <path d="M43.62,54V34h2.57V54Z" className="svg-fill" />
              <path d="M54.65,54V34h2.51V51.63h9.62V54Z" className="svg-fill" />
              <path
                d="M78.85,36.31V54H76.31V36.31h-6V34H84.81v2.34Z"
                className="svg-fill"
              />
              <path
                d="M112.15,52.22a7.84,7.84,0,0,1-10.78,0C99.19,50.1,98.8,47.17,98.8,44s.39-6.12,2.57-8.24a7.84,7.84,0,0,1,10.78,0c2.17,2.12,2.57,5.05,2.57,8.24S114.32,50.1,112.15,52.22ZM110.4,37.49a5.18,5.18,0,0,0-7.28,0c-1.64,1.69-1.72,4.4-1.72,6.49s.08,4.8,1.72,6.49a5.18,5.18,0,0,0,7.28,0c1.64-1.69,1.72-4.4,1.72-6.49S112,39.19,110.4,37.49Z"
                className="svg-fill"
              />
              <path
                d="M134.09,54l-9.82-16.08V54h-2.43V34h2.82l9.82,16.14V34h2.43V54Z"
                className="svg-fill"
              />
            </g>
            <path
              d="M281.56,29.9C292,29.9,299,37.49,299,47.77s-7,17.8-17.46,17.8S264.11,58,264.11,47.77,271.07,29.9,281.56,29.9Zm0,29.11c6.07,0,10.07-4.76,10.07-11.31s-4-11.18-10.07-11.18-10.07,4.69-10.07,11.18S275.42,59,281.56,59Z"
              fill="#080819"
              className="svg-fill"
            />
            <path
              d="M322.39,65.64c-5.1,0-9.66-2.14-11.86-5.66V80.2h-7V30.87H310l.34,4.76c2-3.38,6.21-5.73,11.87-5.73,9.8,0,16.35,6.62,16.49,17.52C338.88,58.81,331.91,65.64,322.39,65.64Zm9-17.94c0-6.76-4-11.18-10.21-11.18s-10.28,4.42-10.28,11.18,4.07,11.25,10.28,11.25S331.36,54.46,331.36,47.7Z"
              fill="#080819"
              className="svg-fill"
            />
            <path
              d="M375.79,50.67H349.36c.55,6,4.9,8.62,9.8,8.62a9.63,9.63,0,0,0,9.18-5.59l6.14,2.48c-2.62,6-8.42,9.45-15.38,9.45-9.94,0-16.7-7-16.7-17.8,0-10.56,6.62-17.94,16.83-17.94,10,0,16.56,7,16.56,17.87Zm-26.35-5.24h18.9c-.34-6.28-4-9.38-9.24-9.38S350.12,39.35,349.43,45.42Z"
              fill="#080819"
              className="svg-fill"
            />
            <path
              d="M412.69,43.91V64.74h-7.31V45.35c0-7.45-4.62-8.83-7.8-8.83-4.34,0-8.76,2.76-8.76,9.25v19h-7.31V30.87h6.83l.27,3.93c1.93-3,5.86-4.9,10.49-4.9C407.31,29.9,412.69,34.59,412.69,43.91Z"
              fill="#080819"
              className="svg-fill"
            />
            <path
              d="M429,26v4.83h8v6.07h-8v27.8h-7.38V36.94h-4.9V30.87h4.9V26c0-8.76,4.9-12.35,11.66-12.35a17.54,17.54,0,0,1,3.86.41v6.49C430.69,19.42,429,22,429,26Z"
              fill="#080819"
              className="svg-fill"
            />
            <path
              d="M442.83,19a4.86,4.86,0,1,1,4.9,4.83A4.83,4.83,0,0,1,442.83,19Zm8.55,11.87V64.74h-7.31V30.87Z"
              fill="#080819"
              className="svg-fill"
            />
            <path
              d="M490.43,43.91V64.74h-7.31V45.35c0-7.45-4.62-8.83-7.8-8.83-4.34,0-8.76,2.76-8.76,9.25v19h-7.31V30.87h6.83l.27,3.93c1.93-3,5.86-4.9,10.49-4.9C485.05,29.9,490.43,34.59,490.43,43.91Z"
              fill="#080819"
              className="svg-fill"
            />
            <path
              d="M245.31,34.51a15.14,15.14,0,0,0-1.74-1.5l-.23-.16-.39-.27-.43-.27-.2-.13-.54-.3-.11-.06a15,15,0,0,0-7-1.72h0a15.05,15.05,0,0,1-15-15.07h0a15,15,0,1,0-15,15h0a15.05,15.05,0,0,1,15,15.07h0a15.05,15.05,0,0,1-15.07,15h0a15,15,0,0,1-15-15,15,15,0,1,0-15,15,15,15,0,0,1,15,15,15.05,15.05,0,0,0,30.11,0,15,15,0,0,1,15-15,15,15,0,0,0,7.63-2.08h0l.59-.37,0,0,.54-.38.08-.05.47-.36.13-.1.43-.37.16-.13.53-.51,0,0h0a15.09,15.09,0,0,0,1.76-2.11l.33-.5a15,15,0,0,0-2.08-18.64Z"
              fill="#504cff"
            />
          </g>
        </g>
      </svg>
    </OpenFinLogoLink>
  </LogoWrapper>
)
