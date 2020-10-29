import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import queryString from 'query-string'
import { RouteComponentProps } from 'react-router'
import { BlotterContainer, BlotterFilters, DEALT_CURRENCY, SYMBOL } from '../widgets/blotter'
import { externalWindowDefault, InteropTopics, platformHasFeature, usePlatform } from 'rt-platforms'
import { Subscription } from 'rxjs'
import { TearOff } from 'rt-components'
import { blotterSelector } from '../layouts'
import { addLayoutToConfig } from './addLayoutToConfig'
import { inExternalWindow } from './inExternalWindow'

const BlotterContainerStyle = styled('div')`
  height: 100%;
  width: 100%;
  padding: 0.625rem;
  margin: auto;
  padding-bottom: 0px;
  margin-bottom: 0px;
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

function ensureArray(
  item: ReadonlyArray<string> | string | null | undefined
): ReadonlyArray<string> {
  if (!item) {
    return []
  }
  if (Array.isArray(item)) {
    return item
  }
  return [item as string]
}

function getFiltersFromQueryStr(queryStr: string): BlotterFilters {
  const parsedQueryString = queryString.parse(queryStr)
  return {
    [SYMBOL]: ensureArray(parsedQueryString[SYMBOL]),
    [DEALT_CURRENCY]: ensureArray(parsedQueryString[DEALT_CURRENCY]),
    count: getSingleNumberFromQuery(parsedQueryString.count),
  }
}

const BlotterRoute: React.FC<RouteComponentProps<{ symbol: string }>> = ({
  location: { search },
}) => {
  const blotter = useSelector(blotterSelector)
  const platform = usePlatform()
  const [filtersFromInterop, setFiltersFromInterop] = useState<ReadonlyArray<BlotterFilters>>()

  useEffect(() => {
    if (!platform) {
      return
    }
    let filterSubscription: Subscription

    if (platformHasFeature(platform, 'interop')) {
      const blotterFilters$ = platform.interop.subscribe$(InteropTopics.FilterBlotter)
      filterSubscription = blotterFilters$.subscribe(setFiltersFromInterop)
    }

    return () => filterSubscription && filterSubscription.unsubscribe()
  }, [platform])

  const filters = (filtersFromInterop && filtersFromInterop[0]) || getFiltersFromQueryStr(search)

  return (
    <TearOff
      id="blotter"
      dragTearOff={false}
      externalWindowProps={addLayoutToConfig(externalWindowDefault.blotterRegion, blotter)}
      render={(popOut, tornOff) => (
        <BlotterContainerStyle>
          <BlotterContainer
            filters={filters} 
            onPopoutClick={popOut}
            tornOff={tornOff}
            tearable={!inExternalWindow}
          />
        </BlotterContainerStyle>
      )}
      tornOff={!blotter.visible}
    />
  )
}

export default BlotterRoute
