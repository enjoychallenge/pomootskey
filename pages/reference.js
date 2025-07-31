import {
  Box,
  IconButton,
  FormGroup,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import StarIcon from '@mui/icons-material/Star'
import { AlphabetEn } from '../app/decode/common'
import { codeChar as morseCode } from '../app/decode/morse'
import { codeChar as brailleCode } from '../app/decode/braille'
import { codeChar as semaphoreCode } from '../app/decode/semaphore'
import { getInputCharJsx as morseCharJsx } from './morse'
import { getInputCharJsx as brailleCharJsx } from './braille'
import { getInputCharJsx as semaphoreCharJsx } from './semaphore'

import AppBar from '../component/AppBar'
import layout_styles from '../styles/common/layout.module.scss'
import reference_styles from '../styles/reference.module.scss'
import morse_styles from '../styles/morse.module.scss'
import braille_styles from '../styles/braille.module.scss'
import semaphore_styles from '../styles/semaphore.module.scss'
import * as React from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import * as slctr from '../features/reference/referenceSelector'
import {
  favoriteStarClick,
  favoritesInputChange,
  showFavoritesSwitch,
} from '../features/reference/referenceSlice'
import { useCallback, useEffect, useRef, useState } from 'react'

const FavoriteStar = ({ char, favorites, onStarClick }) => {
  const onClick = useCallback(() => {
    onStarClick(char)
  }, [onStarClick, char])

  return (
    <IconButton onClick={onClick} alt={char}>
      {favorites.includes(char) ? <StarIcon /> : <StarOutlineIcon />}
    </IconButton>
  )
}

const getBinaryJsx = (decimalValue) => {
  const base = 2
  const binaryStr = decimalValue.toString(base).padStart(5, '0')
  const squaresJsx = binaryStr.split('').map((value, index) => {
    const fill = value === '1' ? 'inherit' : 'none'
    return (
      <rect
        key={index + 'B'}
        width="20"
        height="20"
        x="20"
        y={index * 20}
        fill={fill}
      />
    )
  })
  const numbersJsx = binaryStr.split('').map((value, index) => {
    if (value === '1') {
      return (
        <line
          key={index + '1'}
          x1="2"
          y1={index * 20 + 10}
          x2="18"
          y2={index * 20 + 10}
        />
      )
    }
    return (
      <circle
        key={index + '0'}
        cx="10"
        cy={index * 20 + 10}
        r="8"
        fill="none"
      />
    )
  })
  return (
    <svg width="100%" height="100%" viewBox="0 0 40 100" stroke-width="2">
      {numbersJsx}
      {squaresJsx}
    </svg>
  )
}

export default function ReferencePage() {
  const dispatch = useAppDispatch()
  const favorites = useAppSelector(slctr.getFavorites)
  const showFavorites = useAppSelector(slctr.getShowFavorites)
  const [hideStyles, setHideStyles] = useState([])
  const timeoutId = useRef()

  const onStarClick = useCallback(
    (char) => dispatch(favoriteStarClick({ char })),
    [dispatch]
  )

  const onSwitchChange = useCallback(() => {
    dispatch(showFavoritesSwitch())
  }, [dispatch])

  const onInputChange = useCallback(
    (event) => {
      dispatch(favoritesInputChange(event.target.value))
    },
    [dispatch]
  )

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

  const chars =
    showFavorites && favorites.length > 0
      ? favorites
          .filter((c) => AlphabetEn.includes(c))
          .slice()
          .sort()
      : AlphabetEn.split('')
  const getCharRowJsx = (char) => {
    const index = AlphabetEn.indexOf(char)
    const starJsx = (
      <TableCell className={reference_styles.star_cell}>
        <FavoriteStar
          char={char}
          favorites={favorites}
          onStarClick={onStarClick}
        />
      </TableCell>
    )
    return (
      <TableRow key={char} className={reference_styles.row}>
        {starJsx}
        <TableCell className={reference_styles.number_cell}>
          <Typography
            component={'span'}
            display="inline"
            noWrap={true}
            variant="h5"
            align="right"
          >
            {index + 1}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            component={'span'}
            display="inline"
            noWrap={true}
            variant="h5"
            align="right"
          >
            {char.toUpperCase()}
          </Typography>
        </TableCell>
        <TableCell>
          <Box className={reference_styles.morse_cell}>
            {morseCode(char)
              .split('')
              .map((c, idx) => (
                <Box
                  key={char + idx}
                  className={morse_styles.result_input_char}
                >
                  {morseCharJsx(c)}
                </Box>
              ))}
          </Box>
        </TableCell>
        <TableCell>
          <Box className={[braille_styles.result_input_char].join(' ')}>
            {brailleCharJsx(brailleCode(char))}
          </Box>
        </TableCell>
        <TableCell>
          <Box className={[semaphore_styles.result_input_char].join(' ')}>
            {semaphoreCharJsx(semaphoreCode(char))}
          </Box>
        </TableCell>
        <TableCell>
          <Box>{getBinaryJsx(index + 1)}</Box>
        </TableCell>
        <TableCell>
          <Box>
            <Typography
              component={'span'}
              display="inline"
              noWrap={true}
              variant="h5"
              align="right"
              className={reference_styles.ternary_cell}
            >
              {(index + 1).toString(3).padStart(3, '0')}
            </Typography>
          </Box>
        </TableCell>
      </TableRow>
    )
  }

  const tableRowsJsw = chars.map((char) => {
    return getCharRowJsx(char)
  })

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
            <TextField
              id="favorite-chars"
              label="Favorites"
              value={favorites.join('')}
              onChange={onInputChange}
              inputProps={{
                autoComplete: 'off',
                autoCorrect: 'off',
                autoCapitalize: 'off',
                spellCheck: 'false',
              }}
            />
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={showFavorites}
                    disabled={favorites.length === 0}
                    onChange={onSwitchChange}
                  />
                }
                label="Favorites"
              />
            </FormGroup>
          </Box>
          <Box
            sx={{ color: 'result.main' }}
            className={layout_styles.results_box}
          >
            <TableContainer className={reference_styles.table}>
              <Table>
                <TableBody className={reference_styles.table_body}>
                  {tableRowsJsw}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </>
  )
}
