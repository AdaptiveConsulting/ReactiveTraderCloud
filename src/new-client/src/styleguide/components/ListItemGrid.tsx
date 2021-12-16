import { FC } from "react"
import styled from "styled-components"
import { ListItem } from "./ListItem"

const ListItemGrid: FC = () => {
  return (
    <Root>
      <LabelColumn>
        <div />
        <label>Basic</label>
      </LabelColumn>
      <ListItemColumn>
        <div>Normal</div>
        <ListItem title="Text" />
      </ListItemColumn>
      <ListItemColumn>
        <div>Hover</div>
        <ListItem title="Text" hover />
      </ListItemColumn>
      <ListItemColumn>
        <div>Active</div>
        <ListItem title="Text" active />
      </ListItemColumn>
      <ListItemColumn>
        <div>Disabled</div>
        <ListItem title="Text" disabled />
      </ListItemColumn>
    </Root>
  )
}

export default ListItemGrid

const GridColumn = styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-row-gap: 0.5rem;
  align-items: center;
  margin-bottom: 2rem;
`

const LabelColumn = styled(GridColumn)`
  font-size: 0.6875rem;
  color: ${({ theme }) => theme.secondary.base};
`

const ListItemColumn = styled(GridColumn)`
  min-width: 10rem;
`

const Root = styled.div`
  max-width: 60rem;

  display: grid;
  grid-template-columns: repeat(5, 100px);
  grid-column-gap: 2rem;

  ${ListItemColumn} + ${ListItemColumn} {
    position: relative;

    &::before {
      display: block;
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      box-shadow: 2rem 0 0 ${({ theme }) => theme.primary[1]};
      box-shadow: 2rem 0 0 black;
    }
  }
`
