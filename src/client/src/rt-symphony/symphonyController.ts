import { SymphonyClient } from "./symphony";
import { waitForObject } from "rt-util";

const RT_MODULE_ID = 'reactiveTrader'

export const initiateSymphony = async (env?: string) => {

  const SYMPHONY = await waitForObject<SymphonyClient>('SYMPHONY')

  const host = !env ? 'https://localhost:3000' : `https://web-${env}.adaptivecluster.com`


  const MENU_CONTROLLER = 'menu:controller'
  const menuController = SYMPHONY.services.register(MENU_CONTROLLER);


  const ENTITY_CONTROLLER = 'adaptive:controller'
  const entityController = SYMPHONY.services.register(ENTITY_CONTROLLER);
  const VERSION = 0.2

  const helloResult = await SYMPHONY.remote.hello()
  console.info('Adaptive: Symphony has been initiated', helloResult)

  const registerResult = await SYMPHONY.application
    .register(
      RT_MODULE_ID,
      ['modules', 'applications-nav', 'entity'],
      [ENTITY_CONTROLLER, MENU_CONTROLLER]
    )

  console.info('Adaptive: Symphony has been registered', registerResult)
  const modulesService = SYMPHONY.services.subscribe('modules');
  const navService = SYMPHONY.services.subscribe('applications-nav');
  const entityService = SYMPHONY.services.subscribe("entity");

  entityService.registerRenderer(
    "com.adaptive.fx",
    {},
    ENTITY_CONTROLLER
  );

  const createTemplate = (symbol: string) => `<entity><iframe style="height: 190px;" src="https://web-demo.adaptivecluster.com/spot/${symbol}?tileView=Normal"/></entity>`

  entityController.implement({
    render: (type, data) => {
      if (type === "com.adaptive.fx" && data.version >= VERSION) {
        return {
          template: createTemplate(data.symbol),
          data,
        };
      }
    },
  })

  const PRIMARY_NAV_ID = 'rt-nav'
  navService.add(PRIMARY_NAV_ID, { title: 'Reactive Trader', icon: `${host}/symphony/logo.png` }, MENU_CONTROLLER);

  menuController.implement({
    select(id) {
      console.info('Adaptive: Selected' + id)
      if (id === PRIMARY_NAV_ID) {
        navService.focus(PRIMARY_NAV_ID)
      }

      modulesService.show(
        RT_MODULE_ID,
        'Reactive Trader',
        MENU_CONTROLLER,
        `${host}/?symphony=true&waitFor=SYMPHONY`,
        {
          // You must specify canFloat in the module options so that the module can be pinned
          canFloat: true
        }
      )

      modulesService.focus(RT_MODULE_ID)
    }
  })

}
