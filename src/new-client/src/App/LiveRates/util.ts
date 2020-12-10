import { useState, useEffect, useCallback, useMemo } from 'react'
import { Rate } from './types'

export const useLocalStorage = <T>(key: string, initialState: T) => {
    const [state, setState] = useState(() => {
        return window.localStorage.getItem(key) ?? JSON.stringify(initialState)
    })

    useEffect(() => {
        const updateState = () => {
            setState(window.localStorage.getItem(key) ?? JSON.stringify(initialState))
        }

        updateState()
        
        window.addEventListener('storage', updateState)

        return () => {
            window.removeEventListener('storage', updateState)
        }

    }, [key, initialState])

    useEffect(() => {
        window.localStorage.setItem(key, state)
    }, [key, state])

    const value = useMemo(() => JSON.parse(state), [state])
    const setter = useCallback((valueOrCallback: T | ((value: T) => T)) => {
            valueOrCallback instanceof Function 
            ? setState((prev) => JSON.stringify(valueOrCallback(JSON.parse(prev))))
            : setState(JSON.stringify(valueOrCallback))
    }, [])

    return [value, setter]
}

export function toRate(
    rawRate: number = 0,
    ratePrecision: number = 0,
    pipPrecision: number = 0
  ): Rate {
    const rateString = rawRate.toFixed(ratePrecision)
    const priceParts = rateString.split('.')
    const wholeNumber = priceParts[0]
    const fractions = priceParts[1] || '00000'
  
    return {
      rawRate,
      ratePrecision,
      pipPrecision,
      bigFigure: Number(wholeNumber + '.' + fractions.substring(0, pipPrecision - 2)),
      pips: Number(fractions.substring(pipPrecision - 2, pipPrecision)),
      pipFraction: Number(fractions.substring(pipPrecision, pipPrecision + 1))
    }
  }
