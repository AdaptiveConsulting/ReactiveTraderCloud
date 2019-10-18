import React from 'react'
import { styled } from 'rt-theme'
import queryString from 'query-string';
import { RouteComponentProps } from 'react-router';
import { BlotterContainer, BlotterFilters, DEALT_CURRENCY, SYMBOL } from '../widgets/blotter'

const BlotterContainerStyle = styled('div')`
  height: calc(100% - 21px);
  width: 100%;
  padding: 0.625rem;
  margin: auto;
`

function getFiltersFromQueryStr(queryStr: string): BlotterFilters {
  const parsedQueryString = queryString.parse(queryStr)
  return {
    [SYMBOL]: parsedQueryString[SYMBOL] as ReadonlyArray<any>,
    [DEALT_CURRENCY]: parsedQueryString[DEALT_CURRENCY] as ReadonlyArray<any>
  }
}

const BlotterRoute = ({location: {search}}: RouteComponentProps<{ symbol: string }>) => {
  return (
    <BlotterContainerStyle>
      <BlotterContainer filters={getFiltersFromQueryStr(search)}/>
    </BlotterContainerStyle>
  )
}

export default BlotterRoute
