import React from 'react'
import { styled } from 'rt-theme'
import { BlotterContainer } from '../widgets/blotter'
import { SYMBOL, TRADER_NAME } from '../widgets/blotter/components/blotterUtils';
import { FilterValuesByFieldId } from '../widgets/blotter/BlotterContainer';

const BlotterContainerStyle = styled('div')`
  height: calc(100% - 21px);
  width: 100%;
  padding: 0.625rem;
  margin: auto;
`

const defaultPreset: FilterValuesByFieldId = {
  [SYMBOL]: ['GBPJPY', 'USDJPY'],
  [TRADER_NAME]: ['MPE']
}

const BlotterRoute = () => (
  <BlotterContainerStyle>
    <BlotterContainer filters={defaultPreset}/>
  </BlotterContainerStyle>
)

export default BlotterRoute
