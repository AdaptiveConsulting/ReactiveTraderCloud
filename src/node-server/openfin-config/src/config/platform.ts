/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default (env: string) => {
  //const baseConfig = base(env)
  const appId = 'reactive-trader-cloud-platform-demo'
  const name = 'Reactive Trader Cloud (Platform)'
  const appUrl = `https://web-${env}.adaptivecluster.com/`

  const config = {
    devtools_port: 9090,
    splashScreenImage: `${appUrl}static/media/splash-screen.jpg`,
    runtime: {
      arguments: '--v=1 --inspect',
      version: '15.80.48.13',
    },
    shortcut: {
      company: 'Adaptive Consulting',
      icon: `${appUrl}static/media/icon.ico`,
      name,
    },
    appAssets: [
      {
        src: `${appUrl}plugin/add-in.zip`,
        alias: 'excel-api-addin',
        version: '2.0.0',
        forceDownload: true,
      },
    ],
    platform: {
      uuid: appId,
      applicationIcon: `${appUrl}static/media/icon.ico`,
      url: `${appUrl}`,
      defaultWindowOptions: {
        contextMenu: true,
        frame: false,
        url: `${appUrl}openfin-window-frame`,
      },
      services: [
        {
          name: 'fdc3',
          manifestUrl: 'https://cdn.openfin.co/services/openfin/fdc3/0.2.0/app.json',
        },
        {
          name: 'notifications',
          manifestUrl: 'https://cdn.openfin.co/services/openfin/notifications/0.11.1/app.json',
        },
      ],
    },
    snapshot: {
      windows: [
        {
          applicationIcon: `${appUrl}static/media/adaptive-mark-large.png`,
          autoShow: true,
          defaultWidth: 1280,
          defaultHeight: 900,
          minWidth: 800,
          minHeight: 600,
          defaultCentered: true,
          resizable: true,
          maximizable: true,
          saveWindowState: true,
          frame: false,
          shadow: true,
          _comment:
            'Openfin Excel API preloaded below + added in appAssets (not included in standard OpenFin package)',
          preload: [
            {
              url: `${appUrl}plugin/service-loader.js`,
            },
            {
              url: `${appUrl}plugin/fin.desktop.Excel.js`,
            },
          ],
          contextMenu: true,
          accelerator: {
            devtools: true,
            reload: true,
            reloadIgnoringCache: true,
            zoom: true,
          },
          url: `${appUrl}`,
          layout: {
            settings: {
              blockedPopoutsThrowError: false,
              closePopoutsOnUnload: true,
              constrainDragToContainer: false,
              hasHeaders: true,
              popoutWholeStack: false,
              reorderEnabled: true,
              reorderOnTabMenuClick: true,
              responsiveMode: 'always',
              selectionEnabled: true,
              showCloseIcon: false,
              showMaximiseIcon: false,
              showPopoutIcon: false,
              tabControlOffset: 10,
              tabOverlapAllowance: 0,
            },
            content: [
              {
                type: 'row',
                id: 'mainRow',
                isClosable: true,
                reorderEnabled: true,
                contextMenu: true,
                title: '',
                content: [
                  {
                    type: 'column',
                    isClosable: true,
                    reorderEnabled: true,
                    title: '',
                    width: 80,
                    content: [
                      {
                        type: 'stack',
                        width: 50,
                        height: 50,
                        isClosable: true,
                        reorderEnabled: true,
                        title: '',
                        activeItemIndex: 0,
                        content: [
                          {
                            type: 'component',
                            componentName: 'view',
                            contextMenu: true,
                            componentState: {
                              url: `${appUrl}tiles`,
                              name: 'Tiles',
                            },
                            isClosable: true,
                            reorderEnabled: true,
                            title: 'Spot Tiles',
                          },
                        ],
                      },
                      {
                        type: 'stack',
                        header: {},
                        isClosable: true,
                        reorderEnabled: true,
                        title: '',
                        activeItemIndex: 0,
                        height: 50,
                        content: [
                          {
                            type: 'component',
                            componentName: 'view',
                            componentState: {
                              url: `${appUrl}blotter`,
                              name: 'Blotter',
                            },
                            isClosable: true,
                            reorderEnabled: true,
                            title: 'Blotter',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'stack',
                    width: 30,
                    height: 100,
                    isClosable: true,
                    reorderEnabled: true,
                    title: '',
                    activeItemIndex: 0,
                    content: [
                      {
                        type: 'component',
                        componentName: 'view',
                        componentState: {
                          url: `${appUrl}analytics`,
                          name: 'Analytics',
                        },
                        isClosable: true,
                        reorderEnabled: true,
                        title: 'Analytics',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  }

  return config
}
