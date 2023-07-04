import OpenFin from "@openfin/core"
function init() {
  fin.Platform.init({
    overrideCallback: async (Provider) => {
      // TODO 4823 - for general Platform overrides .. remove if not necessary
      class Override extends Provider {}
      return new Override()
    },
    interopOverride: async (InteropBroker) => {
      class Override extends InteropBroker {
        async handleFiredIntent(intent: OpenFin.Intent) {
          console.debug("handleFiredIntent: ", intent)

          // TODO 4823 - links up with temp code in CoreFxTrades
          //             this should fire up RA (by uuid/name) .. so how does RT boot up RA?
          //             -> usually by Application.startFromManifest or Platform.launchContentManifest
          const platform = fin.Platform.getCurrentSync()
          super.setIntentTarget(intent, {
            uuid: platform.identity.uuid,
            name: "FX Blotter",
          })
        }
      }

      return new Override()
    },
  })
}

window.addEventListener("DOMContentLoaded", async () => {
  init()
})
