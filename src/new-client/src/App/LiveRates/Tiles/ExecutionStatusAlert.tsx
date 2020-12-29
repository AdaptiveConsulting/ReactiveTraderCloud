
import { format } from "date-fns"
import { ExecutionStatus, useExecution, onExecutionAcknowledge } from "services/executions"
import { Direction } from "services/trades"
import styled, { DefaultTheme } from "styled-components/macro"

const OverlayDiv = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
`

const ExecutionStatusAlertContainer = styled(OverlayDiv) <{ status: ExecutionStatus, theme: DefaultTheme }>`
  background-color: ${({ status, theme }) => {
    switch (status) {
      case 'Done':
        return `${theme.colors.accents.positive.base} `
      case 'Rejected':
        return `${theme.colors.accents.negative.base} `
      default:
        return ''
    }
  }};
  display: table;
  font-size: 0.75rem;
`


const PendingPopUp = styled("div")`
  background-color: ${({theme}) => theme.accents.primary.base }
`

const pastTenseDirection = (d: Direction): string => {
  if (d === Direction.Buy) {
    return 'bought'
  }

  if (d === Direction.Sell) {
    return 'sold'
  }

  console.error('Unknown Direction')
  return 'unknown'
}

const BoldText =  styled.span`
  font-weight: bold;
`

const BoldTextWithBackground = styled("span")`
  background-color: ${({ theme }) => theme.textColor };
  color: ${({ theme }) => theme.colors.accents.positive.base};
`

const TradeIdDiv = styled.div`
  display: block;
  margin: 1rem;
`

const TradeMessageDiv = styled.div`
  display: block;
  line-height: 1.5rem;
  margin: auto;
  text-align: center;
  width: 66%;
`

const AcknowledgeButton = styled("button")<{success: Boolean, theme: DefaultTheme }>`
  background-color: ${({ success, theme }) => success ? theme.accents.positive.lighter : theme.accents.negative.darker };
  border-radius: 2rem;
  display: block;
  margin: 1rem auto 0 auto;
  padding: 0.5rem;
`

const ExecutionStatusAlert = (props: any) => {
  const {
    currencyPair,
    direction,
    dealtCurrency,
    id,
    notional,
    spotRate,
    status,
    tradeId,
    valueDate,
  } = useExecution(props.symbol)

  const tradeIdMessage = `Trade Id: ${tradeId}`

  const closeAlert = () => {
    onExecutionAcknowledge({ currencyPair, id })
  }

  const Done = () => {
    return (
      <ExecutionStatusAlertContainer status={ExecutionStatus.Done}>
        <TradeIdDiv>{tradeIdMessage}</TradeIdDiv>
        <TradeMessageDiv>
          {`You ${pastTenseDirection(direction)} `}
          <BoldTextWithBackground>{`${dealtCurrency} ${notional}`}</BoldTextWithBackground>
          {` at a rate of `}
          <BoldTextWithBackground>{`${spotRate}`}</BoldTextWithBackground>
          {' for '}
          <BoldText>{`TODO ${notional * spotRate}`}</BoldText>
          {' settling '}
          <BoldText>{`SPT (${format(new Date(valueDate), "dd-MMM")})`}</BoldText>
        </TradeMessageDiv>
        <AcknowledgeButton onClick={closeAlert} success={true}>Dismiss</AcknowledgeButton>
      </ExecutionStatusAlertContainer>
    )

  }

  const Rejected = () => {
    return (
      <ExecutionStatusAlertContainer status={ExecutionStatus.Rejected}>
        <TradeIdDiv>{tradeIdMessage}</TradeIdDiv>
        <TradeMessageDiv>Your trade has been rejected.</TradeMessageDiv>
        <AcknowledgeButton onClick={closeAlert} success={false}>CLICK</AcknowledgeButton>
      </ExecutionStatusAlertContainer>
    )
  }

  const Pending = () => {
    return (
      <OverlayDiv>
        <PendingPopUp>Pending</PendingPopUp>
      </OverlayDiv>
    )
  }

  switch(status) {
    case ExecutionStatus.None:
      return null
    case ExecutionStatus.Pending:
      return <Pending />
    case ExecutionStatus.Done:
      return <Done />
    case ExecutionStatus.Rejected:
      return <Rejected />
  }
}

export default ExecutionStatusAlert