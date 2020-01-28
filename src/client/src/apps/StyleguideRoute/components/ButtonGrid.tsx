import React from 'react'

import { Button } from 'rt-styleguide'
import { styled } from 'rt-theme'

import { ButtonStyleProps } from 'rt-styleguide'

interface TitleButtonProp {
  title?: string
}

export default (() => (
  <Root>
    <LabelColumn>
      <div />
      <label>Normal</label>
      <label>Hover</label>
      <label>Active</label>
      <label>Disabled</label>
    </LabelColumn>
    <ButtonColumn>
      <ColumnTitle>Primary</ColumnTitle>
      <ButtonVariants intent="primary" title="Primary" />
    </ButtonColumn>
    <ButtonColumn>
      <ColumnTitle>Primary-Outline</ColumnTitle>
      <ButtonVariants intent="primary" title="Primary outline" outline />
    </ButtonColumn>
    <ButtonColumn>
      <ColumnTitle>Secondary</ColumnTitle>
      <ButtonVariants intent="secondary" title="Secondary" />
    </ButtonColumn>
    <ButtonColumn>
      <ColumnTitle>Secondary-Outline</ColumnTitle>
      <ButtonVariants intent="secondary" title="Secondary outline" outline />
    </ButtonColumn>
  </Root>
)) as React.FC

const ButtonVariants: React.FC<ButtonStyleProps & TitleButtonProp> = props => (
  <React.Fragment>
    {
      // standard
      <ButtonRow>
        <Button {...props}>{props.title}</Button>
      </ButtonRow>
    }
    {
      //  hover
      <ButtonRow>
        <Button {...props} active>
          Active
        </Button>
      </ButtonRow>
    }
    {
      //  active
      <ButtonRow>
        <Button {...props} active>
          Hover
        </Button>
      </ButtonRow>
    }
    {
      //  disabled
      <ButtonRow>
        <Button {...props} disabled>
          Disabled
        </Button>
      </ButtonRow>
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
  color: ${({ theme }) => theme.secondary.base};
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
      box-shadow: 2rem 0 0 ${({ theme }) => theme.primary[1]};
      box-shadow: 2rem 0 0 black;
    }
  }
`
