import React from 'react'
import { styled } from 'rt-theme'
import { BlotterContainer } from '../widgets/blotter'
import { DEALT_CURRENCY, SYMBOL } from '../widgets/blotter/components/blotterUtils';
import { BlotterFilter } from '../widgets/blotter/BlotterContainer';
import queryString from 'query-string';
import { RouteComponentProps } from 'react-router';

const BlotterContainerStyle = styled('div')`
  height: calc(100% - 21px);
  width: 100%;
  padding: 0.625rem;
  margin: auto;
`

const getFilterFromQueryStr: (queryStr: string) => BlotterFilter =
  queryStr => {
    const parsedQueryString = queryString.parse(queryStr)
    return {
      [SYMBOL]: parsedQueryString[SYMBOL] as ReadonlyArray<any>,
      [DEALT_CURRENCY]: parsedQueryString[DEALT_CURRENCY] as ReadonlyArray<any>
    }
  }

const BlotterRoute = ({location: {search}}: RouteComponentProps<{ symbol: string }>) => {
  return (
    <BlotterContainerStyle>
      <BlotterContainer filter={getFilterFromQueryStr(search)}/>
    </BlotterContainerStyle>
  )
}

export default BlotterRoute
