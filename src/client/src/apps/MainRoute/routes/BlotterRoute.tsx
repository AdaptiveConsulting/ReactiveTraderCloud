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

function enforceArray(element: string[] | string | null | undefined): ReadonlyArray<any> {
  return Array.isArray(element) ? element : [element]
}

function getFiltersFromQueryStr(queryStr: string): BlotterFilters {
  const parsedQueryString = queryString.parse(queryStr)
  return {
    [SYMBOL]: enforceArray(parsedQueryString[SYMBOL]),
    [DEALT_CURRENCY]: enforceArray(parsedQueryString[DEALT_CURRENCY])
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
