// import styled from "styled-components"
// import { Subscribe } from "@react-rxjs/core"
// import { TradesGrid } from "./TradesGrid"
// import { TradesFooter } from "./TradesFooter"
// import { TradesHeader } from "./TradesHeader"
// import { tableTrades$ } from "./TradesState"
// import { storiesOf } from "@storybook/react"
// import Story from "@/stories/Story"
// import { Trade } from "@/services/trades"

// const blotterRejectedRow: Trade = {
//   dealtCurrency: 'GBP',
//   direction: 'Sell',
//   notional: 1000000,
//   spotRate: 184.485,
//   status: 'Rejected',
//   symbol: 'GBPJPY',
//   tradeDate: new Date('Thu Nov 18 2021 13:29:30 GMT-0400 (Eastern Daylight Time)'),
//   tradeId: 2340,
//   traderName: 'CZA',
//   valueDate: new Date('Sun Nov 21 2021 20:00:00 GMT-0400 (Eastern Daylight Time)')
// }

// const blotterSuccessRow: Trade = {
//   dealtCurrency: 'EUR',
//   direction: 'Sell',
//   notional: 1000000,
//   spotRate: 133.303,
//   status: 'Done',
//   symbol: 'EURJPY',
//   tradeDate: new Date('Thu Nov 18 2018 14:46:12 GMT-0400 (Eastern Daylight Time)'),
//   tradeId: 2356,
//   traderName: 'DOR',
//   valueDate: new Date('Sun Nov 21 2018 20:00:00 GMT-0400 (Eastern Daylight Time)')
// }

// const mockedTrades = [
//     blotterRejectedRow,
//     blotterSuccessRow,
//     blotterSuccessRow,
//     blotterRejectedRow,
//     blotterRejectedRow,
//     blotterSuccessRow,
//     blotterSuccessRow,
//     blotterSuccessRow,
//     blotterRejectedRow,
//     blotterSuccessRow,
//     blotterSuccessRow,
//     blotterSuccessRow,
//     blotterRejectedRow,
//     blotterSuccessRow,
//     blotterSuccessRow,
//     blotterSuccessRow,
//     blotterRejectedRow,
//     blotterSuccessRow,
//     blotterSuccessRow,
//     blotterSuccessRow,
//     blotterRejectedRow
//   ]

// const TradesStyle = styled.div`
//   height: 100%;
//   width: 100%;
//   color: ${({ theme }) => theme.core.textColor};
//   font-size: 0.8125rem;
// `

// const stories = storiesOf("Trades", module)

// stories.add("TradesGridDefault", () => (
//   <Story>
//     <TradesStyle role="region" aria-labelledby="trades-table-heading">
//       <TradesHeader />
//       <TradesGrid trades={mockedTrades} highlightedRow={null} mocked={true}/>
//       <TradesFooter />
//     </TradesStyle>
//   </Story>
// ))

// stories.add("TradesGridDefaultEmpty", () => (
//   <Story>
//     <TradesStyle role="region" aria-labelledby="trades-table-heading">
//       <TradesHeader />
//       <TradesGrid trades={[]} highlightedRow={null} mocked={true}/>
//       <TradesFooter />
//     </TradesStyle>
//   </Story>
// ))

// stories.add("TradesFooter", () => (
//   <Story>
//     <TradesStyle role="region" aria-labelledby="trades-table-heading">
//       <TradesFooter />
//     </TradesStyle>
//   </Story>
// ))

// stories.add("TradesHeader", () => (
//   <Story>
//     <TradesStyle role="region" aria-labelledby="trades-table-heading">
//       <TradesHeader />
//     </TradesStyle>
//   </Story>
// ))

// stories.add("TradesGridEmpty", () => (
//   <Story>
//     <TradesStyle role="region" aria-labelledby="trades-table-heading">
//       <TradesGrid trades={[]} highlightedRow={null} mocked={true}/>
//     </TradesStyle>
//   </Story>
// ))
