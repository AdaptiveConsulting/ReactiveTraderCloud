import merge from 'lodash.merge'
import { OpenFinApplicationConfiguration } from '../types'
import base from './base'

/* eslint-disable @typescript-eslint/camelcase */
export default (env: string): OpenFinApplicationConfiguration => {
  const baseConfig = base(env)
  const name = `Reactive Ecosystem Launcher${env !== 'demo' ? ` (${env.toUpperCase()})` : ''}`

  return merge(baseConfig, {
    startup_app: {
      name,
      url: `https://web-${env}.adaptivecluster.com/launcher`,
      uuid: `reactive-launcher-${env}`,
      defaultWidth: 650,
      defaultHeight: 52,
      defaultTop: 160,
      defaultLeft: 30,
      permissions: {
        System: {
          launchExternalProcess: true,
        },
      },
      saveWindowState: false,
      resizable: false,
      shadow: true,
      backgroundColor: '#444C5F',
      alwaysOnTop: true,
      icon: `https://web-${env}.adaptivecluster.com/static/media/icon.ico`,
      applicationIcon: `https://web-${env}.adaptivecluster.com/static/media/adaptive-mark-large.png`,
      contextMenu: true,
      accelerator: {
        devtools: true,
        reload: true,
        reloadIgnoreCache: true,
        zoom: true,
      },
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
      {
        src: `https://web-${env}.adaptivecluster.com/plugin/LimitChecker.zip`,
        alias: 'LimitChecker',
        version: '1.6.0',
        target: 'LimitChecker.application',
      },
    ],
  })
}
