import styled from "styled-components"

import {
  ChartIcon,
  ChevronIcon,
  DownloadIcon,
  FilterIcon,
  PopInIcon,
  PopOutIcon,
} from "@/client/components/icons"

import { H2, H3, H5 } from "../elements"
import { Paragraph, SectionBlock, Text, TextProps } from "../styled"

export const FontFamilies = () => (
  <>
    <SectionBlock colorScheme="secondary" py={0} pt={2} mh={0}>
      <H2 pt={4}>Iconography</H2>

      <Paragraph>
        With icons we aim to create a consistent style of weight, colour, size
        and usage throughout this platform. All icons can be represented at
        different sizes and should scale accordingly to their container size.
      </Paragraph>
    </SectionBlock>
    <SectionBlock colorScheme="secondary" py={2} pt={2} mh={0}>
      <H3>Generic</H3>
      <IconGrid>
        <div></div>
        <H5>Normal</H5>
        <H5>Hover</H5>
        <H5>Active</H5>
        <H5>Disabled</H5>

        <H5>Download</H5>
        <div>{<DownloadIcon />}</div>
        <ActiveIcon>{<DownloadIcon />}</ActiveIcon>
        <ActiveIcon>{<DownloadIcon />}</ActiveIcon>
        <DisabledIcon>{<DownloadIcon />}</DisabledIcon>

        <H5>Filter</H5>
        <div>{<FilterIcon />}</div>
        <ActiveIcon>{<FilterIcon />}</ActiveIcon>
        <ActiveIcon>{<FilterIcon />}</ActiveIcon>
        <DisabledIcon>{<FilterIcon />}</DisabledIcon>

        <H5>Pop Out</H5>
        <div>{<PopOutIcon />}</div>
        <ActiveIcon>{<PopOutIcon />}</ActiveIcon>
        <ActiveIcon>{<PopOutIcon />}</ActiveIcon>
        <DisabledIcon>{<PopOutIcon />}</DisabledIcon>

        <H5>Pop In</H5>
        <div>{<PopInIcon />}</div>
        <ActiveIcon>{<PopInIcon />}</ActiveIcon>
        <ActiveIcon>{<PopInIcon />}</ActiveIcon>
        <DisabledIcon>{<PopInIcon />}</DisabledIcon>

        <H5>Chevron</H5>
        <div>{<ChevronIcon />}</div>
        <ActiveIcon>{<ChevronIcon />}</ActiveIcon>
        <ActiveIcon>{<ChevronIcon />}</ActiveIcon>
        <DisabledWholeIcon>{<ChevronIcon />}</DisabledWholeIcon>

        <H5>Chart</H5>
        <div>{<ChartIcon />}</div>
        <ActiveIcon>{<ChartIcon />}</ActiveIcon>
        <ActiveIcon>{<ChartIcon />}</ActiveIcon>
        <DisabledIcon>{<ChartIcon />}</DisabledIcon>
      </IconGrid>
    </SectionBlock>
  </>
)

const IconGrid = styled(Text)<TextProps>`
  display: grid;
  grid-template-columns: 120px repeat(4, 100px);
  grid-column-gap: 0.5rem;
  grid-row-gap: 0.7rem;
  margin: 3rem 0;
`

const ActiveIcon = styled.div`
  svg path:last-child {
    fill: #5f94f5;
  }
`

const DisabledWholeIcon = styled.div`
  svg path {
    fill: #535760;
  }
`

const DisabledIcon = styled.div`
  svg path:not(:first-child) {
    fill: #535760;
  }
`

export default FontFamilies
