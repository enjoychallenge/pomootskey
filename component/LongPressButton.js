import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@mui/material'

export default function LongPressButton({
  onClick,
  onLongPress,
  variant = 'text',
  disabled = false,
  middlePeriod = 150,
  alt = '',
  children,
}) {
  const [pressed, setPressed] = useState(false)
  const [middlePressed, setMiddlePressed] = useState(false)
  const [longPressed, setLongPressed] = useState(false)
  const middleTimeout = useRef()
  const longTimeout = useRef()

  useEffect(() => {
    if (disabled) {
      setPressed(false)
      setMiddlePressed(false)
      setLongPressed(false)
    }
  }, [disabled])

  if (middlePressed && !middleTimeout.current) {
    middleTimeout.current = setTimeout(() => {
      onClick()
      middleTimeout.current = null
    }, middlePeriod)
  }

  const start = useCallback(
    (event) => {
      setPressed(true)
      middleTimeout.current = setTimeout(() => {
        onClick()
        middleTimeout.current = null
        setMiddlePressed(true)
      }, 300)

      longTimeout.current = setTimeout(() => {
        onLongPress(event)
        setLongPressed(true)
      }, 3000)
    },
    [onClick, onLongPress]
  )

  const stopPress = useCallback(() => {
    if (middleTimeout.current) {
      clearTimeout(middleTimeout.current)
      middleTimeout.current = null
    }
    if (longTimeout.current) {
      clearTimeout(longTimeout.current)
      longTimeout.current = null
    }
    if (pressed && !middlePressed && !longPressed) {
      onClick()
      setPressed(false)
    }
    setMiddlePressed(false)
    setLongPressed(false)
  }, [onClick, pressed, middlePressed, longPressed])

  return (
    <Button
      onPointerDown={start}
      onPointerUp={stopPress}
      onPointerLeave={stopPress}
      variant={variant}
      disabled={disabled}
      alt={alt}
    >
      {children}
    </Button>
  )
}
