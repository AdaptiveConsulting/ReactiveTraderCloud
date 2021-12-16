import { Direction } from "@/services/trades"
import { FC } from "react"
import styled from "styled-components"
import {
  PriceButtonInner as PriceButton,
  PriceButtonProps,
} from "@/App/LiveRates/Tile/PriceButton"

const values: PriceButtonProps = {
  currencyPair: {
    symbol: "EURUSD",
    ratePrecision: 5,
    pipsPosition: 4,
    base: "EUR",
    terms: "USD",
    defaultNotional: 1000000,
  },
  direction: Direction.Buy,
  disabled: false,
  isExpired: false,
  onClick: () => null,
  price: 0.45123,
  priceAnnounced: false,
}

export default (() => (
  <Root>
    <LabelColumn>
      <div>FX</div>
      <label>
        Price Announced /<br></br> RFQ Priced
      </label>
      <label>Priced</label>
      <label>Trading-Disabled</label>
      <label>Executing</label>
      <label>RFQ Expired</label>
      <label>RFQ Expired Tradable</label>
    </LabelColumn>
    <PricingTilesColumn>
      <ColumnTitle>Sell Side</ColumnTitle>
      <PriceButtonVariants direction={Direction.Sell} />
    </PricingTilesColumn>
    <PricingTilesColumn>
      <ColumnTitle>Buy Side</ColumnTitle>
      <PriceButtonVariants direction={Direction.Buy} />
    </PricingTilesColumn>
  </Root>
)) as FC

const PriceButtonVariants: FC<{ direction: Direction }> = ({ direction }) => (
  <>
    {
      //Price Announced
      <PricingTilesRow>
        <PriceButton {...values} direction={direction} priceAnnounced />
      </PricingTilesRow>
    }
    {
      // Priced
      <PricingTilesRow>
        <PriceButton {...values} direction={direction} />
      </PricingTilesRow>
    }
    {
      //Trading disabled
      <PricingTilesRow>
        <PriceButton {...values} direction={direction} disabled />
      </PricingTilesRow>
    }
    {
      //Executing
      <PricingTilesRow>
        <PriceButton {...values} direction={direction} disabled />
      </PricingTilesRow>
    }
    {
      //RFQ Expired
      <PricingTilesRow>
        <PriceButton {...values} direction={direction} disabled isExpired />
      </PricingTilesRow>
    }
    {
      //RFQ Expired Tradable
      <PricingTilesRow>
        <PriceButton {...values} direction={direction} isExpired />
      </PricingTilesRow>
    }
  </>
)

const GridColumn = styled.div`
  display: grid;
  grid-template-rows: 2rem repeat(6, 1fr);
  grid-row-gap: 0.5rem;
  align-items: center;
`

const LabelColumn = styled(GridColumn)`
  font-size: 0.6875rem;
  color: ${({ theme }) => theme.secondary.base};

  & > div {
    font-size: 0.875rem;
  }
`

const ColumnTitle = styled.div``
const PricingTilesRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 0.5rem;
  padding-right: 20px;
`
const PricingTilesColumn = styled(GridColumn)`
  min-width: 10rem;
`

const Root = styled.div`
  max-width: 60rem;

  display: grid;
  grid-template-columns: 120px 1fr 1fr;
  padding-bottom: 2rem;

  ${PricingTilesColumn} + ${PricingTilesColumn} {
    position: relative;

    &::before {
      display: block;
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      box-shadow: 2rem 0 0 ${({ theme }) => theme.primary[1]};
      box-shadow: 2rem 0 0 black;
    }
  }
`
