import { checkCompatibility } from "@/generated/TradingGateway"
import { lastValueFrom } from "rxjs"
import { map, tap } from "rxjs/operators"

export interface Compatibility {
  isCompatible: boolean
  incompatibilityReasons: string[]
}

export async function checkTradingGatewayCompatibility(): Promise<Compatibility> {
  return lastValueFrom(
    checkCompatibility().pipe(
      tap((response) => {
        const log =
          response.type === "incompatible" ? console.error : console.log
        log(`Trading Gateway Api is ${response.type}`)
      }),
      map((response) => {
        if (response.type === "incompatible") {
          const incompatibilityReasons = response.payload.methods.map(
            ({
              method: { methodName, serviceName, methodRouteKey },
              reason: { type },
            }) => `${type} ${serviceName} ${methodName} ${methodRouteKey}`,
          )
          return {
            isCompatible: false,
            incompatibilityReasons,
          }
        }
        return {
          isCompatible: true,
          incompatibilityReasons: [] as string[],
        }
      }),
    ),
  )
}
