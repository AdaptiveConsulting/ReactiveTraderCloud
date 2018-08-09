import { injectGlobal } from 'emotion'
import animationSpeed from 'rt-themes/baseTheme/animationSpeed'

const createTransitions = () => {
  Object.values(animationSpeed()).forEach(speed => {
    // tslint:disable-next-line: no-unused-expression
    injectGlobal`
      .fade${speed}-enter {
        opacity: 0.01;
      }
  
      .fade${speed}-enter.fade${speed}-enter-active {
        opacity: 1;
        transition: opacity ${speed}ms ease-in;
      }
  
      .fade${speed}-leave {
        opacity: 1;
      }
  
      .fade${speed}-leave.fade${speed}-leave-active {
        opacity: 0.01;
        transition: opacity ${speed}ms ease-in;
      }
    `
  })
}

export default createTransitions
