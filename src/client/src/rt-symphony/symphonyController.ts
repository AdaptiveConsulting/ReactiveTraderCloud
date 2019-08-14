import { SymphonyClient } from "./symphony";


const RT_MODULE_ID = 'reactiveTrader'
export const initiateSymphony = async (SYMPHONY: SymphonyClient, env?: string) => {

  const enviroment = !env ? 'https://localhost:3000' : `https://web-${env}.adaptivecluster.com`


  const MENU_CONTROLLER = 'menu:controller'
  const menuController = SYMPHONY.services.register(MENU_CONTROLLER);


  const ENTITY_CONTROLLER = 'adaptive:controller'
  const entityController = SYMPHONY.services.register(ENTITY_CONTROLLER);
  const VERSION = 0.2

  const helloResult = await SYMPHONY.remote.hello()
  console.info('Symphony has been initiated', helloResult)

  const registerResult = await SYMPHONY.application
    .register(
      RT_MODULE_ID,
      ['modules', 'applications-nav', 'entity'],
      [ENTITY_CONTROLLER, MENU_CONTROLLER]
    )

  console.info('Symphony has been registered', registerResult)
  const modulesService = SYMPHONY.services.subscribe('modules');

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

  const navService = SYMPHONY.services.subscribe('applications-nav');

  const PRIMARY_NAV_ID = 'rt-nav'
  navService.add(PRIMARY_NAV_ID, { title: 'Reactive Trader', icon: `${enviroment}/symphony/logo.png` }, ENTITY_CONTROLLER);

  menuController.implement({
    select(id) {
      if (id === PRIMARY_NAV_ID) {
        navService.focus(PRIMARY_NAV_ID)
      }

      modulesService.show(
        RT_MODULE_ID,
        'Reactive Trader',
        ENTITY_CONTROLLER,
        `${enviroment}/`,
        {
          // You must specify canFloat in the module options so that the module can be pinned
          canFloat: true
        }
      )

      modulesService.focus(RT_MODULE_ID)
    }
  })

}
