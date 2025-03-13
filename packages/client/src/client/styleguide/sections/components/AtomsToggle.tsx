import { useState } from "react"
import styled from "styled-components"

import { Box } from "@/client/components/Box"
import { Toggle } from "@/client/components/Toggle"

const Container = styled(Box)`
  width: 500px;
  margin: auto;
`

export const AtomsToggle = () => {
  const [isToggled, setToggled] = useState(false)

  return (
    <Container>
      <Toggle
        isToggled={isToggled}
        left="Buy"
        right="Sell"
        onChange={() => setToggled((isToggled) => !isToggled)}
      />
    </Container>
  )
}
