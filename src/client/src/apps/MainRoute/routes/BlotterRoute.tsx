import React from 'react'
import { styled } from 'rt-theme'
import queryString from 'query-string'
import { RouteComponentProps } from 'react-router'
import { BlotterContainer, BlotterFilters, DEALT_CURRENCY, SYMBOL } from '../widgets/blotter'

const BlotterContainerStyle = styled('div')`
  height: calc(100% - 21px);
  width: 100%;
  padding: 0.625rem;
  margin: auto;
`

function getSingleNumberFromQuery(count: string[] | string | null | undefined): number | undefined {
  if (count === null || typeof count === 'undefined') {
    return
  }

  if (Array.isArray(count)) {
    return parseInt(count[0])
  }
  return parseInt(count)
}

function getFiltersFromQueryStr(queryStr: string): BlotterFilters {
  const parsedQueryString = queryString.parse(queryStr)
  // enforce array for values
  return {
    [SYMBOL]: [].concat(parsedQueryString[SYMBOL]),
    [DEALT_CURRENCY]: [].concat(parsedQueryString[DEALT_CURRENCY]),
    count: getSingleNumberFromQuery(parsedQueryString.count),
  }
}

const BlotterRoute = ({ location: { search } }: RouteComponentProps<{ symbol: string }>) => {
  return (
    <BlotterContainerStyle>
      <BlotterContainer filters={getFiltersFromQueryStr(search)} />
    </BlotterContainerStyle>
  )
}

export default BlotterRoute
