import { useCallback, useRef, useState } from 'react'
import { Button } from '@mui/material'
import { Backspace } from '@mui/icons-material'

export default function BackspaceButton({ onClick, onLongPress }) {
  const [pressed, setPressed] = useState(false)
  const [middlePressed, setMiddlePressed] = useState(false)
  const [longPressed, setLongPressed] = useState(false)
  const middleTimeout = useRef()
  const longTimeout = useRef()

  if (middlePressed && !middleTimeout.current) {
    middleTimeout.current = setTimeout(() => {
      onClick()
      middleTimeout.current = null
    }, 150)
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
  }, [onClick, middlePressed, longPressed])

  return (
    <Button
      onPointerDown={start}
      onPointerUp={stopPress}
      onPointerLeave={stopPress}
    >
      <Backspace />
    </Button>
  )
}
