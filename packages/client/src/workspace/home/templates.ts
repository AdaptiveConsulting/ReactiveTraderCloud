import { ButtonStyle, CLITemplate, TemplateFragment } from "@openfin/workspace"
import * as CSS from "csstype"
import { format } from "date-fns"

import { isBuy } from "@/client/App/Credit/common"
import {
  customNumberFormatter,
  DECIMAL_SEPARATOR,
  significantDigitsNumberFormatter,
} from "@/client/utils"
import { CurrencyPair, Direction } from "@/generated/TradingGateway"
import { RfqDetails } from "@/services/credit"
import {
  ExecutionStatus,
  ExecutionTrade,
  TimeoutExecution,
} from "@/services/executions"
import { CreditExceededExecution } from "@/services/executions/types"
import { Price, PriceMovementType } from "@/services/prices"

import { BASE_URL, VITE_RT_URL } from "../constants"
import {
  createButton,
  createContainer,
  createImage,
  createText,
  createTextContainer,
} from "../templates"
import { ADAPTIVE_LOGO } from "./utils"

const nf = new Intl.NumberFormat("default")

const MOVEMENT_UP_ICON = `${BASE_URL}/images/icons/up.svg`
const MOVEMENT_DOWN_ICON = `${BASE_URL}/images/icons/down.svg`

const formatSimple = customNumberFormatter()
const formatTo2Digits = significantDigitsNumberFormatter(2)
const formatTo3Digits = significantDigitsNumberFormatter(3)
const formatToMin2IntDigits = customNumberFormatter({
  minimumIntegerDigits: 2,
})

const getPriceBits = (price: number, currencyPair: CurrencyPair) => {
  const { ratePrecision, pipsPosition } = currencyPair
  const rateString = price.toFixed(ratePrecision)
  const [wholeNumber, fractions_] = rateString.split(".")
  const fractions = fractions_ || "00000"

  const pip = formatToMin2IntDigits(
    Number(fractions.substring(pipsPosition - 2, pipsPosition)),
  )
  const tenth = formatSimple(
    Number(fractions.substring(pipsPosition, pipsPosition + 1)),
  )

  const bigFigureNumber = Number(
    wholeNumber + "." + fractions.substring(0, pipsPosition - 2),
  )
  let bigFigure =
    bigFigureNumber < 1 && pipsPosition === 4
      ? formatTo2Digits(bigFigureNumber)
      : formatTo3Digits(bigFigureNumber)
  if (bigFigureNumber === Math.floor(bigFigureNumber))
    bigFigure += DECIMAL_SEPARATOR

  return {
    bigFigure,
    pip,
    tenth,
  }
}

const getBaseSpotTemplate = (price: Price): TemplateFragment => {
  const getPriceItem = (direction: "bid" | "ask") =>
    createContainer(
      "column",
      [
        createText(`${direction}Label`, 10, {
          opacity: 0.59,
          textTransform: "uppercase",
        }),
        createContainer(
          "row",
          [
            createText(`${direction}BigFigure`, 14, {}),
            createText(`${direction}Pip`, 36, { lineHeight: 1 }),
            createText(`${direction}Tenth`, 14, {}),
          ],
          { alignItems: "baseline", marginTop: "-14px" },
        ),
      ],
      { width: "35%" },
    )

  return createContainer("column", [
    createContainer(
      "row",
      [
        createText("symbol", 13, { fontWeight: "bold" }),
        createText("date", 11, { opacity: 0.59 }),
      ],
      {
        justifyContent: "space-between",
      },
    ),
    createContainer(
      "row",
      [
        getPriceItem("bid"),
        createContainer(
          "column",
          [
            createImage("movementUp", "Price Movement Up", {
              width: "10px",
              height: "10px",
              visibility:
                price.movementType === PriceMovementType.UP
                  ? "visible"
                  : "hidden",
            }),
            createText("spread", 12, {}),
            createImage("movementDown", "Price Movement Down", {
              width: "10px",
              height: "10px",
              visibility:
                price.movementType === PriceMovementType.DOWN
                  ? "visible"
                  : "hidden",
            }),
          ],
          {
            alignItems: "center",
          },
        ),
        getPriceItem("ask"),
      ],
      {
        justifyContent: "space-around",
        margin: "20px 0",
      },
    ),
  ])
}

const getSpotTemplate = (
  actions: { launch: string },
  price: Price,
): TemplateFragment => {
  return createContainer(
    "column",
    [
      getBaseSpotTemplate(price),
      createContainer(
        "row",
        [
          createButton(ButtonStyle.Secondary, "launchButton", actions.launch, {
            fontSize: "12px",
          }),
        ],
        { justifyContent: "flex-end", paddingTop: "10px" },
      ),
    ],
    {
      padding: "10px",
    },
  )
}

