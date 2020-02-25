import React from 'react'
import { styled } from 'rt-theme'
import {
  DownloadIcon,
  FilterIcon,
  PopoutIcon,
  PopInIcon,
  CrossIcon,
  MaximizeIcon,
  MinimizeIcon,
  ChevronIcon,
  UndockIcon,
  ChartIcon,
} from 'rt-components'

import { H2, H3, H5 } from '../elements'
import { Paragraph, SectionBlock, Text, TextProps } from '../styled'

export const FontFamilies: React.FC = () => (
  <React.Fragment>
    <SectionBlock py={0} pt={2} mh={0}>
      <H2 pt={4}>Iconography</H2>

      <Paragraph>
        With icons we aim to create a consistent style of weight, colour, size and usage throughout
        this platform. All icons can be represented at different sizes and should scale accordingly
        to their container size.
      </Paragraph>
    </SectionBlock>
    <SectionBlock py={2} pt={2} mh={0}>
      <H3>Generic</H3>
      <IconGrid>
        <div></div>
        <H5>Normal</H5>
        <H5>Hover</H5>
        <H5>Active</H5>
        <H5>Disabled</H5>

        <H5>Download</H5>
        <div>{DownloadIcon}</div>
        <ActiveIcon>{DownloadIcon}</ActiveIcon>
        <ActiveIcon>{DownloadIcon}</ActiveIcon>
        <div>{DownloadIcon}</div>

        <H5>Filter</H5>
        <div>{FilterIcon}</div>
        <ActiveIcon>{FilterIcon}</ActiveIcon>
        <ActiveIcon>{FilterIcon}</ActiveIcon>
        <div>{FilterIcon}</div>

        <H5>Pop Out</H5>
        <div>{PopoutIcon}</div>
        <ActiveIcon>{PopoutIcon}</ActiveIcon>
        <ActiveIcon>{PopoutIcon}</ActiveIcon>
        <div>{PopoutIcon}</div>

        <H5>Pop In</H5>
        <div>{PopInIcon}</div>
        <ActiveIcon>{PopInIcon}</ActiveIcon>
        <ActiveIcon>{PopInIcon}</ActiveIcon>
        <div>{PopInIcon}</div>

        <H5>Cross</H5>
        <div>{CrossIcon}</div>
        <ActiveIcon>{CrossIcon}</ActiveIcon>
        <ActiveIcon>{CrossIcon}</ActiveIcon>
        <div>{CrossIcon}</div>

        <H5>Minimize-Screen</H5>
        <div>{MinimizeIcon}</div>
        <ActiveIcon>{MinimizeIcon}</ActiveIcon>
        <ActiveIcon>{MinimizeIcon}</ActiveIcon>
        <div>{MinimizeIcon}</div>

        <H5>Maximize-Screen</H5>
        <div>{MaximizeIcon}</div>
        <ActiveIcon>{MaximizeIcon}</ActiveIcon>
        <ActiveIcon>{MaximizeIcon}</ActiveIcon>
        <div>{MaximizeIcon}</div>

        <H5>Chevron</H5>
        <div>{ChevronIcon}</div>
        <ActiveIcon>{ChevronIcon}</ActiveIcon>
        <ActiveIcon>{ChevronIcon}</ActiveIcon>
        <div>{ChevronIcon}</div>

        <H5>Undock</H5>
        <div>
          <UndockIcon width={24} height={24} />
        </div>
        <ActiveIconInverse>
          <UndockIcon width={24} height={24} />
        </ActiveIconInverse>
        <ActiveIconInverse>
          <UndockIcon width={24} height={24} />
        </ActiveIconInverse>
        <div>
          <UndockIcon width={24} height={24} />
        </div>

        <H5>Chart</H5>
        <div>{ChartIcon}</div>
        <ActiveIcon>{ChartIcon}</ActiveIcon>
        <ActiveIcon>{ChartIcon}</ActiveIcon>
        <div>{ChartIcon}</div>
      </IconGrid>
    </SectionBlock>
  </React.Fragment>
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

const ActiveIconInverse = styled.div`
  svg path:nth-child(2) {
    fill: #5f94f5;
  }
`

export default FontFamilies
