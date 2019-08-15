import { SymphonyClient } from "./symphony";
import { SYMPHONY_APP_ID, createTileMessage, FX_ENTITY_TYPE } from "./constants";
import { waitForObject } from "rt-util";
export const initiateSymphony = async (env?: string) => {

  const SYMPHONY = await waitForObject<SymphonyClient>('SYMPHONY')

  const host = !env ? 'https://localhost:3000' : `https://web-${env}.adaptivecluster.com`

  const MENU_CONTROLLER = 'menu:controller'
  const menuController = SYMPHONY.services.register(MENU_CONTROLLER);

  const ENTITY_CONTROLLER = 'entity:controller'
  const entityController = SYMPHONY.services.register(ENTITY_CONTROLLER);
  const VERSION = 0.2

  const helloResult = await SYMPHONY.remote.hello()
  console.info('Adaptive: Symphony has been initiated', helloResult)

  const registerResult = await SYMPHONY.application
    .register(
      SYMPHONY_APP_ID,
      ['modules', 'applications-nav', 'entity'],
      [ENTITY_CONTROLLER, MENU_CONTROLLER]
    )

  console.info('Adaptive: Symphony has been registered', registerResult)
  const modulesService = SYMPHONY.services.subscribe('modules');
  const navService = SYMPHONY.services.subscribe('applications-nav');
  const entityService = SYMPHONY.services.subscribe("entity");

  entityService.registerRenderer(
    FX_ENTITY_TYPE,
    {},
    ENTITY_CONTROLLER
  );

  const createTemplate = (symbol: string) => createTileMessage(host, symbol)

  entityController.implement({
    render: (type, data) => {
      if (type === FX_ENTITY_TYPE && data.version >= VERSION) {
        return {
          template: createTemplate(data.symbol),
          data,
        };
      }
    },
  })

  const createNavItem = (id: string, title:string)=> navService.add(id, { title, icon: `${host}/symphony/logo.png` }, MENU_CONTROLLER);

  const PRIMARY_NAV_ID = 'rt-nav'
  createNavItem(PRIMARY_NAV_ID, 'Reactive Trader')

  const BLOTTER_ID = 'rt-blotter-nav'
  createNavItem(BLOTTER_ID, 'Blotter')

  const ANALYTICS_NAV_ID = 'rt-analytics-nav'
  createNavItem(ANALYTICS_NAV_ID, 'Analytics')

  const TILES_NAV_ID = 'rt-tiles-nav'
  createNavItem(TILES_NAV_ID, 'Prices')

  const symphonyMap: { [key: string]: string } = {
    'rt-blotter-nav': `${host}/blotter`,
    'rt-analytics-nav': `${host}/analytics`,
    'rt-tiles-nav': `${host}/tiles`,
    'rt-nav': `${host}`
  }

  menuController.implement({
    select(id) {
      navService.focus(id)

      modulesService.show(
        SYMPHONY_APP_ID + id,
        'Reactive Trader',
        MENU_CONTROLLER,
        `${symphonyMap[id]}/?symphony=true&waitFor=SYMPHONY`,
        {
          canFloat: true
        }
      )

      modulesService.focus(SYMPHONY_APP_ID)
    }
  })

}