const getBaseSpotData = (price: Price, currencyPair: CurrencyPair) => {
  const { symbol, bid, ask, valueDate, spread } = price
  const bidPriceBits = getPriceBits(bid, currencyPair)
  const askPriceBits = getPriceBits(ask, currencyPair)

  return {
    symbol,
    bidBigFigure: bidPriceBits.bigFigure,
    bidPip: bidPriceBits.pip,
    bidTenth: bidPriceBits.tenth,
    askBigFigure: askPriceBits.bigFigure,
    askPip: askPriceBits.pip,
    askTenth: askPriceBits.tenth,
    date: `SPT (${format(new Date(valueDate), "dd MMM").toUpperCase()})`,
    askLabel: "Buy",
    bidLabel: "Sell",
    spread,
    movementUp: MOVEMENT_UP_ICON,
    movementDown: MOVEMENT_DOWN_ICON,
  }
}

export const constructSpotResult = (
  price: Price,
  currencyPair: CurrencyPair,
) => {
  const { symbol } = price
  const LAUNCH_ACTION = `Launch ${symbol} tile`
  const TRADE_ACTION = `Trade ${symbol}`

  return {
    key: `spot-${symbol}`,
    title: symbol,
    label: "Currency Pair",
    icon: ADAPTIVE_LOGO,
    data: {
      symbol,
      manifestType: "url",
      manifest: `${VITE_RT_URL}/fx-spot/${symbol}`,
    },
    actions: [
      { name: LAUNCH_ACTION, hotkey: "enter" },
      { name: TRADE_ACTION, hotkey: "CmdOrCtrl+T" },
    ],
    template: CLITemplate.Custom,
    templateContent: {
      layout: getSpotTemplate({ launch: LAUNCH_ACTION }, price),
      data: {
        ...getBaseSpotData(price, currencyPair),
        launchButton: "Launch",
      },
    },
  }
}

export const constructMarketTemplateContent = (
  prices: Price[],
  currencyPairs: Record<string, CurrencyPair>,
) => {
  const data = prices.reduce(
    (acc, cur) => {
      const currencyPair = currencyPairs[cur.symbol]
      const { bigFigure, pip, tenth } = getPriceBits(cur.mid, currencyPair)

      return {
        ...acc,
        [`${cur.symbol}Label`]: cur.symbol,
        [`${cur.symbol}BigFigure`]: bigFigure,
        [`${cur.symbol}Pip`]: pip,
        [`${cur.symbol}Tenth`]: tenth,
        [`${cur.symbol}Movement`]: cur.movementType,
      }
    },
    {
      movementUp: MOVEMENT_UP_ICON,
      movementDown: MOVEMENT_DOWN_ICON,
    },
  )

  const getTemplate = () => {
    return createContainer(
      "column",
      prices.map((price) =>
        createContainer(
          "row",
          [
            createText(`${price.symbol}Label`, 12, {
              opacity: 0.59,
              width: "64px",
            }),
            createContainer(
              "row",
              [
                createText(`${price.symbol}BigFigure`, 10, {}),
                createText(`${price.symbol}Pip`, 22, { lineHeight: 1 }),
                createText(`${price.symbol}Tenth`, 10, {}),
              ],
              { width: "60px", alignItems: "baseline" },
            ),
            createImage(
              price.movementType === PriceMovementType.UP
                ? "movementUp"
                : "movementDown",
              `Price Movement ${price.movementType}`,
              {
                width: "10px",
                height: "10px",
                alignSelf: "center",
                display:
                  price.movementType === PriceMovementType.NONE
                    ? "none"
                    : "block",
              },
            ),
          ],
          { alignItems: "flex-end", marginBottom: "6px" },
        ),
      ),
      {
        padding: "10px",
      },
    )
  }

  return {
    layout: getTemplate(),
    data,
  }
}

export const constructTradeExecutionTemplateContent = (
  price: Price,
  currencyPair: CurrencyPair,
  notional: string,
  direction: Direction,
) => {
  const layout: TemplateFragment = createContainer(
    "column",
    [
      getBaseSpotTemplate(price),
      createContainer(
        "row",
        [
          createButton(
            ButtonStyle.Secondary,
            "executeButton", //TODO - const
            `Execute`,
            {
              fontSize: "12px",
            },
          ),
        ],
        { justifyContent: "center", paddingTop: "10px" },
      ),
    ],
    {
      padding: "10px",
    },
  )

  const data = {
    ...getBaseSpotData(price, currencyPair),
    executeButton: `${direction} - ${notional}`,
    notional,
    executingLoader: "Executing",
  }

  return {
    layout,
    data,
  }
}

