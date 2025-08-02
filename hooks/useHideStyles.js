import layout_styles from '../styles/common/layout.module.scss'
import { useEffect, useRef, useState } from 'react'

export function useHideStyles() {
  const [hideStyles, setHideStyles] = useState([])
  const timeoutId = useRef()

  const resizeListener = () => {
    timeoutId.current = setTimeout(() => {
      const offsetTop = window.visualViewport.offsetTop
      setHideStyles(offsetTop > 0 ? [layout_styles.hide] : [])
      document.documentElement.style.setProperty(
        '--virtualKeyboardHeight',
        offsetTop.toString()
      )
    }, 150)
  }

  useEffect(() => {
    window.visualViewport.addEventListener('resize', resizeListener)
    return () => {
      window.visualViewport.removeEventListener('resize', resizeListener)
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
        timeoutId.current = null
      }
    }
  }, [])

  return hideStyles
}
