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
import 'ress'

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
import 'typeface-lato'
import 'typeface-montserrat'

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

import { injectGlobal } from './emotion'

export default injectGlobal`
  :root, body {
    font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 16px;
    line-height: 1rem;
    text-rendering: geometricPrecision;   


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
`
