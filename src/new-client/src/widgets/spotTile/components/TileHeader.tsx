import { useCallback } from "react"
import { usePlatform, platformHasFeature } from "@/platform"

import styled from "styled-components"
import { TileHeader as Header, TileSymbol, DeliveryDate } from "./styled"
import { CurrencyPair } from "@/services/currencyPairs"
interface Props {
  ccyPair: CurrencyPair
  date: string
  displayCurrencyChart?: () => void
}

export const ActionButton = styled("button")`
  opacity: 0;
  transition: opacity 0.2s;
  margin-left: 8px;
  padding-left: 8px;
  border-left: 1px solid white;
`

const TileHeader: React.FC<Props> = ({
  ccyPair,
  date,
  displayCurrencyChart,
}) => {
  const platform = usePlatform()

  const share = useCallback(() => {
    if (platformHasFeature(platform, "share")) {
      platform.share(ccyPair.symbol)
    }
  }, [ccyPair.symbol, platform])

  const baseTerm = `${ccyPair.base}/${ccyPair.terms}`
  return (
    <Header>
      <TileSymbol data-qa="tile-header__tile-symbol">{baseTerm}</TileSymbol>
      {platformHasFeature(platform, "share") && (
        <ActionButton data-qa="tile-header__share-button" onClick={share}>
          <i className="fas fa-share" />
        </ActionButton>
      )}
      <DeliveryDate data-qa="tile-header__delivery-date">{date}</DeliveryDate>
    </Header>
  )
}
//@ts-ignore
export default React.memo(TileHeader)
