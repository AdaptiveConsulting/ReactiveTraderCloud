/**
 * Resetting CSS
 *
 * We need to establish a reasonable baseline to work from.
 * For app development this typically means removing
 * many of the default styles.
 *
 * We must also set some better defaults such as:
 * box-sizing: border-box;
 *
 * Being a routine exercise we can rely on an external
 * package to accomplish the task.
 *
 * Here we use "ress", a modern CSS reset based off normalize
 */
import "ress"

/**
 * Adding Typefaces
 *
 * There are various ways to include typefaces in our apps.
 * Some may choose to write them manually, use Google's CDN,
 * or include them as a package.
 *
 * We are sourcing our typefaces from npm. We get the optimal
 * benefit between maintainence, functional guarantees, and
 * trade offs in initial load times.
 */
/**
 * Establishing a Baseline
 *
 * We must establish our application defaults at a global level
 * — setting up our default typeface and establishing the
 * metrics we'll build on.
 *
 * User interface design guidelines specify 16px as a minimal
 * font size for readable text — for this reason it is the
 * default value in browsers. However, we re-assert it here
 * for the sake of clarity.
 *
 * We establish the line-height as an absolute value — in this
 * case 1rem, or 16px. Avoiding relative units and making
 * line-height explicit in our styles will allow us to
 * achieve a consistent vertical rhythm.
 */
import { createGlobalStyle, css, withTheme } from "styled-components"

import { Theme } from "./themes"

const getColor = (props: { theme: Theme }) =>
  props.theme.color["Colors/Background/bg-tertiary"]

const globalScrollbarStyle = css`
  body,
  #root {
    overflow: hidden;
  }

  body ::-webkit-scrollbar {
    width: 14px;
    height: 14px;
  }

  body ::-webkit-scrollbar-thumb {
    background-color: ${getColor};
  }

  body {
    scrollbar-color: ${getColor} transparent;
  }

  body ::-webkit-scrollbar-thumb {
    border-radius: 22px;
    background-color: rgba(212, 221, 232, 0.4);

    height: 16px;
    border: 4.5px solid rgba(0, 0, 0, 0);
    background-clip: padding-box;
  }

  body ::-webkit-scrollbar-corner {
    background-color: rgba(0, 0, 0, 0);
  }

  body .ag-body ::-webkit-scrollbar {
    width: 14px;
    height: 14px;
  }
`

// background-color needs to be hardcoded to dark theme for PWA otherwise we end up with a
// white status bar with white text when switching to light theme
export default withTheme(createGlobalStyle`
  :root, body {
    font-family: 'Work Sans', 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 16px;
    line-height: 1rem;
    text-rendering: geometricPrecision;

    color: ${({ theme }) => theme.color["Colors/Text/text-primary (900)"]};

    .tearOff {
      box-shadow: 1px 4px 10px 0px rgba(0,0,0,0.3);
      outline: 1px dashed #49608C;
    }

    @media all and (max-width: 400px) {
      font-size: 14px;
    }

    @media all and (max-width: 320px) {
      font-size: 12px;
    }
  }
  
  body, #root {
    height: 100vh;
    max-width: 100vw;
  }

  button {
    -webkit-appearance: none;
    border-width: 0;
    border-color: transparent;
  }
  
  button:focus {
    outline: none;
  }
  
  /* Undo ress.css overflow-y rule */
  html {
    overflow-y: initial;
  } 

  
  ${globalScrollbarStyle}
`)
