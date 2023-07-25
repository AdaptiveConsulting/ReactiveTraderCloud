import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { concat, merge, of } from "rxjs"
import { catchError, debounceTime, exhaustMap, map } from "rxjs/operators"
import styled from "styled-components"

import { withSubscriber } from "@/client/utils/withSubscriber"
import { ThroughputAdminService } from "@/generated/TradingGateway"

const Wrapper = styled.div`
  background: ${({ theme }) => theme.white};
  height: 100%;
  padding: 20px;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`

const Label = styled.label`
  color: ${({ theme }) => theme.colors.light.secondary[5]};
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  display: block;
`

const InputWrapper = styled.div`
  position: relative;
  width: 140px;
  margin-right: 20px;
`

const Input = styled.input`
  padding: 0.5rem;
  padding-right: 60px;
  border: 1px solid ${({ theme }) => theme.colors.light.primary[4]};
  color: ${({ theme }) => theme.colors.light.secondary[4]};
  font-size: 0.65rem;
  margin-right: 1rem;
  width: 100%;
`

const InputMeta = styled.div`
  position: absolute;
  top: 0.55rem;
  right: 0.65rem;
  font-size: 0.65rem;
  color: ${({ theme }) => theme.colors.light.primary[4]};
`

const InputSlider = styled.input`
  width: 100px;
  height: 4px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ theme }) => theme.accents.primary.base};
    cursor: pointer;
  }
`

const ResultMessage = styled.div<{ validResult: boolean }>`
  background-color: ${({ validResult, theme }) =>
    validResult ? theme.accents.positive.base : theme.accents.negative.base};
  color: ${({ theme }) => theme.white};
  padding: 0.5rem;
  font-size: 0.65rem;
`

const [userThroughput$, setUserThroughput] = createSignal<number>()
const [useThroughput] = bind(
  concat(
    ThroughputAdminService.getThroughput().pipe(
      map((res) => res.updatesPerSecond),
    ),
    userThroughput$,
  ),
)

const throughputResponse$ = userThroughput$.pipe(
  debounceTime(300),
  exhaustMap((value) => {
    return concat(
      ThroughputAdminService.setThroughput({
        targetUpdatesPerSecond: value,
      }),
      of(value),
    ).pipe(
      catchError((e) => {
        console.log("Error setting throughput", e)
        return of(e)
      }),
    )
  }),
)

const [useResult] = bind<number | Error | undefined>(
  merge(
    throughputResponse$,
    throughputResponse$.pipe(
      debounceTime(3000),
      map(() => undefined),
    ),
  ),
  undefined,
)

const AdminComponent = () => {
  const throughput = useThroughput()
  const result = useResult()

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    setUserThroughput(parseInt(e.currentTarget.value))
  }

  const validResult = typeof result === "number"
  return (
    <Wrapper>
      <Label htmlFor="throughput">Desired Throughput</Label>
      <Row>
        <InputWrapper>
          <Input
            type="number"
            value={throughput}
            onChange={onChange}
            id="throughput"
          />
          <InputMeta>Updates/sec</InputMeta>
        </InputWrapper>
        <InputSlider
          type="range"
          value={throughput}
          onChange={onChange}
          min={0}
          max={1000}
          step={10}
        />
      </Row>
      {result !== undefined ? (
        <ResultMessage validResult={validResult}>
          {validResult
            ? `Throughput has been set to ${result}`
            : "Error setting throughput"}
        </ResultMessage>
      ) : null}
    </Wrapper>
  )
}

export const Admin = withSubscriber(AdminComponent)
