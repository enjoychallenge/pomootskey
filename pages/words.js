import { useAppDispatch, useAppSelector } from '../app/hooks'
import { Box, TextField, Typography, Slider } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import AppBar from '../component/AppBar'
import * as slctr from '../features/words/wordsSelector'
import layout_styles from '../styles/common/layout.module.scss'
import { setChars, setLenInterval } from '../features/words/wordsSlice'
import result_styles from '../styles/common/result.module.scss'
import * as React from 'react'

export default function WordsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const loaderRef = useRef(null)
  const dispatch = useAppDispatch()
  const chars = useAppSelector(slctr.getChars)
  const allWords = useAppSelector(slctr.getWords)
  const wordLenInterval = useAppSelector(slctr.getLenInterval)
  const pageSize = 50
  const [wordsJsx, setWordsJsx] = useState([])

  function wordsToJsx(wordsToShow) {
    return wordsToShow.map((word, idx) => {
      return (
        <Typography key={idx} sx={{ color: 'result.main' }}>
          {word}
        </Typography>
      )
    })
  }

  const addPage = useCallback(async () => {
    if (isLoading) return

    setIsLoading(true)

    const newWords = allWords.slice(
      pageSize * pageIndex,
      pageSize * (pageIndex + 1)
    )
    setWordsJsx((prevWords) => [...prevWords, wordsToJsx(newWords)])
    setPageIndex((prevIndex) => prevIndex + 1)
    setIsLoading(false)
  }, [isLoading, allWords, pageIndex])

  useEffect(() => {
    setIsLoading(true)
    setWordsJsx(wordsToJsx(allWords.slice(0, pageSize)))
    setPageIndex(1)
    setIsLoading(false)
  }, [allWords])

  useEffect(() => {
    const loaderRefLocal = loaderRef.current
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0]
      if (target.isIntersecting) {
        addPage()
      }
    })

    if (loaderRefLocal) {
      observer.observe(loaderRefLocal)
    }

    return () => {
      if (loaderRefLocal) {
        observer.unobserve(loaderRefLocal)
      }
    }
  }, [addPage])

  const onCharsChange = useCallback(
    (value) => {
      dispatch(setChars({ value }))
    },
    [dispatch]
  )

  const onLenIntervalChange = useCallback(
    (value) => {
      dispatch(setLenInterval({ value }))
    },
    [dispatch]
  )

  return (
    <>
      <Box className={layout_styles.page}>
        <AppBar />
        <Box
          component="main"
          className={layout_styles.main_decoder}
          sx={{ color: 'primary.main' }}
        >
          <Box className={layout_styles.inputs_box}>
            <Box>
              <TextField
                required
                id="input-chars"
                label="Hledané znaky"
                value={chars}
                onChange={(event) => onCharsChange(event.target.value)}
              />
              <Slider
                aria-label="Délka slova"
                value={wordLenInterval}
                onChange={(event, newValue) => onLenIntervalChange(newValue)}
                min={1}
                max={14}
                step={1}
                valueLabelDisplay="auto"
                marks={true}
              />
            </Box>
          </Box>
          <Box
            sx={{ color: 'result.main' }}
            className={layout_styles.results_box}
          >
            <div>{wordsJsx}</div>
            <div ref={loaderRef} className={result_styles.observer} />
          </Box>
        </Box>
      </Box>
    </>
  )
}
