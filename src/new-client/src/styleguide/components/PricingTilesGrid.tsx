import styled from "styled-components"
// import { PriceButton } from "@/App/LiveRates/Tile/PriceButton/PriceButton"
import { PriceButtonInnerComponent } from "@/App/LiveRates/Tile/PriceButton"
import { Direction } from "@/services/trades"
import { QuoteStateStage } from "@/App/LiveRates/Tile/Rfq"

const rfqStateReceived = {
  stage: QuoteStateStage.Received,
}

const rfqStateRejected = {
  stage: QuoteStateStage.Rejected,
}

const rfqStateRequested = {
  stage: QuoteStateStage.Requested,
}

const values = {
  bigFigure: "0.45",
  pip: "12",
  tenth: "3",
  symbol: "eurusd",
  price: true,
  persist: true,
}

const currencyPair = {
  symbol: "USDYAN",
  ratePrecision: 1.5,
  pipsPosition: 1.0,
  base: "USD",
  terms: "YAN",
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
)) as React.FC

const PriceButtonVariants: React.FC<{ direction: Direction }> = ({
  direction,
}) => (
  <>
    {
      //Price Announced
      <PricingTilesRow>
        <PriceButtonInnerComponent
          direction={direction}
          disabled={false}
          isExpired={false}
          /* TODO investigate why TS says that the property does not exist 
          // @ts-ignore */
          rfqQuoteState={rfqStateReceived}
          {...values}
        />
      </PricingTilesRow>
    }
    {
      // Priced
      <PricingTilesRow>
        <PriceButtonInnerComponent
          direction={direction}
          disabled={false}
          isExpired={false}
          /* TODO investigate why TS says that the property does not exist 
          // @ts-ignore */
          rfqQuoteState={rfqStateRequested}
          {...values}
        />
      </PricingTilesRow>
    }

    {
      //Trading disabled
      <PricingTilesRow>
        <PriceButtonInnerComponent
          direction={direction}
          disabled={true}
          isExpired={false}
          /* TODO investigate why TS says that the property does not exist 
          // @ts-ignore */
          rfqQuoteState={rfqStateRequested}
          {...values}
        />
      </PricingTilesRow>
    }
    {
      //Executing
      <PricingTilesRow>
        <PriceButtonInnerComponent
          direction={direction}
          disabled={true}
          isExpired={false}
          /* TODO investigate why TS says that the property does not exist 
          // @ts-ignore */
          rfqQuoteState={rfqStateRequested}
          {...values}
        />
      </PricingTilesRow>
    }
    {
      //RFQ Expired
      <PricingTilesRow>
        <PriceButtonInnerComponent
          direction={direction}
          disabled={true}
          isExpired={true}
          /* TODO investigate why TS says that the property does not exist 
          // @ts-ignore */
          rfqQuoteState={rfqStateRequested}
          {...values}
        />
      </PricingTilesRow>
    }
    {
      //RFQ Expired Tradable
      <PricingTilesRow>
        <PriceButtonInnerComponent
          direction={direction}
          disabled={false}
          isExpired={true}
          /* TODO investigate why TS says that the property does not exist 
          // @ts-ignore */
          rfqQuoteState={rfqStateRequested}
          {...values}
        />
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
