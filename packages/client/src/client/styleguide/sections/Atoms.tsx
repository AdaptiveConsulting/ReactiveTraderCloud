import React from "react"

import { PriceMovementInner } from "@/client/App/LiveRates/Tile/PriceMovement"
import { Box } from "@/client/components/Box"
import { Direction } from "@/generated/TradingGateway"
import { PriceMovementType } from "@/services/prices"

import { H2, H3, P } from "../elements"
import { SectionBlock } from "../styled"
import { Table } from "./Atoms.styled"
import {
  ChartingStates,
  CommonStates,
  PricingTileStates,
  TabStates,
  TextInputStates,
} from "./atomStates"
import {
  AtomsButton,
  AtomsCheckBox,
  AtomsTab,
  AtomsTabBar,
  AtomsTextInput,
  AtomsToggle,
  Separator,
} from "./components"
import { AtomsChart } from "./components/AtomsChart"
import { AtomsPricingTile } from "./components/AtomsPricingTile"

const buttonVariants = [
  "primary",
  "brand",
  "outline",
  "warning",
  "white-outline",
] as const
const inputVariants = ["text", "combo-box"] as const
const checkBoxVariants = ["unchecked", "checked"] as const
const pricingTileVariants = [Direction.Buy, Direction.Sell] as const
const spreadVariants = ["Spread"] as const
const chartingVariants = ["Charting"] as const

type Variants =
  | typeof buttonVariants
  | typeof inputVariants
  | ["tab"]
  | typeof checkBoxVariants
  | typeof pricingTileVariants
  | typeof spreadVariants
  | typeof chartingVariants

type EnumValues<T> = T[keyof T]

interface TableProps<V extends Variants, S> {
  variants: V
  states: S
  renderItem: (state: EnumValues<S>, variant: V[number]) => React.ReactNode
}

const AtomTable = <V extends Variants, S extends Record<string, string>>({
  variants,
  states,
  renderItem,
}: TableProps<V, S>) => (
  <Table>
    <thead>
      <th></th>
      {Object.values(states).map((state) => (
        <th key={state} scope="col">
          {state}
        </th>
      ))}
    </thead>
    <tbody>
      {variants.map((variant) => (
        <tr key={variant}>
          <th scope="row">{variant}</th>
          {(Object.values(states) as EnumValues<S>[]).map((state) => (
            <td key={state} align="center">
              {renderItem(state, variant)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </Table>
)

export const Atoms = () => {
  return (
    <>
      <SectionBlock>
        <H2>Atoms</H2>
        <P>
          Atoms are the lowest level of a UI such as a button, text link, input
          field etc. Atoms are placed together to create a specific piece of
          functionality. All controls are scalable in height and width so as to
          accomodate a compact or spacious UI preference.
        </P>

        <Box paddingY="4xl">
          <H3>Tab</H3>
          <AtomTable
            states={TabStates}
            variants={["tab"]}
            renderItem={(state) => <AtomsTab state={state} />}
          />
        </Box>

        <Separator />
        <Box paddingY="4xl">
          <H3>Tab Bar</H3>
          <AtomsTabBar items={["Tab 1", "Tab 2", "Tab 3", "Tab 4"]} />
        </Box>
        <Separator />

        <Box paddingY="4xl">
          <H3>Header</H3>
          <AtomsTabBar items={["Title"]} />
        </Box>
        <Separator />

        <Box paddingY="4xl">
          <H3>Buttons</H3>
          <AtomTable
            states={CommonStates}
            variants={buttonVariants}
            renderItem={(state, variant) => (
              <AtomsButton
                state={state}
                variant={variant}
                disabled={state === CommonStates.Disabled ? true : false}
                size="lg"
                onClick={() => {}}
              >
                {state}
              </AtomsButton>
            )}
          />
        </Box>

        <Separator />

        <Box paddingY="4xl">
          <H3>Text Input/Combo Box</H3>
          <AtomTable
            states={TextInputStates}
            variants={inputVariants}
            renderItem={(state, variant) => (
              <AtomsTextInput
                state={state}
                disabled={state === TextInputStates.Disabled ? true : false}
                comboBox={variant === "combo-box"}
              />
            )}
          />
        </Box>

        <Separator />

        <Box paddingBottom="4xl">
          <Box paddingY="4xl">
            <H3>Checkbox</H3>
            <AtomTable
              states={CommonStates}
              variants={checkBoxVariants}
              renderItem={(state, variant) => (
                <AtomsCheckBox
                  checked={variant === "checked" ? true : false}
                  state={state}
                  name={state}
                  onChange={() => {}}
                  disabled={state === CommonStates.Disabled}
                />
              )}
            />
          </Box>
        </Box>

        <Separator />

        <Box paddingY="4xl">
          <H3>Toggle</H3>
          <AtomsToggle />
        </Box>

        <Separator />

        <Box paddingY="4xl">
          <H3>Pricing Tiles</H3>
          <AtomTable
            states={PricingTileStates}
            variants={pricingTileVariants}
            renderItem={(state, variant) => (
              <AtomsPricingTile state={state} direction={variant} />
            )}
          />
        </Box>

        <Separator />

        <Box paddingY="4xl">
          <H3>Spread</H3>
          <AtomTable
            states={PriceMovementType}
            variants={spreadVariants}
            renderItem={(state) => (
              <PriceMovementInner
                movementType={state}
                spread="3.0"
                isAnalyticsView={false}
              />
            )}
          />
        </Box>

        <Separator />

        <Box paddingY="4xl">
          <H3>Charting</H3>
          <AtomTable
            states={ChartingStates}
            variants={chartingVariants}
            renderItem={(state) => (
              <AtomsChart active={state === ChartingStates.Active} />
            )}
          />
        </Box>
      </SectionBlock>
    </>
  )
}
