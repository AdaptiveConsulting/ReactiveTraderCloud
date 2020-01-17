import merge from 'lodash.merge'
import { OpenFinApplicationConfiguration } from '../types'
import base from './base'

/* eslint-disable @typescript-eslint/camelcase */
export default (env: string): OpenFinApplicationConfiguration => {
  const baseConfig = base(env)
  const name = `Reactive Trader Cloud${env !== 'demo' ? ` (${env.toUpperCase()})` : ''}`

  return merge(baseConfig, {
    devtools_port: 9090,
    splashScreenImage: `https://web-${env}.adaptivecluster.com/static/media/splash-screen.jpg`,
    startup_app: {
      name,
      url: `https://web-${env}.adaptivecluster.com/`,
      uuid: `reactive-trader-cloud-web-${env}`,
      applicationIcon: `https://web-${env}.adaptivecluster.com/static/media/adaptive-mark-large.png`,
      defaultWidth: 1280,
      defaultHeight: 900,
      minWidth: 800,
      minHeight: 600,
      resizable: true,
      maximizable: true,
    },
    shortcut: {
      company: 'Adaptive Consulting',
      icon: `https://web-${env}.adaptivecluster.com/static/media/icon.ico`,
      name,
    },
    appAssets: [
      {
        src: `https://web-${env}.adaptivecluster.com/plugin/add-in.zip`,
        alias: 'excel-api-addin',
        version: '2.0.0',
      },
    ],
  })
}
