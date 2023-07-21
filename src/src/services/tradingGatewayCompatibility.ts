import { checkCompatibility } from "@/generated/TradingGateway"

export function checkTradingGatewayCompatibility() {
  checkCompatibility().subscribe((response) => {
    const log = response.type === "incompatible" ? console.error : console.log
    log(`Trading Gateway Api is ${response.type}`)
    if (response.type === "incompatible") {
      response.payload.methods.map(
        ({
          method: { methodName, serviceName, methodRouteKey },
          reason: { type },
        }) => log(`${type} ${serviceName} ${methodName} ${methodRouteKey}`),
      )
    }
  })
}
