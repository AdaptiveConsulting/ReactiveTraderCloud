import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import _ from 'lodash'
import React from 'react'

import { Button, ButtonGroup } from 'rt-styleguide'
import { resolvesColor, styled } from 'test-theme'

import { PassThroughProps } from '../tools'

export default (() => (
  <Root>
    <LabelColumn>
      <div />
      <label>Normal</label>
      <label>Active</label>
      <label>Disabled</label>
      <label>With Icons</label>
      <label>Grouped</label>
    </LabelColumn>
    <ButtonColumn>
      <ColumnTitle>Standard</ColumnTitle>
      <ButtonVariants />
    </ButtonColumn>
    <ButtonColumn>
      <ColumnTitle>Standard Outline</ColumnTitle>
      <ButtonVariants outline />
    </ButtonColumn>
    <ButtonColumn>
      <ColumnTitle>Pill</ColumnTitle>
      <ButtonVariants pill />
    </ButtonColumn>
    <ButtonColumn>
      <ColumnTitle>Pill Outline</ColumnTitle>
      <ButtonVariants pill outline />
    </ButtonColumn>
  </Root>
)) as React.SFC

const ButtonVariants: React.SFC<PassThroughProps> = props => (
  <React.Fragment>
    {
      // standard
      <ButtonRow>
        <Button {...props} intent="primary">
          Primary
        </Button>
        <Button {...props} intent="secondary">
          Secondary
        </Button>
      </ButtonRow>
    }
    {
      //  active
      <ButtonRow>
        <Button {...props} intent="primary" active>
          Primary
        </Button>
        <Button {...props} intent="secondary" active>
          Secondary
        </Button>
      </ButtonRow>
    }
    {
      //  disabled
      <ButtonRow>
        <Button {...props} intent="primary" disabled>
          Primary
        </Button>
        <Button {...props} intent="secondary" disabled>
          Secondary
        </Button>
      </ButtonRow>
    }
    {
      //  With Icons
      <ButtonRow>
        <Button {...props} intent="primary">
          <FontAwesomeIcon icon={faCheck} /> Primary
        </Button>
        <Button {...props} intent="secondary">
          <FontAwesomeIcon icon={faCheck} /> Secondary
        </Button>
      </ButtonRow>
    }
    {
      // Grouped
      <div>
        <ButtonGroup {...props} intent="primary">
          <Button>Left</Button>
          <Button>Middle</Button>
          <Button>Right</Button>
        </ButtonGroup>
        <ButtonGroup {...props} intent="secondary">
          <Button>1</Button>
          <Button>2</Button>
          <Button>3</Button>
          <Button>4</Button>
          <Button>5</Button>
        </ButtonGroup>
      </div>
    }
  </React.Fragment>
)

const GridColumn = styled.div`
  display: grid;
  grid-template-rows: 3rem repeat(3, 2rem) 4.5rem 5rem;
  grid-row-gap: 0.5rem;
  align-items: center;
`

const LabelColumn = styled(GridColumn)`
  font-size: 0.6875rem;
  color: ${resolvesColor('secondary.base')};
`

const ColumnTitle = styled.div``
const ButtonRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 0.5rem;
`
const ButtonColumn = styled(GridColumn)`
  min-width: 10rem;
`

const Root = styled.div`
  max-width: 60rem;

  display: grid;
  grid-template-columns: 5rem 1fr 1fr 1fr 1fr ;
  grid-column-gap: 2rem;

  padding-bottom: 2rem;

  ${ButtonColumn} + ${ButtonColumn} {
    position: relative;

    &::before {
      display: block;
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      box-shadow: 2rem 0 0 ${resolvesColor('primary.1')};
      box-shadow: 2rem 0 0 black;
    }
  }
`
