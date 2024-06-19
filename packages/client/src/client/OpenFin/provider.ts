import OpenFin from "@openfin/core"

import { ENVIRONMENT } from "@/client/constants"

type ExternalClientMap = Map<
  OpenFin.ApplicationIdentity["uuid"],
  OpenFin.InteropClient
>

export interface ExternalContext extends OpenFin.Context {
  _clientInfo?: {
    uuid: string
  }
}

function interopOverride(
  InteropBroker: OpenFin.Constructor<OpenFin.InteropBroker>,
): OpenFin.InteropBroker {
  class Override extends InteropBroker {
    private limitCheckerUuid: string
    private limitCheckerClients: ExternalClientMap

    constructor() {
      super()
      this.limitCheckerUuid = `reactive-trader-limit-checker-${ENVIRONMENT}`
      this.limitCheckerClients = new Map()
      this.initializeBrokers(
        this.limitCheckerUuid,
        this.limitCheckerClients,
      ).catch((error) => console.error(error))
    }

    private async initializeBrokers(
      externalUuid: string,
      externalClients: ExternalClientMap,
    ): Promise<void> {
      const platform: OpenFin.Platform = fin.Platform.wrapSync({
        uuid: externalUuid,
      })

      // If an external platform is already running when the broker platform (i.e. RT) is launched
      if (await platform.Application.isRunning()) {
        await this.setupContextGroups(externalUuid, externalClients)
      }

      // If an external platform has just been started when the broker platform (i.e. RT) is already running
      await platform.on("platform-api-ready", async () => {
        await this.setupContextGroups(externalUuid, externalClients)
      })

      await platform.Application.once("closed", () => {
        externalClients.clear()
      })
    }

    private async setupContextGroups(
      externalUuid: string,
      externalClients: ExternalClientMap,
    ) {
      // Create a InteropClient instance by connecting to the external broker
      const externalInteropClient = fin.Interop.connectSync(externalUuid, {})
      const externalContextGroup =
        await externalInteropClient.getContextGroups()

      // Create a InteropClient instance by connecting to the current platform broker
      const brokerInteropClient = fin.Interop.connectSync(fin.me.uuid, {})
      const brokerContextGroups = await brokerInteropClient.getContextGroups()

      // Check which external context groups is shared with the current platform context group and
      // create a colorClient
      const externalContextGroupPromises = externalContextGroup.map(
        async (externalContextGroupInfo) => {
          // check to see if a Platform Client's context group has any of the channels as a externalContextGroup
          const hasPlatformContextGroup: boolean = brokerContextGroups.some(
            ({ id }) => id === externalContextGroupInfo.id,
          )

          if (hasPlatformContextGroup) {
            // Create a colorClient to connect to the external broker
            const colorClient = fin.Interop.connectSync(externalUuid, {})
            // Adds client to the context group
            await colorClient.joinContextGroup(externalContextGroupInfo.id)

            /**
             * @function contextHandler
             * @param context object passed from the setContext method.
             * @remarks
             * If the newContext variable has a _clientInfo object with a uuid return the context as is
             * because it is initially set on the platformInteropClient's broker.
             * otherwise copy the context attributes and values to a new object containing
             * a _clientInfo attribute with the uuid of the connected externalBroker.
             */
            const contextHandler = async (
              context: ExternalContext,
            ): Promise<void> => {
              await brokerInteropClient.joinContextGroup(
                externalContextGroupInfo.id,
              )
              const newContext = context._clientInfo?.uuid
                ? context
                : { ...context, _clientInfo: { uuid: externalUuid } }
              await brokerInteropClient.setContext(newContext)
            }

            await colorClient.addContextHandler(contextHandler)
            // return the connected context group and corresponded color client.
            return externalClients.set(externalContextGroupInfo.id, colorClient)
          }

          return externalClients
        },
      )
      try {
        await Promise.all(externalContextGroupPromises)
      } catch (error) {
        throw new Error(
          `Not able to setup handlers for external brokers: ${error}`,
        )
      }
    }

    /**
     * @method setContextOnExternalClient
     * @param context context object passed in from the @setContext method.
     * @param clientIdentity clientIdentity object passed in from the @setContext method.
     * @remarks if the externalClientsMap has previously derived contextGroup get the corresponding colorClient and set the context on the matching colorClient.
     */

    private async setContextOnExternalClient(
      context: ExternalContext,
      clientIdentity: OpenFin.ClientIdentity,
    ) {
      // use accessor syntax for this.getClientState as it is not a public inherited method from InteropBroker
      // eslint-disable-next-line @typescript-eslint/dot-notation
      const state = this["getClientState"](clientIdentity)
      const ctxGroupId = state.contextGroupId as string
      if (this.limitCheckerClients.has(ctxGroupId)) {
        const colorClient = this.limitCheckerClients.get(
          ctxGroupId,
        ) as OpenFin.InteropClient
        await colorClient.setContext(context)
      }
    }

    /**
     * @override @method setContext
     * @param payload object that is passed in when set context is called from an OpenFin entity using the interop api.
     * @param clientIdentity object containing the clientIdentity of the sender.
     * @example // please refer to the working examples code panel in this projects interface.
     */
    async setContext(
      payload: { context: ExternalContext },
      clientIdentity: OpenFin.ClientIdentity,
    ): Promise<void> {
      // create a new context object for interop setContext calls from the interop object within the Platform Client's windows or views.
      const { context } = payload
      if (context._clientInfo) {
        const {
          _clientInfo: { uuid },
        } = context
        // set context on external broker
        if (uuid !== fin.me.uuid) {
          const newContext = context
          delete newContext._clientInfo
          super.setContext({ ...payload, context: newContext }, clientIdentity)
        }
      } else {
        // If there is no _clientInfo object present on the context object we treat it as a brand new object and set it on both the platform and external clients.
        const newContext = { ...context, _clientInfo: { uuid: fin.me.uuid } }
        await this.setContextOnExternalClient(newContext, clientIdentity)
        super.setContext(payload, clientIdentity)
      }
    }

    async handleFiredIntent(intent: OpenFin.Intent) {
      console.debug("handleFiredIntent: ", intent)

      // TODO (5465) - this should fire up RA (by uuid/name) .. so how does RT boot up RA?
      //            -> usually by Application.startFromManifest or Platform.launchContentManifest
      const platform = fin.Platform.getCurrentSync()
      super.setIntentTarget(intent, {
        uuid: platform.identity.uuid,
        name: "FX Blotter",
      })
    }
  }

  return new Override()
}

function init() {
  fin.Platform.init({
    overrideCallback: async (Provider) => {
      // TODO (5465) - for general Platform overrides .. remove if not necessary
      class Override extends Provider {}
      return new Override()
    },
    interopOverride,
  })
}

window.addEventListener("DOMContentLoaded", async () => {
  init()
})
