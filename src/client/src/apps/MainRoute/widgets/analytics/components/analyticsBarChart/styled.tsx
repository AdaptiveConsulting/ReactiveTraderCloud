import { styled } from 'rt-theme'

const FlexDiv = styled.div`
  display: flex;
  flex-direction: column;
`

export const BarChart = styled.div`
  display: flex;
`

export const PriceContainer = styled(FlexDiv).attrs((props: { distance: number }) => ({
  style: {
    transform: `translate(${props.distance}%)`,
  },
}))<{ distance: number }>`
  width: 100%;
  transition: transform 0.5s;
  font-size: 11px;
  transition-timing-function: ${({ theme }) => theme.motion.easing};
`

export const Offset = styled.div`
  flex: 0 1 20px;
`
export const OriginTickWrapper = styled(FlexDiv)`
  width: 100%;
  height: 20px;
`

export const PriceLabel = styled.div<{ color: string; distance: number }>`
  align-self: center;
  transition: font-size 0.2s, transform 0.2s;
  color: ${({ theme, color }) => theme.template[color].normal};
  padding-bottom: 0px;

  &:hover {
    font-size: 18px;
    padding-bottom: 3px;
    transform: translateX(
      ${({ distance }) => (Math.abs(distance) > 30 ? `${distance * -1}%` : '0%')}
    );
  }
`
export const DiamondShape = styled.div<{ color: string }>`
  align-self: center;
  width: 6px;
  height: 6px;
  transform: rotate(45deg);
  background-color: ${({ theme, color }) => theme.template[color].normal};
`
export const Label = styled.div`
  flex: 0 0 60px;
  align-self: center;
  opacity: 0.6;
  font-size: 11px;
  color: ${({ theme }) => theme.core.textColor};
`
export const BarPriceContainer = styled.div`
  width: 100%;
  overflow-x: hidden;
`
const bgColor = '#444c5f'
export const Bar = styled.div`
  background-color: ${bgColor};
  height: 0.125rem;
  width: 100%;
  border: 1px solid ${bgColor};
`
export const OriginTick = styled.div`
  width: 1.6px;
  height: 5px;
  background-color: ${bgColor};
  border: 1px solid ${bgColor};
`
