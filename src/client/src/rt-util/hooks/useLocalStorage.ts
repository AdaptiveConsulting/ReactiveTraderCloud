import { useState, useEffect, useCallback } from 'react'

export const useLocalStorage = <T>(key: string, initialValue: T) => {
    const [state, setState] = useState(() => {
        return window.localStorage.getItem(key) ?? JSON.stringify(initialValue)
    })

    useEffect(() => {
        const updateState = () => {
            setState(window.localStorage.getItem(key) ?? JSON.stringify(initialValue))
        }

        window.addEventListener('storage', updateState)

        return () => {
            window.removeEventListener('storage', updateState)
        }

    }, [key, initialValue])

    useEffect(() => {
        window.localStorage.setItem(key, state)
    }, [key, state])

    const value = JSON.parse(state)
    const setter = useCallback((value: T) => {
        setState(JSON.stringify(value))
    }, [])

    return [value, setter]
}