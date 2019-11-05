import { SymphonyClient } from './symphony'
import {
  createPlaceholderMessage,
  createTileMessage,
  FX_ENTITY_TYPE,
  pausedPlaceholderMessage,
  SYMPHONY_APP_ID,
} from './constants'
import { waitForObject } from 'rt-util'
import uuid from 'uuid'

export const initiateSymphony = async (env?: string) => {
  const SYMPHONY = await waitForObject<SymphonyClient>('SYMPHONY')

  const host = !env ? 'https://localhost:3000' : `https://web-${env}.adaptivecluster.com`

  const MENU_CONTROLLER = 'menu:controller'
  const menuController = SYMPHONY.services.register(MENU_CONTROLLER)

  const ENTITY_CONTROLLER = 'entity:controller'
  const entityController = SYMPHONY.services.register(ENTITY_CONTROLLER)
  const VERSION = 0.2

  const initiatationResult = await SYMPHONY.remote.hello()
  console.info('Adaptive: Symphony has been initiated', initiatationResult)

  const registerResult = await SYMPHONY.application.register(
    SYMPHONY_APP_ID,
    ['modules', 'applications-nav', 'entity'],
    [ENTITY_CONTROLLER, MENU_CONTROLLER],
  )

  console.info('Adaptive: Symphony has been registered', registerResult)

  const modulesService = SYMPHONY.services.subscribe('modules')
  const navService = SYMPHONY.services.subscribe('applications-nav')
  const entityService = SYMPHONY.services.subscribe('entity')

  entityService.registerRenderer(FX_ENTITY_TYPE, {}, ENTITY_CONTROLLER)

  const createTemplate = (symbol: string) => createTileMessage(host, symbol)

  const map: { [key: string]: string } = {}

  entityController.implement({
    pause(id) {
      entityService.update(id, pausedPlaceholderMessage, {
        symbol: map[id],
        version: VERSION,
        type: FX_ENTITY_TYPE,
      })
    },
    resume(id) {
      entityService.update(id, createTemplate(map[id]), {
        symbol: map[id],
        version: VERSION,
        type: FX_ENTITY_TYPE,
      })
    },

    render: (type, data) => {
      const isValidFxData = type === FX_ENTITY_TYPE && data.version >= VERSION
      const entityInstanceId = uuid.v4()
      map[entityInstanceId] = data.symbol
      return {
        template: isValidFxData ? createTemplate(data.symbol) : createPlaceholderMessage(''),
        data,
        entityInstanceId,
      }
    },
  })

  const createNavItem = (id: string, title: string) =>
    navService.add(
      id,
      {
        title,
        icon: `${host}/symphony/logo.png`,
      },
      MENU_CONTROLLER,
    )

  const PRIMARY_NAV_ID = 'rt-nav'
  createNavItem(PRIMARY_NAV_ID, 'Reactive Trader')

  const BLOTTER_ID = 'rt-blotter-nav'
  createNavItem(BLOTTER_ID, 'Blotter')

  const ANALYTICS_NAV_ID = 'rt-analytics-nav'
  createNavItem(ANALYTICS_NAV_ID, 'Analytics')

  const TILES_NAV_ID = 'rt-tiles-nav'
  createNavItem(TILES_NAV_ID, 'Prices')

  const symphonyMap: { [key: string]: string } = {
    [BLOTTER_ID]: `${host}/blotter`,
    [ANALYTICS_NAV_ID]: `${host}/analytics`,
    [TILES_NAV_ID]: `${host}/tiles`,
    [PRIMARY_NAV_ID]: `${host}`,
  }

  menuController.implement({
    select(id) {
      console.log('adaptive' + id)
      console.log(symphonyMap)

      navService.focus(id)

      modulesService.show(
        id,
        'Reactive Trader',
        MENU_CONTROLLER,
        `${symphonyMap[id]}/?symphony=true&waitFor=SYMPHONY`,
        {
          canFloat: true,
        },
      )

      modulesService.focus(SYMPHONY_APP_ID)
    },
  })
}
