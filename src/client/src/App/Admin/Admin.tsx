import { ThroughputAdminService } from "@/generated/TradingGateway"
import { withSubscriber } from "@/utils/withSubscriber"
import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { EMPTY } from "rxjs"
import { catchError, debounceTime, switchMap } from "rxjs/operators"
import styled from "styled-components"

const Wrapper = styled.div`
  background: ${({ theme }) => theme.white};
  height: 100%;
  padding: 20px;
`

const Row = styled.div`
  display: flex;
  align-items: center;
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

const [throughput$, setThroughput] = createSignal<number>()
const [useThroughput] = bind(throughput$, 1000)

// TODO - What (if any) UI feedback do we want on response
throughput$
  .pipe(
    debounceTime(300),
    switchMap((value) => {
      return ThroughputAdminService.setThroughput({
        targetUpdatesPerSecond: value,
      })
    }),
    catchError((e) => {
      console.log("Error setting throughput", e)
      return EMPTY
    }),
  )
  .subscribe()

const AdminComponent = () => {
  const throughput = useThroughput()

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    setThroughput(parseInt(e.currentTarget.value))
  }

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
          max={5000}
          step={10}
        />
      </Row>
    </Wrapper>
  )
}

export const Admin = withSubscriber(AdminComponent)
