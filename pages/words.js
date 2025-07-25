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
import words_styles from '../styles/words.module.scss'
import * as React from 'react'

export default function WordsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const loaderRef = useRef(null)
  const dispatch = useAppDispatch()
  const chars = useAppSelector(slctr.getChars)
  const searchType = useAppSelector(slctr.getSearchType)
  const allWords = useAppSelector(slctr.getWords)
  const wordLenInterval = useAppSelector(slctr.getLenInterval)
  const wordLenIntervalEnable = useAppSelector(slctr.getLenIntervalEnabled)
  const caseInsensitive = useAppSelector(slctr.getCaseInsensitive)
  const diacriticsInsensitive = useAppSelector(slctr.getDiacriticsInsensitive)
  const pageSize = 50
  const [wordsJsx, setWordsJsx] = useState([])
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
      <MenuItem key={key} value={value} data-testid={value}>
        {value}
      </MenuItem>
    )
  )

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

  const optionsStyles = [words_styles.options].concat(hideStyles)

  return (
    <>
      <Box className={layout_styles.page}>
        <AppBar customStyles={hideStyles} />
        <Box
          component="main"
          className={layout_styles.main_decoder}
          sx={{ color: 'primary.main' }}
        >
          <Box className={layout_styles.inputs_box}>
            <Box className={words_styles.inputs_type_box}>
              <TextField
                required
                id="input-chars"
                label="Hledané znaky"
                value={chars}
                onChange={(event) => onCharsChange(event.target.value)}
                inputProps={{
                  autoComplete: 'off',
                  autoCorrect: 'off',
                  autoCapitalize: 'off',
                  spellCheck: 'false',
                }}
              />
              <Select
                value={searchType}
                onChange={(event) => onSearchTypeChange(event.target.value)}
                data-testid={'searchTypeSelect'}
              >
                {filterMethodsJsx}
              </Select>
            </Box>
            <Box className={optionsStyles.join(' ')}>
              <Box className={words_styles.slider}>
                <Slider
                  name="Délka slova"
                  value={wordLenInterval}
                  onChange={(event, newValue) => onLenIntervalChange(newValue)}
                  min={1}
                  max={38}
                  step={1}
                  valueLabelDisplay="auto"
                  marks={true}
                  disabled={!wordLenIntervalEnable}
                />
                <Typography>Délka slova</Typography>
              </Box>
              <FormGroup className={words_styles.checkboxes_group}>
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
            <div data-testid={'results'}>{wordsJsx}</div>
            <div ref={loaderRef} className={result_styles.observer} />
          </Box>
        </Box>
      </Box>
    </>
  )
}
