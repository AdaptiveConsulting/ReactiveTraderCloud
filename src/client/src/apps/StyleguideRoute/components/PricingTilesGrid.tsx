import React from 'react'
import { styled } from 'rt-theme'
import { Caption } from '../elements'
import PriceButton from '../../MainRoute/widgets/spotTile/components/PriceButton'
import { PriceMovementTypes } from '../../MainRoute/widgets/spotTile/model/priceMovementTypes'
import PriceMovement from '../../MainRoute/widgets/spotTile/components/PriceMovement'
import { Direction } from 'rt-types'

const values = {
  big: 0.45,
  pip: 12,
  tenth: 3,
  rawRate: 33.0122,
  handleClick: () => {},
  isAnalyticsView: false,
  currencyPairSymbol: 'eurusd',
}

export default (() => (
  <Root>
    <LabelColumn>
      <div></div>
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
      <ColumnTitle>
        Sell Side
        <Caption>molecules/pricing-tiles/fx/sell</Caption>
      </ColumnTitle>
      <PriceButtonVariants direction={Direction.Sell} />
    </PricingTilesColumn>
    <PricingTilesColumn>
      <ColumnTitle>
        Buy Side
        <Caption>molecules/pricing-tiles/fx/buy</Caption>
      </ColumnTitle>
      <PriceButtonVariants direction={Direction.Buy} />
    </PricingTilesColumn>
    <PricingTilesColumn>
      <ColumnTitle>
        Spread
        <Caption>molecules/pricing-tiles/spread</Caption>
      </ColumnTitle>
      <PricingTilesRow>
        <label>Down</label>
        <PriceMovementVariants direction={PriceMovementTypes.Down} />
      </PricingTilesRow>
      <PricingTilesRow>
        <label>Up</label>
        <PriceMovementVariants direction={PriceMovementTypes.Up} />
      </PricingTilesRow>
    </PricingTilesColumn>
  </Root>
)) as React.FC

const PriceMovementVariants: React.FC<{ direction: PriceMovementTypes }> = ({ direction }) => (
  <PriceMovement
    priceMovementType={direction}
    spread="3.0"
    show
    isAnalyticsView={false}
    isRequestRFQ={false}
  />
)

const PriceButtonVariants: React.FC<{ direction: Direction }> = ({ direction }) => (
  <React.Fragment>
    {
      //Price Announced
      <PricingTilesRow>
        <PriceButton direction={direction} {...values} priceAnnounced />
      </PricingTilesRow>
    }
    {
      // Priced
      <PricingTilesRow>
        <PriceButton direction={direction} {...values} />
      </PricingTilesRow>
    }
    {
      //Trading disabled
      <PricingTilesRow>
        <PriceButton direction={direction} {...values} disabled />
      </PricingTilesRow>
    }
    {
      //Executing
      <PricingTilesRow>
        <PriceButton direction={direction} {...values} disabled />
      </PricingTilesRow>
    }
    {
      //RFQ Expired
      <PricingTilesRow>
        <PriceButton direction={direction} {...values} disabled expired />
      </PricingTilesRow>
    }
    {
      //RFQ Expired Tradable
      <PricingTilesRow>
        <PriceButton direction={direction} {...values} expired />
      </PricingTilesRow>
    }
  </React.Fragment>
)

const GridColumn = styled.div`
  display: grid;
  grid-template-rows: 4rem repeat(6, 1fr);
  grid-row-gap: 0.5rem;
  align-items: center;
`

const LabelColumn = styled(GridColumn)`
  font-size: 0.6875rem;
  color: ${({ theme }) => theme.secondary.base};
`

const ColumnTitle = styled.div``
const PricingTilesRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 0.5rem;
`
const PricingTilesColumn = styled(GridColumn)`
  min-width: 10rem;
`

const Root = styled.div`
  max-width: 60rem;

  display: grid;
  grid-template-columns: minmax(auto, 120px) 1fr 1fr 1fr ;
  grid-column-gap: 2rem;

  padding-bottom: 2rem;

  ${PricingTilesColumn} + ${PricingTilesColumn} {
    position: relative;

    &::before {
      display: block;
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      box-shadow: 2rem 0 0 ${({ theme }) => theme.primary[1]};
      box-shadow: 2rem 0 0 black;
    }
  }
`
