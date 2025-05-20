import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
  Box,
  TextField,
  Typography,
  Slider,
  Checkbox,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
} from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import AppBar from '../component/AppBar'
import * as slctr from '../features/words/wordsSelector'
import layout_styles from '../styles/common/layout.module.scss'
import {
  setChars,
  setSearchType,
  setLenInterval,
  setCaseInsensitive,
  setDiacriticsInsensitive,
} from '../features/words/wordsSlice'
import { searchTypeEnum } from '../app/decode/words'
import result_styles from '../styles/common/result.module.scss'
import * as React from 'react'

export default function WordsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const [results, setResults] = useState([])
  const [wordsJsx, setWordsJsx] = useState([])

  const loaderRef = useRef(null)
  const workerRef = useRef(null)
  const dispatch = useAppDispatch()

  const chars = useAppSelector(slctr.getChars)
  const searchType = useAppSelector(slctr.getSearchType)
  const wordLenInterval = useAppSelector(slctr.getLenInterval)
  const caseInsensitive = useAppSelector(slctr.getCaseInsensitive)
  const diacriticsInsensitive = useAppSelector(slctr.getDiacriticsInsensitive)

  const pageSize = 50

  function wordsToJsx(wordsToShow) {
    return wordsToShow.map((word, idx) => {
      return (
        <Typography key={idx} sx={{ color: 'result.main' }}>
          {word}
        </Typography>
      )
    })
  }

  const filterMethodsJsx = Object.entries(searchTypeEnum).map(
    ([key, value]) => (
      <MenuItem key={key} value={value}>
        {value}
      </MenuItem>
    )
  )

  const addPage = useCallback(async () => {
    if (isLoading) return

    setIsLoading(true)

    const newWords = results.slice(
      pageSize * pageIndex,
      pageSize * (pageIndex + 1)
    )
    setWordsJsx((prevWords) => [...prevWords, wordsToJsx(newWords)])
    setPageIndex((prevIndex) => prevIndex + 1)
    setIsLoading(false)
  }, [isLoading, results, pageIndex])

  useEffect(() => {
    setIsLoading(true)
    setWordsJsx(wordsToJsx(results.slice(0, pageSize)))
    setPageIndex(1)
    setIsLoading(false)
  }, [results])

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

  useEffect(() => {
    setResults([])
    if (chars === '') return
    workerRef.current = new Worker(
      new URL('../searchWords.worker', import.meta.url)
    )

    workerRef.current.onmessage = function (event) {
      const { results } = event.data
      setResults(results)
      setIsLoading(false)
    }

    setIsLoading(true)
    workerRef.current.postMessage({
      input: chars,
      lenInterval: wordLenInterval,
      caseInsensitive: caseInsensitive,
      diacriticsInsensitive: diacriticsInsensitive,
      searchType: searchType,
    })

    return () => {
      workerRef.current?.terminate()
    }
  }, [
    caseInsensitive,
    chars,
    diacriticsInsensitive,
    searchType,
    wordLenInterval,
  ])

  const onCharsChange = useCallback(
    (value) => {
      dispatch(setChars({ value }))
    },
    [dispatch]
  )

  const onSearchTypeChange = useCallback(
    (value) => {
      dispatch(setSearchType({ value }))
    },
    [dispatch]
  )

  const onLenIntervalChange = useCallback(
    (value) => {
      dispatch(setLenInterval({ value }))
    },
    [dispatch]
  )

  const onCaseInsensitiveChange = useCallback(
    (value) => {
      dispatch(setCaseInsensitive({ value }))
    },
    [dispatch]
  )

  const onDiacriticsInsensitiveChange = useCallback(
    (value) => {
      dispatch(setDiacriticsInsensitive({ value }))
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
                inputProps={{
                  autocomplete: 'off',
                  autocorrect: 'off',
                  autocapitalize: 'off',
                  spellcheck: 'false',
                }}
              />
              <Select
                value={searchType}
                onChange={(event) => onSearchTypeChange(event.target.value)}
              >
                {filterMethodsJsx}
              </Select>
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
              <FormGroup>
                <FormControlLabel
                  label="A=a"
                  control={
                    <Checkbox
                      checked={caseInsensitive}
                      label="A=a"
                      onChange={(event, newValue) =>
                        onCaseInsensitiveChange(newValue)
                      }
                    />
                  }
                />
                <FormControlLabel
                  label="ř=r"
                  control={
                    <Checkbox
                      checked={diacriticsInsensitive}
                      label="A=a"
                      onChange={(event, newValue) =>
                        onDiacriticsInsensitiveChange(newValue)
                      }
                    />
                  }
                />
              </FormGroup>
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
