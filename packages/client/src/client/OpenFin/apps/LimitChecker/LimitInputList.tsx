import styled from "styled-components"

import { Region } from "@/client/components/layout/Region"
import { TabBar } from "@/client/components/TabBar"
import { useCurrencyPairs } from "@/services/currencyPairs"

import { LimitInput } from "./LimitInput"

const LimitInputRegion = styled(Region)`
  flex: 1;
`

export const LimitInputs = () => {
  const currencyPairs = useCurrencyPairs()

  return (
    <LimitInputRegion
      Header={<TabBar items={["Trade limits"]} activeItem="Trade limits" />}
      Body={Object.values(currencyPairs).map((currencyPair) => (
        <LimitInput currencyPair={currencyPair} key={currencyPair.symbol} />
      ))}
      padding="lg"
    />
  )
}
