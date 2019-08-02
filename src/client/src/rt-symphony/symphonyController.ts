import { SymphonyClient } from "./symphony";

const ADAPTIVE_CONTROLLER = 'adaptive:controller'

const RT_MODULE_ID = 'reactiveTrader'
export const initiateSymphony = async (SYMPHONY: SymphonyClient, env?: string) => {
  
  const enviroment = !env ? 'https://localhost:3000' : `https://web-${env}.adaptivecluster.com`
  
  const adaptiveController = SYMPHONY.services.register(ADAPTIVE_CONTROLLER);

  const helloResult = await SYMPHONY.remote.hello()
  console.info('Symphony has been initiated', helloResult)

  const registerResult = await SYMPHONY.application
    .register(
      RT_MODULE_ID,
      ['modules', 'applications-nav'],
      [ADAPTIVE_CONTROLLER]
    )

  console.info('Symphony has been registered', registerResult)

  const modulesService = SYMPHONY.services.subscribe('modules');
  const navService = SYMPHONY.services.subscribe('applications-nav');
  const PRIMARY_NAV_ID = 'rt-nav'
  navService.add(PRIMARY_NAV_ID, {title: 'Reactive Trader', icon:`${enviroment}/symphony/logo.png`}, ADAPTIVE_CONTROLLER);

  adaptiveController.implement({

    select(id) {
      if (id === PRIMARY_NAV_ID) {
        navService.focus(PRIMARY_NAV_ID)
      }

      modulesService.show(
        RT_MODULE_ID,
        'Reactive Trader',
        ADAPTIVE_CONTROLLER,
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