export const constructTradeExecutedTemplateContent = (
  trade: ExecutionTrade | CreditExceededExecution | TimeoutExecution,
) => {
  const fontSize = 12

  if (trade.status === ExecutionStatus.Done) {
    const inverseTextStyle: CSS.Properties = {
      backgroundColor: "white",
      color: "#01C38D",
      fontWeight: "bold",
    }
    const fontSize = 12

    const layout: TemplateFragment = createContainer(
      "column",
      [
        createTextContainer([createText("tradeId")], {
          fontWeight: "bold",
          marginBottom: "10px",
        }),
        createTextContainer([
          createText("direction", fontSize),
          createText("notional", fontSize, inverseTextStyle),
          createText("rateLabel", fontSize),
          createText("rate", fontSize, inverseTextStyle),
          createText("forLabel", fontSize),
          createText("amount", fontSize, {
            fontWeight: "bold",
            fontStyle: "italic",
          }),
          createText("settleLabel", fontSize),
          createText("settleDate", fontSize, { fontWeight: "bold" }),
        ]),
      ],
      {
        padding: "10px",
        height: "100%",
        justifyContent: "center",
        textAlign: "center",
        backgroundColor: "#01C38D",
        color: "white",
      },
    )

    const base = trade.currencyPair.slice(0, 3)
    const terms = trade.currencyPair.slice(3, 6)
    const data = {
      tradeId: `Trade ID: ${trade.tradeId.toString()}`,
      direction: `You ${isBuy(trade.direction) ? "bought" : "sold"} `,
      notional: `${base} ${nf.format(trade.notional)}`,
      rateLabel: " at a rate of ",
      rate: trade.spotRate.toString(),
      forLabel: " for ",
      amount: `${terms} ${nf.format(trade.notional * trade.spotRate)}`,
      settleLabel: ` settling (Spt) `,
      settleDate: format(new Date(trade.valueDate), "dd MMM"),
    }

    return {
      layout,
      data,
    }
  }

  const layout: TemplateFragment = createContainer(
    "column",
    [
      createTextContainer([createText("tradeId")], {
        fontWeight: "bold",
        marginBottom: "10px",
      }),
      createTextContainer([createText("rejectedLabel", fontSize)]),
    ],
    {
      padding: "10px",
      height: "100%",
      justifyContent: "center",
      textAlign: "center",
      backgroundColor: "#FF274B",
      color: "white",
    },
  )

  let data

  switch (trade.status) {
    case ExecutionStatus.Rejected:
      data = {
        tradeId: `Trade ID: ${trade.tradeId.toString()}`,
        rejectedLabel: "Your trade has been rejected",
      }
      break
    case ExecutionStatus.CreditExceeded:
      data = {
        tradeId: `Trade ID: NA`,
        rejectedLabel: "Credit limit exceeded",
      }
      break
    case ExecutionStatus.Timeout:
      data = {
        tradeId: `Trade ID: NA`,
        rejectedLabel: "Request timed out",
      }
      break
  }

  return {
    layout,
    data,
  }
}

export const constructRfqRaisedTemplateContent = (
  rfqDetails?: RfqDetails | null,
) => {
  const fontSize = 12

  if (rfqDetails) {
    const { instrument } = rfqDetails

    const inverseTextStyle: CSS.Properties = {
      backgroundColor: "white",
      color: "#01C38D",
      fontWeight: "bold",
    }
    const fontSize = 12

    const layout: TemplateFragment = createContainer(
      "column",
      [
        createTextContainer([createText("rfqId")], {
          fontWeight: "bold",
          marginBottom: "10px",
        }),
        createTextContainer([
          createText("direction", fontSize),
          createText("notional", fontSize, inverseTextStyle),
        ]),
      ],
      {
        padding: "10px",
        height: "100%",
        justifyContent: "center",
        textAlign: "center",
        backgroundColor: "#01C38D",
        color: "white",
      },
    )

    const data = {
      rfqId: `RFQ ID: ${rfqDetails.id.toString()}`,
      direction: `You raised an RFQ to ${rfqDetails.direction} `,
      notional: `${nf.format(rfqDetails.quantity)} ${instrument?.ticker}`,
    }

    return {
      layout,
      data,
    }
  }

  const layout: TemplateFragment = createContainer(
    "column",
    [createTextContainer([createText("rejectedLabel", fontSize)])],
    {
      padding: "10px",
      height: "100%",
      justifyContent: "center",
      textAlign: "center",
      backgroundColor: "#FF274B",
      color: "white",
    },
  )

  const data = {
    rejectedLabel: "Your RFQ could not be raised",
  }

  return {
    layout,
    data,
  }
}
