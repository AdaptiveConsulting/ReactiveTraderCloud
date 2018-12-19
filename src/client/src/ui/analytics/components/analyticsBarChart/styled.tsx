import { styled } from 'rt-theme'

export const BarChart = styled.div`
  display: flex;
`
export const PriceContainer = styled.div<{ distance: number }>`
  width: 100%;
  text-align: center;
  vertical-align: middle;
  align-content: center;
  font-size: 11px;
  transition: transform 0.5s;
  transition-timing-function: ${({ theme }) => theme.motion.easing};
  transform: translate(${({ distance }) => distance}%);
`

export const Offset = styled.div`
  flex: 0 1 20px;
`
export const OriginTickWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const PriceLabel = styled.span<{ color: string }>`
  font-size: 11px;
  color: ${({ theme, color }) => theme.analytics[color].normal};
`
export const DiamondShape = styled.span<{ color: string }>`
  display: block;
  margin: 0 auto;
  width: 6px;
  height: 6px;
  transform: rotate(45deg);
  background-color: ${({ theme, color }) => theme.analytics[color].normal};
`
export const Label = styled.div`
  width: 20%;
  margin: auto 0;
  opacity: 0.6;
  font-size: 11px;
  color: ${({ theme }) => theme.analytics.textColor};
`
export const BarPriceContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-shrink: 1;
`
export const Bar = styled.div`
  background-color: #444c5f;
  height: 0.125rem;
  width: 100%;
  border: 1px solid #444c5f;
`
export const OriginTick = styled.div`
  width: 1.6px;
  height: 5px;
  background-color: #444c5f;
  border: 1px solid #444c5f;
`
export const Origin = styled.div`
  font-size: 11px;
  text-align: center;
  color: ${({ theme }) => theme.analytics.textColor};
`
