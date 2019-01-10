import React from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare } from '@fortawesome/free-solid-svg-icons'
import { styled } from 'rt-theme'

library.add(faSquare)

const Foo = styled.div`
  display: flex;
  justify-content: space-between;
`
const HR = styled.hr`
  width: 80%;
  margin: 0 auto;
  height: 2px;
  background-color: black;
`

const AnalyticsViewIcon: React.SFC = () => (
  <div>
    <Foo>
      <FontAwesomeIcon icon="square" />
      <FontAwesomeIcon icon="square" />
    </Foo>
    <HR />
  </div>
)

export default AnalyticsViewIcon
